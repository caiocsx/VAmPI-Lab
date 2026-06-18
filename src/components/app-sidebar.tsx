import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { API_ROUTES } from "@/config/api-routes";
import { api } from "@/lib/api";
import {
  BookIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import { Link } from "react-router";

type MeResponse = {
  status: string;
  data: {
    username: string;
    email: string;
    admin: boolean;
  };
};

const data = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Books",
      url: "/books",
      icon: <BookIcon />,
    },
    {
      title: "Writers",
      url: "/writers",
      icon: <UsersIcon />,
    },
  ],
  extra: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Guest",
    email: "Not authenticated",
    admin: false,
  });

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get<MeResponse>(API_ROUTES.auth.me);

        setUser({
          name: data.data.username,
          email: data.data.email,
          admin: data.data.admin,
        });
      } catch {
        setUser({
          name: "Guest",
          email: "Not authenticated",
          admin: false,
        });
      }
    };

    loadUser();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-2 py-1">
            <img src="/vampi-icon.png" alt="VAmPI Logo" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-wider">
              VAmPI <span className="font-light">Lab</span>
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link to={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.extra.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link to={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
