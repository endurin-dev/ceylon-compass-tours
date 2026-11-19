import Link from "next/link";
import { createExperienceAction } from "@/actions/experience.actions";
import { ImageUrlField } from "@/components/admin/image-url-field";

export function ExperienceForm({
  kind,
}: {
  kind: "attractions" | "activities";
}) {
  const label = kind === "attractions" ? "Attraction" : "Activity";

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-page-eyebrow">CATALOGUE</p>
          <h1>Add {label}</h1>
          <p>Add a reusable package {label.toLowerCase()} with its own image.</p>
        </div>
        <Link href={`/admin/${kind}`} className="button button-secondary">← {label}s</Link>
      </div>
      <form action={createExperienceAction} className="admin-panel" style={{ marginTop: 24, maxWidth: 900 }}>
        <input type="hidden" name="kind" value={kind} />
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">{label} name</label>
            <input id="name" name="name" required minLength={2} maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" required minLength={2} maxLength={140} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <ImageUrlField id="imageUrl" name="imageUrl" label="Image" folder={kind} />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={4} maxLength={5000} />
          </div>
        </div>
        <button className="button button-primary" style={{ marginTop: 20 }}>Save {label.toLowerCase()}</button>
      </form>
    </div>
  );
}
