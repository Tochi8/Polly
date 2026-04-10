import NavBar from "@/components/layout/Navbar";
import ButtomNav from "@/components/layout/AdminButtomNav";
import SideBar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
    children,

}: {children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">

       <NavBar>
        {children}
       </NavBar>

       <div className="flex flex-1">

        <SideBar className="hidden md:flex" />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
       {children}
       </main>

       </div>
       
        <ButtomNav  className="md:hidden" />
       
       </div>
    );
}