import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';
import { NEXT_AUTH } from '@/lib/auth';

const apipEndPoint = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';

async function getBody(payload: any) {
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

export default async function GET(req: NextRequest) {
  const requests = req.nextUrl.searchParams.get('requests');
  const noofemails = typeof requests === 'string' ? parseInt(requests, 10) : 10; // Default to 10 if requests is not provided or invalid
  
  try {
    // Retrieve server session to get access token
    const session = await getServerSession(NEXT_AUTH);
    const accessToken = session.access_token;

    // Make GET request to Gmail API to fetch emails
    const response = await axios.get(apipEndPoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      params: {
        maxResults: noofemails,
      },
    });

    // Process the response to extract email details
    const messages = response.data.messages;

    const emailDetails = await Promise.all(
      messages.map(async (message: any) => {
        const msg = await axios.get(`${apipEndPoint}/${message.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });

        // Extract headers
        const resheader = msg.data.payload.headers;
        const subjectHeader = resheader.find((header: any) => header.name === 'Subject');
        const fromHeader = resheader.find((header: any) => header.name === 'From');
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
        let from = 'Unknown Sender';

        // Parse "From" header to get sender's email
        if (fromHeader) {
          const match = fromHeader.value.match(/<(.+?)>/);
          if (match) {
            from = match[1];
          }
        }

        // Get email body and format it
        const body = getBody(msg.data.payload);
        const { text, html } = separateHTMLandText(body);
        const formattedText = formatEmail(text);
        const sanitizedText = stripHTMLAndCSS(formattedText);

        return {
          id: message.id,
          subject,
          from,
          body: { text: sanitizedText, html },
        };
      })
    );

    // Return the email details as JSON response
    return NextResponse.json({ emailDetails }, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
