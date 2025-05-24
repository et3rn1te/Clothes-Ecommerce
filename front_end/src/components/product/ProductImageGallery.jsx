import React, { useState, useEffect } from 'react';

const ProductImageGallery = ({ images, primaryImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Effect to update selected image when images or primaryImage props change
  useEffect(() => {
    if (primaryImage) {
      setSelectedImage(primaryImage);
    } else if (images && images.length > 0) {
      // If no primary image is provided, select the first active image if available
      const firstActiveImage = images.find(img => img.active && img.imageUrl);
      if (firstActiveImage) {
          setSelectedImage(firstActiveImage);
      } else {
          setSelectedImage(null); // No active images available
      }
    } else {
        setSelectedImage(null); // No images provided at all
    }
  }, [images, primaryImage]); // Depend on images and primaryImage props

  // Combine primaryImage and images, filter out null/undefined and inactive images
  // Ensure primary image is included only once if it's also in the images list
  const allImages = [
    primaryImage,
    ...(images || []).filter(img => img && img.imageUrl && img.active && (!primaryImage || img.id !== primaryImage.id))
  ].filter(Boolean);

  // Get image URL with proper fallback
  const getImageUrl = (image) => {
    if (!image || !image.imageUrl) {
      return 'https://placehold.co/600x800?text=No+Image';
    }
    return image.imageUrl;
  };

  // Get alt text with proper fallback
  const getAltText = (image, index) => {
    if (!image) return `Product image ${index + 1}`;
    return image.altText || `Product image ${index + 1}`;
  };

  // Handle image loading error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = 'https://placehold.co/600x800?text=Image+Error';
  };

  if (!primaryImage && allImages.length === 0) {
    return (
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src="https://placehold.co/600x800?text=No+Images"
          alt="No product images available"
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails (Vertical on Left for Large Screens) */}
      {allImages.length > 0 && ( // Show thumbnails if there's at least one image (primary or other active)
        <div className="flex-shrink-0 grid grid-cols-4 gap-4 lg:grid-cols-1 lg:gap-y-4">
          {allImages.map((image, index) => (
            <button
              key={image?.id || index}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg ${
                selectedImage?.id === image?.id
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:opacity-75'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={getAltText(image, index)}
                className="h-full w-full object-cover object-center"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image (Right) */}
       <div className="flex-1 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
        {selectedImage ? (
           <img
            src={getImageUrl(selectedImage)}
            alt={getAltText(selectedImage, 0)}
            className="h-full w-full object-cover object-center"
            onError={handleImageError}
          />
        ) : (
           <img
            src="https://placehold.co/600x800?text=No+Image"
            alt="No product image selected"
            className="h-full w-full object-cover object-center"
           />
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery; 