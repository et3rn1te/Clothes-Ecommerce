import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../API/ProductService';
// ProductVariantService might not be needed here if variants are loaded with product
// import ProductVariantService from '../../API/ProductVariantService';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfo from '../../components/product/ProductInfo';

const ProductDetailPage = () => {
  const { productId, slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  // We still keep variants here to pass to ProductInfo, but selected state is here
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected variant details, lifted from ProductInfo
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId, slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      let productResponse;
      
      if (slug) {
        // If we have a slug, use the slug-based endpoint
        productResponse = await ProductService.getProductBySlug(slug);
      } else {
        // Otherwise, use the ID-based endpoint
        productResponse = await ProductService.getProductById(productId);
      }
      
      setProduct(productResponse.data);

      // Assuming variants are now included in the product response
      if (productResponse.data && productResponse.data.variants) {
          setVariants(productResponse.data.variants);
          // Attempt to pre-select a default variant (e.g., the first one)
          if (productResponse.data.variants.length > 0) {
              const defaultVariant = productResponse.data.variants[0];
              setSelectedColor(defaultVariant.color?.name || null);
              setSelectedSize(defaultVariant.size?.name || null);
              setSelectedVariant(defaultVariant);
          }
      }
      
      setError(null);
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (variant) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', variant);
  };

  // Handler for variant selection changes from ProductInfo
  const handleVariantSelectionChange = (color, size, variant) => {
      setSelectedColor(color);
      setSelectedSize(size);
      setSelectedVariant(variant);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchProductDetails}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Helper to generate full breadcrumb path using parent information
  const getFullBreadcrumbs = (product) => {
    const breadcrumbs = [{ name: 'Trang chủ', href: '/' }];

    if (product && product.categories && product.categories.length > 0) {
      // Assuming the product can have multiple categories, let's build a path for the first one.
      // You might need different logic if a product belongs to multiple main categories.
      let currentCategory = product.categories[0];
      const categoryPath = [];

      // Traverse up the parent chain
      // To ensure we find the parent object when traversing, we might need a map
      const categoryMap = product.categories.reduce((map, cat) => {
          map[cat.id] = cat;
          return map;
      }, {});

      let tempCategory = currentCategory;
      while (tempCategory) {
        categoryPath.unshift({ name: tempCategory.name, href: `/category/${tempCategory.name}` });
        // Use the map to find the parent category object by parentId
        tempCategory = categoryMap[tempCategory.parentId];
      }

      breadcrumbs.push(...categoryPath);
    }

    // Add the product name to the end
    breadcrumbs.push({ name: product.name, href: '#' });

    return breadcrumbs;
  };

  const breadcrumbs = getFullBreadcrumbs(product);

  // Determine which images to show in the gallery
  const imagesToShow = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0
    ? selectedVariant.images // Show variant images if available and a variant is selected
    : product.images; // Otherwise, show product-level images

  // Determine the primary image for the gallery
  const primaryImageToShow = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0
    ? selectedVariant.images.find(img => img.primary) || selectedVariant.images[0] // Use primary variant image or first variant image
    : product.primaryImage; // Otherwise, use product primary image


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index}> {/* Using index as key since name might not be unique in path */}
              <div className="flex items-center">
                {index > 0 && (
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .948.474-8 16-.948-.474z" />
                  </svg>
                )}
                <a
                  href={breadcrumb.href}
                  className="ml-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {breadcrumb.name}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image Gallery Column */}
        <div className="flex flex-col-reverse lg:flex-row lg:gap-x-8">
          {/* Thumbnails Column (Vertical) and Main Image */}
           {/* Pass the determined images and primary image to the gallery */}
           <ProductImageGallery
              images={imagesToShow}
              primaryImage={primaryImageToShow}
              // Add a key prop here if you want to force re-render when images change
              // key={selectedVariant?.id || product.id}
            />
        </div>

        {/* Product Info Column */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <ProductInfo
            product={product}
            variants={variants} // Still pass all variants for internal logic in ProductInfo
            onAddToCart={handleAddToCart}
            // Pass down state and handler for variant selection
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedVariant={selectedVariant}
            onVariantSelectionChange={handleVariantSelectionChange}
          />

          {/* Additional Information Section */}
          <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Additional Information</h3>
              {/* Placeholder for Free Shipping, Return Policy, etc. */}
              <div className="mt-4 space-y-6 text-sm text-gray-600">
                  <p>Free ship cho đơn từ 200k</p>
                  <p>60 ngày đổi trả vì bất kỳ lý do gì</p>
                  <p>Hotline 1900.27.27.37 hỗ trợ từ 8h30 - 22h mỗi ngày</p>
                  <p>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h</p>
                  {/* Add Zalo Chat link if needed */} 
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 