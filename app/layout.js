import "./globals.css";

export const metadata = {
  title: "Assembly Studio — The platform layer for AI-native service firms",
  description:
    "Assembly Studio is the AI app layer on the Assembly platform. Describe your firm, ship client-facing apps with auth, CRM, billing and a portal already included. Request early access to the beta.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
