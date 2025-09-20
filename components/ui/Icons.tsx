import React from 'react';

type IconProps = {
  className?: string;
};

export const LogoIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="85%" stopColor="white"/>
        <stop offset="100%" stopColor="#E0E0E0"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur">
            <animate attributeName="stdDeviation" values="1.5; 2.5; 1.5" dur="2s" repeatCount="indefinite" />
        </feGaussianBlur>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#grad1)"/>
    <circle cx="100" cy="100" r="75" fill="#1C2B5B"/>
    <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
      <g strokeWidth="2.5">
        <path d="M 60 125 v -40"/>
        <path d="M 55 128 h 10"/>
        <path d="M 55 125 h 10"/>
        <path d="M 54 85 h 12"/>
        <path d="M 56 82.5 c -1 -4 3 -4 4 0 c 1 4 -3 4 -4 0 z m 4 0 c 1 -4 5 -4 4 0 c -1 4 -5 4 -4 0 z"/>
        <path d="M 140 125 v -40"/>
        <path d="M 135 128 h 10"/>
        <path d="M 135 125 h 10"/>
        <path d="M 134 85 h 12"/>
        <path d="M 136 82.5 c -1 -4 3 -4 4 0 c 1 4 -3 4 -4 0 z m 4 0 c 1 -4 5 -4 4 0 c -1 4 -5 4 -4 0 z"/>
      </g>
      <g strokeWidth="3">
        <path d="M 118 78 c -5 -10 -20 -12 -30 -5"/>
        <path d="M 108 85 q -5 10 -10 15 q -5 5 -2 10"/>
        <path d="M 88 73 c -5 10 -3 20 5 27"/>
        <path d="M 86 85 l -10 40"/>
        <path d="M 110 115 c 10 -10 10 -25 0 -30"/>
        <path d="M 82 100 h 30"/>
        <path d="M 110 115 l 5 5"/>
        <path d="M 98 120 l 10 -10"/>
        <g transform="translate(10, 2)">
            <rect x="108" y="98" width="24" height="32" rx="3" ry="3" strokeWidth="2"/>
            <rect x="108" y="98" width="24" height="32" rx="3" ry="3" stroke="white" strokeOpacity="0.7" filter="url(#glow)" />
            <g strokeWidth="1.5">
                <rect x="116" y="103" width="8" height="5"/>
                <line x1="120" y1="108" x2="120" y2="111"/>
                <rect x="112" y="111" width="6" height="4"/>
                <rect x="122" y="111" width="6" height="4"/>
                <line x1="115" y1="115" x2="115" y2="118"/>
                <rect x="112" y="118" width="6" height="4"/>
            </g>
        </g>
      </g>
    </g>
  </svg>
);
export const BookIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
export const DocumentTextIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
export const LightBulbIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.642 6.01 6.01 0 00-1.5-1.142 6.01 6.01 0 00-1.5 1.142 6.01 6.01 0 001.5 11.642zM12 18a2.25 2.25 0 01-2.25-2.25H12a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 0112 4.5v3.75m0 3.75h-1.5m1.5 0h1.5m-1.5 0V6.75m0 9.75v3.75M9.75 15.75H12m0 0H14.25" /></svg>;
export const ChartBarIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
export const DatabaseIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5-3.75a1.5 1.5 0 00-1.5-1.5h-13.5a1.5 1.5 0 00-1.5 1.5" /></svg>;
export const ArchiveBoxIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
export const CalendarIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h2.25" /></svg>;
export const CheckBadgeIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const UsersIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.28a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm4.5-9.72a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM13.5 18a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm-4.5-9.72h9" /></svg>;
export const UserIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
export const ChevronDownIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
export const DownloadIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
export const PrinterIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 3.329m0 0a6.002 6.002 0 019 0l.72 10.5M9 18.75h.008v.008H9v-.008zm3.75 0h.008v.008h-.008v-.008zm3.75 0h.008v.008h-.008v-.008z" /></svg>;
export const UploadIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
export const PlusCircleIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const ClipboardDocumentCheckIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>;
export const AcademicCapIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.076 9.227m3.076-9.227l3.076 9.227m0 0l3.076-9.227m-3.076 9.227l3.076 9.227M12 21l-3.076-9.227m3.076 9.227L15 11.773m-3 9.227l-3.076-9.227" /></svg>;
export const SparklesIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 17.25l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 13.5l.398 1.178a3.375 3.375 0 002.456 2.456l1.178.398-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg>;
export const DocumentPlusIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m9.75 0l-2.25-2.25m0 0l-2.25 2.25m2.25-2.25v13.5A2.25 2.25 0 0113.5 21h-6a2.25 2.25 0 01-2.25-2.25V5.625a2.25 2.25 0 012.25-2.25h6" /></svg>;