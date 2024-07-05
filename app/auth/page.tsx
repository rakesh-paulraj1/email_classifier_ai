import React from 'react'
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
const  auth = async () => {
    const session= await getServerSession(NEXT_AUTH);
    console.log(session.access_token);
    
   
  return (
    <div>auth</div>
  )
}

export default auth