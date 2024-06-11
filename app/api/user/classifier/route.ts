// Interface for email properties
interface filteredemailProps {
  id: string;
  subject: string;
  from: string;
  body: {
    text: string;
  };
}

// Interface for classified email with classification label
interface categorizedEmail {
  id: string;
  subject: string;
  from: string;
  body: {
    text: string;
  };
  classification: "important" | "promotion" | "social" | "marketing" | "spam" | "general";
}

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: "" ?? '',
  dangerouslyAllowBrowser: true,
});

// Function to classify emails with type annotations
async function categorizeEmails(emails: filteredemailProps[]): Promise<categorizedEmail[]> {
  if (!emails || emails.length === 0) {
    console.error("No emails to categorize");
    return [];
  }

  const categorizedEmails: categorizedEmail[] = await Promise.all(
    emails.map(async (email: filteredemailProps) => {
      try {
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Judging from the subject line and the body of this email, classify this email\n\n${email.subject}\n\n${email.body.text}\n\ngive answer labeled as\n\n"important: Emails that are personal or work-related and require immediate attention.",\n\n"promotion: Emails related to sales, discounts, and marketing campaigns.",\n\n"social: Emails from social networks, friends, and family.",\n\n"marketing: Emails related to marketing, newsletters, and notifications.",\n\n"spam: Unwanted or unsolicited emails." or\n\n"general: If none of the above are matched, use General"\n\ngive one word (important, promotion, social, marketing, spam, or general) answer from these options only and ignore the dash lines in the body`,
            },
          ],
          model: "gpt-3.5-turbo",
          max_tokens: 1,
          temperature: 1,
          stop: ["\n"],
        });
        const decision = response.choices[0].message.content as
          | "important"
          | "promotion"
          | "social"
          | "marketing"
          | "spam"
          | "general";

        return {
          id: email.id,
          subject: email.subject,
          from: email.from,
          body: email.body,
          classification: decision,
        };
      } catch (error) {
        console.error("Error classifying email:", error);
        return {
          id: email.id,
          subject: email.subject,
          from: email.from,
          body: email.body,
          classification: "general",
        };
      }
    })
  );

  return categorizedEmails;
}

import { NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' });
  }

  try {
    const emails: filteredemailProps[] = await req.json(); 
    const categorizedEmails = await categorizeEmails(emails.emails);
    return NextResponse.json(categorizedEmails);
  } catch (error) {
    console.error("Error classifying emails:", error);
    return NextResponse.json({ message: 'Error classifying emails' });
  }
}
