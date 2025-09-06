"use client";

import React from "react";
import { ProductCardProps } from "~~/types";

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy, onViewDetails }) => {
  const formatPrice = (price: number, currency: string) => {
    return `$${price.toLocaleString()} ${currency}`;
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm flex flex-col items-center">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Product Image
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">In Stock</span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Out of Stock</span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price, product.currency)}</span>
        </div>

        {/* Specs Preview */}
        {product.specs && product.specs.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Key specs:</span> {product.specs.slice(0, 2).join(", ")}
              {product.specs.length > 2 && "..."}
            </div>
          </div>
        )}

        {/* Merchant */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Sold by:</span> {product.merchant}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onBuy(product.id)}
            disabled={!product.inStock}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              product.inStock
                ? "brand-gradient-primary text-white hover-brand-primary shadow-brand-primary"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {product.inStock ? "Buy Now" : "Out of Stock"}
          </button>
          <button
            onClick={() => onViewDetails(product.id)}
            className="px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium focus-brand-primary"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
