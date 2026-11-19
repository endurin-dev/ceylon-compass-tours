# Payments module implementation checklist

No real payment gateway is connected in this starter.

Implement a provider adapter with:
- Server-side payment intent/session creation
- Currency and amount validation against the booking record
- Signed webhook verification
- Idempotent event processing
- Reconciliation and failed-payment handling
- Refund support and audit records

Never expose secret keys to the browser or treat a redirect query parameter as proof of payment.
