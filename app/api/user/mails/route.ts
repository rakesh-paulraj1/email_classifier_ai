/*
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';



function getBody(payload: any) {

  let body = '';

  if (payload.parts) {
    payload.parts.forEach((part) => {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else if (part.parts) {
        body += getBody(part); // recursively handle nested parts
      }
    });
  } else if (payload.body && payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  return body;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);
  
 const noofemails=req.nextUrl.searchParams.get("requests")
 
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  console.log(session);

  const accessToken = session.access_token;
  console.log(session.access_token);
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,);
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: Number(noofemails)
    });

    const messages = response.data.messages || [];
    

    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        const headers = msg.data.payload.headers;
        const subjectHeader = headers.find(
          (header) => header.name === "Subject"
        );
        const fromHeader = headers.find((header) => header.name === "From");
        const subject = subjectHeader ? subjectHeader.value : "No Subject";
        let from = "Unknown Sender";

        if (fromHeader) {
          const match = fromHeader.value.match(/<(.+?)>/);
          if (match) {
            from = match[1];
          }
        }

        const body = getBody(msg.data.payload);
        const { text, html } = separateHTMLandText(body);
        const formatedText = formatEmail(text);
        const sanitizedText = stripHTMLAndCSS(formatedText);
        console.log("body"+body);
        return {
          id: message.id,
          subject,
          from,
          body: { text: sanitizedText, html },
        };
      })
    );


    return NextResponse.json({ emailDetails }, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
  */

import { NEXT_AUTH } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
const session=await getServerSession(NEXT_AUTH);
const accessToken=session.access_token;

const apipEndPoint="https://gmail.googleapis.com/gmail/v1/users/me/messages"

const headers={
  Authorization:`Bearer ${accessToken}`,
  Accept:"application/json"
}
 export const getemails=async(noofemails:number)=>{
try{ 
  const response=await axios.get(apipEndPoint,{headers,params:{
    maxResults:(noofemails),
  }});
  console.log(response.data);
  return response.data;
}catch(error){
  console.log(error);
  return error;
}
}

export async function GET(req: NextRequest) {
  const noofemails=req.nextUrl.searchParams.get("requests")||"10";
 try{ const response =await getemails(parseInt(noofemails));
  console.log(response);
  return NextResponse.json({response}, { status: 200 });}
  catch (error) {
    console.error('Error fetching emails', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

