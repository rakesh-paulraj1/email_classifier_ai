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
 import { useState } from "react";
 
 export const EmailCard = ({
    id,
     subject,
     from,
     body,
     classification
 }: EmailCardProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const closeModal = () => setVisible(false);
    const openModal = () => setVisible(true);
     return (<div>
         {visible && ( //side email viewer code starts here , as i didnt wanted to make separate components to avoid rerenders
                
                    <div className="bg-grey h-[90vh] p-5 flex flex-col gap-4 border ">
                        <div className="flex justify-between ">
                            <div className="text-xl text-black  font-semibold">
                                {from}
                            </div>
                            <div className={`text-xl text-black font-semibold`}>
                                {classification}
                            </div>
                        </div>
                        <div className="text-l text-white font-medium">
                            Subject: {subject}
                        </div>
                        <div className="text-l  text-black bg-slate-800 font-medium h-[60vh] w-[100vh] overflow-scroll scrollbar-hide border-2 border-slate-700 rounded p-2"  >
                            <div className="p-5" dangerouslySetInnerHTML={{__html:body.html}}></div>
                            <pre className="flex flex-wrap p-5">{body.text}</pre>
                        </div>
                      
                        <button
                            className="text-white font-semibold bg-slate-800 w-[10vh] rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeModal();
                            }}
                        >
                            Close
                        </button>
                    </div>
                //side email viewer ends here
            )}

         <div onClick={openModal} className="block mb-4">
             <div className="h-full w-full px-4 py-2 overflow-hidden bg-white  border border-black/[0.2] rounded relative z-20">
                 <div className="text-black-100 font-bold tracking-wide text-xl mt-2">
                     {subject}
                 </div>
                 <div className="pt-2 flex items-center">
                     <div className="pl-2 text-black-600 tracking-wide leading-relaxed text-sm">
                         {from}
                     </div>
                     <div className="ml-auto">
                         <div className="text-xl text-white font-semibold">
                             {classification}
                         </div>
                     </div>
                 </div>
                 <div className="mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm">
                     {body.text.slice(0, 100) + "..."}
                 </div>
             </div>
         </div>
         </div>
     );
};
