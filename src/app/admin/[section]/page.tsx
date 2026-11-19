import { DataTable, type AdminTableRow } from "@/components/admin/data-table";
import { MediaLibrary } from "@/components/admin/media-library";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type AdminColumn = { key: string; label: string };
type TableData = {
  title: string;
  description: string;
  columns: AdminColumn[];
  rows: AdminTableRow[];
  emptyMessage?: string;
  secondary?: {
    title: string;
    columns: AdminColumn[];
    rows: AdminTableRow[];
  };
};

function formatDate(date: Date | null) {
  return date ? date.toLocaleDateString("en", { dateStyle: "medium" }) : "";
}

function pretty(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return formatDate(value);
  if (Array.isArray(value)) return value.map(pretty).filter(Boolean).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const columns = (...items: AdminColumn[]) => items;

async function getSectionData(section: string): Promise<TableData | null> {
  switch (section) {
    case "destinations": {
      const destinations = await prisma.destination.findMany({
        include: { _count: { select: { tourDestinations: true } } },
        orderBy: { name: "asc" },
      });
      return {
        title: "Destinations",
        description: `${destinations.length} destinations in the database.`,
        columns: columns(
          { key: "name", label: "Destination" },
          { key: "slug", label: "Slug" },
          { key: "description", label: "Description" },
          { key: "photo", label: "Photo URL" },
          { key: "latitude", label: "Latitude" },
          { key: "longitude", label: "Longitude" },
          { key: "tours", label: "Tours" },
        ),
        rows: destinations.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description ?? "",
          photo: item.imageUrl ?? "",
          latitude: pretty(item.latitude),
          longitude: pretty(item.longitude),
          tours: pretty(item._count.tourDestinations),
          __edit: JSON.stringify({
            name: item.name,
            slug: item.slug,
            imageUrl: item.imageUrl ?? "",
            description: item.description ?? "",
          }),
        })),
      };
    }
    case "attractions": {
      const attractions = await prisma.attraction.findMany({
        include: { _count: { select: { tourAttractions: true } } },
        orderBy: { name: "asc" },
      });
      return {
        title: "Attractions",
        description: `${attractions.length} attractions in the catalogue.`,
        columns: columns(
          { key: "name", label: "Attraction" },
          { key: "slug", label: "Slug" },
          { key: "description", label: "Description" },
          { key: "photo", label: "Image URL" },
          { key: "tours", label: "Packages" },
        ),
        rows: attractions.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description ?? "",
          photo: item.imageUrl ?? "",
          tours: pretty(item._count.tourAttractions),
          __edit: JSON.stringify({
            name: item.name,
            slug: item.slug,
            imageUrl: item.imageUrl ?? "",
            description: item.description ?? "",
          }),
        })),
      };
    }
    case "activities": {
      const activities = await prisma.activity.findMany({
        include: { _count: { select: { tourActivities: true } } },
        orderBy: { name: "asc" },
      });
      return {
        title: "Activities",
        description: `${activities.length} activities in the catalogue.`,
        columns: columns(
          { key: "name", label: "Activity" },
          { key: "slug", label: "Slug" },
          { key: "description", label: "Description" },
          { key: "photo", label: "Image URL" },
          { key: "tours", label: "Packages" },
        ),
        rows: activities.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description ?? "",
          photo: item.imageUrl ?? "",
          tours: pretty(item._count.tourActivities),
          __edit: JSON.stringify({
            name: item.name,
            slug: item.slug,
            imageUrl: item.imageUrl ?? "",
            description: item.description ?? "",
          }),
        })),
      };
    }
    case "categories":
      return {
        title: "Categories",
        description: "Tour categories are not currently part of the database schema.",
        columns: columns({ key: "name", label: "Category" }),
        rows: [],
        emptyMessage:
          "No category table is configured. Add a Category model and connect it to tours to manage categories here.",
      };
    case "itineraries": {
      const days = await prisma.itineraryDay.findMany({
        include: {
          tour: { select: { title: true } },
          _count: { select: { activities: true } },
        },
        orderBy: [{ tour: { title: "asc" } }, { dayNumber: "asc" }],
      });
      return {
        title: "Itineraries",
        description: `${days.length} itinerary days across all tours.`,
        columns: columns(
          { key: "tour", label: "Tour" },
          { key: "day", label: "Day" },
          { key: "title", label: "Day title" },
          { key: "overnight", label: "Overnight in" },
          { key: "meals", label: "Meals" },
          { key: "activities", label: "Activities" },
        ),
        rows: days.map((item) => ({
          id: item.id,
          tour: item.tour.title,
          day: pretty(item.dayNumber),
          title: item.title,
          overnight: item.overnightAt ?? "",
          meals: item.meals.join(", "),
          activities: pretty(item._count.activities),
          __edit: JSON.stringify({
            dayNumber: String(item.dayNumber),
            title: item.title,
            description: item.description,
            overnightAt: item.overnightAt ?? "",
            accommodation: item.accommodation ?? "",
            meals: item.meals.join(", "),
          }),
        })),
      };
    }
    case "departures": {
      const departures = await prisma.tourDeparture.findMany({
        include: { tour: { select: { title: true } } },
        orderBy: { startDate: "asc" },
      });
      const prices = await prisma.tourPrice.findMany({
        include: { tour: { select: { title: true } } },
        orderBy: [{ tour: { title: "asc" } }, { adultPrice: "asc" }],
      });
      return {
        title: "Departures & Pricing",
        description: `${departures.length} departures and ${prices.length} tour prices.`,
        columns: columns(
          { key: "tour", label: "Tour" },
          { key: "start", label: "Start date" },
          { key: "end", label: "End date" },
          { key: "seats", label: "Seats booked / capacity" },
          { key: "active", label: "Active" },
        ),
        rows: departures.map((item) => ({
          id: item.id,
          tour: item.tour.title,
          start: formatDate(item.startDate),
          end: formatDate(item.endDate),
          seats: `${item.bookedSeats} / ${item.capacity ?? "—"}`,
          active: item.active ? "Yes" : "No",
          __edit: JSON.stringify({
            startDate: item.startDate.toISOString().slice(0, 10),
            endDate: item.endDate.toISOString().slice(0, 10),
            capacity: item.capacity == null ? "" : String(item.capacity),
            active: String(item.active),
          }),
        })),
        emptyMessage: "No tour departures found.",
        secondary: {
          title: "Tour prices",
          columns: columns(
            { key: "tour", label: "Tour" },
            { key: "label", label: "Price option" },
            { key: "adult", label: "Adult" },
            { key: "child", label: "Child" },
            { key: "currency", label: "Currency" },
          ),
          rows: prices.map((item) => ({
            id: item.id,
            tour: item.tour.title,
            label: item.label,
            adult: pretty(item.adultPrice),
            child: pretty(item.childPrice),
            currency: item.currency,
            __edit: JSON.stringify({
              label: item.label,
              adultPrice: item.adultPrice.toString(),
              childPrice: item.childPrice?.toString() ?? "",
              infantPrice: item.infantPrice?.toString() ?? "",
              currency: item.currency,
            }),
          })),
        },
      };
    }
    case "bookings": {
      const bookings = await prisma.booking.findMany({
        include: {
          tour: { select: { title: true } },
          customer: { select: { firstName: true, lastName: true, email: true } },
          travellers: { select: { firstName: true, lastName: true, travellerType: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return {
        title: "Bookings",
        description: `${bookings.length} bookings in the database.`,
        columns: columns(
          { key: "reference", label: "Reference" },
          { key: "customer", label: "Customer" },
          { key: "email", label: "Email" },
          { key: "tour", label: "Tour" },
          { key: "travel", label: "Travel dates" },
          { key: "travellers", label: "Travellers" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
          { key: "payment", label: "Payment" },
        ),
        rows: bookings.map((item) => ({
          id: item.id,
          reference: item.reference,
          customer: `${item.customer.firstName} ${item.customer.lastName}`,
          email: item.customer.email,
          tour: item.tourTitleSnapshot,
          travel: `${formatDate(item.travelStartDate)} – ${formatDate(item.travelEndDate)}`,
          travellers: item.travellers
            .map((person) => `${person.firstName} ${person.lastName} (${person.travellerType.toLowerCase()})`)
            .join(", "),
          total: `${item.currency} ${pretty(item.totalAmount)}`,
          status: item.status,
          payment: item.paymentStatus,
          __edit: JSON.stringify({ status: item.status }),
        })),
      };
    }
    case "customers": {
      const customers = await prisma.customer.findMany({
        include: { _count: { select: { bookings: true } } },
        orderBy: { createdAt: "desc" },
      });
      return {
        title: "Customers",
        description: `${customers.length} customers in the database.`,
        columns: columns(
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "country", label: "Country" },
          { key: "bookings", label: "Bookings" },
        ),
        rows: customers.map((item) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
          email: item.email,
          phone: item.phone ?? "",
          country: item.country ?? "",
          bookings: pretty(item._count.bookings),
          __edit: JSON.stringify({
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            phone: item.phone ?? "",
            country: item.country ?? "",
          }),
        })),
      };
    }
    case "payments": {
      const payments = await prisma.bookingPayment.findMany({
        include: {
          booking: {
            select: {
              reference: true,
              customer: { select: { firstName: true, lastName: true } },
              tour: { select: { title: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return {
        title: "Payments",
        description: `${payments.length} payment records in the database.`,
        columns: columns(
          { key: "reference", label: "Booking" },
          { key: "customer", label: "Customer" },
          { key: "tour", label: "Tour" },
          { key: "amount", label: "Amount" },
          { key: "method", label: "Method" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
          { key: "provider", label: "Provider" },
        ),
        rows: payments.map((item) => ({
          id: item.id,
          reference: item.booking.reference,
          customer: `${item.booking.customer.firstName} ${item.booking.customer.lastName}`,
          tour: item.booking.tour.title,
          amount: `${item.currency} ${pretty(item.amount)}`,
          method: item.method,
          status: item.status,
          date: formatDate(item.paidAt ?? item.createdAt),
          provider: item.provider ?? "",
        })),
      };
    }
    case "enquiries": {
      const enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
      return {
        title: "Enquiries",
        description: `${enquiries.length} enquiries in the database.`,
        columns: columns(
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "country", label: "Country" },
          { key: "message", label: "Message" },
          { key: "status", label: "Status" },
          { key: "date", label: "Received" },
        ),
        rows: enquiries.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone ?? "",
          country: item.country ?? "",
          message: item.message,
          status: item.status,
          date: formatDate(item.createdAt),
          __edit: JSON.stringify({ status: item.status }),
        })),
      };
    }
    case "reviews": {
      const reviews = await prisma.review.findMany({
        include: { tour: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
      });
      return {
        title: "Reviews",
        description: `${reviews.length} reviews in the database.`,
        columns: columns(
          { key: "customer", label: "Customer" },
          { key: "tour", label: "Tour" },
          { key: "rating", label: "Rating" },
          { key: "title", label: "Title" },
          { key: "body", label: "Review" },
          { key: "approved", label: "Approved" },
        ),
        rows: reviews.map((item) => ({
          id: item.id,
          customer: item.customerName,
          tour: item.tour.title,
          rating: `${item.rating} / 5`,
          title: item.title ?? "",
          body: item.body,
          approved: item.approved ? "Yes" : "No",
          __edit: JSON.stringify({
            customerName: item.customerName,
            rating: String(item.rating),
            title: item.title ?? "",
            body: item.body,
            approved: String(item.approved),
          }),
        })),
      };
    }
    case "media": {
      const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
      return {
        title: "Media Library",
        description: `${media.length} media records in the database.`,
        columns: columns(
          { key: "filename", label: "File" },
          { key: "mime", label: "Type" },
          { key: "size", label: "Size" },
          { key: "folder", label: "Folder" },
          { key: "alt", label: "Description" },
          { key: "url", label: "URL" },
        ),
        rows: media.map((item) => ({
          id: item.id,
          filename: item.filename,
          mime: item.mimeType,
          size: `${Math.round(item.sizeBytes / 1024)} KB`,
          folder: item.folder ?? "",
          alt: item.altText ?? "",
          url: item.url,
          __edit: JSON.stringify({
            altText: item.altText ?? "",
            folder: item.folder ?? "",
          }),
        })),
      };
    }
    case "website-content":
    case "settings": {
      const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
      return {
        title: section === "settings" ? "Settings" : "Website Content",
        description: `${settings.length} site settings in the database.`,
        columns: columns(
          { key: "key", label: "Setting" },
          { key: "value", label: "Value" },
          { key: "updated", label: "Last updated" },
        ),
        rows: settings.map((item) => ({
          id: item.id,
          key: item.key,
          value: pretty(item.value),
          updated: formatDate(item.updatedAt),
          __edit: JSON.stringify({
            key: item.key,
            value: JSON.stringify(item.value, null, 2),
          }),
        })),
      };
    }
    case "team": {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        title: "Team",
        description: `${users.length} team accounts in the database.`,
        columns: columns(
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "active", label: "Active" },
          { key: "created", label: "Created" },
        ),
        rows: users.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role,
          active: item.active ? "Yes" : "No",
          created: formatDate(item.createdAt),
          __edit: JSON.stringify({
            name: item.name,
            email: item.email,
            role: item.role,
            active: String(item.active),
          }),
        })),
      };
    }
    case "reports": {
      const [
        tourCount,
        destinationCount,
        bookingCount,
        confirmedBookingCount,
        customerCount,
        enquiryCount,
        reviewCount,
      ] = await Promise.all([
        prisma.tour.count(),
        prisma.destination.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "CONFIRMED" } }),
        prisma.customer.count(),
        prisma.enquiry.count(),
        prisma.review.count(),
      ]);
      const metrics = [
        ["Tours", tourCount],
        ["Destinations", destinationCount],
        ["Bookings", bookingCount],
        ["Confirmed bookings", confirmedBookingCount],
        ["Customers", customerCount],
        ["Enquiries", enquiryCount],
        ["Reviews", reviewCount],
      ];
      return {
        title: "Reports",
        description: "Current record totals from the database.",
        columns: columns(
          { key: "metric", label: "Metric" },
          { key: "total", label: "Total" },
        ),
        rows: metrics.map(([metric, total]) => ({
          id: pretty(metric),
          metric: pretty(metric),
          total: pretty(total),
        })),
      };
    }
    default:
      return null;
  }
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (section === "media") {
    const [items, tours] = await Promise.all([
      prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.tour.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
    ]);
    const tourImages = await prisma.tourImage.findMany({
      where: { url: { in: items.map((item) => item.url) } },
      select: {
        id: true,
        url: true,
        tourId: true,
        tour: { select: { title: true, slug: true } },
      },
    });

    return (
      <div>
        <div className="admin-page-heading">
          <div>
            <p className="admin-page-eyebrow">ASSETS</p>
            <h1>Media Library</h1>
            <p>Upload images, organize them, and add them to tour package galleries.</p>
          </div>
        </div>
        <MediaLibrary
          items={items.map((item) => ({
            ...item,
            tourImages: tourImages
              .filter((image) => image.url === item.url)
              .map((image) => ({
                id: image.id,
                tourId: image.tourId,
                title: image.tour.title,
                slug: image.tour.slug,
              })),
          }))}
          tours={tours}
        />
      </div>
    );
  }

  const data = await getSectionData(section);
  if (!data) {
    return (
      <div className="admin-panel">
        <h1 style={{ color: "var(--navy)" }}>Admin section not found</h1>
        <p className="muted">This section does not have a database view configured.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-page-eyebrow">MANAGEMENT</p>
          <h1 style={{ color: "var(--navy)" }}>{data.title}</h1>
          <p className="muted">{data.description}</p>
        </div>
        {section === "destinations" && (
          <Link href="/admin/destinations/new" className="button button-primary">
            + Add Destination
          </Link>
        )}
        {section === "attractions" && (
          <Link href="/admin/attractions/new" className="button button-primary">
            + Add Attraction
          </Link>
        )}
        {section === "activities" && (
          <Link href="/admin/activities/new" className="button button-primary">
            + Add Activity
          </Link>
        )}
      </div>
      <DataTable
        columns={data.columns}
        rows={data.rows}
        section={section}
        emptyMessage={data.emptyMessage}
      />
      {data.secondary && (
        <>
          <h2 className="admin-secondary-heading">
            {data.secondary.title}
          </h2>
          <DataTable
            columns={data.secondary.columns}
            rows={data.secondary.rows}
            section={section}
            recordType="prices"
            emptyMessage={`No ${data.secondary.title.toLowerCase()} found.`}
          />
        </>
      )}
    </div>
  );
}
