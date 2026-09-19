import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home                           from './pages/Home';
import AreaHub                        from './pages/AreaHub';
import { SimuladorLoading }           from './SimuladorComponentes';
import { AuthProvider }               from './context/AuthContext';
import { AuthBar }                    from './components/auth/AuthBar';
import { ProtectedRoute }             from './components/auth/ProtectedRoute';

/* ── Plataforma de cursos ─────────────────────────────────────── */
const Login                         = lazy(() => import('./pages/Login'));
const Cadastro                      = lazy(() => import('./pages/Cadastro'));
const AdminDashboard                = lazy(() => import('./admin/AdminDashboard'));
const AdminCourseDetail             = lazy(() => import('./admin/AdminCourseDetail'));
const AdminUsers                    = lazy(() => import('./admin/AdminUsers'));
const AdminVendas                   = lazy(() => import('./admin/AdminVendas'));

/* ── Fermentação ──────────────────────────────────────────────── */
const SimuladorART                  = lazy(() => import('./fermentacao/simuladorART'));
const SimuladorArrtTitrino          = lazy(() => import('./fermentacao/ArrtTitrino'));
const SimuladorArtMosto             = lazy(() => import('./fermentacao/ArtMosto'));
const AcidesDorna                   = lazy(() => import('./fermentacao/AcidesDorna'));
const AcidesMosto                   = lazy(() => import('./fermentacao/AcidesMosto'));

/* ── Águas ────────────────────────────────────────────────────── */
const SimuladorSilicaBaixa          = lazy(() => import('./aguas/SilicaBaixa'));
const SimuladorAlcalinidade         = lazy(() => import('./aguas/Alcalinidade'));
const SimuladorCloreto              = lazy(() => import('./aguas/cloreto'));
const SimuladorDureza               = lazy(() => import('./aguas/dureza'));
const SimuladorDeha                 = lazy(() => import('./aguas/Deha'));
const SimuladorFerro                = lazy(() => import('./aguas/Ferro'));
const SimuladorNaftol               = lazy(() => import('./aguas/Naftol'));
const SimuladorSilicaAlta           = lazy(() => import('./aguas/SilicaAlta'));
const SimuladorFerroHach            = lazy(() => import('./aguas/FerroHach'));
const SimuladorArtAguas             = lazy(() => import('./aguas/ArtAguas'));
const CondutividadeAguas            = lazy(() => import('./aguas/condutividadeAguas'));
const PhAguas                       = lazy(() => import('./aguas/phAguas'));

/* ── Microbiologia ────────────────────────────────────────────── */
const SimuladorMicrobiologico       = lazy(() => import('./microbiologia/viabilidade'));
const SimuladorContagemBastonetes   = lazy(() => import('./microbiologia/ContagemdeBastonetes'));
const SimuladorAcidoLatico          = lazy(() => import('./microbiologia/AcidoLatico'));

/* ── Merck · Qhantye ─────────────────────────────────────────── */
const SilicaMk                      = lazy(() => import('./merck/SilicaMk'));
const SilicaBaixaMk                 = lazy(() => import('./merck/SilicaBaixaMk'));
const SilicaAltaMk                  = lazy(() => import('./merck/SilicaAltaMk'));
const FerroMk                       = lazy(() => import('./merck/ferroMk'));
const CloretoMk                     = lazy(() => import('./merck/cloretoMk'));
const CloroMk                       = lazy(() => import('./merck/cloroMk'));
const DurezaMk                      = lazy(() => import('./merck/durezaMk'));

/* ── Destilaria ───────────────────────────────────────────────── */
const SimuladorGlCo2                = lazy(() => import('./destilaria/GlCo2'));
const SimuladorGlCuba                = lazy(() => import('./destilaria/GlCuba'));
const SimuladorAcAlcoo              = lazy(() => import('./destilaria/AcAlcoo'));
const PhAlcool                      = lazy(() => import('./destilaria/phAlcool'));
const CondutividadeAlcool           = lazy(() => import('./destilaria/condutividadeAlcool'));

/* ── Caldos ───────────────────────────────────────────────────── */
const PolBagaco                     = lazy(() => import('./caldos/polbagaco'));
const UmidadeBagaco                 = lazy(() => import('./caldos/umidadebagaco'));
const UmidadeTorta                  = lazy(() => import('./caldos/umidadetorta'));
const ImpurezaBagaco                = lazy(() => import('./caldos/impurezabagaco'));

/* ── COI ──────────────────────────────────────────────────────── */
const COISimulator                  = lazy(() => import('./coi/SimuladorCOI'));

/* ──────────────────────────────────────────────────────────────── */

