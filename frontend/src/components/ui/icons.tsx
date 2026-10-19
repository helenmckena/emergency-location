import type { SVGProps } from 'react';

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 10.5c0 5.25-7 11-7 11s-7-5.75-7-11a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function AlertCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FileWarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2.75h8l4 4V21a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25V3a.25.25 0 0 1 .25-.25Z" />
      <path d="M14 2.75V7h4.25" />
      <path d="M12 11.5v3.6" />
      <circle cx="12" cy="17.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CameraPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.1-1.7A1.5 1.5 0 0 1 9.87 4.5h4.26a1.5 1.5 0 0 1 1.27.8L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.2" />
      <path d="M17.5 9.8v2.4M16.3 11h2.4" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function TranslateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 5.5h8M7 3.5v2M9.5 5.5c-.6 3-2.3 5.4-5 7.1M5 8.6c1 1.9 2.4 3.3 4.5 4.4" />
      <path d="M13 20.5 17 11l4 9.5M14.2 17.5h5.6" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.4C5.14 1.4 1.2 5.34 1.2 10.2c0 3.89 2.52 7.19 6.02 8.35.44.08.6-.19.6-.42v-1.63c-2.45.53-2.96-1.05-2.96-1.05-.4-1.02-.98-1.29-.98-1.29-.8-.55.06-.54.06-.54.89.06 1.35.91 1.35.91.79 1.34 2.06.96 2.56.73.08-.57.31-.96.56-1.18-1.96-.22-4.02-.98-4.02-4.36 0-.96.34-1.75.9-2.37-.09-.22-.39-1.12.09-2.33 0 0 .74-.24 2.42.9a8.3 8.3 0 0 1 4.4 0c1.68-1.14 2.42-.9 2.42-.9.48 1.21.18 2.11.09 2.33.56.62.9 1.41.9 2.37 0 3.39-2.07 4.14-4.04 4.36.32.28.6.82.6 1.65v2.44c0 .23.16.51.61.42a8.8 8.8 0 0 0 6-8.35C18.8 5.34 14.86 1.4 10 1.4Z"
      />
    </svg>
  );
}

export function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 6H6.75A1.75 1.75 0 0 0 5 7.75v9.5C5 18.22 5.78 19 6.75 19h9.5A1.75 1.75 0 0 0 18 17.25V14" />
      <path d="M13.5 5H19v5.5" />
      <path d="M18.7 5.3 11 13" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.2 4.4 2.9 11.6c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.5.8 1 .8s.7-.2 1-.5l2.4-2.3 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.4-1.8-1.5-1.3ZM8.6 14.2l9.4-5.8c.5-.3.9-.1.5.2l-7.8 7.1-.3 3-1.4-4.5Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5A9.5 9.5 0 0 0 3.6 17l-1.1 4.5 4.6-1.2A9.5 9.5 0 1 0 12 2.5Zm5.6 13.5c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.7-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.2.4.9 1.5 1.9 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3.1.2.1.9-.1 1.5Z" />
    </svg>
  );
}

export function BroadcastIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="2.2" />
      <path d="M7.8 8.2a6 6 0 0 0 0 7.6M16.2 8.2a6 6 0 0 1 0 7.6" />
      <path d="M4.8 5.2a10.3 10.3 0 0 0 0 13.6M19.2 5.2a10.3 10.3 0 0 1 0 13.6" />
    </svg>
  );
}
