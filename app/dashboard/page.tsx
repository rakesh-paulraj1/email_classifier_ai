"use client";
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Navbar from '@/components/Navbar';


const Dashboard = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session) {
      const previousemails = axios.post("/api/user/login", {
        username:session.user.name,
        useremail: session.user.email,
      });
    }
  });
  console.log(session);

  return session ? (
    <div>
      <Navbar
        name={session.user.name  || ""}
        email={session.user.email || ""}
        imagesrc={session.user.image || ""}
      />
      <div>
        <h1>Welcome {session.user.name}</h1>
        <h2>Email {session.user.email}</h2>
        
      </div>
    </div>
  ) : (
    <div>No user logged in</div>
  );
};

export default Dashboard;