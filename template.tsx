// "use client";

// import React, { useState } from "react";
// import { useStore } from "../../../../store/store"; 
// import useUser from "../../../../hooks/useUser"; 
// import useLocationTracking from "../../../../hooks/useLocationTracking"; 
// import useDeviceTracking from "../../../../hooks/useDeviceTracking";
// import Breadcrumb from "apps/user-ui/src/components/Common/Breadcrumb";

// // --- MOCK DATA ---
// const mockProduct = {
//   _id: "static-dev-id-001",
//   title: "Urban Explorer Noise-Cancelling Headphones Pro",
//   shortDescription: "Experience pure sound with the Urban Explorer Pro. Featuring industry-leading active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
//   regularPrice: 350.00,
//   discountedPrice: 299.00,
//   stock: 12, 
//   brand: "AudioTech",
//   seller: {
//     name: "AudioTech Official Store",
//     rating: 4.8,
//     shipsOnTime: "98%",
//     chatResponse: "95%"
//   },
//   category: "Electronics",
//   subCategory: "Audio",
//   warranty: "2 Years Official Warranty",
//   sku: "HDPH-500-BLK",
//   images: [
//     { file_url: "/images/products/product-4-bg-1.png" },
//     { file_url: "/images/products/product-4-bg-2.png" },
//     { file_url: "/images/products/product-4-sm-1.png" },
//     { file_url: "/images/products/product-4-sm-2.png" }
//   ],
//   videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
//   cashOnDelivery: true,
//   colors: ["#1F2937", "#D1D5DB", "#3B82F6"], 
//   sizes: ["Standard", "Pro Fit"],
//   tags: ["Wireless", "Bluetooth 5.0", "Noise Cancelling"],
//   customSpecifications: [
//     { key: "Battery Life", value: "30 Hours" },
//     { key: "Charging Time", value: "2 Hours (USB-C)" },
//     { key: "Weight", value: "250g" },
//     { key: "Bluetooth Range", value: "10 Meters" },
//     { key: "Driver Unit", value: "40mm Dynamic" }
//   ],
//   reviews: [
//     {
//       id: 1,
//       user: "Sarah Jenkins",
//       date: "Oct 24, 2025",
//       rating: 5,
//       comment: "Absolutely love these! The battery life is insane."
//     },
//     {
//       id: 2,
//       user: "Mike Ross",
//       date: "Nov 02, 2025",
//       rating: 4,
//       comment: "Great headphones for the price."
//     }
//   ]
// };

// // --- HELPER COMPONENT: STAR RATING ---
// const StarRating = ({ rating, setRating, editable = false }: { rating: number, setRating?: (r: number) => void, editable?: boolean }) => {
//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           disabled={!editable}
//           onClick={() => editable && setRating && setRating(star)}
//           className={`${editable ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform focus:outline-none`}
//         >
//           <svg
//             className={`w-4 h-4 ${star <= rating ? "fill-[#FACC15] text-[#FACC15]" : "fill-[#D1D5DB] text-[#D1D5DB]"}`}
//             viewBox="0 0 20 20"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         </button>
//       ))}
//     </div>
//   );
// };

// const ProductDetailsPage = () => {
//   const product = mockProduct;

//   // --- STATE ---
//   const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
//   const [quantity, setQuantity] = useState(1);
//   const [activePreview, setActivePreview] = useState(0);
//   const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
//   const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
//   const [reviewForm, setReviewForm] = useState({ rating: 0, name: "", email: "", comment: "" });

//   // --- CONTEXT HOOKS ---
//   const { cart = [], addToCart = () => {}, wishlist = [], addToWishList = () => {} } = useStore() || {};
//   const { user } = useUser() || {};
//   const location = useLocationTracking(); 
//   const deviceInfo = useDeviceTracking();

//   // --- LOGIC ---
//   const isInCart = cart.some((crt: any) => crt?._id === product._id);
//   const isInWishList = wishlist.some((list: any) => list?._id === product._id);

//   const handleSubmitReview = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (reviewForm.rating === 0) return alert("Please select a rating star!");
//     alert(`Review Posted!\nName: ${reviewForm.name}\nComment: ${reviewForm.comment}`);
//     setReviewForm({ rating: 0, name: "", email: "", comment: "" });
//   };

//   const handleChat = () => {
//     alert("Chat system initialization... (Coming Soon)");
//   };

