'use client'
import Link from 'next/link'
import React from 'react'
import { HeartIcon, Search, ShoppingBagIcon } from 'lucide-react'
import HeaderBottom from './Header-Bottom'
import useUser from 'apps/user-ui/src/hooks/useUser'
import ProfileIcon from '../../../assets/svgs/profile-icon'

const Header = () => {

  const { user, isLoading } = useUser()
  return (
    <>
      {/* Primary Navbar */}
      {/* Main Navbar */}
      <nav className="bg-white text-gray-800 px-4 py-3 shadow">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-wide text-blue-600">shopit</span>
          </div>
          {/* Center: Search */}
          <form className="flex-1 mx-8 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-md outline-0 bg-gray-100 pl-10 pr-4 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>
          </form>
          {/* Right: Profile, Cart, Wishlist with badges*/}
          <div className="flex items-center gap-6">
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
            {/* Cart Icon with badge */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx="7" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
              </button>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 font-bold shadow -mr-1 -mt-1">3</span>
            </div>
            {/* Heart Icon (Wishlist) with badge */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </button>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 font-bold shadow -mr-1 -mt-1">5</span>
            </div>
          </div>
        </div>
      </nav>
      <HeaderBottom />
    </>

  )
}

export default Header