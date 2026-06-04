import { Outlet } from "react-router-dom";
import { QueryProvider } from "../providers/query-provider";

export function RootLayout() {
  return (
    <QueryProvider>
      <Outlet />;
    </QueryProvider>
  );
}
