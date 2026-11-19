import Link from "next/link";
import { createDestinationAction } from "@/actions/destination.actions";
import { ImageUrlField } from "@/components/admin/image-url-field";

export default function NewDestinationPage() {
  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-page-eyebrow">CATALOGUE</p>
          <h1>Add Destination</h1>
          <p>Add a destination name, a short description, and a photo uploaded from your device.</p>
        </div>
        <Link href="/admin/destinations" className="button button-secondary">
          ← Destinations
        </Link>
      </div>
      <form
        action={createDestinationAction}
        className="admin-panel"
        style={{ marginTop: 24, maxWidth: 900 }}
      >
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Destination name</label>
            <input id="name" name="name" required minLength={2} maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor="slug">URL slug</label>
            <input
              id="slug"
              name="slug"
              required
              minLength={2}
              maxLength={140}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="nuwara-eliya"
            />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <ImageUrlField id="imageUrl" name="imageUrl" label="Destination image" folder="destinations" />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              minLength={10}
              maxLength={2000}
            />
          </div>
        </div>
        <button className="button button-primary" style={{ marginTop: 20 }}>
          Save destination
        </button>
      </form>
    </div>
  );
}
