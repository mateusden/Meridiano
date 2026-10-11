export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/*/api/" },
    sitemap: "https://globale-nine.vercel.app/sitemap.xml",
  };
}