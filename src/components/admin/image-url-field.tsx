"use client";

import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

export function ImageUrlField({
  id,
  name,
  label,
  defaultValue = "",
  folder,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  folder: string;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(
    defaultValue.startsWith("/uploads/") ? defaultValue : "",
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", folder);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await response.json() as { files?: { url: string }[]; error?: string };
      if (!response.ok) {
        setMessage(result.error ?? "Image upload failed. Try again.");
        return;
      }
      const url = result.files?.[0]?.url;
      if (!url) {
        setMessage("The upload completed without an image URL.");
        return;
      }
      setImageUrl(url);
      setMessage("Image uploaded.");
    } catch {
      setMessage("Could not reach the server. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="image-url-field">
      <label htmlFor={`${id}-file`}>{label}</label>
      <input id={id} name={name} type="hidden" value={imageUrl} />
      <div className="image-url-controls">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
        >
          {uploading ? <LoaderCircle size={15} className="media-spinner" /> : <Upload size={15} />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {imageUrl ? (
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setImageUrl("");
              setMessage("Image removed.");
            }}
            disabled={uploading}
          >
            <X size={15} />
            Remove image
          </button>
        ) : null}
        <input
          id={`${id}-file`}
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={uploadImage}
          hidden
        />
      </div>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="image-url-preview" src={imageUrl} alt="Selected image preview" />
      ) : (
        <span className="image-url-help"><ImagePlus size={14} /> Upload a JPEG, PNG or WebP image from your device (max 8 MB).</span>
      )}
      {message ? <span className="image-url-help" role="status">{message}</span> : null}
    </div>
  );
}
