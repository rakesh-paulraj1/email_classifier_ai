import React from 'react'
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { getemails } from '../api/user/mails/route';
const  auth = async () => {
    const session= await getServerSession(NEXT_AUTH);
    console.log(session.access_token);
   
      const response = getemails(parseInt("10"));
      console.log(response);
   
  return (
    <div>auth</div>
  )
}

export default auth