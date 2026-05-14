import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";

export const metadata = {
  title: "The AI app builder for client-facing experiences",
  description:
    "Build apps that ship directly to your client portal, work with your existing contacts, and honor your team's permissions and brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
