import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/used/SearchBar";
import CategoryPanel from "../../components/used/CategoryPanel";
import NavigationBar from "../../components/common/NavigationBar";
import Chip from "../../components/common/Chip";
import { ROUTES } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import { useCommitSearch } from "../../hooks/useCommitSearch";
import { RECOMMENDED_KEYWORD_POOL } from "../../constants/usedCategories";
import { pickRandomItems } from "../../utils/pickRandomItems";
import {
  toBusinessCategoryCode,
  toProductCategoryCode,
} from "../../utils/productCategoryMap";

const RECOMMENDED_KEYWORD_COUNT = 3;

export default function UsedSearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [recommendedKeywords] = useState(() =>
    pickRandomItems(RECOMMENDED_KEYWORD_POOL, RECOMMENDED_KEYWORD_COUNT),
  );

  const recentSearches = useUsedStore((s) => s.recentSearches);
  const removeRecentSearch = useUsedStore((s) => s.removeRecentSearch);
  const commitSearch = useCommitSearch();

  const goResult = (query: string) => {
    const q = commitSearch(query);
    if (!q) return;
    navigate(`${ROUTES.USED_SEARCH_RESULT}?q=${encodeURIComponent(q)}`);
  };

  const goCategory = (type: "industry" | "item", label: string) => {
    const param =
      type === "industry"
        ? `businessCategory=${encodeURIComponent(toBusinessCategoryCode(label))}`
        : `productCategory=${encodeURIComponent(toProductCategoryCode(label))}`;
    navigate(
      `${ROUTES.USED_SEARCH_RESULT}?${param}&label=${encodeURIComponent(label)}`,
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-24">
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        onBack={() => navigate(-1)}
        onSearch={() => goResult(keyword)}
      />

      <div className="flex flex-col gap-2 bg-gray-30 py-[18px]">
        <section>
          <h2 className="px-[18px] py-1 text-subtitle-2 text-gray-900">
            최근 검색어
          </h2>
          {recentSearches.length === 0 ? (
            <p className="px-4 py-2 text-body-2 text-gray-400">
              최근 검색어가 없습니다.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1 px-4 py-2">
              {recentSearches.map((kw) => (
                <Chip
                  key={kw}
                  variant="recent"
                  label={kw}
                  onClick={() => goResult(kw)}
                  onRemove={() => removeRecentSearch(kw)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="px-[18px] py-1 text-subtitle-2 text-gray-900">
            추천 검색어
          </h2>
          <div className="flex flex-wrap gap-1 px-4 py-2">
            {recommendedKeywords.map((kw) => (
              <Chip
                key={kw}
                variant="keyword"
                label={`#${kw}`}
                onClick={() => goResult(kw)}
              />
            ))}
          </div>
        </section>
      </div>

      <CategoryPanel onSelect={goCategory} />

      <NavigationBar />
    </div>
  );
}
