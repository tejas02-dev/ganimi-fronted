"use client";
import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarHeader, 
    SidebarItem, 
    SidebarMenu, 
    SidebarTrigger, 
    SidebarGroup, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    SidebarGroupContent} from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { Home, User, Users, Package, LibraryBig, ShoppingCart, BookOpen, Settings, BarChart3, Heart, Bell, AlarmClock, BadgeInfo } from "lucide-react";
import NavUser from "./NavUser";

export default function DashboardSidebar() {
    const pathname = usePathname();
    
    // Determine user role based on current route
    const getUserRole = () => {
        if (pathname.includes('/dashboard/admin')) return 'admin';
        if (pathname.includes('/dashboard/vendor')) return 'vendor';
        if (pathname.includes('/dashboard/student')) return 'student';
        return 'default';
    };
    
    // Define navigation items for each role
    const navigationItems = {
        admin: [
            { title: 'Dashboard', url: '/dashboard/admin', icon: Home },
            { title: 'Users', url: '/dashboard/admin/users', icon: Users },
            { title: 'Services', url: '/dashboard/admin/services', icon: Package },
            { title: 'Orders', url: '/dashboard/admin/orders', icon: ShoppingCart },
            { title: 'Analytics', url: '/dashboard/admin/analytics', icon: BarChart3 },
            { title: 'Settings', url: '/dashboard/admin/settings', icon: Settings },
        ],
        vendor: [
            { title: 'Dashboard', url: '/dashboard/vendor', icon: Home },
            { title: 'Profile', url: '/dashboard/vendor/profile', icon: User },
            { title: 'My Services', url: '/dashboard/vendor/services', icon: Package },
            { title: 'My Bookings', url: '/dashboard/vendor/bookings', icon: BookOpen },
            { title: 'Notifications', url: '/dashboard/vendor/notifications', icon: Bell },
            { title: 'Analytics', url: '/dashboard/vendor/analytics', icon: BarChart3 },
            { title: 'Settings', url: '/dashboard/vendor/settings', icon: Settings },
            { title: 'Contact Us', url: '/dashboard/vendor/contact-us', icon: BadgeInfo },
        ],
        student: [
            { title: 'Dashboard', url: '/dashboard/student', icon: Home },
            { title: 'Profile', url: '/dashboard/student/profile', icon: User },
            { title: 'Browse Categories', url: '/dashboard/student/categories', icon: Package },
            { title: 'My Services', url: '/dashboard/student/services', icon: LibraryBig },
            { title: 'My Bookings', url: '/dashboard/student/bookings', icon: BookOpen },
            { title: 'My Orders', url: '/dashboard/student/orders', icon: ShoppingCart },
            { title: 'Reports', url: '/dashboard/student/reports', icon: BarChart3 },
            { title: 'Favorites', url: '/dashboard/student/favorites', icon: Heart },
            { title: 'Notifications', url: '/dashboard/student/notifications', icon: Bell },
            { title: 'Reminders', url: '/dashboard/student/reminders', icon: AlarmClock },
            { title: 'Settings', url: '/dashboard/student/settings', icon: Settings },
            { title: 'Contact Us', url: '/dashboard/student/contact-us', icon: BadgeInfo },
        ],
        default: [
            { title: 'Dashboard', url: '/dashboard', icon: Home },
            { title: 'Settings', url: '/dashboard/settings', icon: Settings },
        ]
    };
    
    const currentRole = getUserRole();
    const items = navigationItems[currentRole];
    
    return (
        <Sidebar variant="inset" collapsible="icon" >
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Ganimi</h2>
          <p className="text-sm text-muted-foreground capitalize">{currentRole} Panel</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    )
}