"use client";
import { signIn } from 'next-auth/react';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import React from "react";
import AuroraBackground from "../components/ui/aurora-background";
import { useSession } from 'next-auth/react';

 function AuroraBackgroundDemo() {
  const router = useRouter();
  const { data: session, status } = useSession();
if(status === "authenticated"){
 router.push('/dashboard');
}
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Categorize your email with AI
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          created by Rakesh
        </div>
        <button onClick={async ()=>{
              await signIn('google')
            }}  className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Sign in with Google        </button>
      </motion.div>
    </AuroraBackground>
  );
}
export default AuroraBackgroundDemo;
