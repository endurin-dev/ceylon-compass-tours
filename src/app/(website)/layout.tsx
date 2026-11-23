import { Header } from "@/components/website/header";
import { Footer } from "@/components/website/footer";
import { TelegramButton } from "@/components/website/telegram-button";
import { WhatsAppButton } from "@/components/website/whatsapp-button";

export const metadata = {
  title: "Ceylon Compass | Sri Lanka Tours",
  description: "Unforgettable journeys. Lifelong memories. Explore Sri Lanka with Ceylon Compass.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <TelegramButton />
      <WhatsAppButton />
    </>
  );
}