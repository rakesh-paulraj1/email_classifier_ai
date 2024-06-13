interface EmailCardProps {
    id: number;
    subject: string;
    from: string;
    body: {
       text: string;
       html: string;
    };
    classification: string;
 }
 
 export const EmailCard = ({
    id,
     subject,
     from,
     body,
     classification
 }: EmailCardProps) => {
     return (
         <div className="block mb-4">
             <div className="h-full w-full px-4 py-2 overflow-hidden bg-white  border border-black/[0.2] rounded relative z-20">
                 <div className="text-black-100 font-bold tracking-wide text-xl mt-2">
                     {subject}
                 </div>
                 <div className="pt-2 flex items-center">
                     <div className="pl-2 text-black-600 tracking-wide leading-relaxed text-sm">
                         {from}
                     </div>
                     <div className="ml-auto">
                         <div className="text-xl text-black font-semibold">
                             {classification}
                         </div>
                     </div>
                 </div>
                 <div className="mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm">
                     {body.text.slice(0, 100) + "..."}
                 </div>
             </div>
         </div>
     );
 };
 