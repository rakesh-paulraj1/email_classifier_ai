import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { formatEmail, separateHTMLandText, stripHTMLAndCSS } from '@/lib/emailFormetter';
import { useParams } from 'next/navigation';


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

  const { accessToken } = session.user;

  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: '',
      maxResults: Number(noofemails)
    });

    const messages = response.data.messages || [];
    console.log(messages);

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