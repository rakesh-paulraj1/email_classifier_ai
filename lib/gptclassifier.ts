import { emails } from '@/app/dashboard/page';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface FilteredEmailProps {
    id: number;
    subject: string;
    from: string;
    body: {
        text: string;
        html: string;
    };
}

interface CategorizedEmailProps extends FilteredEmailProps {
    classification: string;
}
const openai = new OpenAI({
    apiKey:"h" ?? '',
    dangerouslyAllowBrowser: true,
});


export async function classifyEmails(emails : emails[]) {

    const categorizedEmails: CategorizedEmailProps[] = [];
   
    await Promise.all(
      emails.map(async (email: emails) => {
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Judging from the subject line and the body of this email, classify this email header\n\n${email.subject}\n\ngive answer labeled as\n\nimportant promotion social marketing spam general\n\ngive one word answer from these options only and ignore the dash lines in the body`
              ,
            },
          ],
          model: "babbage-002", 
          max_tokens: 1,
          temperature: 1,
          stop: ["\n"],
        });
        const decision = response.choices[0].message.content;
  
        categorizedEmails.push({subject: email.subject, from: email.from, classification: decision || "", body: email.body,id:email.id} );
  
      })
    );
  console.log(process.env.OPENAI_KEY);
    return categorizedEmails;
  }
