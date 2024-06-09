interface filterdemailProps {
    map(arg0: (email: any, id: any) => import("react").JSX.Element): import("react").ReactNode;
    id: number;
    subject: string;
    from: string;
    body: {
       text: string;
       html: string;
    };
    
 }
 interface CategorizedemailProps {
    id: number;
    subject: string;
    from: string;
    body: {
       text: string;
       html: string;
    };
    classification: string;
 }

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

let savedApiKey;

if (typeof window !== 'undefined') {
  savedApiKey = localStorage.getItem('OPENAI_KEY');
}

const openai = new OpenAI({
  apiKey: savedApiKey ?? process.env.NEXT_PUBLIC_OPENAI_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

export default async function CLASSIFYEMAILS(
  req: NextApiRequest,
  res: NextApiResponse<CategorizedemailProps[]>
) {
  if (req.method === "POST") {
    try {
      const { emails } = req.body;

      const categorizedEmails: CategorizedemailProps[] = [];

      await Promise.all(
        emails.map(async (email: filterdemailProps) => {
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
          const decision = response.choices[0].message.content;

          categorizedEmails.push({
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            classification: decision || "",
          });
        })
      );

      res.status(200).json(categorizedEmails);
    } catch (error) {
      console.error("Error categorizing emails:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
