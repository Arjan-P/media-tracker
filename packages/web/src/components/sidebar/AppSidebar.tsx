import * as React from "react";
import {
  ApertureIcon,
  CompassIcon,
  HomeIcon,
  LibraryBigIcon,
} from "lucide-react";

import { NavMain, NavMainProps } from "./NavMain";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";

const data: NavMainProps = {
  navMain: [
    { title: "Home", url: ROUTES.HOME, icon: HomeIcon, items: [] },
    {
      title: "Explore",
      url: ROUTES.EXPLORE_MOVIES,
      icon: CompassIcon,
      items: [
        { title: "Movies", url: ROUTES.EXPLORE_MOVIES, items: [] },
        { title: "TV", url: ROUTES.EXPLORE_TV, items: [] },
        { title: "Games", url: ROUTES.EXPLORE_GAMES, items: [] },
        { title: "Books", url: ROUTES.EXPLORE_BOOKS, items: [] },
        { title: "Anime", url: ROUTES.EXPLORE_ANIME, items: [] },
        { title: "Manga", url: ROUTES.EXPLORE_MANGA, items: [] },
      ],
    },
    { title: "Library", url: ROUTES.LIBRARY, icon: LibraryBigIcon, items: [] },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! w-fit"
            >
              <Link to={"/"}>
                <ApertureIcon className="!size-6" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain navMain={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
