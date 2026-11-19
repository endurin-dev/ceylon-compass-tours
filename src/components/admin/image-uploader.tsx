"use client";

export function ImageUploader() {
  return <div className="admin-panel">
    <label style={{display:"block",fontWeight:700,marginBottom:8}}>Upload tour images</label>
    <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled />
    <p className="muted">Upload UI placeholder. Connect authenticated signed Cloudinary/S3 uploads before enabling.</p>
  </div>;
}
