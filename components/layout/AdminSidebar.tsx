import Link from "next/link";

interface AdminSidebarProps{
    className?: string;
}

export default function SideBar({className}: AdminSidebarProps) {
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