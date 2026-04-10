import Link from "next/link";

interface AdminButtomProps {
    className?: string;
}

export default function ButtomNav({className}: AdminButtomProps) {
    return (
        <div className={className}>
            <div>
                <Link href="/home">
                {/* Home icon goes here */}
                </Link>
            </div>

             <div>
                <Link href="/stats">
                {/* Stats icon goes here */}
                </Link>
            </div>

             <div>
                <Link href="/notis">
                {/* Notis icon goes here */}
                </Link>
            </div>

             <div>
                <Link href="/settings">
                {/* Settings icon goes here */}
                </Link>
            </div>
        </div>
    );
}