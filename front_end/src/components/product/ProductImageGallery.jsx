const ProductImageGallery = ({ images, selectedColor }) => {
  const filteredImages = selectedColor
    ? images.filter(img => img.color?.id === selectedColor.id)
    : images;

  return (
    <div className="space-y-4">
      {filteredImages.length > 0 ? (
        <img
          src={filteredImages[0].imageUrl}
          alt="Ảnh chính"
          className="w-full h-auto rounded-lg shadow"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500">Không có ảnh</span>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
