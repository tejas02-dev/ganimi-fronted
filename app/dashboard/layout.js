"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/custom/DashboardSidebar"

export default function Layout({ children }) {

  const pathname = usePathname();
    
    // Determine user role based on current route
    const getUserRole = () => {
        if (pathname.includes('/dashboard/admin')) return 'Admin Dashboard';
        if (pathname.includes('/dashboard/vendor')) return 'Vendor Dashboard';
        if (pathname.includes('/dashboard/student')) return 'Student Dashboard';
        return 'Dashboard';
    };


    return (
      <SidebarProvider style={{"--sidebar-width": "250px"}}>
        <DashboardSidebar />
        
        <SidebarInset className="p-4 ">
        <div className="flex items-center ">
        <SidebarTrigger className="mr-2"/>
        <Separator orientation="vertical" className=""/>
        <h1 className="text-2xl font-bold ml-2">{getUserRole()}</h1>
        </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    )
  }