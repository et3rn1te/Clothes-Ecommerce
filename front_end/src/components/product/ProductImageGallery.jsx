import { useState } from 'react';

const ProductImageGallery = ({ images = [], selectedColor }) => {
  // Lấy ảnh đầu tiên làm ảnh mặc định
  const defaultImage = images.find(img => img.active)?.imageUrl || null;
  const [selectedImage, setSelectedImage] = useState(defaultImage);

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
    );
  }

  // Lọc ảnh theo màu sắc đã chọn
  const filteredImages = selectedColor
    ? images.filter(img => img.colorId === selectedColor.id && img.active)
    : images.filter(img => img.active);

  // Nếu không có ảnh nào được chọn, sử dụng ảnh đầu tiên
  if (!selectedImage && filteredImages.length > 0) {
    setSelectedImage(filteredImages[0].imageUrl);
  }

  return (
    <div className="space-y-4">
      {/* Ảnh chính */}
      {selectedImage && (
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={selectedImage}
            alt="Product"
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}

      {/* Thumbnails */}
      {filteredImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.imageUrl)}
              className={`relative aspect-square overflow-hidden rounded-lg ${
                selectedImage === image.imageUrl
                  ? 'ring-2 ring-blue-500'
                  : 'ring-1 ring-gray-200'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={image.altText || `Product ${image.id}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 