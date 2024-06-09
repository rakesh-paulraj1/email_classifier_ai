

interface EmailCardProps {
   
    title: string;
    sender: string;
    content: string;
    classification:string
}


export const BlogCard = ({
    title,
    sender,
    content,
    classification
   
}: EmailCardProps) => {
    return (
  
            <div className=" h-full w-full px-4 py-2 overflow-hidden bg-black border border-white/[0.2] rounded relative z-20">
                <div className={("text-zinc-100 font-bold tracking-wide text-xl mt-2")}>
                    {title}
                </div>
                
                <div className={("mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm")}>
                  {(content.slice(0, 100) + "...")}
                </div>
               
            </div>
       
    );
};



