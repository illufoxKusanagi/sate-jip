import { useAuth } from "@/app/context/auth-context";
import { AppSidebar } from "../sidebar/app-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { TopBar } from "./top-bar";

export function PageStructure({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row h-screen w-full relative">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto">
          <TopBar />
          <div className="flex flex-col mx-4 sm:mx-8 lg:mx-20 my-16 sm:my-10 rounded-lg justify-center">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
