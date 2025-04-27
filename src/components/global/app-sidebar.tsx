import {
  ArrowBigDown,
  BookOpen,
  Calendar,
  Home,
  Inbox,
  Menu,
  Search,
  Settings,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Scholarships",
    url: "/scholarships",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { signOut } = useAuthStore();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarHeader className="flex items-center justify-between gap-2 flex-row border-b m-2">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="logo"
              width={18}
              height={18}
              className="rounded"
            />
            {!isCollapsed && (
              <h1 className="text-base font-semibold">ScholarAI</h1>
            )}
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.title : undefined}
                  >
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
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={signOut}
                variant="destructive"
                className="cursor-pointer"
                size="icon"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sign Out</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            onClick={signOut}
            variant="destructive"
            className="cursor-pointer"
          >
            Sign Out
          </Button>
        )}
      </SidebarFooter>
      <div
        className="absolute top-1/2 -right-5 bg-background border rounded-full p-2 hover:bg-accent"
        onClick={() => toggleSidebar()}
      >
        <ChevronLeft
          className={cn(
            "h-4  w-4 transition-transform duration-200",
            isCollapsed ? "rotate-180" : ""
          )}
        />
      </div>
    </Sidebar>
  );
}
