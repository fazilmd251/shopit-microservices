import { Undo2 } from 'lucide-react'
import React from 'react'

const RestoreModal = (
    { handleConfirmRestore, handleCloseRestoreConfirm, productToRestore, isLoading }:
    { handleConfirmRestore: any, handleCloseRestoreConfirm: any, productToRestore: any, isLoading: boolean }
) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseRestoreConfirm} // Close on overlay click
        >
            <div
                className="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl border border-slate-700"
                onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-green-900/30">
                        <Undo2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-slate-100">Restore Product</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Are you sure you want to restore this product?
                            <br />
                            <strong className="font-medium text-slate-200">{productToRestore.title}</strong>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">This product will be visible to customers again.</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCloseRestoreConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmRestore}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Restoring...' : 'Restore'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RestoreModal