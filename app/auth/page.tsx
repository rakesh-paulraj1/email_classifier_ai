"use client";
export type emails= {
  id: number,
  subject: string,
  from: string
  body:  {
    text : string ,
    html : string ,
  }
}
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';
import React from 'react'
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import axios
 from 'axios';
const  auth = async () => {
    
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
        const emails = await getemails(1); 
        console.log('Fetched emails:', emails);
        
      } catch (error) {
        console.error('Error fetching emails:', error);
       
      }
    }
    
    fetchData();


  return (
    <div>auth
       </div>
  )
}

export default auth