//   return (
//     <>
//     <Breadcrumb title="Product" pages={['product']}/>
//     <section className="bg-white py-10 lg:py-20 font-sans text-[#1F2937]">
//       <div className="max-w-[1170px] mx-auto px-4 sm:px-8">
        
//         {/* --- HERO SECTION --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20 items-start">
          
//           {/* ================= LEFT COLUMN ================= */}
//           <div className="flex flex-col gap-6">
            
//             {/* 1. Big Preview */}
//             <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] min-h-[400px] lg:h-[500px] flex items-center justify-center group">
//               <img
//                 src={product.images[activePreview].file_url}
//                 alt="Product Preview"
//                 className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
//               />
//               <span className="absolute top-5 left-5 bg-[#EF4444] text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
//                 Sale -15%
//               </span>
//             </div>

//             {/* 2. Thumbnails Row */}
//             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//               {product.images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActivePreview(idx)}
//                   className={`relative w-24 h-24 rounded-lg border-2 flex-shrink-0 overflow-hidden ${
//                     activePreview === idx ? "border-[#2563EB] ring-2 ring-[#DBEAFE]" : "border-[#E5E7EB] hover:border-[#9CA3AF]"
//                   }`}
//                 >
//                   <img src={img.file_url} alt="thumb" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>

//             {/* 3. SELLER & STORE INFO (Moved Here) */}
//             <div className="border border-[#E5E7EB] rounded-xl p-6 bg-[#FAFAFA]">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                      <span className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Sold By</span>
//                      <h4 className="text-base font-bold text-[#111827] flex items-center gap-2 mt-1">
//                        <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
//                        {product.seller.name}
//                      </h4>
//                   </div>
//                 </div>

//                 {/* Seller Stats */}
//                 <div className="grid grid-cols-3 gap-3 mb-5">
//                    <div className="bg-white p-3 rounded-lg text-center border border-[#E5E7EB] shadow-sm">
//                       <span className="block text-sm font-bold text-[#F59E0B]">{product.seller.rating}/5</span>
//                       <span className="text-[10px] text-[#6B7280] uppercase font-semibold mt-1">Rating</span>
//                    </div>
//                    <div className="bg-white p-3 rounded-lg text-center border border-[#E5E7EB] shadow-sm">
//                       <span className="block text-sm font-bold text-[#111827]">{product.seller.shipsOnTime}</span>
//                       <span className="text-[10px] text-[#6B7280] uppercase font-semibold mt-1">On Time</span>
//                    </div>
//                    <div className="bg-white p-3 rounded-lg text-center border border-[#E5E7EB] shadow-sm">
//                       <span className="block text-sm font-bold text-[#111827]">{product.seller.chatResponse}</span>
//                       <span className="text-[10px] text-[#6B7280] uppercase font-semibold mt-1">Response</span>
//                    </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <button 
//                     onClick={handleChat}
//                     className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#2563EB] text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
//                     Chat Now
//                   </button>
//                   <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#D1D5DB] text-[#374151] font-semibold rounded-lg hover:border-[#111827] hover:text-[#111827] transition-all text-sm bg-white">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
//                     Visit Store
//                   </button>
//                 </div>
//             </div>

//           </div>

//           {/* ================= RIGHT COLUMN ================= */}
//           <div className="flex flex-col">
//             {/* Breadcrumb / Brand */}
//             <div className="text-sm text-[#6B7280] mb-2 font-medium tracking-wide uppercase">
//               {product.category} / {product.subCategory}
//             </div>

//             <h1 className="text-3xl lg:text-4xl font-bold text-[#111827] mb-4 leading-tight">
//               {product.title}
//             </h1>

//             {/* Rating & Stock Row */}
//             <div className="flex items-center gap-4 mb-6">
//               <div className="flex items-center gap-2">
//                 <StarRating rating={4} />
//                 <span className="text-sm text-[#6B7280] font-medium underline cursor-pointer hover:text-[#2563EB]">
//                   {product.reviews.length} Reviews
//                 </span>
//               </div>
//               <div className="h-4 w-[1px] bg-[#D1D5DB]"></div>
//               <span className="text-sm text-[#16A34A] font-semibold bg-[#F0FDF4] px-2 py-0.5 rounded">
//                 In Stock ({product.stock})
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-end gap-3 mb-6">
//               <span className="text-3xl font-bold text-[#2563EB]">${product.discountedPrice}</span>
//               <span className="text-xl text-[#9CA3AF] line-through mb-1">${product.regularPrice}</span>
//             </div>

//             <p className="text-[#4B5563] mb-8 leading-relaxed text-base">
//               {product.shortDescription}
//             </p>

