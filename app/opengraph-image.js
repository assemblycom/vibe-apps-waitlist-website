import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const alt = "Assembly Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoPath = path.join(process.cwd(), "public/logos/web-logo.svg");
  const logoBuffer = await fs.readFile(logoPath);
  const logoSrc = `data:image/svg+xml;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        <img src={logoSrc} width={700} height={100} alt="Assembly Studio" />
      </div>
    ),
    { ...size },
  );
}
