export type emails= {
  id: number,
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
import { classifyEmails } from "@/lib/gptclassifier";
import Button from '@/components/ui/button';
import axios from 'axios';


const Dashboard = () => {
  const { data: session, status } = useSession();
  const [categorizedEmails, setCategorizedEmails] =
    useState<CATEGORIZED_EMAILS>();
  const [emails, setEmails] = useState<emails[]>([]);
  const router = useRouter();
  const nonclassifiedEmails = emails;
  const handleClassification = async (nonclassifiedEmails: EMAIL[]) => {
    const classificationResult = await classifyEmails(nonclassifiedEmails);
    setCategorizedEmails(classificationResult);
  };
  const handleclick = async () => {
    try {
      const response = await axios.post("/api/user/classifier", {
        emails: emails,
      });
      setCategorizedEmails(response.categorizedEmails);
    } catch (error) {
      console.log(error);
    }
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
          <Button onClick={() => handleClassification(nonclassifiedEmails)}>
            Classify
          </Button>
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