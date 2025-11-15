'use client'
import React, { useState } from 'react'
import SideBar from '../../shared/components/sidebar/SideBar'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CreateProduct from './create-product/page'
import { headers } from 'next/headers'
import {Toaster} from 'react-hot-toast'
import DiscountCodes from './discount-codes/page'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)
  const [isModalOpenDiscount, setIsModalOpenDiscount] = useState(false)
  const route = searchParams.get('page') || 'overview'

  const hideHeader:string[]=['create-product']

  return (
    <><Toaster/>
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main section */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header fixed */}
      <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm p-6 border-b border-gray-800">
          <Header route={route} collapsed={collapsed} setIsModalOpen={setIsModalOpenDiscount} isModalOpen={isModalOpenDiscount}/>
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={route}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {route === 'overview' && <Overview />}
              {route === 'orders' && <Orders />}
              {route === 'products' && <Products />}
              {route === 'analytics' && <Analytics />}
              {route === 'settings' && <Settings />}
              {route === 'create-product' && <CreateProduct />}
              {route === 'discount-codes' && <DiscountCodes setIsModalOpen={setIsModalOpenDiscount} isModalOpen={isModalOpenDiscount} />}
            </motion.section>
          </AnimatePresence>
        </main>
      </div>
    </div>
    </>
  )
}

export default Layout





function Header({ collapsed ,route,isModalOpen, setIsModalOpen}:{isModalOpen:boolean, setIsModalOpen:any,collapsed:boolean,route:string}) {
  return (
    <>
    {route==='create-product'&&(
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Create Product</h1>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <a href="/dashboard" className="hover:text-indigo-400">
              Dashboard
            </a>
            <span className="mx-2">{">"}</span>
            <span className="text-indigo-400 font-medium">Create Product</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-md bg-gray-800/70 flex items-center justify-center text-xl">🔔</div>
      </div>)}
      {
        route==='discount-codes'&&(<div className="flex items-center justify-between">
          {/* Left Side: Title and Breadcrumbs */}
          <div>
            <h1 className="text-2xl font-semibold text-white">Discount Codes</h1>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <a href="/dashboard" className="hover:text-indigo-400">
                Dashboard
              </a>
              <span className="mx-2">{">"}</span>
              <span className="text-indigo-400 font-medium">Discount Codes</span>
            </div>
          </div>
          {/* Right Side: Action Button + Bell */}
          <div className="flex items-center gap-3">
            <button onClick={()=>setIsModalOpen(true)}
              // href={createDiscountLink}
              className="px-3 py-2 bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700"
            >
              Create Discount Code
            </button>
            <div className="w-10 h-10 rounded-md bg-gray-800/60 flex items-center justify-center">🔔</div>
          </div>
        </div>)
      }
    
    {route!=='create-product'&&route!=='discount-codes'&&(<div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, Mohamed</h1>
        <p className="text-sm text-gray-400">Here's what's happening with your store today.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-2 bg-white/6 rounded-md text-sm">New product</button>
        <div className="w-10 h-10 rounded-md bg-gray-800/60 flex items-center justify-center">🔔</div>
      </div>
    </div>)}
    </>
  )
}

function Overview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard title="Total Sales" value="$8,420" delta="+12%" />
          <MetricCard title="Orders" value="1,240" delta="+6%" />
        </div>

        <div className="bg-gray-800/40 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Recent Orders</h3>
          <Table />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Store Performance</h3>
          <SmallStat label="Conversion" value="3.6%" />
          <SmallStat label="Avg. Order" value="$24.5" />
        </div>

        <div className="p-4 bg-gray-800/40 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Top Products</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Velvet Sofa — 120 sales</li>
            <li>• Oak Dining Table — 98 sales</li>
            <li>• Floor Lamp — 74 sales</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}

function Orders() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Orders</h2>
      <div className="bg-gray-800/40 p-4 rounded-lg">
        <Table full />
      </div>
    </div>
  )
}

function Products() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <input placeholder="Search product" className="px-3 py-2 rounded-md bg-gray-900/60 border border-gray-800 text-sm" />
          <button className="px-3 py-2 rounded-md bg-indigo-600 text-sm">Add</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-800/40 rounded-lg">
            <div className="h-36 bg-gray-700 rounded-md mb-3 flex items-center justify-center">Image</div>
            <div className="text-sm font-medium">Product #{i + 1}</div>
            <div className="text-xs text-gray-400">${(25 + i * 7).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Analytics() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>
      <div className="bg-gray-800/40 p-6 rounded-lg">(insert charts here)</div>
    </div>
  )
}

function Settings() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="bg-gray-800/40 p-4 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Store visibility</div>
            <div className="text-xs text-gray-400">Make your store public or private</div>
          </div>
          <button className="px-3 py-2 rounded-md bg-indigo-600 text-sm">Toggle</button>
        </div>

        <div>
          <label className="text-sm">Currency</label>
          <select className="block mt-2 px-3 py-2 rounded-md bg-gray-900/60 border border-gray-800 text-sm">
            <option>USD</option>
            <option>EUR</option>
            <option>INR</option>
          </select>
        </div>
      </div>
    </div>
  )
}

/* Small UI components */

function MetricCard({ title, value, delta }:{delta:any,value:any,title:any}) {
  return (
    <div className="p-4 bg-gray-800/40 rounded-lg">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-green-400">{delta}</div>
    </div>
  )
}

function SmallStat({ label, value }:{label:string,value:any}) {
  return (
    <div className="flex items-center justify-between text-sm mb-2">
      <div className="text-gray-300">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}

function Table({ full }:{full?:any}) {
  const rows = Array.from({ length: full ? 10 : 5 }).map((_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: ['Aisha', 'Rahul', 'Sara', 'Dev'][i % 4],
    total: (45 + i * 13).toFixed(2),
    status: ['Pending', 'Shipped', 'Delivered', 'Cancelled'][i % 4],
  }))

  return (
    <div className="overflow-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400 text-xs">
            <th className="py-2">Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-gray-800/60">
              <td className="py-3">{r.id}</td>
              <td>{r.customer}</td>
              <td>${r.total}</td>
              <td
                className={`text-sm ${
                  r.status === 'Pending'
                    ? 'text-yellow-300'
                    : r.status === 'Delivered'
                    ? 'text-green-400'
                    : 'text-gray-300'
                }`}
              >
                {r.status}
              </td>
              <td className="text-right">
                <button className="text-sm px-2 py-1 rounded-md bg-white/6">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}




// return (
//     <div className='flex h-full bg-black min-h-screen'>
//       {/* side bar */}
//       {/* <aside className='w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800 text-white p-4'>
//         <div className="sticky top-0"> */}
//           <SideBar/>
//         {/* </div>
//       </aside> */}
//       {/* main content area */}
//       <main className='flex-1'>
//         <div className="overfolw-auto">
//         {children}  
//         </div>
//       </main>
//     </div>
//   )

