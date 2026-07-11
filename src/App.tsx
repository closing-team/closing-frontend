import { Route, Routes } from 'react-router-dom';
import GuideListPage from './pages/guide/GuideListPage';
import SupportListPage from './pages/support/SupportListPage';

function HomePlaceholder() {
  return <div>홈 (준비 중)</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePlaceholder />} />
      <Route path="/guide" element={<GuideListPage />} />
      {/* TODO: /guide/:stepId — 가이드 상세 (GUIDE002) */}
      <Route path="/support" element={<SupportListPage />} />
      {/* TODO: /support/:supportId — 지원정보 상세 (SUP003) */}
      {/* TODO: /market — 중고거래 */}
    </Routes>
  );
}
