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
          open
            ? "px-4 pt-4 block opacity-100"
            : "px-2 pt-4 flex items-center justify-center opacity-100"
        )}
      >
        <SidebarMenu>
          <SidebarMenuButton asChild className="hover:bg-accent/50 h-10">
            {open ? (
              <p className="body-big-bold text-center text-primary-600 dark:text-primary-300">
                SATE-JIP
              </p>
            ) : (
              <div className="flex items-center justify-center w-full">
                <LayoutDashboard className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex flex-col gap-4 transition-all duration-300",
          open ? "px-4 py-2" : "px-2 pt-4"
        )}
      >
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuButton asChild>
                  <CollapsibleTrigger
                    className={cn(
                      "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
                      !open && "justify-center px-2"
                    )}
                  >
                    <Building className={cn(!open && "h-5 w-5")} />
                    {open && "Jaringan Intra Pemerintah"}
                    {open && (
                      <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                    )}
                  </CollapsibleTrigger>
                </SidebarMenuButton>
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <div className="mt-1 space-y-1">
                    {tikItems.map((item) => (
                      <SidebarMenuButton key={item.title} asChild>
                        <Link
                          href={item.url}
                          className={cn(!open && "justify-center px-2")}
                        >
                          <item.icon className={cn(!open && "h-5 w-5")} />
                          {open && <span>{item.title}</span>}
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
                <CollapsibleTrigger
                  className={cn(
                    "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
                    !open && "justify-center px-2"
                  )}
                >
                  <Database className={cn(!open && "h-5 w-5")} />
                  {open && "Pusat Data Pemerintah"}
                  {open && (
                    <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="mt-1 space-y-1">
                  {dataCentralItem.map((item) => (
                    <SidebarMenuButton key={item.title} asChild>
                      <Link
                        href={item.url}
                        className={cn(!open && "justify-center px-2")}
                      >
                        <item.icon className={cn(!open && "h-5 w-5")} />
                        {open && <span>{item.title}</span>}
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
                <CollapsibleTrigger
                  className={cn(
                    "w-full text-primary-600 dark:text-primary-300 hover:text-primary-500 transition-colors",
                    !open && "justify-center px-2"
                  )}
                >
                  <Calendar className={cn(!open && "h-5 w-5")} />
                  {open && "Agenda"}
                  {open && (
                    <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="mt-1 space-y-1">
                  {calendarItem.map((item) => (
                    <SidebarMenuButton key={item.title} asChild>
                      <Link
                        href={item.url}
                        className={cn(!open && "justify-center px-2")}
                      >
                        <item.icon className={cn(!open && "h-5 w-5")} />
                        {open && <span>{item.title}</span>}
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
          "w-full bg-accent/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          open ? "p-4" : "p-2"
        )}
      >
        {open ? (
          <p className="body-small-bold text-center">
            Made with ❤️ by <br />
            <Link href={"https://github.com/illufoxKusanagi"}>
              <span className="hover:underline text-primary-600 dark:text-primary-300">
                Illufox Kasunagi
              </span>
            </Link>
          </p>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-xl">❤️</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
