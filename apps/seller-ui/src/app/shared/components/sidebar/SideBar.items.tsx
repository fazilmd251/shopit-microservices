import Link from 'next/link'
import React from 'react'

interface Props{
    icon?:React.ReactNode
    title?:string
    isActive?:boolean
    href?:string
    navItems?:any
    item:any
    active:boolean
    collapsed:boolean
}

const SideBarItems = ({icon,title,isActive,navItems,item, active, collapsed}:Props) => {
   // Build href with the ?page= param, navigation is client-side with Link
  const href = `/dashboard?page=${item.id}`

  return (
    <Link href={href} legacyBehavior>
      <a
        className={`group flex items-center gap-3 rounded-md px-3 py-2 my-1 transition-colors ${
          active ? 'bg-white/6 ring-1 ring-white/6' : 'hover:bg-white/3'
        }`}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            active ? 'bg-indigo-500/30' : 'bg-transparent'
          }`}
        >
          <item.icon />
        </div>
        {!collapsed && <span className="text-sm font-medium text-white">{item.label}</span>}
      </a>
    </Link>
  )
}

export default SideBarItems