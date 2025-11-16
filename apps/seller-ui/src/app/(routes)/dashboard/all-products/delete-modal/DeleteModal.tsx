import { AlertTriangle } from 'lucide-react'
import React from 'react'

const DeleteModal = (
    { handleConfirmDelete, handleCloseDeleteConfirm, productToDelete, isLoading }:
    { handleConfirmDelete: any, handleCloseDeleteConfirm: any, productToDelete: any, isLoading: boolean }
) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseDeleteConfirm} // Close on overlay click
        >
            <div
                className="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl border border-slate-700"
                onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-900/30">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-slate-100">Delete Product</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Are you sure you want to delete this product?
                            <br />
                            <strong className="font-medium text-slate-200">{productToDelete.title}</strong>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">This action can be undone by restoring.</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCloseDeleteConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmDelete}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal