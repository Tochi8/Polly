export default function NavBar() {
    return (
        <nav className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
            <div className="w-8 h-3 bg-gray-200 rounded" />
            <div className="flex items-center gap-4">
                <button className="text-gray-500">🔍</button>
                <button className="text-gray-500">🔔</button>
                <button className="text-gray-500">☰</button>
            </div>
        </nav>
    )
}