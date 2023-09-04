import "../stylesheets/main.css";

import { inter, iBMPlexSans } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/query-provider";
import AuthProvider from "@/components/auth-provider";
import { SidebarContextProvider } from "@/context/sidebar";
import { ToastContextProvider } from "@/context/toast";
import { Body } from "@/components/body";

export const metadata = {
  title: "Admin Portal | Calvary Carpentry",
  description: "Admin Portal | Calvary Carpentry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <QueryProvider>
          <ToastContextProvider>
            <SidebarContextProvider>
              <body
                className={`${inter.className} ${iBMPlexSans.className} font-sans bg-[#eeeef1]`}
              >
                <Body>{children}</Body>
                <Toaster />
              </body>
            </SidebarContextProvider>
          </ToastContextProvider>
        </QueryProvider>
      </AuthProvider>
    </html>
  );
}
