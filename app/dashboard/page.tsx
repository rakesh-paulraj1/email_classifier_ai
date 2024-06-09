export type emails= {
  id: string,
  subject: string,
  from: string
  body:  {
    text : string ,
    html : string ,
  }
}
export type CATEGORIZED_EMAILS = {
  subject: string,
  from: string,
  body: {
    text : string ,
    html : string ,
  },
  classification: string
}[];

"use client";
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Emailclassifier } from '@/components/Emailclassifier';
import CLASSIFYEMAILS from '../api/user/classifier/route';
import { NextApiResponse,NextApiRequest } from 'next';
import Button from '@/components/ui/button';
import { NextResponse } from 'next/server';

const Dashboard = () => {
  const { data: session, status } = useSession();
 const [categorizedEmails, setCategorizedEmails] = useState<CATEGORIZED_EMAILS>();
  const [emails, setEmails] = useState<emails[]>([]);
  const router = useRouter();
  const nonclassifiedEmails = emails;
  const handleClassification = async (
    req: NextApiRequest,res:NextApiResponse
  
  ) => {
    try {
      const nonclassifiedEmails: emails[] = req.body;
      const classificationResult = await CLASSIFYEMAILS(nonclassifiedEmails);
      NextResponse.json(classificationResult);
      setCategorizedEmails(classificationResult.data);
    } catch (error) {
      // Handle errors
      NextResponse
        .json({ error: "An error occurred while classifying emails." });
    }
  };
  
  const handleClick = async () => {
    const nonclassifiedEmails: emails[] = [emails]; 
    await handleClassification(nonclassifiedEmails);
  };
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch("/api/user/mails");

        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        const data = await response.json();
        const emails: emails[] = data.emailDetails;
        setEmails(emails);
      } catch (error) {
        console.error("Error fetching and classifying emails:", error);
      } finally {
      }
    };
    fetchEmails();
  }, []);
  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <div>
      <Navbar
        name={session?.user.name ?? ""}
        email={session?.user?.email ?? ""}
        imagesrc={session?.user?.image ?? ""}
      />
     
      <div className={"h-screen grid grid-cols-1 py-10 flex justify-center"}>
        
        <div className="col-span-1 md:col-span-3 my-20 w-[90%] md:w-[80%] mx-auto">
        <Button onClick={handleClick}>Classify</Button>
          <Emailclassifier
            categorizedEmails={categorizedEmails}
            nonclassifiedEmails={nonclassifiedEmails}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;