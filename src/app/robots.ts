
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/dashboard/",
        "/login/",
        "/admin-login/",
      ],
    },
    sitemap: "https://www.ceyloncompass.com/sitemap.xml",
  };
}