function NaoEncontrado() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      background: '#0a0f1e',
      color: '#f0f6ff',
      fontFamily: "'DM Sans', sans-serif",
      textAlign: 'center',
      padding: 24,
    }}>
      <div style={{ fontSize: 52 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Página não encontrada</h1>
      <p style={{ color: 'rgba(240,246,255,0.55)', margin: 0 }}>
        A rota acessada não existe nesta plataforma.
      </p>
      <Link
        to="/"
        style={{
          marginTop: 8,
          padding: '10px 24px',
          borderRadius: 12,
          background: '#22d3ee',
          color: '#0a0f1e',
          fontWeight: 800,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AuthBar />
        <Suspense fallback={<SimuladorLoading />}>
        <Routes>
          {/* ── Home ──────────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />

          {/* ── Plataforma de cursos ──────────────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cursos/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminCourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendas"
            element={
              <ProtectedRoute adminOnly>
                <AdminVendas />
              </ProtectedRoute>
            }
          />

          {/* ── Hubs de área ──────────────────────────────────────── */}
          <Route path="/fermentacao"   element={<AreaHub areaKey="fermentacao" />} />
          <Route path="/aguas"         element={<AreaHub areaKey="aguas" />} />
          <Route path="/microbiologia" element={<AreaHub areaKey="microbiologia" />} />
          <Route path="/merck"         element={<AreaHub areaKey="merck" />} />
          <Route path="/destilaria"    element={<AreaHub areaKey="destilaria" />} />
          <Route path="/coi"           element={<AreaHub areaKey="coi" />} />
          <Route path="/caldos"        element={<AreaHub areaKey="caldos" />} />
          <Route path="/insumos"       element={<AreaHub areaKey="insumos" />} />

          {/* ── Fermentação ───────────────────────────────────────── */}
          <Route path="/simulador"     element={<SimuladorART />} />
          <Route path="/arrtitrino"    element={<SimuladorArrtTitrino />} />
          <Route path="/artmosto"      element={<SimuladorArtMosto />} />
          <Route path="/acides-dorna"  element={<AcidesDorna />} />
          <Route path="/acides-mosto"  element={<AcidesMosto />} />

          {/* ── Águas ─────────────────────────────────────────────── */}
          <Route path="/SilicaBaixa"         element={<SimuladorSilicaBaixa />} />
          <Route path="/alcalinidade"        element={<SimuladorAlcalinidade />} />
          <Route path="/cloreto"             element={<SimuladorCloreto />} />
          <Route path="/dureza"              element={<SimuladorDureza />} />
          <Route path="/deha"                element={<SimuladorDeha />} />
          <Route path="/ferro"               element={<SimuladorFerro />} />
          <Route path="/naftol"              element={<SimuladorNaftol />} />
          <Route path="/silica-alta"         element={<SimuladorSilicaAlta />} />
          <Route path="/ferro-hach"          element={<SimuladorFerroHach />} />
          <Route path="/art-aguas"           element={<SimuladorArtAguas />} />
          <Route path="/condutividade"       element={<CondutividadeAguas />} />
          <Route path="/ph-aguas"            element={<PhAguas />} />

          {/* ── Microbiologia ─────────────────────────────────────── */}
          <Route path="/viabilidade"         element={<SimuladorMicrobiologico />} />
          <Route path="/contagembastonetes"  element={<SimuladorContagemBastonetes />} />
          <Route path="/acidolatico"         element={<SimuladorAcidoLatico />} />

          {/* ── Merck · Qhantye ───────────────────────────────────── */}
          <Route path="/silica-mk"       element={<SilicaMk />} />
          <Route path="/silica-baixa-mk" element={<SilicaBaixaMk />} />
          <Route path="/silica-alta-mk"  element={<SilicaAltaMk />} />
          <Route path="/ferro-mk"        element={<FerroMk />} />
          <Route path="/cloreto-mk"      element={<CloretoMk />} />
          <Route path="/cloro-mk"        element={<CloroMk />} />
          <Route path="/dureza-mk"       element={<DurezaMk />} />

          {/* ── Destilaria ────────────────────────────────────────── */}
          <Route path="/glco2"                element={<SimuladorGlCo2 />} />
          <Route path="/glcuba"               element={<SimuladorGlCuba />} />
          <Route path="/acalcoo"              element={<SimuladorAcAlcoo />} />
          <Route path="/ph-alcool"            element={<PhAlcool />} />
          <Route path="/condutividade-alcool" element={<CondutividadeAlcool />} />

          {/* ── Caldos ────────────────────────────────────────────── */}
          <Route path="/pol-bagaco"      element={<PolBagaco />} />
          <Route path="/umidade-bagaco"  element={<UmidadeBagaco />} />
          <Route path="/umidade-torta"    element={<UmidadeTorta />} />
          <Route path="/impureza-bagaco" element={<ImpurezaBagaco />} />

          {/* ── COI ───────────────────────────────────────────────── */}
          <Route path="/coigeracaodevapor" element={<COISimulator />} />

          {/* ── 404 ───────────────────────────────────────────────── */}
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
