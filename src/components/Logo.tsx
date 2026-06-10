/* eslint-disable @next/next/no-img-element */

/**
 * CVeed logo, using the real brand artwork in /public/brand.
 *  - <Logo />            → "Cveed" wordmark lockup (header / nav / footer)
 *  - <Logo variant="mark" />   → just the purple CV badge (square; icons)
 *  - <Logo variant="lockup" /> → full lockup incl. tagline (marketing)
 */
export function Logo({
  variant = "wordmark",
  height = 26,
  size = 30,
  className = "",
}: {
  variant?: "wordmark" | "mark" | "lockup";
  height?: number;
  size?: number;
  className?: string;
}) {
  if (variant === "mark") {
    return (
      <img
        src="/brand/cveed-mark.png"
        alt="CVeed"
        width={size}
        height={size}
        className={`rounded-[7px] ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === "lockup") {
    return <img src="/brand/cveed-logo.png" alt="CVeed — AI Talent Discovery" className={className} />;
  }

  return (
    <img
      src="/brand/cveed-wordmark.png"
      alt="CVeed"
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
