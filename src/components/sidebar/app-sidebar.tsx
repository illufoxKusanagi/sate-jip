"use client";
import {
  Building,
  Calendar,
  Calendar1,
  ChevronDown,
  Cog,
  Database,
  DatabaseIcon,
  DatabaseZap,
  Home,
  LayoutDashboard,
  PersonStandingIcon,
  Pin,
  Server,
  Ticket,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function AppSidebar() {
  const { open } = useSidebar();

  const user = {
    name: "arief",
    email: "ariefsatria@gmail.com",
    avatar: "",
  };

  const tikItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Penanggung-Jawab",
      url: "/admins",
      icon: PersonStandingIcon,
    },
    {
      title: "Lokasi",
      url: "/locations",
      icon: Pin,
    },
    {
      title: "Config",
      url: "/dataConfig",
      icon: Cog,
    },
  ];

  const calendarItem = [
    {
      title: "Kalender Kegiatan",
      url: "/activityCalendar",
      icon: Calendar1,
    },
  ];

  const dataCentralItem = [
    {
      title: "Dashboard",
      url: "/data-central-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manajemen Server",
      url: "/server-management",
      icon: Server,
    },
    {
      title: "Data Server",
      url: "/server-data",
      icon: DatabaseZap,
    },
  ];

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Config",
      url: "/dataConfig",
      icon: Cog,
    },
    {
      title: "E-TIcketing",
      url: "#",
      icon: Ticket,
    },

    // {
    //   title: "Search",
    //   url: "#",
    //   icon: Search,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings,
    // },
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
          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuButton asChild>
                  <CollapsibleTrigger className="w-full text-muted-foreground hover:text-foreground transition-colors">
                    <Building />
                    Jaringan Intra Pemerintah
                    <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarMenuButton>
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <div className="mt-1 space-y-1">
                    {tikItems.map((item) => (
                      <SidebarMenuButton key={item.title} asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* {items.map((item) => (
                  <SidebarHeader key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarHeader>
                ))} */}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuButton asChild>
                <CollapsibleTrigger className="w-full text-muted-foreground hover:text-foreground transition-colors">
                  <Database />
                  Pusat Data Pemerintah
                  <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="mt-1 space-y-1">
                  {dataCentralItem.map((item) => (
                    <SidebarMenuButton key={item.title} asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuButton asChild>
                <CollapsibleTrigger className="w-full text-muted-foreground hover:text-foreground transition-colors">
                  <Calendar />
                  Agenda
                  <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="mt-1 space-y-1">
                  {calendarItem.map((item) => (
                    <SidebarMenuButton key={item.title} asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={cn(
          "w-full bg-accent backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
      >
        <p className="body-small-bold text-center">
          Made with ❤️ by <br />
          <Link href={"https://github.com/illufoxKusanagi"}>
            <span className="hover:underline">Illufox Kasunagi</span>
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
