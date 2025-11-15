'use client'
import React, { useEffect, useMemo, useState } from 'react'
import useSideBar from '../../../hooks/useSideBar'
import { usePathname, useSearchParams } from 'next/navigation'
import useSeller from '../../../hooks/useSeller'
import { motion, AnimatePresence } from 'framer-motion'
import Box from '../box/Box'
import Link from 'next/link'
import { IconCreateEvent, IconCreateProduct, IconDiscount, IconEvents, IconHome, IconInbox, IconLogout, IconMenu, IconNotifications, IconOrders, IconPayments, IconProducts, IconSettings } from './SideBar.svgs'
import SideBarItems from './SideBar.items'

const SideBar = ({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { activeSideBar, setActiveSideBar } = useSideBar()
  const pathname = usePathname()
  const { seller } = useSeller()

  useEffect(() => {
    setActiveSideBar(pathname)
  }, [pathname, setActiveSideBar])

  const getIconcolor = (route: string) => activeSideBar === route ? '#0085ff' : '#969696'

  const searchParams = useSearchParams()



  // derive active route from query parameter 'page' or default to 'overview'
  const route = searchParams.get('page') || 'overview'

  // derive active route from query parameter 'page' or default to 'overview'

const navItems = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: IconHome },
    { id: 'orders', label: 'Orders', icon: IconOrders },
    { id: 'payments', label: 'Payments', icon: IconPayments },
    { id: 'products', label: 'All Products', icon: IconProducts },
    { id: 'create-product', label: 'Create Product', icon: IconCreateProduct },
    { id: 'create-event', label: 'Create Event', icon: IconCreateEvent },
    { id: 'all-events', label: 'All Events', icon: IconEvents },
    { id: 'inbox', label: 'Inbox', icon: IconInbox },
    { id: 'settings', label: 'Settings', icon: IconSettings }, // Corrected id to lowercase
    { id: 'notifications', label: 'Notifications', icon: IconNotifications}, // Added
    { id: 'discount-codes', label: 'Discount Codes', icon: IconDiscount }, // Added
    { id: 'logout', label: 'Logout', icon: IconLogout}, // Added
  ], [])


  return (
    <>
      {/* Sidebar */}
     <motion.aside
  initial={false}
  animate={{ width: collapsed ? 72 : 260 }}
  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
  className="bg-gradient-to-b from-gray-850 via-gray-900 to-black shadow-xl flex flex-col h-screen"
>
  {/* Header (fixed top) */}
  <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-850 via-gray-900 to-black">
    <div className="flex items-center gap-3 p-4 border-b border-gray-800/60">
      <button
        onClick={() => setCollapsed(v => !v)}
        aria-label="Toggle sidebar"
        className="p-2 rounded-md bg-black/20 hover:bg-white/5 transition"
      >
        <IconMenu />
      </button>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="flex items-center gap-3"
            key="brand"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 3v18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-sm font-semibold">Seller Dashboard</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>

  {/* Scrollable Nav area */}
  <nav className="flex-1 overflow-y-auto px-2 py-4">
    {navItems.map(item => (
      <SideBarItems
        key={item.id}
        item={item}
        active={route === item.id}
        collapsed={collapsed}
      />
    ))}
  </nav>

  {/* Footer (fixed bottom) */}
  <div className="sticky bottom-0 bg-gradient-to-b from-gray-900 to-black p-4 border-t border-gray-800/60">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-700/40 flex items-center justify-center">MF</div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className="flex-1"
          >
            <div className="text-sm font-medium">{seller?.shop?.name || "unknown"}</div>
            <div className="text-xs text-gray-400">Seller</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
</motion.aside>

    </>
  )
}

export default SideBar



