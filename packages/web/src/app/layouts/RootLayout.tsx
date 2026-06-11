import { Outlet } from "react-router-dom";
import { QueryProvider } from "../providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "../providers/theme-provider";

export function RootLayout() {
  return (
    <SidebarProvider>
      <QueryProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </ThemeProvider>
      </QueryProvider>
    </SidebarProvider>
  );
}
