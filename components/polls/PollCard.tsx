'use client';
import Badge from "@/components/ui/Badge";

interface PollCardProps {
    children?: React.ReactNode;
    title?: string;
    voters?: number;
    deadline?: string;
    percentage?: number;
    type?: 'PollCard' | 'Draft'
}

export default function PollCard (
    {
    children,
    title,
    voters,
    deadline,
    percentage,
    type ='PollCard'
}: PollCardProps) {

    if (type === 'Draft') {
            return (
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-sm font-bold text-ink">{title}</div>
                <Badge variant="Draft"/>
                <div className="text-xs text-gray-500 mt-1">Draft . {voters ?? 0} voters added</div>
                {children}
            </div>);
        } 

    return (
         <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
            
            {/* title and status */}
           <div className="flex items-start justify-between gap-2">
           <h3 className="text-sm font-bold text-ink leading-snug flex-1">{title}</h3>
           <Badge variant="Live"/>
            </div>

          <div className="flex gap-3">
            {/* voters and deadline */}
             <span className="text-xs text-gray-500">{/* icon here */} {voters}</span>
             <span className="text-xs text-gray-500"> {/* icon here */}{deadline} </span>
          </div> 
              
              {/* progress bar */}
            {percentage !== undefined && (
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{percentage}% voted</span>
                    </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                            className="h-full bg-ink rounded-full"
                            style={{ width: `${percentage}%` }}
                            />
                            </div>
                    </div>
            )} 
        </div>
    );
}