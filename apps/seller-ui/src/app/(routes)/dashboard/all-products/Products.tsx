import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct"
import {useReactTable,getCoreRowModel,getFilteredRowModel,flexRender} from '@tanstack/react-table'
import { useMemo, useState } from "react"
import Link from "next/link"
import { Star, Eye, Edit, BarChart2, Trash2, Undo2 } from "lucide-react"
import DeleteModal from "./delete-modal/DeleteModal"
import RestoreModal from "./restore-modal/RestoreModal" // <-- Import new component

function Products({ globalFilter, setGlobalFilter }: { globalFilter: any, setGlobalFilter: any }) {

    const [productToDelete, setProductToDelete] = useState<any>(null)
    const [productToRestore, setProductToRestore] = useState<any>(null) // <-- New state for restore

    // --- REACT QUERY SETUP ---
    const fetchProducts = async () => {
        const response = await axiosInstanceForProducts.get('/api/get-all-products')
        return response.data.products
    }

    const queryClient = useQueryClient()

    const { data: products, isLoading } = useQuery({
        queryKey: ['shop-products'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5
    })


    // --- DELETE HANDLERS ---
    const handleOpenDeleteConfirm = (product: any) => {
        setProductToDelete(product)
    }

    const handleCloseDeleteConfirm = () => {
        setProductToDelete(null)
    }

    const handleConfirmDelete = () => {
        if (!productToDelete) return
        deleteMutation.mutate(productToDelete.id)
    }

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axiosInstanceForProducts.delete(`/api/delete-product/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-products"] })
            setProductToDelete(null)
        }
    })

    // --- RESTORE HANDLERS ---
    const handleOpenRestoreConfirm = (product: any) => {
        setProductToRestore(product)
    }

    const handleCloseRestoreConfirm = () => {
        setProductToRestore(null)
    }

    const handleConfirmRestore = () => {
        if (!productToRestore) return
        restoreMutation.mutate(productToRestore.id)
    }

    const restoreMutation = useMutation({
        mutationFn: async (id) => {
            // Note: Your original code used .delete, ensure this is correct.
            // It might be a .patch or .post, e.g., `/api/restore-product/${id}`
            await axiosInstanceForProducts.put(`/api/restore-product/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-products"] })
            setProductToRestore(null) // <-- Corrected to set restore state
        }
    })


    // --- TABLE COLUMNS ---
    const columns = useMemo(() => [
        // ... (image, title, salesPrice, ratings, stock columns are unchanged) ...
        {
            accessorKey: "image",
            header: "Product",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                        <img
                            src={row.original.images[0].url}
                            alt={row.original.images[0].url}
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
                            href={`${process.env.NEXT_PUBLIC_SERVER_USER_UI_LINK}/api/${row.original.slug}`}
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
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${row.original.stock > 0
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
            cell: ({ row }: any) => {
                // --- THIS IS THE KEY LOGIC ---
                // I'm assuming your product object has an `isDeleted` property
                const isDeleted = row.original.isDeleted;

                return (
                    <div className="flex items-center gap-2">
                        {isDeleted ? (
                            // --- RENDER ONLY RESTORE BUTTON ---
                            <button
                                onClick={() => handleOpenRestoreConfirm(row.original)}
                                className="p-2 rounded-md text-slate-400 hover:bg-green-900/20 hover:text-green-400 transition-all"
                                title="Restore Product"
                            >
                                <Undo2 size={18} />
                            </button>
                        ) : (
                            // --- RENDER ALL NORMAL BUTTONS ---
                            <>
                                <Link href={`/api/${row.original.id}`} className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all">
                                    <Eye size={18} />
                                </Link>
                                <Link href={`/api/edit/${row.original.id}`} className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-all">
                                    <Edit size={18} />
                                </Link>
                                <button className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-purple-400 transition-all">
                                    <BarChart2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleOpenDeleteConfirm(row.original)}
                                    className="p-2 rounded-md text-slate-400 hover:bg-red-900/20 hover:text-red-500 transition-all"
                                    title="Delete Product"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                )
            }
        }
    ], []) // Note: Add dependencies here if your handlers (like handleOpen...) rely on props

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

                {/* ... (Header Section) ... */}

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

                {/* Footer */}
                <div className="mt-4 text-xs text-slate-500 text-right">
                    Showing {table.getRowModel().rows.length} products
                </div>
            </div>

            {/* --- CONFIRMATION MODAL (DELETE) --- */}
            {productToDelete && (
                <DeleteModal
                    handleCloseDeleteConfirm={handleCloseDeleteConfirm}
                    handleConfirmDelete={handleConfirmDelete}
                    productToDelete={productToDelete}
                    isLoading={deleteMutation.isPending}
                />
            )}

            {/* --- CONFIRMATION MODAL (RESTORE) --- */}
            {productToRestore && (
                <RestoreModal
                    handleCloseRestoreConfirm={handleCloseRestoreConfirm}
                    handleConfirmRestore={handleConfirmRestore}
                    productToRestore={productToRestore}
                    isLoading={restoreMutation.isPending}
                />
            )}

        </div>
    )
}

export default Products