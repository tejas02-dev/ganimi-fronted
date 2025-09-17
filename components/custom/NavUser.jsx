"use client";
import { useState, useEffect } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { EllipsisVertical, LogOut } from "lucide-react";

export default function NavUser() {
    const [userData, setUserData] = useState(null);
    const isMobile = useSidebar();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await fetch("http://localhost:5500/api/v1/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("user");
        setUserData(null);
        router.push("/login");
      }
    };
    useEffect(() => {
        // Only access localStorage on the client side
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem("user");
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setUserData(parsedUser);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            }
        }
    }, []);
    // Show loading state if userData is not available yet
    if (!userData) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <Avatar className="h-8 w-8 rounded-lg grayscale">
                            <AvatarFallback className="rounded-lg">...</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">Loading...</span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={userData?.profilePicture} alt={userData?.name} />
                  <AvatarFallback className="rounded-lg">
                    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData?.name || "User"}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userData?.email || ""}
                  </span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData?.profilePicture} alt={userData?.name} />
                    <AvatarFallback className="rounded-lg">
                      {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userData?.name || "User"}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {userData?.email || ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut  />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
}