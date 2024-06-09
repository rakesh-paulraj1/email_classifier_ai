"use client";
import Button from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const options = ['GPT-3', 'GPT-4', 'Whisper'];
  const router = useRouter();
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option:any) => {
    setSelected(option);
    setIsOpen(false);
    
    console.log('Selected option:', option);
  };
  const { data: session, status } = useSession();
 if(status === "authenticated"){
  router.push('/dashboard');
 }

  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-gray-50">
        
        
      <div className="w-full max-w-md px-4">
      <h1 className="md:text-4xl text-3xl lg:text-6xl font-bold text-center text-gray-600 relative z-20">
        Email Classifier AI
      </h1>
        <div className="rounded-lg bg-white shadow-md p-6">
          <div className="space-y-4 text-center">
          <div className="flex justify-center ">
            <a className="text-lg font-bold">Welcome</a>
          </div>
            <Button onClick={async ()=>{
              await signIn('google')
            }} >Sign up with Google</Button>
              
            <div className="relative inline-block text-left w-full">
              
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center justify-center rounded-md w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-gray-50"
              >
                {selected || 'Choose AI Model'}
                <svg
                  className="ml-auto h-4 w-4"
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="absolute mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(option)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
