import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight, FileEdit, Map, Plus, Star } from "lucide-react";
import { DataTable, type AdminTableRow } from "@/components/admin/data-table";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";

export default async function ToursAdminPage() {
  const [tours, destinations, attractions, activities] = await Promise.all([
    prisma.tour.findMany({
      include: {
        tourDestinations: {
          include: { destination: { select: { id: true, name: true, slug: true, imageUrl: true } } },
          orderBy: { sortOrder: "asc" },
        },
        tourAttractions: {
          include: { attraction: { select: { id: true, name: true } } },
          orderBy: { sortOrder: "asc" },
        },
        tourActivities: {
          include: { activity: { select: { id: true, name: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.destination.findMany({
      select: { id: true, name: true, slug: true, imageUrl: true },
      orderBy: { name: "asc" },
    }),
    prisma.attraction.findMany({ select: { id: true, name: true, imageUrl: true }, orderBy: { name: "asc" } }),
    prisma.activity.findMany({ select: { id: true, name: true, imageUrl: true }, orderBy: { name: "asc" } }),
  ]);

  const destinationOptions = JSON.stringify(destinations);
  const attractionOptions = JSON.stringify(attractions);
  const activityOptions = JSON.stringify(activities);

  const rows: AdminTableRow[] = tours.map((tour) => ({
    id: tour.id,
    title: tour.title,
    destinations: tour.tourDestinations.map(({ destination }) => destination.name).join(", "),
    attractions: tour.tourAttractions.map(({ attraction }) => attraction.name).join(", "),
    activities: tour.tourActivities.map(({ activity }) => activity.name).join(", "),
    duration: tour.durationLabel ?? `${tour.durationDays} days / ${tour.durationNights} nights`,
    price: `${tour.currency} ${tour.basePrice.toString()}`,
    priceVisibility: tour.showPrice ? "Shown" : "Hidden",
    status: tour.status,
    featured: tour.featured ? "Yes" : "No",
    __edit: JSON.stringify({
      title: tour.title,
      slug: tour.slug,
      shortDescription: tour.shortDescription,
      description: tour.description,
      durationDays: String(tour.durationDays),
      durationNights: String(tour.durationNights),
      durationLabel: tour.durationLabel ?? "",
      basePrice: tour.basePrice.toString(),
      currency: tour.currency,
      status: tour.status,
      featured: String(tour.featured),
      showPrice: String(tour.showPrice),
      coverImageUrl: tour.coverImageUrl ?? "",
      destinationIds: JSON.stringify(tour.tourDestinations.map(({ destination }) => destination.id)),
      destinationOptions,
      attractionIds: JSON.stringify(tour.tourAttractions.map(({ attraction }) => attraction.id)),
      activityIds: JSON.stringify(tour.tourActivities.map(({ activity }) => activity.id)),
      attractionOptions,
      activityOptions,
    }),
  }));

  const columns = [
    { key: "title", label: "Tour" },
    { key: "destinations", label: "Destinations" },
    { key: "attractions", label: "Attractions" },
    { key: "activities", label: "Activities" },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Starting price" },
    { key: "priceVisibility", label: "Public price" },
    { key: "status", label: "Status" },
    { key: "featured", label: "Featured" },
  ];

  const published = tours.filter((t) => t.status === "PUBLISHED").length;
  const drafts = tours.filter((t) => t.status === "DRAFT").length;
  const featured = tours.filter((t) => t.featured).length;
  const placeholderPrices = tours.filter((t) => Number(t.basePrice) === 1).length;

  const stats = [
    { label: "Total tours", value: tours.length, Icon: Map, tone: "" },
    { label: "Published", value: published, Icon: CheckCircle2, tone: "ok" },
    { label: "Drafts", value: drafts, Icon: FileEdit, tone: "warn" },
    { label: "Featured", value: featured, Icon: Star, tone: "star" },
  ];

  return (
    <div className="ta">
      <div className="ta-head">
        <div>
          <div className="ta-crumb">
            <span>Catalogue</span>
            <ChevronRight size={12} />
            <span>Tours</span>
          </div>
          <h1>Tour Packages</h1>
          <p className="ta-muted">Create, edit and publish the packages shown on your website.</p>
        </div>
        <Link href="/admin/tours/new" className="ta-btn ta-btn-primary">
          <Plus size={16} /> Add new tour
        </Link>
      </div>

      <div className="ta-stats">
        {stats.map(({ label, value, Icon, tone }) => (
          <div className="ta-stat" key={label}>
            <div className={`ta-stat-icon ${tone}`}>
              <Icon size={20} />
            </div>
            <div>
              <b>{value}</b>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>

      {placeholderPrices > 0 && (
        <div className="ta-alert">
          <AlertTriangle size={18} />
          <span>
            <b>{placeholderPrices} tour{placeholderPrices > 1 ? "s" : ""}</b> still use the USD 1.00 placeholder
            price. Set real prices before publishing.
          </span>
        </div>
      )}

      <div className="ta-card ta-table-card">
        <DataTable columns={columns} rows={rows} section="tours" />
      </div>
    </div>
  );
}