interface SpinnerProps {
    size?: 'Small' | 'Medium' | 'Large'
}

export default function Spinner({
    size = 'Small'
}: SpinnerProps) {

    const variants = {
        Small: 'w-4 h-4',
        Medium: 'w-8 h-8',
        Large: 'w-12 h-12',
    }

    return (
        <div 
        className={`${variants[size]} rounded-full border-2 border-surface2 border-t-ink animate-spin`}
        />
    );
}