import { ImageIcon } from "../../assets/icons";

interface ProductThumbnailProps {
  imageUrl?: string | null;
  alt: string;
  iconClassName?: string;
}

// 부모 컨테이너를 채우는 상품 이미지. 이미지가 없으면 회색 배경 + ImageIcon 폴백을 보여준다.
export default function ProductThumbnail({
  imageUrl,
  alt,
  iconClassName = "h-10 w-10",
}: ProductThumbnailProps) {
  if (imageUrl) {
    return (
      <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-gray-200">
      <ImageIcon className={iconClassName} />
    </div>
  );
}
