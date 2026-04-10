interface BadgeProps {
    variant?: 'Live' | 'Draft' | 'Closed' 
}

export default function Badge({
    variant = 'Live'
}: BadgeProps) {

    const variants = {
        Live: 'bg-lime text-ink text-xs font-semibold px-3 py-1 rounded-full hover:bg-lime/80',
        Draft: 'bg-ghost text-mid text-xs font-semibold px-3 py-1 rounded-full hover:bg-surface2',
        Closed: 'bg-surface2 text-mid text-xs font-semibold px-3 py-1 rounded-full'
    }

    return (
         <span className={`${variants[variant]}`}>{variant}</span> 
    );
}