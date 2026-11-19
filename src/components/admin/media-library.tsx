"use client";

import { attachMediaToTour, deleteMediaItem, removeTourImage } from "@/actions/media.actions";
import { updateAdminRecord } from "@/actions/admin-record.actions";
import { ImagePlus, Link2, LoaderCircle, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export type MediaLibraryItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string | null;
  folder: string | null;
  tourImages: { id: string; tourId: string; title: string; slug: string }[];
};

type TourOption = { id: string; title: string };

export function MediaLibrary({
  items,
  tours,
}: {
  items: MediaLibraryItem[];
  tours: TourOption[];
}) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [search, setSearch] = useState("");
  const visibleItems = items.filter((item) =>
    `${item.filename} ${item.altText ?? ""} ${item.folder ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(event.target.files ?? []));
    setUploadMessage("");
  }

  async function uploadFiles() {
    if (!selectedFiles.length) return;
    setUploading(true);
    setUploadMessage("");
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await response.json() as { files?: MediaLibraryItem[]; error?: string };
      if (!response.ok) {
        setUploadMessage(result.error ?? "Image upload failed. Try again.");
        return;
      }
      setSelectedFiles([]);
      setUploadMessage(`${result.files?.length ?? 0} image(s) added to the library.`);
      router.refresh();
    } catch {
      setUploadMessage("Could not reach the server. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="media-library">
      <section className="admin-panel media-upload-panel">
        <div className="media-upload-copy">
          <span className="media-upload-icon"><ImagePlus size={20} /></span>
          <div>
            <h2>Add images to your library</h2>
            <p>Upload JPEG, PNG or WebP images. Maximum 8 MB per image, up to 12 at a time.</p>
          </div>
        </div>
        <div className="media-upload-controls">
          <label className="button button-secondary media-file-picker">
            <Upload size={15} />
            Choose images
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseFiles} />
          </label>
          <button type="button" className="button button-primary" disabled={!selectedFiles.length || uploading} onClick={uploadFiles}>
            {uploading ? <LoaderCircle size={15} className="media-spinner" /> : <Upload size={15} />}
            {uploading ? "Uploading..." : `Upload${selectedFiles.length ? ` ${selectedFiles.length}` : ""}`}
          </button>
        </div>
        {selectedFiles.length ? (
          <div className="media-selected-files">
            {selectedFiles.map((file) => <span key={`${file.name}-${file.lastModified}`}>{file.name}</span>)}
            <button type="button" aria-label="Clear selected images" onClick={() => setSelectedFiles([])}><X size={14} /></button>
          </div>
        ) : null}
        {uploadMessage ? <p className="media-feedback" role="status">{uploadMessage}</p> : null}
      </section>

      <div className="media-library-toolbar">
        <strong>{items.length} {items.length === 1 ? "image" : "images"}</strong>
        <input
          type="search"
          value={search}
          placeholder="Search images..."
          aria-label="Search media"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {visibleItems.length ? (
        <div className="media-grid">
          {visibleItems.map((item) => (
            <MediaCard item={item} tours={tours} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="admin-panel media-empty">
          <ImagePlus size={26} />
          <strong>{search ? "No images match your search" : "Your media library is empty"}</strong>
          <span>{search ? "Try a different search term." : "Choose images above to start building tour galleries."}</span>
        </div>
      )}
    </div>
  );
}

function MediaCard({ item, tours }: { item: MediaLibraryItem; tours: TourOption[] }) {
  const router = useRouter();
  const [altText, setAltText] = useState(item.altText ?? "");
  const [folder, setFolder] = useState(item.folder ?? "");
  const [tourId, setTourId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveMetadata() {
    setBusy(true);
    setMessage("");
    try {
      const result = await updateAdminRecord("media", item.id, "default", { altText, folder });
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setMessage("Image details saved.");
      router.refresh();
    } catch {
      setMessage("Could not save image details. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function addToTour() {
    if (!tourId) {
      setMessage("Choose a tour package first.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await attachMediaToTour(item.id, tourId);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setTourId("");
      setMessage("Added to the tour gallery.");
      router.refresh();
    } catch {
      setMessage("Could not add this image to the tour. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function detachFromTour(imageId: string) {
    if (!window.confirm("Remove this image from the tour gallery?")) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await removeTourImage(imageId);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setMessage("Removed from the tour gallery.");
      router.refresh();
    } catch {
      setMessage("Could not remove the image from the tour. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteImage() {
    if (!window.confirm("Delete this image from the media library?")) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await deleteMediaItem(item.id);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    } catch {
      setMessage("Could not delete the image. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="admin-panel media-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="media-card-image" src={item.url} alt={item.altText ?? item.filename} loading="lazy" />
      <div className="media-card-body">
        <div className="media-card-title" title={item.filename}>{item.filename}</div>
        <div className="media-card-meta">{item.mimeType} · {(item.sizeBytes / 1024 / 1024).toFixed(1)} MB</div>

        <label className="media-field">
          <span>Alt text</span>
          <input value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={300} />
        </label>
        <label className="media-field">
          <span>Folder</span>
          <input value={folder} onChange={(event) => setFolder(event.target.value)} maxLength={160} />
        </label>
        <button type="button" className="media-save-button" disabled={busy} onClick={saveMetadata}>Save image details</button>

        <div className="media-usage">
          <strong><Link2 size={13} /> Used in {item.tourImages.length} tour{item.tourImages.length === 1 ? "" : "s"}</strong>
          {item.tourImages.map((usage) => (
            <div className="media-tour-usage" key={usage.id}>
              <a href={`/tour-packages/${usage.slug}`} target="_blank" rel="noreferrer">{usage.title}</a>
              <button type="button" disabled={busy} onClick={() => detachFromTour(usage.id)} aria-label={`Remove from ${usage.title}`}>Remove</button>
            </div>
          ))}
        </div>

        <div className="media-attach-control">
          <select aria-label={`Choose a tour for ${item.filename}`} value={tourId} onChange={(event) => setTourId(event.target.value)}>
            <option value="">Add to a tour...</option>
            {tours.map((tour) => <option key={tour.id} value={tour.id}>{tour.title}</option>)}
          </select>
          <button type="button" disabled={busy || !tourId} onClick={addToTour}>Add</button>
        </div>
        <button type="button" className="media-delete-button" disabled={busy} onClick={deleteImage}>
          <Trash2 size={13} /> Delete image
        </button>
        {message ? <p className="media-card-message" role="status">{message}</p> : null}
      </div>
    </article>
  );
}
