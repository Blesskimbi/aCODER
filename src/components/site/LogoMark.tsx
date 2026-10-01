/** The A-Coder mark, flattened to line art for small sizes. */
export function LogoMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="acoder-mark" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.42" stopColor="#B9C2CB" />
          <stop offset="0.78" stopColor="#5A616A" />
          <stop offset="1" stopColor="#FF8A4C" />
        </linearGradient>
      </defs>
      <g stroke="url(#acoder-mark)" strokeLinecap="round" fill="none">
        <path d="M110 14 L204 178 L16 178 Z" strokeWidth="11" />
        <path
          d="M110 48 L178 166 L42 166 Z"
          strokeWidth="10"
          strokeDasharray="128 24"
          strokeDashoffset="18"
        />
        <path
          d="M110 82 L152 154 L68 154 Z"
          strokeWidth="9"
          strokeDasharray="78 20"
          strokeDashoffset="52"
        />
        <path d="M110 114 L128 143 L92 143 Z" strokeWidth="8" />
      </g>
    </svg>
  );
}
