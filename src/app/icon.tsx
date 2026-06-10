import { ImageResponse } from "next/og";

// App icon (favicon + PWA icon), generated at build time. A magnifying glass
// in the brand gradient — "talent discovery".
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
          borderRadius: 112,
        }}
      >
        {/* lens */}
        <div
          style={{
            position: "absolute",
            top: 132,
            left: 132,
            width: 196,
            height: 196,
            borderRadius: 9999,
            border: "40px solid white",
          }}
        />
        {/* handle */}
        <div
          style={{
            position: "absolute",
            top: 322,
            left: 348,
            width: 46,
            height: 150,
            background: "white",
            borderRadius: 9999,
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
