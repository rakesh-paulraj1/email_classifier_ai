interface emails {
  id: string;
  subject: string;
  from: string;
  body: {
    text: string;
  };
}
interface categorized extends emails{
  classification:string;
}

import { NextRequest, NextResponse } from 'next/server';

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_KEY);


async function classifyemails(emails: emails[]): Promise<categorized[]> {
  if (!emails || emails.length === 0) {
    console.error("No emails to categorize");
    return [];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const categorizedEmails: categorized[] = await Promise.all(
    emails.map(async (email: emails) => {
      try {
      
        const prompt = `Judging from the subject line and the body of this email, classify this email\n\n${email.subject}\n\n${email.body.text}\n\ngive answer labeled as\n\n"important: Emails that are personal or work-related and require immediate attention.",\n\n"promotion: Emails related to sales, discounts, and marketing campaigns.",\n\n"social: Emails from social networks, friends, and family.",\n\n"marketing: Emails related to marketing, newsletters, and notifications.",\n\n"spam: Unwanted or unsolicited emails." or\n\n"general: If none of the above are matched, use General"\n\ngive one word (important, promotion, social, marketing, spam, or general) answer from these options only and ignore the dash lines in the body`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const decision = response.text().trim();
           console.log(decision);
        
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
 console.log(categorizedEmails);
  return categorizedEmails;
}


export async function POST(req:NextRequest, res:NextResponse) {
  try{
  const emails = await req.json();
  const categorizedEmails=await classifyemails(emails.emails);
 
  return NextResponse.json(categorizedEmails);
  console.log(categorizedEmails);
  }catch(e){
    console.log("the error is "+e);
    return NextResponse.json({
      error:"the error is"+e
    })
  }
}