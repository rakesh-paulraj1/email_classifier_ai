"use client"
interface Navbar {
  name: string;
  email: string;
  imagesrc: string;
}
import React from 'react'
import Router from 'next/router';
import Image from 'next/image';
const Navbar :React.FC<Navbar>= ({name, email, imagesrc}) => {
  return (
   <div>
    <header className="flex h-16 w-full items-center justify-between bg-white px-4 md:px-6 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
       
       
      <Image src={imagesrc}  alt="profile"width={800} height={500} className="h-9 w-9 rounded-full object-cover" />
        <div className="grid gap-0.5 text-sm text-gray-900">
          <div className="font-medium">{name}</div>
          <div className="text-gray-600">{email}</div>
        </div>
      </div>
        <button
          onClick={() => {Router.push('/api/auth/logout')}}
          className="text-gray-600 hover:text-gray-900 border border-gray-200 "
        >
        <LogOutIcon className="h-5 w-5" />
        <span className="sr-only">Logout</span>
      </button>
    </header>
    </div>
  )
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}


export default Navbar;