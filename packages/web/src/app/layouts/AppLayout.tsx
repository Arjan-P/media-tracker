import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/SiteHeader";

export function AppLayout() {
  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset className="m-2 rounded-2xl border overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}
