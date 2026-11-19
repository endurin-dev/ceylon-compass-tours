# Media module implementation checklist

Use Cloudinary or S3-compatible storage for image binaries. Store URL, storage key/public ID, dimensions, MIME type, file size, alt text and folder in the `Media` table.

Implement:
- Authenticated upload authorization
- File type and size validation
- Signed direct uploads
- Image optimization and responsive variants
- Reuse media across tours
- Safe deletion that checks references before deleting the remote object
