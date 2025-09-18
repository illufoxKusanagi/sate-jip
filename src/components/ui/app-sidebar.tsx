// // Add this to your existing AppSidebar component

// import { useAuth } from "@/app/context/auth-context";
// import { Button } from "@/components/ui/button";
// import { LogOut, User } from "lucide-react";

// // Edited Here: Add user section to sidebar
// export function AppSidebar() {
//   const { user, logout, isAuthenticated } = useAuth();

//   return (
//     <div className="sidebar">
//       {/* ...existing sidebar content... */}

//       {/* Edited Here: Add user section at bottom of sidebar */}
//       {isAuthenticated && user && (
//         <div className="mt-auto p-4 border-t">
//           <div className="flex items-center gap-2 mb-2">
//             <User className="h-4 w-4" />
//             <span className="text-sm font-medium">{user.name}</span>
//           </div>
//           <div className="text-xs text-muted-foreground mb-2">{user.email}</div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={logout}
//             className="w-full"
//           >
//             <LogOut className="h-4 w-4 mr-2" />
//             Logout
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import {
  Calendar,
  Home,
  Inbox,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { open } = useSidebar();

  const user = {
    name: "arief",
    email: "ariefsatria@gmail.com",
    avatar: "",
  };

  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          open ? "px-4 pt-4 block opacity-100" : "p-0 opacity-0 hidden"
        )}
      >
        <SidebarMenu>
          <SidebarMenuButton asChild className="hover:bg-accent/50 h-10">
            <p className="body-big-bold text-center text-primary">SATE-JIP</p>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex flex-col gap-4 transition-all duration-300",
          open ? "px-4 py-2" : "p-0 pt-4"
        )}
      >
        <SidebarMenu>
          {/* <SidebarMenuButton
            variant="default"
            className="h-10 px-4 py-3 justify-start gap-3 transition-colors"
            asChild
          >
            <Plus size="icon" className="shrink-0" />
            {open && <span className="body-medium-bold">Percakapan Baru</span>}
          </SidebarMenuButton> */}

          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarHeader key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarHeader>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter
        className={cn(
          "absolute bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          open ? "p-0" : "p-0"
        )}
      >
        {/* <NavUser user={user} /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
