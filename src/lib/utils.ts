export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatMoney(amount: number, currency = "USD", locale = "en") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}
