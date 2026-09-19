import { generateKeyPairSync } from 'node:crypto';

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});

process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/plataforma_test?schema=public';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy_never_called';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret_1234567890';
process.env.FRONTEND_URL = 'http://localhost:5173/industria';
process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
process.env.CLOUDFLARE_API_TOKEN = 'test-token';
process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE = 'test1234';
process.env.CLOUDFLARE_STREAM_KEY_ID = 'test-key-id';
process.env.CLOUDFLARE_STREAM_PEM = privateKey.replace(/\n/g, '\\n');
process.env.SMTP_HOST = '';
process.env.SMTP_PORT = '';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';
process.env.SMTP_FROM = '';
