import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  return (
    <div
      className={cn(
        "flex min-h-screen",
        isAuthenticated ? "bg-[#F1FFEF]" : "bg-[#FFDCCC]"
      )}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64 min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
