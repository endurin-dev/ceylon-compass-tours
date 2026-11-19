# Booking module implementation checklist

- Recalculate all prices on the server; never trust browser-submitted totals.
- Create the booking and traveller rows in one Prisma transaction.
- Persist tour title, route, selected dates and itemized price snapshot.
- Reserve departure capacity atomically to prevent overbooking.
- Keep booking state separate from payment state.
- For payment providers, verify signed webhooks server-side and make webhook handling idempotent.
- Generate a human-readable, unique booking reference.
- Add cancellation, refund and booking status audit history.
