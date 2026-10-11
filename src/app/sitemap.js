export default function sitemap() {
  const base = "https://globale-nine.vercel.app";
  const paths = ["", "/globale", "/idiomale", "/conflitale", "/bandeirale", "/sobre", "/independenciale", "/vizinhale", "/como-jogar"];

  return paths.map((p) => ({
    url: base + p,
    lastModified: new Date(),
  }));
}