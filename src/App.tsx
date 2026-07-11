import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import GuideListPage from "./pages/guide/GuideListPage";
import LLMPage from "./pages/llm/LLMPage";
import SupportListPage from "./pages/support/SupportListPage";
import UsedListPage from "./pages/used/UsedListPage";

export default function App() {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app bg-white shadow-sm">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuideListPage />} />
        <Route path="/ai" element={<LLMPage />} />
        {/* TODO: /guide/:stepId — 가이드 상세 (GUIDE002) */}
        <Route path="/support" element={<SupportListPage />} />
        {/* TODO: /support/:supportId — 지원정보 상세 (SUP003) */}
        <Route path="/used" element={<UsedListPage />} />
        {/* TODO: /used/:productId — 상품 상세 (MKT002) */}
        {/* TODO: /used/write — 글쓰기 (MKT003) */}
      </Routes>
    </div>
  );
}
