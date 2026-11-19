import { Send } from "lucide-react";
import { contactDetails } from "@/lib/contact";
import styles from "./whatsapp-button.module.css";

export function TelegramButton() {
  const phone = contactDetails.francePhone.href.replace(/\D/g, "");

  return (
    <a
      className={styles.telegramButton}
      href={`https://t.me/+${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Superstar Travel on Telegram"
      title="Chat with us on Telegram"
    >
      <Send size={16} strokeWidth={2.2} aria-hidden="true" />
    </a>
  );
}
