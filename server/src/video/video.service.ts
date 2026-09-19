import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { EnrollmentsService } from '../enrollments/enrollments.service.js';

@Injectable()
export class VideoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly enrollments: EnrollmentsService,
  ) {}

  private cfHeaders() {
    return {
      Authorization: `Bearer ${this.config.get<string>('CLOUDFLARE_API_TOKEN')}`,
      'Content-Type': 'application/json',
    };
  }

  async createUploadUrl() {
    const accountId = this.config.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: this.cfHeaders(),
        body: JSON.stringify({ maxDurationSeconds: 7200, requireSignedURLs: true }),
      },
    );
    const json = await res.json();
    if (!json.success) {
      throw new Error(`Falha ao criar upload no Cloudflare Stream: ${JSON.stringify(json.errors)}`);
    }
    return { uploadURL: json.result.uploadURL, uid: json.result.uid };
  }

  private signPlaybackToken(videoUid: string) {
    const pem = (this.config.get<string>('CLOUDFLARE_STREAM_PEM') ?? '').replace(/\\n/g, '\n');
    const keyId = this.config.get<string>('CLOUDFLARE_STREAM_KEY_ID');
    const exp = Math.floor(Date.now() / 1000) + 4 * 60 * 60; // 4h

    return jwt.sign({ sub: videoUid, kid: keyId, exp }, pem, {
      algorithm: 'RS256',
      header: { kid: keyId, alg: 'RS256' },
    });
  }

  private buildPlaybackUrls(videoUid: string, token: string) {
    const customerCode = this.config.get<string>('CLOUDFLARE_STREAM_CUSTOMER_CODE');
    const base = `https://customer-${customerCode}.cloudflarestream.com/${videoUid}`;
    return {
      hlsUrl: `${base}/manifest/video.m3u8?token=${token}`,
      iframeUrl: `${base}/iframe?token=${token}`,
    };
  }

  async getPlaybackForLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    if (!lesson.cfVideoId) throw new NotFoundException('Vídeo desta aula ainda não está disponível');

    await this.enrollments.assertPago(userId, lesson.module.course.id);

    const token = this.signPlaybackToken(lesson.cfVideoId);
    return { lessonId: lesson.id, ...this.buildPlaybackUrls(lesson.cfVideoId, token) };
  }
}
