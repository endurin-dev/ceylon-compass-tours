import { MessageCircle } from "lucide-react";
import { contactDetails } from "@/lib/contact";
import styles from "./whatsapp-button.module.css";

export function WhatsAppButton() {
  const phone = contactDetails.sriLankaPhones[0].href.replace(/\D/g, "");

  return (
    <a
      className={styles.button}
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ceylon Compass on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" />
    </a>
  );
}
