import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import GuideListPage from './pages/guide/GuideListPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/guide" element={<GuideListPage />} />
      {/* TODO: /guide/:stepId — 가이드 상세 (GUIDE002) */}
      {/* TODO: /support — 지원정보 */}
      {/* TODO: /market — 중고거래 */}
    </Routes>
  );
}
