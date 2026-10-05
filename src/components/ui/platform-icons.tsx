import React from "react";

export function AppleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.06-.52 2.68-1.26z" />
    </svg>
  );
}

export function WindowsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 5.479l7.377-1.016v7.127H3V5.48zm0 13.042l7.377 1.018v-7.04H3v6.022zm8.342 1.151L21 21V11.59h-9.658v8.082zM21 3l-9.658 1.332v7.258H21V3z" />
    </svg>
  );
}

export function LinuxIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.012 2.25c-3.084 0-5.25 2.502-5.25 5.568 0 1.26.368 2.454.984 3.444-.316.592-.588 1.272-.796 2.028-.868.516-1.572 1.284-1.992 2.22-.384.852-.468 1.8-.252 2.688.3 1.248 1.224 2.196 2.436 2.52 1.116.3 2.268-.024 3.096-.756.54.18 1.128.276 1.764.276.636 0 1.224-.096 1.764-.276.828.732 1.98 1.056 3.096.756 1.212-.324 2.136-1.272 2.436-2.52.216-.888.132-1.836-.252-2.688-.42-.936-1.124-1.704-1.992-2.22-.208-.756-.48-1.436-.796-2.028.616-.99.984-2.184.984-3.444 0-3.066-2.166-5.568-5.25-5.568zm-1.8 4.2c.498 0 .9.402.9.9 0 .498-.402.9-.9.9-.498 0-.9-.402-.9-.9 0-.498.402-.9.9-.9zm3.6 0c.498 0 .9.402.9.9 0 .498-.402.9-.9.9-.498 0-.9-.402-.9-.9 0-.498.402-.9.9-.9zm-1.8 2.4c.996 0 1.8.36 1.8.804 0 .444-.804.804-1.8.804-.996 0-1.8-.36-1.8-.804 0-.444.804-.804 1.8-.804z" />
    </svg>
  );
}

export function PlatformIcon({
  os,
  className = "h-4 w-4",
}: {
  os: "mac" | "windows" | "linux" | "unknown" | string | null;
  className?: string;
}) {
  switch (os) {
    case "mac":
      return <AppleIcon className={className} />;
    case "windows":
      return <WindowsIcon className={className} />;
    case "linux":
      return <LinuxIcon className={className} />;
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      );
  }
}
