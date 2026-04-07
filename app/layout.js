import "./globals.css";

export const metadata = {
  title: "Join the Waitlist — Assembly Vibe Apps",
  description:
    "Get early access to Vibe Apps by Assembly. Describe the app you need — AI builds it with your CRM, projects, payments, and client portal built in.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
