import { ImageResponse } from "next/og";

// Icon used when iOS users "Add to Home Screen".
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 46,
            width: 70,
            height: 70,
            borderRadius: 9999,
            border: "14px solid white",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 113,
            left: 122,
            width: 16,
            height: 53,
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
