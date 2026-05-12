type IconProps = {
	size?: number;
	className?: string;
	title?: string;
};


export function EditorIcon({ size = 18, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M7 3.5h6l4 4V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z" fill="currentColor" opacity={0.2} stroke="none" strokeLinejoin="round" strokeLinecap="round" />
			<path d="M13 3.5 17 7.5h-4V3.5Z" fill="currentColor" opacity={0.35} stroke="none" />
			<path d="M7 3.5h6l4 4V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z" />
			<path d="M13 3.5V8h4.5" />
			<path d="M8.5 13.5h7" />
			<path d="M8.5 16.5h5" />
			<path d="M9 10.5h3.5" />
			<path d="m14.5 13.5 4-4 2 2-4 4-2.5.5.5-2.5Z" />
		</svg>
	);
}

export function AgentIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M7 6.5h8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9.5L7 17v-3.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3Z" fill="currentColor" opacity="0.2" stroke="none" />
			<path d="M7 6.5h8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9.5L7 17v-3.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3Z" />
			<path d="M9 10h.01" />
			<path d="M12 10h.01" />
			<path d="M15 10h.01" />
			<path d="M11 14.5h6.5a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-2.5 2.5H11l-2 2v-2a2.5 2.5 0 0 1-2.5-2.5" fill="currentColor" opacity={0.12} stroke="none" />
			<path d="M11 17.5h6a2.5 2.5 0 0 0 2.5-2.5v-1" />
		</svg>
	);
}

export function ClassicResumeIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="currentColor" opacity={0.12} stroke="none" />
			<path d="M3 3h18v5.5H3Z" fill="currentColor" opacity={0.25} stroke="none" />
			<path d="M3 3h18v18H3Z" />
			<path d="M3 8.5h18" />
			<path d="M7 6h10" />
			<path d="M7 11.5h10" />
			<path d="M7 14h10" />
			<path d="M7 16.5h7" />
		</svg>
	);
}

export function ModernResumeIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M3 3h18v18H3Z" fill="currentColor" opacity={0.1} stroke="none" />
			<path d="M3 3h5v18H3Z" fill="currentColor" opacity={0.3} stroke="none" />
			<path d="M3 3h18v18H3Z" />
			<path d="M8 3v18" />
			<path d="M11 7h7" />
			<path d="M11 10h7" />
			<path d="M11 14h7" />
			<path d="M11 17h5" />
			<path d="M4.5 7h2" />
			<path d="M4.5 10h2" />
			<path d="M4.5 13h2" />
			<path d="M4.5 16h2" />
		</svg>
	);
}

export function MinimalResumeIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="currentColor" opacity={0.1} stroke="none" />
			<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
			<path d="M7 7h10" />
			<path d="M7 10h6" />
			<path d="M7 14h10" />
			<path d="M7 17h8" />
		</svg>
	);
}

export function ExecutiveResumeIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M3 3h18v18H3Z" fill="currentColor" opacity={0.1} stroke="none" />
			<path d="M3 3h18v7H3Z" fill="currentColor" opacity={0.25} stroke="none" />
			<path d="M3 3h18v18H3Z" />
			<path d="M3 10h18" />
			<path d="M3 15h18" />
			<path d="M6 6.5h12" />
			<path d="M8 8.5h8" />
			<path d="M6 12h12" />
			<path d="M6 17.5h12" />
		</svg>
	);
}

export function SingleColumnIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="currentColor" opacity={0.12} stroke="none" />
			<path d="M3 3h18v4H3Z" fill="currentColor" opacity={0.28} stroke="none" />
			<path d="M3 3h18v18H3Z" />
			<path d="M3 7h18" />
			<path d="M6 10h12" />
			<path d="M6 12.5h12" />
			<path d="M6 15h12" />
			<path d="M6 17.5h9" />
		</svg>
	);
}

export function TwoColumnIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M3 3h18v18H3Z" fill="currentColor" opacity={0.1} stroke="none" />
			<path d="M3 3h7v18H3Z" fill="currentColor" opacity={0.25} stroke="none" />
			<path d="M3 3h18v18H3Z" />
			<path d="M10 3v18" />
			<path d="M4.5 6.5h4" />
			<path d="M4.5 9h4" />
			<path d="M4.5 12h4" />
			<path d="M4.5 15h4" />
			<path d="M12 7h7" />
			<path d="M12 10h7" />
			<path d="M12 13h7" />
			<path d="M12 16h5" />
		</svg>
	);
}

export function A4PaperIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M5 2h9l5 5v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="currentColor" opacity={0.15} stroke="none" />
			<path d="M14 2l5 5h-5Z" fill="currentColor" opacity={0.3} stroke="none" />
			<path d="M5 2h9l5 5v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
			<path d="M14 2v5h5" />
			<text x="12" y="17" fontSize="4.5" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="sans-serif">A4</text>
		</svg>
	);
}

export function LetterPaperIcon({ size = 20, className, title }: IconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
			{title && <title>{title}</title>}
			<path d="M4 2h10l6 5v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="currentColor" opacity={0.15} stroke="none" />
			<path d="M14 2l6 5h-6Z" fill="currentColor" opacity={0.3} stroke="none" />
			<path d="M4 2h10l6 5v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
			<path d="M14 2v5h6" />
			<text x="12" y="17" fontSize="3.8" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="sans-serif">LTR</text>
		</svg>
	);
}