//             {/* Selectors */}
//             <div className="space-y-6 mb-8 border-t border-b border-[#F3F4F6] py-6">
//               {/* Colors */}
//               <div>
//                 <span className="block text-sm font-bold text-[#111827] mb-3">Color: <span className="font-normal text-[#6B7280]">{selectedColor}</span></span>
//                 <div className="flex items-center gap-3">
//                   {product.colors.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => setSelectedColor(color)}
//                       className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition-all ${
//                         selectedColor === color ? "ring-2 ring-offset-2 ring-[#2563EB] scale-110" : "hover:scale-110"
//                       }`}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Sizes */}
//               <div>
//                 <span className="block text-sm font-bold text-[#111827] mb-3">Size: <span className="font-normal text-[#6B7280]">{selectedSize}</span></span>
//                 <div className="flex flex-wrap gap-2">
//                   {product.sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-5 py-2 text-sm font-medium rounded-md border transition-all ${
//                         selectedSize === size
//                           ? "bg-[#111827] text-white border-[#111827]"
//                           : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#9CA3AF]"
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               {/* Quantity Counter */}
//               <div className="flex items-center justify-between border border-[#D1D5DB] rounded-lg w-full sm:w-32 bg-[#F9FAFB]">
//                 <button 
//                   onClick={() => quantity > 1 && setQuantity(q => q - 1)}
//                   className="w-10 h-12 flex items-center justify-center text-xl hover:bg-[#E5E7EB] rounded-l-lg"
//                 >-</button>
//                 <span className="font-bold text-[#111827]">{quantity}</span>
//                 <button 
//                   onClick={() => setQuantity(q => q + 1)}
//                   className="w-10 h-12 flex items-center justify-center text-xl hover:bg-[#E5E7EB] rounded-r-lg"
//                 >+</button>
//               </div>

//               <button
//                  disabled={isInCart || quantity === 0}
//                  onClick={() => addToCart({
//                    ...product, quantity: 1
//                  }, user, location, deviceInfo)}
//                 className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base py-3.5 px-6 rounded-lg shadow-lg shadow-[#2563EB]/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isInCart ? "Already in Cart" : "Add to Cart"}
//               </button>

//               <button 
//                  disabled={isInWishList} onClick={() => addToWishList({ ...product, quantity: 1 },user,location,deviceInfo)}
//                  className={`w-full sm:w-14 h-12 sm:h-auto flex items-center justify-center border rounded-lg transition-all ${isInWishList ? 'text-[#EF4444] border-[#FECACA] bg-[#FEF2F2]' : 'border-[#D1D5DB] hover:border-[#6B7280] hover:bg-[#F9FAFB]'}`}
//               >
//                 <svg className={`w-6 h-6 ${isInWishList ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth="2">
//                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//               </button>
//             </div>

//             {/* Location Display */}
//             {location && location.city && location.country && (
//                <div className="mt-6 p-3 bg-gray-50 border border-[#E5E7EB] rounded-lg flex items-center gap-2 text-sm text-[#111827]">
//                   <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                   <span>Deliver to: <span className="font-bold">{location.city}, {location.country}</span></span>
//                </div>
//             )}

//             {/* Delivery Info */}
//             <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#6B7280]">
//                <span className="flex items-center gap-1">
//                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                  Free Delivery Available
//                </span>
//                <span className="flex items-center gap-1">
//                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                  {product.warranty}
//                </span>
//                <span className="flex items-center gap-1">
//                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
//                  Cash on Delivery
//                </span>
//             </div>
            
//           </div>
//         </div>

//         {/* --- TABS SECTION --- */}
//         <div className="bg-[#F9FAFB] rounded-2xl p-6 lg:p-10 border border-[#F3F4F6]">
//           <div className="flex flex-wrap gap-8 border-b border-[#E5E7EB] mb-8">
//             {["description", "specs", "reviews"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab as any)}
//                 className={`pb-4 text-lg font-bold capitalize transition-all relative ${
//                   activeTab === tab
//                     ? "text-[#2563EB] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#2563EB] after:rounded-t-md"
//                     : "text-[#6B7280] hover:text-[#1F2937]"
//                 }`}
//               >
//                 {tab === 'specs' ? 'Specifications' : tab}
//               </button>
//             ))}
//           </div>

