/*
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';



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

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH);
    const filterValue = req.nextUrl.searchParams.get("requests");

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const accessToken = session.access_token;
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
    );
    oAuth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: Number(filterValue)
    });

    const messages = response.data.messages || [];
    
    const emailDetails = await Promise.all(messages.map(async (message: any) => {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const headers = msg.data.payload.headers;
      const subjectHeader = headers.find((header: any) => header.name === "Subject");
      const fromHeader = headers.find((header: any) => header.name === "From");
      const subject = subjectHeader ? subjectHeader.value : "No Subject";
      let from = "Unknown Sender";

      if (fromHeader) {
        const match = fromHeader.value.match(/<(.+?)>/);
        if (match) {
          from = match[1];
        }
      }

      const body = getBody(msg.data.payload);
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
    }));

    return NextResponse.json({ emailDetails }, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
*/
  



import { NEXT_AUTH } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';

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
export const getemails=async(noofemails:number)=>{
 

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



export default async function GET(req: NextRequest) {

  
  const requests= req.nextUrl.searchParams.get("requests");
  const noofemails = typeof requests === 'string' ? parseInt(requests, 10) : 10; // Default to 10 if requests is not provided or invalid
  
  try {
    const response = await getemails(noofemails);
    console.log(response);
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }}
/*import { NextRequest, NextResponse } from "next/server";
export async function GET(){
  return NextResponse.json({hello:"world"}, { status: 200 });
}*/

