import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ProductCard from "../../components/used/ProductCard";
import { useUsedStore } from "../../stores/usedStore";
import { usedDetailPath } from "../../constants/routes";

export default function UsedLikedProductsPage() {
  const navigate = useNavigate();
  const products = useUsedStore((s) => s.products);
  const toggleLike = useUsedStore((s) => s.toggleLike);

  const likedProducts = products.filter((p) => p.liked);

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar title="관심 물품" onBack={() => navigate(-1)} />

      {likedProducts.length === 0 ? (
        <p className="px-4 pt-20 text-center text-body-2 text-gray-400">
          아직 관심 등록한 물품이 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-3">
          {likedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(id) => navigate(usedDetailPath(id))}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}
