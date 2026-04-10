interface NavBarProps {
    children: React.ReactNode
}

export default function NavBar({
    children,
}: NavBarProps) {
    return (
        <NavBar>
            {children}
        </NavBar>
    )
}