"use client";

import { deleteAdminRecord, updateAdminRecord } from "@/actions/admin-record.actions";
import { DestinationPicker, type DestinationOption } from "@/components/admin/destination-picker";
import { ImageUrlField } from "@/components/admin/image-url-field";
import { TourItemPicker, type TourItemOption } from "@/components/admin/tour-item-picker";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";

export type AdminTableRow = Record<string, string>;

type FieldDefinition = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "select" | "destination-picker" | "tour-items" | "image";
  options?: string[];
  wide?: boolean;
  optional?: boolean;
};

const editableFields: Record<string, FieldDefinition[]> = {
  tours: [
    { key: "title", label: "Tour name" },
    { key: "slug", label: "URL slug" },
    { key: "shortDescription", label: "Short description", type: "textarea", wide: true },
    { key: "description", label: "Description", type: "textarea", wide: true },
    { key: "durationDays", label: "Duration in days", type: "number" },
    { key: "durationNights", label: "Duration in nights", type: "number" },
    { key: "durationLabel", label: "Display duration", optional: true },
    { key: "basePrice", label: "Starting price", type: "number" },
    { key: "currency", label: "Currency" },
    { key: "status", label: "Status", type: "select", options: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
    { key: "featured", label: "Featured", type: "select", options: ["false", "true"] },
    { key: "showPrice", label: "Show price publicly", type: "select", options: ["true", "false"] },
    { key: "coverImageUrl", label: "Cover image", type: "image", wide: true, optional: true },
    { key: "destinationIds", label: "Destinations and route order", type: "destination-picker", wide: true },
    { key: "experienceIds", label: "Attractions and activities", type: "tour-items", wide: true },
  ],
  destinations: [
    { key: "name", label: "Destination" },
    { key: "slug", label: "URL slug" },
    { key: "imageUrl", label: "Image", type: "image", wide: true, optional: true },
    { key: "description", label: "Description", type: "textarea", wide: true, optional: true },
  ],
  attractions: [
    { key: "name", label: "Attraction" },
    { key: "slug", label: "URL slug" },
    { key: "imageUrl", label: "Image", type: "image", wide: true, optional: true },
    { key: "description", label: "Description", type: "textarea", wide: true, optional: true },
  ],
  activities: [
    { key: "name", label: "Activity" },
    { key: "slug", label: "URL slug" },
    { key: "imageUrl", label: "Image", type: "image", wide: true, optional: true },
    { key: "description", label: "Description", type: "textarea", wide: true, optional: true },
  ],
  itineraries: [
    { key: "dayNumber", label: "Day number", type: "number" },
    { key: "title", label: "Day title" },
    { key: "overnightAt", label: "Overnight in", optional: true },
    { key: "accommodation", label: "Accommodation", optional: true },
    { key: "meals", label: "Meals (comma or line separated)", type: "textarea", wide: true, optional: true },
    { key: "description", label: "Description", type: "textarea", wide: true },
  ],
  departures: [
    { key: "startDate", label: "Start date", type: "date" },
    { key: "endDate", label: "End date", type: "date" },
    { key: "capacity", label: "Seat capacity", type: "number", optional: true },
    { key: "active", label: "Active", type: "select", options: ["true", "false"] },
  ],
  prices: [
    { key: "label", label: "Price option" },
    { key: "adultPrice", label: "Adult price", type: "number" },
    { key: "childPrice", label: "Child price", type: "number", optional: true },
    { key: "infantPrice", label: "Infant price", type: "number", optional: true },
    { key: "currency", label: "Currency" },
  ],
  bookings: [
    {
      key: "status",
      label: "Booking status",
      type: "select",
      options: ["PENDING", "REQUESTED", "AWAITING_PAYMENT", "PARTIALLY_PAID", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"],
    },
  ],
  customers: [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name", optional: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", optional: true },
    { key: "country", label: "Country", optional: true },
  ],
  enquiries: [
    { key: "status", label: "Enquiry status", type: "select", options: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] },
  ],
  reviews: [
    { key: "customerName", label: "Customer name" },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "title", label: "Title", optional: true },
    { key: "approved", label: "Approved", type: "select", options: ["false", "true"] },
    { key: "body", label: "Review", type: "textarea", wide: true },
  ],
  media: [
    { key: "altText", label: "Alternative text", optional: true },
    { key: "folder", label: "Folder", optional: true },
  ],
  settings: [
    { key: "key", label: "Setting key" },
    { key: "value", label: "Value (JSON or text)", type: "textarea", wide: true },
  ],
  "website-content": [
    { key: "key", label: "Setting key" },
    { key: "value", label: "Value (JSON or text)", type: "textarea", wide: true },
  ],
  team: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      type: "select",
      options: ["SUPER_ADMIN", "TOUR_MANAGER", "BOOKING_MANAGER", "FINANCE_MANAGER", "CONTENT_MANAGER", "SUPPORT"],
    },
    { key: "active", label: "Active", type: "select", options: ["true", "false"] },
  ],
};

