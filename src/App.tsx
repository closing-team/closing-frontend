import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import GuideListPage from './pages/guide/GuideListPage';
import LLMPage from './pages/llm/LLMPage';
import SupportListPage from './pages/support/SupportListPage';
import SplashPage from './pages/auth/SplashPage';
import LoginPage from './pages/auth/LoginPage';
import { ROUTES } from './constants/routes';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.SPLASH} element={<SplashPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.GUIDE_LIST} element={<GuideListPage />} />
      <Route path="/ai" element={<LLMPage />} />
      {/* TODO: /guide/:stepId — 가이드 상세 (GUIDE002) */}
      <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
      {/* TODO: /support/:supportId — 지원정보 상세 (SUP003) */}
      {/* TODO: /market — 중고거래 */}
    </Routes>
  );
}
