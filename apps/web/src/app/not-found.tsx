import "./globals.css";

/** Fallback für Anfragen ausserhalb der Sprachrouten (z. B. unbekannte Dateien). */
export default function GlobalNotFound() {
  return (
    <html lang="de-CH">
      <body className="flex min-h-dvh items-center justify-center p-6">
        <main className="text-center">
          <h1 className="text-h1">404</h1>
          <p className="mt-2 text-text-2">
            <a href="/" className="text-link underline underline-offset-4">
              Pickeed
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
