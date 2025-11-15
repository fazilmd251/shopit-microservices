import { useQuery } from "@tanstack/react-query"
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct"
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table'
import { useMemo, useState } from "react"

function Products() {
    const fetchProducts = async () => {
        const response = await axiosInstanceForProducts.get('/api/get-all-products')
        return response.data.products
    }
    const { data } = useQuery({
        queryKey: ['shop-products'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5
    })

    // const columns = useMemo(() => [
    //     {
    //         accessorKey: "image",
    //         header: "Image",
    //         cell: ({ row }: any) => (
    //             <img src={row.original.image} alt={row.original.image} />
    //         )
    //     }
    // ])

    const [globalFilter, setGlobalFilter] = useState("")
    const [analyticsData, setAnalyticsData] = useState(null)
    const [showAnalytics, setShowAnalytics] = useState(false)
    const [showDeleteModel, setShowDeleteModel] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>()

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Products</h2>
                <div className="flex items-center gap-2">
                    <input placeholder="Search product" className="px-3 py-2 rounded-md bg-gray-900/60 border border-gray-800 text-sm" />
                    <button className="px-3 py-2 rounded-md bg-indigo-600 text-sm">Add</button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-fit">
                {data && data.length > 0 && data.map((prod: any, i: number) => (
                    <div key={i} className="p-4 bg-gray-800/40 rounded-lg">
                        <img src={prod.images[0].file_url} className="h-36 bg-gray-700 rounded-md mb-3 flex items-center justify-center" />
                        <div className="text-sm font-medium">{prod.title}</div>
                        <div className="text-xs text-gray-400">Rs. {prod.salesPrice}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Products