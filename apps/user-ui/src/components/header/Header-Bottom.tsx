'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import useUser from 'apps/user-ui/src/hooks/useUser'
import ProfileIcon from '../../../assets/svgs/profile-icon'

const HeaderBottom = () => {
  const [isSticky, setIsSticky] = useState(false)
   const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return
      const { top } = navRef.current.getBoundingClientRect()
      setIsSticky(top <= 0) 
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
const {user,isLoading}=useUser()

  return (
    <>
      {/* Main Nav (always visible) */}
      <div ref={navRef} className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex justify-center">
          <nav className="flex gap-6">
            {['Home', 'Features', 'Pricing', 'Docs', 'Contact', 'Support'].map(
              (item, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="text-gray-800 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Sticky Sub-header (profile, cart, wishlist) */}
      {isSticky && (
        <div className="fixed top-0 left-0 z-30 w-full bg-gray-100 shadow-lg transition-all duration-300">
          <div className="mx-auto max-w-7xl px-4 py-2 flex justify-end items-center gap-4">
            {/* Profile */}
            {
          !isLoading&&user?(<div className="flex items-center gap-2">
            <Link href={'/profile'}>
          <ProfileIcon/>
          </Link>
          <span className="flex flex-col leading-tight">
                <span className="font-semibold text-xs text-gray-600">hello</span>
                <span className="font-semibold text-xs text-blue-600">{user?.name.split(" ")[0]}</span>
              </span>
          </div>):
          (<>
             <div className="flex items-center gap-2">
              {/* <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-blue-400"
              /> */}
              <ProfileIcon/>
              <span className="flex flex-col leading-tight">
                <span className="font-semibold text-xs text-gray-600">hello</span>
                <Link href={isLoading?'/':'/login'} className="font-semibold text-xs text-blue-600">{isLoading?'...':'sign in'}</Link>
              </span>
            </div>
          </>)
         }
            {/* Cart */}
            <button className="relative p-1.5 hover:bg-gray-200 rounded-full transition">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle cx="7" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1 py-0.5 font-bold shadow">
                3
              </span>
            </button>

            {/* Wishlist */}
            <button className="relative p-1.5 hover:bg-gray-200 rounded-full transition">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1 py-0.5 font-bold shadow">
                5
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default HeaderBottom
