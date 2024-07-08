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
import { getServerSession } from 'next-auth';
import { useState } from 'react';
import { NEXT_AUTH } from '@/lib/auth';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Emailclassifier } from '@/components/Emailclassifier';
import Button from '@/components/ui/button';
import axios from 'axios';
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';


const Dashboard = () => {
  const { data: session, status } = useSession();

 

  const [categorizedEmails, setCategorizedEmails] =
    useState<CATEGORIZED_EMAILS>();
  const [emails, setEmails] = useState<emails[]>([]);
  const router = useRouter();
  const [filterValue, setFilterValue] = useState<number>(10);
  
  const nonclassifiedEmails = emails;

  const handleclick = async () => {
    try {
      const response = await axios.post("/api/user/classifier", {
        emails: emails,
      });
      setCategorizedEmails(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

 /*useEffect(() => {
    const fetchEmails = async () => {
      try {
       const response=await fetch(`api/user/mails1/${filterValue}`);
       console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        const data = await response.json();
        const emails: emails[] = data.emailDetails;
        setEmails(emails);
      } catch (error) {
        console.log("Error fetching and classifying emails:", error);
      } finally { }
    };
    fetchEmails();
  },[filterValue]);*/
 
   /* const fetchData = async () => {
      try {
        const response = await getemails(filterValue);
        if (!response.ok) {
          throw new Error('Request failed with status: ' + response.status);
        }
        const data = await response.json();
        const emails: emails[] = data.emailDetails;
        setEmails(emails);
      } catch (error) {
        console.error('Error fetching emails:', error);
        // Handle error state or UI feedback as needed
      }
    };*/
    function getBody(payload: any) {
      let body = '';
    
      if (payload.parts) {
        payload.parts.forEach((part: any) => {
          if (part.mimeType === 'text/plain' && part.body && part.body.data) {
            body += Buffer.from(part.body.data, 'base64').toString('utf-8');
          } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
            body += Buffer.from(part.body.data, 'base64').toString('utf-8');
          } else if (part.parts) {
            body += getBody(part); // Recursively handle nested parts
          }
        });
      } else if (payload.body && payload.body.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }
    
      return body;
    }
   const getemails=async(noofemails:number)=>{
   
  
      const apipEndPoint="https://gmail.googleapis.com/gmail/v1/users/me/messages"
      
      
      try{  const session=await getServerSession(NEXT_AUTH);
        const access_token=session.access_token;
       const headers={Authorization:`Bearer ${access_token}`,
        Accept:"application/json"}
          const response=await axios.get(apipEndPoint,{headers,params:{
          maxResults:(noofemails),
        }});
        //console.log(response.data.messages);
        const messages=response.data.messages;
      
      
        //getting particular email from the api 
        const emailDetails=await Promise.all(messages.map(async(message:any)=>{
          const msg=await axios.get(apipEndPoint+"/"+message.id,{headers});
          const resheader= msg.data.payload.headers;
          const subjectHeader=resheader.find((header:any)=>header.name=="Subject");
          const fromHeader=resheader.find((header:any)=>header.name=="From");
          const subject=subjectHeader?subjectHeader.value:"No Subject";
          let from="Unknown Sender";
          if (fromHeader) {
            const match = fromHeader.value.match(/<(.+?)>/);
            if (match) {
              from = match[1];
            }
          }
          const body=getBody(msg.data.payload);
          // You can define these functions according to your application's requirements
          const { text, html } = separateHTMLandText(body);
          const formattedText = formatEmail(text);
          const sanitizedText = stripHTMLAndCSS(formattedText);
          return {
            id: message.id,
            subject,
            from,
            body: { text: sanitizedText, html },
          };
        }))
        return emailDetails;
      }catch(error){
        console.log(error);
        return error;
      }
      }
      async function fetchData() {
        try {
          const emails = await getemails(filterValue);
          setEmails(emails as emails[]);
          console.log(emails);
        } catch (error) {
          console.error('Error fetching emails:', error);
          // Handle error state or UI feedback as needed
        }
      }
      
      fetchData();

    
  
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
          <div className="mb-3">
          <Button onClick={handleclick}>
            Classify
          </Button>
          
          <div className='flex items-center gap-2 mt-3'>
          <h4 className='font-semibold'>Filter :</h4>
          <input
            className=' text-center bg-white rounded text-black w-[10vh] border-2 border-slate-300'
            type='number'
            placeholder='filter'
            step="1"
            max="50"
            min="10"
            value={filterValue}
            onChange={(e) => {
              const value = e.target.value;
              setFilterValue(parseInt(value, 10));
            }}
          />
        
        </div>
          </div>
        
          
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