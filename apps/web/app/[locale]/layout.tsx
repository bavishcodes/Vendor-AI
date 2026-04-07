import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "@/context/AuthContext";
import { StockRequestProvider } from "@/context/StockRequestContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { VendorProvider } from "@/context/VendorContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AuthProvider>
          <VendorProvider>
            <InventoryProvider>
              <StockRequestProvider>{children}</StockRequestProvider>
            </InventoryProvider>
          </VendorProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
