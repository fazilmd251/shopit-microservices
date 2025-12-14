import ProductDetailsContent from "apps/user-ui/src/components/product/ProductDetails"
import axiosInstanceForProducts from "apps/user-ui/src/utils/axiosInstanceForProduct"
import { Metadata } from "next"

async function fetchProductDetails(slug: string) {
    try {
        const res = await axiosInstanceForProducts.get(`/api/get-product/${slug}`)
        return res?.data?.product
    } catch (error) {
        console.log("Error fetching product details", error)
        return null
    }
}

function capitalizeWords(str = "") {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const product = await fetchProductDetails(slug)

    return {
        title: product ? `${capitalizeWords(product.title)} | Shopit` : 'Product Not Found | Shopit',
        description: product?.short_description || product?.description?.substring(0, 160) || "Discover high quality products on Shopit",
        openGraph: {
            images: product?.images?.[0]?.file_url ? [product.images[0].file_url] : []
        }
    }
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    //const { slug } = await params
    //const productDetails = await fetchProductDetails(slug)

    // if (!productDetails) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
    //         </div>
    //     )
    // }

    return (
        <div>
            <ProductDetailsContent product={null} />
        </div>
    )
}

export default page



