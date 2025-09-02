"use client";

import { useAuth } from "@/providers/auth-provider";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  // Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";

interface AppSidebarProps {
  roleRoute: string;
}

export function AppSidebar({ roleRoute }: AppSidebarProps) {
  const { user, logout } = useAuth();

  const navigation = [
    {
      title: "Dashboard",
      url: `/${roleRoute}`,
      icon: LayoutDashboard,
      roles: ["dashboard", "admin"],
    },
    {
      title: "Categories",
      url: `/${roleRoute}/categories`,
      icon: Package,
      roles: ["admin"],
    },
    {
      title: "Services",
      url: `/${roleRoute}/services`,
      icon: Package,
      roles: ["dashboard", "admin"],
    },
    {
      title: "Orders",
      url: `/${roleRoute}/orders`,
      icon: ShoppingCart,
      roles: ["dashboard", "admin"],
    },
    {
      title: "New Order",
      url: `/${roleRoute}/new-order`,
      icon: Users,
      roles: ["admin", "dashboard"],
    },
    {
      title: "Users",
      url: `/${roleRoute}/users`,
      icon: Users,
      roles: ["admin"],
    },
    // {
    //   title: "Settings",
    //   url: `/${roleRoute}/settings`,
    //   icon: Settings,
    //   roles: ["dashboard", "admin"],
    // },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(roleRoute)
  );

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            T
          </div>
          <span className="font-semibold text-lg">TopSMM Panel</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user?.name}</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
