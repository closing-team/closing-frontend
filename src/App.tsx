import { Route, Routes } from 'react-router-dom';
import GuideListPage from './pages/guide/GuideListPage';

function HomePlaceholder() {
  return <div>홈 (준비 중)</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePlaceholder />} />
      <Route path="/guide" element={<GuideListPage />} />
      {/* TODO: /guide/:stepId — 가이드 상세 (GUIDE002) */}
      {/* TODO: /support — 지원정보 */}
      {/* TODO: /market — 중고거래 */}
    </Routes>
  );
}
