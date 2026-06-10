/**
 * CVeed logo — a magnifying glass (talent discovery) in the brand color.
 * Use <Logo /> for the icon mark, or <Logo withWordmark /> for icon + "CVeed".
 */
export function Logo({
  withWordmark = false,
  className = "",
  size = 28,
}: {
  withWordmark?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="url(#cveed-g)" />
        <circle cx="14" cy="14" r="6" stroke="white" strokeWidth="2.5" />
        <line x1="18.7" y1="18.7" x2="23" y2="23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="cveed-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
      </svg>
      {withWordmark && <span className="text-lg font-bold tracking-tight text-slate-900">CVeed</span>}
    </span>
  );
}
