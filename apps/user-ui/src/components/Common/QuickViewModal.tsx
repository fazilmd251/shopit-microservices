"use client";

import React, { useEffect, useState } from "react";
import { useModalContext } from "../../app/context/QuickViewModalContext";
import { usePreviewSlider } from "../../app/context/PreviewSliderContext";
import { useStore } from "../../store/store";
import useUser from "../../hooks/useUser";
import useLocationTracking from "../../hooks/useLocationTracking";
import useDeviceTracking from "../../hooks/useDeviceTracking";

type Product = any;

const QuickViewModal = () => {
  const { isModalOpen, closeModal, product } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();

  const [quantity, setQuantity] = useState(1);
  const [activePreview, setActivePreview] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes[0]||null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.color[0]||null);
  const { cart, addToCart, removeFromCart, wishlist, addToWishList, removeFromWishList } = useStore()
  const isInCart = cart.some(crt => crt?.id === product?.id)
  const isInWishList = cart.some(list => list?.id === product?.id)
  const { user } = useUser()
  const location = useLocationTracking()
  const deviceInfo = useDeviceTracking()

  const handlePreviewSlider = () => {
    if (!product) return;
    openPreviewModal();
  };

  const handleAddToCart = () => {
    if (!product) return;
    // later: call cart logic / mutation here
    closeModal();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
      setActivePreview(0);
      setSelectedSize(null);
      setSelectedColor(null);
    };
  }, [isModalOpen, closeModal]);

  if (!product) return null;

  const inStock = typeof product.stock === "number" && product.stock > 0;
  const shop = product.Shop;

  return (
    <div
      className={`${isModalOpen ? "z-99999" : "hidden"
        } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            {/* Left: gallery (big preview + thumbnails below) */}
            <div className="max-w-[526px] w-full">
              {/* Big preview */}
              <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3 mb-4">
                <div>
                  <button
                    onClick={handlePreviewSlider}
                    aria-label="button for zoom"
                    className="gallery__Image w-10 h-10 rounded-[5px] bg-white shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-8 right-4 lg:right-8 z-50"
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                        fill=""
                      />
                    </svg>
                  </button>

                  {product?.images?.[activePreview]?.file_url && (
                    <img
                      src={product.images[activePreview].file_url}
                      alt="products-details"
                      width={400}
                      height={400}
                      className="object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Thumbnails below preview */}
              <div className="flex gap-3 flex-wrap">
                {product.images?.map((img: any, key: number) => (
                  <button
                    onClick={() => setActivePreview(key)}
                    key={key}
                    className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${activePreview === key && "border-2 border-blue"
                      }`}
                  >
                    <img
                      src={img?.file_url || ""}
                      alt="thumbnail"
                      width={61}
                      height={61}
                      className="aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: details */}
            <div className="max-w-[445px] w-full">
              {/* Shop details at top right side */}
              {shop && (
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="text-xs">
                    <p className="font-semibold text-dark">
                      Sold by:{" "}
                      <span className="font-medium text-blue">
                        {shop.name}
                      </span>
                    </p>
                    {shop.bio && (
                      <p className="text-[11px] text-dark-4 line-clamp-2">
                        {shop.bio}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-dark font-medium">
                      Shop rating:{" "}
                      <span className="text-yellow-500 font-semibold">
                        {shop.ratings ?? 0}/5
                      </span>
                    </p>
                    {shop.address && (
                      <p className="text-[11px] text-dark-4 line-clamp-1">
                        {shop.address}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Top row: chat + badge */}
              <div className="flex items-center justify-between mb-4">
                <button className="inline-flex items-center gap-2 text-xs font-medium text-blue border border-blue rounded-md py-1.5 px-3 hover:bg-blue hover:text-white ease-out duration-200">
                  Chat with seller
                </button>

                <span className="inline-block text-[11px] font-medium text-white py-1 px-3 bg-green">
                  SALE 20% OFF
                </span>
              </div>

              <h3 className="font-semibold text-lg xl:text-heading-5 text-dark mb-2">
                {product.title}
              </h3>

              {/* Stock status */}
              <p className="text-xs mb-4">
                {inStock ? (
                  <span className="text-green-600 font-medium">
                    In stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Out of stock
                  </span>
                )}
              </p>

              {/* Size selector */}
              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-dark mb-2">
                    Select size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[40px] px-3 py-1.5 text-xs rounded-md border text-dark ${selectedSize === size
                          ? "border-blue bg-blue text-white"
                          : "border-gray-3 bg-white hover:border-blue"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {Array.isArray(product.color) && product.color.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-dark mb-2">
                    Select color
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.color.map((c: string) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border-2 ${selectedColor === c
                          ? "border-blue"
                          : "border-gray-3"
                          }`}
                        style={{ backgroundColor: c }}
                        aria-label={`Select color ${c}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-between gap-5 mt-4 mb-5">
                <div>
                  <h4 className="font-semibold text-sm text-dark mb-2">
                    Price
                  </h4>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-lg xl:text-xl">
                      ${product.discountedPrice || product.salesPrice}
                    </span>
                    <span className="font-medium text-dark-4 text-sm xl:text-base line-through">
                      ${product.price || product.regularPrice}
                    </span>
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-dark mb-2">
                    Quantity
                  </h4>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        quantity > 1 && setQuantity(quantity - 1)
                      }
                      aria-label="button for remove product"
                      className="flex items-center justify-center w-9 h-9 rounded-[5px] bg-gray-2 text-dark ease-out duration-200 hover:text-blue"
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="2"
                        viewBox="0 0 16 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M-8.548e-08 0.977778C-3.82707e-08 0.437766 0.437766 3.82707e-08 0.977778 8.548e-08L15.0222 1.31328e-06C15.5622 1.36049e-06 16 0.437767 16 0.977779C16 1.51779 15.5622 1.95556 15.0222 1.95556L0.977778 1.95556C0.437766 1.95556 -1.32689e-07 1.51779 -8.548e-08 0.977778Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    <span className="flex items-center justify-center w-16 h-9 rounded-[5px] border border-gray-4 bg-white font-medium text-dark text-sm">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="button for add product"
                      className="flex items-center justify-center w-9 h-9 rounded-[5px] bg-gray-2 text-dark ease-out duration-200 hover:text-blue"
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.08889 0C8.6289 2.36047e-08 9.06667 0.437766 9.06667 0.977778L9.06667 15.0222C9.06667 15.5622 8.6289 16 8.08889 16C7.54888 16 7.11111 15.5622 7.11111 15.0222L7.11111 0.977778C7.11111 0.437766 7.54888 -2.36047e-08 8.08889 0Z"
                          fill=""
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 7.91111C4.72093e-08 7.3711 0.437766 6.93333 0.977778 6.93333L15.0222 6.93333C15.5622 6.93333 16 7.3711 16 7.91111C16 8.45112 15.5622 8.88889 15.0222 8.88889L0.977778 8.88889C0.437766 8.88889 -4.72093e-08 8.45112 0 7.91111Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-3">
                <button
                  disabled={isInCart || quantity === 0}
                  onClick={() => addToCart({
                    ...product, quantity: 1
                  }, user, location, deviceInfo)}
                  className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark text-sm"
                >
                  Add to Cart
                </button>

                <button className="inline-flex items-center gap-2 font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-95 text-sm"
                 disabled={isInWishList} onClick={() => addToWishList({ ...product, quantity: 1 },user,location,deviceInfo)}
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.68698 3.68688C3.30449 4.31882 2.29169 5.82191 2.29169 7.6143C2.29169 9.44546 3.04103 10.8569 4.11526 12.0665C5.00062 13.0635 6.07238 13.8897 7.11763 14.6956C7.36588 14.8869 7.61265 15.0772 7.85506 15.2683C8.29342 15.6139 8.68445 15.9172 9.06136 16.1374C9.43847 16.3578 9.74202 16.4584 10 16.4584C10.258 16.4584 10.5616 16.3578 10.9387 16.1374C11.3156 15.9172 11.7066 15.6139 12.145 15.2683C12.3874 15.0772 12.6342 14.8869 12.8824 14.6956C13.9277 13.8897 14.9994 13.0635 15.8848 12.0665C16.959 10.8569 17.7084 9.44546 17.7084 7.6143C17.7084 5.82191 16.6955 4.31882 15.3131 3.68688C13.97 3.07295 12.1653 3.23553 10.4503 5.01733C10.3325 5.13974 10.1699 5.20891 10 5.20891C9.83012 5.20891 9.66754 5.13974 9.54972 5.01733C7.83474 3.23553 6.03008 3.07295 4.68698 3.68688ZM10 3.71573C8.07331 1.99192 5.91582 1.75077 4.16732 2.55002C2.32061 3.39415 1.04169 5.35424 1.04169 7.6143C1.04169 9.83557 1.9671 11.5301 3.18062 12.8966C4.15241 13.9908 5.34187 14.9067 6.39237 15.7155C6.63051 15.8989 6.8615 16.0767 7.0812 16.2499C7.50807 16.5864 7.96631 16.9453 8.43071 17.2166C8.8949 17.4879 9.42469 17.7084 10 17.7084C10.5754 17.7084 11.1051 17.4879 11.5693 17.2166C12.0337 16.9453 12.492 16.5864 12.9188 16.2499C13.1385 16.0767 13.3695 15.8989 13.6077 15.7155C14.6582 14.9067 15.8476 13.9908 16.8194 12.8966C18.0329 11.5301 18.9584 9.83557 18.9584 7.6143C18.9584 5.35424 17.6794 3.39415 15.8327 2.55002C14.0842 1.75077 11.9267 1.99192 10 3.71573Z"
                      fill=""
                    />
                  </svg>
                  Add to Wishlist
                </button>
              </div>

              {/* Estimated delivery */}
              <p className="text-[11px] text-dark-4">
                Estimated delivery: 3–5 business days (exact date shown at
                checkout)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
