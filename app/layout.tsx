import type { Metadata } from "next";
import { Montserrat, Jost } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { BuyNowProvider } from "@/contexts/BuyNowContext";
import { ProductManageProvider } from "@/contexts/ProductManageContext";
import ClerkWrapper from "@/components/providers/ClerkWrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});
export const metadata: Metadata = {
  title: "Jewelry Shop",
  description:
    "Discover timeless jewelry crafted with elegance and care. From delicate everyday pieces to meaningful designs, our collection brings beauty, balance, and confidence to every moment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get Clerk publishable key from environment
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    console.error(
      "⚠️ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing! Please add it to .env file"
    );
  }

  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${jost.variable} antialiased`}>
        <ClerkProvider
          publishableKey={clerkPublishableKey || ""}
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90",
            },
          }}
          // Add domain if using custom domain (optional)
          {...(process.env.NEXT_PUBLIC_CLERK_DOMAIN && {
            domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
          })}
          // Add afterSignInUrl and afterSignUpUrl for better UX
          // Redirect đến callback route để check role và redirect tương ứng
          afterSignInUrl="/auth/callback"
          afterSignUpUrl="/auth/callback"
          afterSignOutUrl="/"
          // Type assertion để fix TypeScript error với Next.js 16
          {...({} as any)}
        >
          <ClerkWrapper>
            <ThemeProvider>
              <CartProvider>
                <BuyNowProvider>
                  <ProductManageProvider>{children}</ProductManageProvider>
                </BuyNowProvider>
              </CartProvider>
            </ThemeProvider>
          </ClerkWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
