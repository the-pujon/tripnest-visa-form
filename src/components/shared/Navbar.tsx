"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LuChevronDown, LuLayoutDashboard, LuLogOut, LuMenu, LuUser } from "react-icons/lu"
// import Logo from ""

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  
    return (
     <nav className="sticky top-0 z-50 self-start bg-white w-full shadow">
         <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="tripNEST Logo"
                  width={124}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>
  
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  All Packages
                  <LuChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Visa
              </Link>
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  Others
                  <LuChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
  
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center border rounded-full p-2 hover:bg-gray-50 transition-colors"
                >
                  <LuUser className="h-4 w-4 text-orange-500" />
                  {/* <LuChevronDown className="ml-1 h-4 w-4" /> */}
                </button>
  
                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                    <Link
                      href="/travelers"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LuLayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        // Handle logout
                        console.log("Logging out...")
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LuLogOut className="h-4 w-4 mr-2" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
  
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-orange-500">
                <LuMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
  
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">
                All Packages
              </button>
              <Link
                href="/visa"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Visa
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact
              </Link>
              <button className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left">
                Others
              </button>
  
              {/* Mobile User Menu */}
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <LuLayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  // Handle logout
                  console.log("Logging out...")
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <LuLogOut className="h-5 w-5 mr-2" />
                Log out
              </button>
            </div>
          </div>
        )}
  
        {/* Click outside handler for user dropdown */}
        {isUserDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsUserDropdownOpen(false)} />}
      </div>
     </nav>
    )
  }
  
