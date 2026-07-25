import { ImageIcon } from "../../assets/icons";

interface ProductThumbnailProps {
  imageUrl?: string | null;
  alt: string;
  iconClassName?: string;
}

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
