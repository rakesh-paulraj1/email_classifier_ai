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
 
import { EmailCard } from "./Emailcard"
export function Emailclassifier({
    categorizedEmails,
    nonclassifiedEmails,
    loading
}:
    {
        categorizedEmails: CategorizedemailProps | undefined,
        nonclassifiedEmails:filterdemailProps
        loading: boolean
    }) {
    return (
        <div>
           
            {loading ? (
    <div className="">loading</div>
) : (
    <ul>
        {categorizedEmails && Array.isArray(categorizedEmails) ? (
            categorizedEmails.map((email, id) => (
                <EmailCard key={id} from={email.from} subject={email.subject} classification={email.classification} body={email.body} />
            ))
        ) : (
            nonclassifiedEmails.map((email, id) => (
                <EmailCard key={id} from={email.from} subject={email.subject} classification={""} body={email.body} />
            ))
        )}
    </ul>
)}

            </div>
        
    )
}