//           <div className="min-h-[200px]">
//             {/* Description */}
//             {activeTab === "description" && (
//               <div className="animate-fade-in-up">
//                 <p className="text-[#4B5563] leading-7 mb-6 max-w-4xl">
//                   {product.description}
//                 </p>
//                 <div className="grid md:grid-cols-2 gap-6 mt-8">
//                    <div className="bg-white p-5 rounded-lg border border-[#F3F4F6] shadow-sm">
//                       <h4 className="font-bold text-[#111827] mb-2">Advanced Noise Cancellation</h4>
//                       <p className="text-sm text-[#6B7280]">Block out the world and focus on your music with our state-of-the-art ANC technology.</p>
//                    </div>
//                    <div className="bg-white p-5 rounded-lg border border-[#F3F4F6] shadow-sm">
//                       <h4 className="font-bold text-[#111827] mb-2">All Day Comfort</h4>
//                       <p className="text-sm text-[#6B7280]">Plush memory foam ear cushions ensure you can listen for hours without fatigue.</p>
//                    </div>
//                 </div>
//               </div>
//             )}

//             {/* Specs */}
//             {activeTab === "specs" && (
//               <div className="animate-fade-in-up max-w-3xl">
//                 <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-[#E5E7EB]">
//                   <tbody>
//                     {product.customSpecifications.map((spec, idx) => (
//                       <tr key={idx} className={idx % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"}>
//                         <td className="p-4 font-semibold text-[#111827] w-1/3 border-b border-[#F3F4F6]">{spec.key}</td>
//                         <td className="p-4 text-[#4B5563] border-b border-[#F3F4F6]">{spec.value}</td>
//                       </tr>
//                     ))}
//                     <tr className="bg-white">
//                         <td className="p-4 font-semibold text-[#111827] border-b border-[#F3F4F6]">SKU</td>
//                         <td className="p-4 text-[#4B5563] border-b border-[#F3F4F6]">{product.sku}</td>
//                     </tr>
//                     <tr className="bg-[#F9FAFB]">
//                         <td className="p-4 font-semibold text-[#111827]">Tags</td>
//                         <td className="p-4 text-[#4B5563]">{product.tags.join(", ")}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Reviews */}
//             {activeTab === "reviews" && (
//               <div className="grid lg:grid-cols-2 gap-12 animate-fade-in-up">
//                 {/* List */}
//                 <div className="space-y-6">
//                   <h3 className="text-xl font-bold text-[#111827]">2 Reviews for {product.title}</h3>
//                   {product.reviews.map((rev) => (
//                     <div key={rev.id} className="bg-white p-6 rounded-xl border border-[#F3F4F6] shadow-sm">
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-center gap-3">
//                            <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] font-bold">
//                              {rev.user.charAt(0)}
//                            </div>
//                            <div>
//                              <h4 className="font-bold text-sm text-[#111827]">{rev.user}</h4>
//                              <span className="text-xs text-[#9CA3AF]">{rev.date}</span>
//                            </div>
//                         </div>
//                         <StarRating rating={rev.rating} />
//                       </div>
//                       <p className="text-[#4B5563] text-sm leading-relaxed">{rev.comment}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Form */}
//                 <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] shadow-sm h-fit">
//                   <h3 className="text-lg font-bold text-[#111827] mb-1">Add a Review</h3>
//                   <p className="text-xs text-[#6B7280] mb-6">Your email will not be published.</p>
                  
//                   <form onSubmit={handleSubmitReview} className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-[#374151] mb-2">Your Rating</label>
//                       <StarRating 
//                         rating={reviewForm.rating} 
//                         setRating={(r) => setReviewForm({ ...reviewForm, rating: r })} 
//                         editable 
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <input
//                         type="text"
//                         placeholder="Name *"
//                         required
//                         className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#3B82F6] focus:bg-white focus:outline-none transition-all text-sm"
//                         value={reviewForm.name}
//                         onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email *"
//                         required
//                         className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#3B82F6] focus:bg-white focus:outline-none transition-all text-sm"
//                         value={reviewForm.email}
//                         onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
//                       />
//                     </div>

//                     <textarea
//                       rows={4}
//                       placeholder="Your Review *"
//                       required
//                       className="w-full px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#3B82F6] focus:bg-white focus:outline-none transition-all text-sm"
//                       value={reviewForm.comment}
//                       onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
//                     />

//                     <button
//                       type="submit"
//                       className="w-full bg-[#111827] text-white font-bold py-3 rounded-lg hover:bg-[#1F2937] transition-colors"
//                     >
//                       Submit Review
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </section>
//     </>
//   );
// };

// export default ProductDetailsPage;