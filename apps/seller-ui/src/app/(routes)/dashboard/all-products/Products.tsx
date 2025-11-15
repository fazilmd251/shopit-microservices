import { useQuery } from "@tanstack/react-query"
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct"
import { 
    useReactTable, 
    getCoreRowModel, 
    getFilteredRowModel, 
    flexRender 
} from '@tanstack/react-table'
import { useMemo, useState } from "react"
import Link from "next/link"
import { 
    Star, 
    Search, 
    Eye, 
    Edit, 
    BarChart2, 
    Trash2, 
    MoreHorizontal,
    Plus,
    ChevronRight
} from "lucide-react"

function Products({globalFilter, setGlobalFilter}:{globalFilter:any, setGlobalFilter:any}) {
    const fetchProducts = async () => {
        const response = await axiosInstanceForProducts.get('/api/get-all-products')
        return response.data.products
    }

    const { data: products, isLoading } = useQuery({
        queryKey: ['shop-products'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5
    })

    
    
    // Columns Definition
    const columns = useMemo(() => [
        {
            accessorKey: "image",
            header: "Product",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                        <img 
                            src={row.original.image} 
                            alt={row.original.title}
                            className="h-full w-full object-cover" 
                        />
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'title',
            header: 'Details',
            cell: ({ row }: any) => {
                const truncatedTitle = row.original.title.length > 30 ?
                    `${row.original.title.substring(0, 30)}...` : row.original.title
                return (
                    <div className="flex flex-col">
                        <Link
                            href={`${process.env.NEXT_PUBLIC_SERVER_URI_PRODUCT}/api/${row.original.slug}`}
                            className="font-medium text-slate-200 hover:text-indigo-400 transition-colors"
                            title={row.original.title}
                        >
                            {truncatedTitle}
                        </Link>
                        <span className="text-xs text-slate-500 capitalize">{row.original.category || 'Uncategorized'}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: "salesPrice",
            header: "Price",
            cell: ({ row }: any) => (
                <span className="font-medium text-emerald-400">₹{row.original.salesPrice}</span>
            )
        },
        {
            accessorKey: "ratings",
            header: "Rating",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-1.5">
                    <Star className="fill-yellow-500 text-yellow-500" size={14} />
                    <span className="text-sm text-slate-300">{row.original.ratings || 5.0}</span>
                </div>
            )
        },
        {
            accessorKey: "stock",
            header: "Stock",
            cell: ({ row }: any) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.original.stock > 0 
                    ? 'bg-slate-800 text-slate-300 border border-slate-700' 
                    : 'bg-red-900/20 text-red-400 border border-red-900/50'
                }`}>
                    {row.original.stock > 0 ? `${row.original.stock} in stock` : 'Out of stock'}
                </span>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    {/* View */}
                    <Link href={`/api/${row.original.id}`} className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all">
                        <Eye size={18} />
                    </Link>

                    {/* Edit */}
                    <Link href={`/api/edit/${row.original.id}`} className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-all">
                        <Edit size={18} />
                    </Link>

                    {/* Analytics */}
                    <button className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-purple-400 transition-all">
                        <BarChart2 size={18} />
                    </button>

                    {/* Delete */}
                    <button className="p-2 rounded-md text-slate-400 hover:bg-red-900/20 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ], [])

    const table = useReactTable({
        data: products || [],
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString",
        onGlobalFilterChange: setGlobalFilter
    })

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading products...</div>

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-slate-200 font-sans">
            <div className="mx-auto max-w-7xl">
                
                {/* Header Section */}
                

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm backdrop-blur-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b border-slate-800">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-4 font-medium">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="group hover:bg-slate-800/50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4 align-middle">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Simple Footer / Pagination could go here */}
                <div className="mt-4 text-xs text-slate-500 text-right">
                    Showing {table.getRowModel().rows.length} products
                </div>
            </div>
        </div>
    )
}

export default Products
// "use client"
// import { useQuery } from "@tanstack/react-query"
// import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct"
// import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table'
// import { useMemo, useState } from "react"
// import Link from "next/link"
// import { Star, Search, Eye, Edit, BarChart2, Trash2, Package } from "lucide-react"

// function Products() {
//     const fetchProducts = async () => {
//         const response = await axiosInstanceForProducts.get('/api/get-all-products')
//         return response.data.products
//     }

//     const { data: products, isLoading } = useQuery({
//         queryKey: ['shop-products'],
//         queryFn: fetchProducts,
//         staleTime: 1000 * 60 * 5
//     })

//     const [globalFilter, setGlobalFilter] = useState("")
    
//     // State placeholders for future logic
//     const [selectedProduct, setSelectedProduct] = useState<any>()

//     const columns = useMemo(() => [
//         {
//             accessorKey: "image",
//             header: "Image",
//             cell: ({ row }: any) => (
//                 <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
//                     <img 
//                         src={row.original.image} 
//                         alt={row.original.title}
//                         className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
//                     />
//                 </div>
//             )
//         },
//         {
//             accessorKey: 'title',
//             header: 'Product Name',
//             cell: ({ row }: any) => {
//                 const truncatedTitle = row.original.title.length > 30 ?
//                     `${row.original.title.substring(0, 30)}...` : row.original.title
//                 return (
//                     <Link
//                         href={`${process.env.NEXT_PUBLIC_SERVER_URI_PRODUCT}/api/${row.original.slug}`}
//                         className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
//                         title={row.original.title}>
//                         {truncatedTitle}
//                     </Link>
//                 )
//             }
//         },
//         {
//             accessorKey: "salesPrice",
//             header: "Price",
//             cell: ({ row }: any) => (
//                 <span className="font-semibold text-slate-200">
//                     ₹{row.original.salesPrice}
//                 </span>
//             )
//         },
//         {
//             accessorKey: "ratings",
//             header: "Ratings",
//             cell: ({ row }: any) => (
//                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 w-fit border border-slate-700">
//                     <Star className="fill-yellow-500 text-yellow-500" size={14} />
//                     <span className="text-sm font-medium text-slate-200">{row.original.ratings || 5}</span>
//                 </div>
//             )
//         },
//         {
//             accessorKey: "stock",
//             header: "Stock",
//             cell: ({ row }: any) => (
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     row.original.stock > 0 
//                     ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
//                     : 'bg-red-500/10 text-red-400 border border-red-500/20'
//                 }`}>
//                     {row.original.stock > 0 ? `${row.original.stock} in stock` : 'Out of stock'}
//                 </span>
//             )
//         },
//         {
//             accessorKey: "category",
//             header: "Category",
//             cell: ({ row }: any) => (
//                 <span className="text-slate-400 capitalize">{row.original.category}</span>
//             )
//         },
//         {
//             id: "actions",
//             header: "Actions",
//             cell: ({ row }: any) => (
//                 <div className="flex items-center gap-3">
//                     <Link href={`/api/${row.original.id}`} title="View" className="text-slate-400 hover:text-blue-400 transition-colors">
//                         <Eye size={18} />
//                     </Link>

//                     <Link href={`/api/edit/${row.original.id}`} title="Edit" className="text-slate-400 hover:text-emerald-400 transition-colors">
//                         <Edit size={18} />
//                     </Link>

//                     <button title="Analytics" className="text-slate-400 hover:text-purple-400 transition-colors">
//                         <BarChart2 size={18} />
//                     </button>

//                     <button title="Delete" className="text-slate-400 hover:text-red-400 transition-colors">
//                         <Trash2 size={18} />
//                     </button>
//                 </div>
//             )
//         }
//     ], [])

//     const table = useReactTable({
//         data: products || [],
//         columns,
//         state: { globalFilter },
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         globalFilterFn: "includesString",
//         onGlobalFilterChange: setGlobalFilter
//     })

//     return (
//         <div className="w-full space-y-4 p-2">
            
//             {/* Header & Search Bar Section */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//                         <Package className="text-indigo-500" /> Products
//                     </h2>
//                     <p className="text-sm text-slate-400 mt-1">Manage your inventory and track performance.</p>
//                 </div>

//                 <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
//                     </div>
//                     <input
//                         value={globalFilter}
//                         onChange={e => setGlobalFilter(e.target.value)}
//                         placeholder="Search products..."
//                         className="pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl text-sm 
//                                    focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none w-full sm:w-72 transition-all"
//                     />
//                 </div>
//             </div>

//             {/* Table Section */}
//             <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm shadow-xl shadow-black/20">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             {table.getHeaderGroups().map(headerGroup => (
//                                 <tr key={headerGroup.id} className="border-b border-slate-800 bg-slate-900/80">
//                                     {headerGroup.headers.map(header => (
//                                         <th key={header.id} className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
//                                             {flexRender(header.column.columnDef.header, header.getContext())}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </thead>
//                         <tbody className="divide-y divide-slate-800">
//                             {isLoading ? (
//                                 <tr>
//                                     <td colSpan={columns.length} className="p-8 text-center text-slate-500">
//                                         Loading products...
//                                     </td>
//                                 </tr>
//                             ) : table.getRowModel().rows.length > 0 ? (
//                                 table.getRowModel().rows.map(row => (
//                                     <tr key={row.id} className="group hover:bg-slate-800/40 transition-colors">
//                                         {row.getVisibleCells().map(cell => (
//                                             <td key={cell.id} className="p-4 align-middle text-sm text-slate-300">
//                                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={columns.length} className="p-8 text-center text-slate-500">
//                                         No products found matching your search.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
            
//             {/* Footer / Pagination Info could go here */}
//             <div className="text-xs text-slate-500 text-right pt-2">
//                 Showing {table.getRowModel().rows.length} products
//             </div>
//         </div>
//     )
// }

// export default Products


//   <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold">Products</h2>
//                 <div className="flex items-center gap-2">
//                     <input placeholder="Search product" className="px-3 py-2 rounded-md bg-gray-900/60 border border-gray-800 text-sm" />
//                     <button className="px-3 py-2 rounded-md bg-indigo-600 text-sm">Add</button>
//                 </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-fit">
//                 {data && data.length > 0 && data.map((prod: any, i: number) => (
//                     <div key={i} className="p-4 bg-gray-800/40 rounded-lg">
//                         <img src={prod.images[0].file_url} className="h-36 bg-gray-700 rounded-md mb-3 flex items-center justify-center" />
//                         <div className="text-sm font-medium">{prod.title}</div>
//                         <div className="text-xs text-gray-400">Rs. {prod.salesPrice}</div>
//                     </div>
//                 ))}
//             </div>