const readOnlySections = new Set(["categories", "payments", "reports"]);

function getEditValues(row: AdminTableRow): Record<string, string> {
  try {
    return JSON.parse(row.__edit ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function isLongValue(value: string) {
  return value.length > 110;
}

export function DataTable({
  columns,
  rows,
  section,
  recordType = "default",
  emptyMessage = "No records found.",
}: {
  columns: { key: string; label: string }[];
  rows: AdminTableRow[];
  section: string;
  recordType?: string;
  emptyMessage?: string;
}) {
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState<AdminTableRow | null>(null);
  const [modalMode, setModalMode] = useState<"details" | "edit" | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const fields = useMemo(
    () => editableFields[recordType === "prices" ? "prices" : section] ?? [],
    [recordType, section],
  );
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      columns.some((column) => row[column.key]?.toLowerCase().includes(query)),
    );
  }, [columns, rows, search]);

  function openModal(row: AdminTableRow, mode: "details" | "edit") {
    setSelectedRow(row);
    setModalMode(mode);
    setMessage("");
  }

  function closeModal() {
    if (isPending) return;
    setSelectedRow(null);
    setModalMode(null);
    setMessage("");
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRow) return;
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
    );
    values.destinationIds = JSON.stringify(formData.getAll("destinationIds").map(String));
    values.attractionIds = JSON.stringify(formData.getAll("attractionIds").map(String));
    values.activityIds = JSON.stringify(formData.getAll("activityIds").map(String));

    startTransition(async () => {
      const result = await updateAdminRecord(section, selectedRow.id, recordType, values);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setSelectedRow(null);
      setModalMode(null);
      setMessage("");
      router.refresh();
    });
  }

  function removeRecord(row: AdminTableRow) {
    if (!window.confirm("Delete this record? This action cannot be undone.")) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteAdminRecord(section, row.id, recordType);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (rows.length === 0) {
    return (
      <div className="admin-panel admin-empty-state admin-table-wrap">
        {emptyMessage}
      </div>
    );
  }

  const canEdit = fields.length > 0 && !readOnlySections.has(section);
  const canDelete = !readOnlySections.has(section);

  return (
    <>
      <div className="admin-panel admin-table-wrap">
        <div className="admin-table-toolbar">
          <span className="admin-table-count">
            {filteredRows.length} {filteredRows.length === 1 ? "record" : "records"}
          </span>
          {readOnlySections.has(section) ? (
            <span className="admin-table-readonly">
              {section === "payments" ? "Protected financial records" : "Read-only report"}
            </span>
          ) : null}
          <label className="admin-table-search">
            <Search size={14} />
            <input
              aria-label="Search records"
              placeholder="Search records"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">{column.label}</th>
              ))}
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length ? filteredRows.map((row, index) => (
              <tr key={row.id || `${index}`}>
                {columns.map((column, columnIndex) => {
                  const value = row[column.key] || "—";
                  return (
                    <td key={column.key}>
                      {columnIndex === 0 ? (
                        <span className="admin-table-primary" title={value}>{value}</span>
                      ) : column.key === "status" || column.key === "active" || column.key === "approved" ? (
                        <span className={`admin-status-pill ${value.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                          {value}
                        </span>
                      ) : (
                        <span className={isLongValue(value) ? "admin-table-muted" : undefined} title={value}>
                          {value}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-button" type="button" onClick={() => openModal(row, "details")}>
                      <Eye size={13} /> View
                    </button>
                    {canEdit ? (
                      <button className="admin-action-button" type="button" onClick={() => openModal(row, "edit")}>
                        <Pencil size={13} /> Edit
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button
                        className="admin-action-button is-danger"
                        type="button"
                        disabled={isPending}
                        onClick={() => removeRecord(row)}
                        aria-label={`Delete ${row[columns[0]?.key] ?? "record"}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td className="admin-empty-inline" colSpan={columns.length + 1}>No records match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {message ? <p className="admin-form-error">{message}</p> : null}

      {selectedRow && modalMode ? (
        <div className="admin-modal-backdrop" onMouseDown={closeModal}>
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-record-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="admin-modal-header">
              <div>
                <h2 id="admin-record-modal-title">
                  {modalMode === "details" ? "Record details" : "Edit record"}
                </h2>
                <p>{selectedRow[columns[0]?.key] ?? "Admin record"}</p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeModal} aria-label="Close dialog">
                ×
              </button>
            </header>
            {modalMode === "details" ? (
              <div className="admin-modal-body">
                <dl className="admin-detail-list">
                  {[
                    ...columns.map((column) => ({
                      key: column.key,
                      label: column.label,
                      value: selectedRow[column.key] || "—",
                    })),
                    ...fields
                      .filter((field) =>
                        field.type !== "destination-picker" &&
                        field.type !== "tour-items" &&
                        !columns.some((column) => column.key === field.key),
                      )
                      .map((field) => ({
                        key: field.key,
                        label: field.label,
                        value: getEditValues(selectedRow)[field.key] || "—",
                      })),
                  ].map(({ key, label, value }) => (
                    <div className={`admin-detail-item${isLongValue(value) ? " is-wide" : ""}`} key={key}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                {readOnlySections.has(section) ? (
                  <p className="admin-readonly-note">
                    {section === "payments"
                      ? "Payment records are read-only to preserve financial audit history."
                      : section === "reports"
                        ? "Reports are calculated from the underlying records."
                        : "This section is not configured in the database yet."}
                  </p>
                ) : null}
              </div>
            ) : (
              <form className="admin-modal-body" onSubmit={saveRecord}>
                <div className="admin-editor-grid">
                  {fields.map((field) => {
                    const value = getEditValues(selectedRow)[field.key] ?? "";
                    return (
                      <div className={`admin-editor-field${field.wide ? " is-wide" : ""}`} key={field.key}>
                        {field.type === "image" ? null : (
                          <label htmlFor={`record-${field.key}`}>{field.label}</label>
                        )}
                        {field.type === "textarea" ? (
                          <textarea id={`record-${field.key}`} name={field.key} defaultValue={value} required={!field.optional} />
                        ) : field.type === "destination-picker" ? (
                          <DestinationPicker
                            key={`${selectedRow.id}-destinations`}
                            destinations={JSON.parse(getEditValues(selectedRow).destinationOptions ?? "[]") as DestinationOption[]}
                            name="destinationIds"
                            initialSelectedIds={JSON.parse(value || "[]") as string[]}
                          />
                        ) : field.type === "tour-items" ? (
                          <TourItemPicker key={`${selectedRow.id}-experiences`} groups={[
                            {
                              name: "attractionIds",
                              label: "Attractions",
                              items: JSON.parse(getEditValues(selectedRow).attractionOptions ?? "[]") as TourItemOption[],
                              initialSelectedIds: JSON.parse(getEditValues(selectedRow).attractionIds || "[]") as string[],
                            },
                            {
                              name: "activityIds",
                              label: "Activities",
                              items: JSON.parse(getEditValues(selectedRow).activityOptions ?? "[]") as TourItemOption[],
                              initialSelectedIds: JSON.parse(getEditValues(selectedRow).activityIds || "[]") as string[],
                            },
                          ]} />
                        ) : field.type === "image" ? (
                          <ImageUrlField
                            key={`${selectedRow.id}-${field.key}`}
                            id={`record-${field.key}`}
                            name={field.key}
                            label={field.label}
                            defaultValue={value}
                            folder={section === "tours" ? "tour-covers" : section}
                          />
                        ) : field.type === "select" ? (
                          <select id={`record-${field.key}`} name={field.key} defaultValue={value} required>
                            {field.options?.map((option) => (
                              <option value={option} key={option}>
                                {field.key === "showPrice"
                                  ? option === "true" ? "Show price" : "Hide price"
                                  : option.replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={`record-${field.key}`}
                            name={field.key}
                            type={field.type ?? "text"}
                            defaultValue={value}
                            required={!field.optional}
                            step={field.type === "number"
                              ? ["durationDays", "durationNights", "dayNumber", "capacity", "rating"].includes(field.key)
                                ? "1"
                                : "0.01"
                              : undefined}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="admin-modal-footer">
                  <button type="button" className="button button-secondary" onClick={closeModal} disabled={isPending}>Cancel</button>
                  <button type="submit" className="button button-primary" disabled={isPending}>
                    {isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
                {message ? <p className="admin-form-error">{message}</p> : null}
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
