import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { AuthSessionProvider } from "~/app/_components/auth/auth-session-provider";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Bridge",
  description: "Track events, applications, and deadlines in one place",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-[#121212] text-zinc-100">
        <AuthSessionProvider session={session}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
