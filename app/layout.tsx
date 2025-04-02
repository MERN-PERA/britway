import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Home, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Britway",
  description: "Driver booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-4 sticky top-0">
              {/* Logo Section */}
              <div className="flex flex-col items-center">
                <Link href="/" className="flex items-center justify-center">
                <img
                  src="./favicon.ico"
                  alt="Britway Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 md:h-32 md:w-32 object-contain"
                />

                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex-1">
                <nav className="grid gap-2 px-2 text-sm font-medium lg:px-4">
                  <Link
                    href="/driver"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Home className="h-4 w-4" />
                    Drivers
                  </Link>
                  <Link
                    href="/booking"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Booking
                  </Link>
                </nav>
              </div>

              {/* Footer Section */}
              <div className="mt-auto p-4">
              <Card x-chunk="dashboard-02-chunk-0" className="w-16 mx-auto bg-gray-200 rounded-3xl">
                <CardContent className="p-1 text-center">
                  <span className="text-xs">v 1.0.2</span>
                </CardContent>
              </Card>

              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {/* Header Section */}
            <header className="flex items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <nav className="grid gap-2 text-lg font-medium">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <span className="sr-only">Britway</span>
                    </Link>
                    <Link
                      href="/driver"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Drivers
                    </Link>
                    <Link
                      href="/booking"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Booking
                    </Link>
                  </nav>
                  <div className="mt-auto">
                    <Card x-chunk="dashboard-02-chunk-0">
                      <CardContent className="p-2 text-center">
                        <span>v 1.0.2</span>
                      </CardContent>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 p-4 lg:gap-6 lg:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
