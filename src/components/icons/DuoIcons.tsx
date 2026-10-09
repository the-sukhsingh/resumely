import * as React from 'react';

export interface DuoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  secondaryOpacity?: number | string;
}

// Search Duo: secondary circular background/lens, primary rim and handle
export const SearchDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.25, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2a9 9 0 1 0 5.618 16.032l4.175 4.175a1 1 0 0 0 1.414-1.414l-4.175-4.175A9 9 0 0 0 11 2zm-7 9a7 7 0 1 1 14 0 7 7 0 0 1-14 0z"
      />
    </svg>
  )
);
SearchDuo.displayName = 'SearchDuo';

// Sparkles Duo: secondary soft ambient glow stars, primary sharp central star
export const SparklesDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.35, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M18.5 2.5a.75.75 0 0 1 .75.75c0 1.5.8 2.3 2.3 2.3a.75.75 0 0 1 0 1.5c-1.5 0-2.3.8-2.3 2.3a.75.75 0 0 1-1.5 0c0-1.5-.8-2.3-2.3-2.3a.75.75 0 0 1 0-1.5c1.5 0 2.3-.8 2.3-2.3a.75.75 0 0 1 .75-.75zM4.5 16.5a.75.75 0 0 1 .75.75c0 1.2.6 1.8 1.8 1.8a.75.75 0 0 1 0 1.5c-1.2 0-1.8.6-1.8 1.8a.75.75 0 0 1-1.5 0c0-1.2-.6-1.8-1.8-1.8a.75.75 0 0 1 0-1.5c1.2 0 1.8-.6 1.8-1.8a.75.75 0 0 1 .75-.75z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        d="M10 3a1 1 0 0 1 1 1c0 3.3 2.7 6 6 6a1 1 0 0 1 0 2c-3.3 0-6 2.7-6 6a1 1 0 0 1-2 0c0-3.3-2.7-6-6-6a1 1 0 0 1 0-2c3.3 0 6-2.7 6-6a1 1 0 0 1 1-1z"
      />
    </svg>
  )
);
SparklesDuo.displayName = 'SparklesDuo';

// Sliders Duo: secondary horizontal track slots, primary adjustment knobs
export const SlidersDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zm0 10.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 4a2.75 2.75 0 0 0-2.75 2.75v.01A2.75 2.75 0 0 0 7 9.5a2.75 2.75 0 0 0 2.75-2.74v-.01A2.75 2.75 0 0 0 7 4zm10 10.5a2.75 2.75 0 0 0-2.75 2.75v.01a2.75 2.75 0 0 0 5.5 0v-.01a2.75 2.75 0 0 0-2.75-2.75z"
      />
    </svg>
  )
);
SlidersDuo.displayName = 'SlidersDuo';

// Link Duo: secondary background node/link, primary foreground link
export const LinkDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M10.59 13.41a1 1 0 0 1 0 1.42l-2.83 2.83a4 4 0 0 1-5.66-5.66l2.83-2.83a1 1 0 0 1 1.42 1.42L3.52 13.4a2 2 0 0 0 2.83 2.83l2.83-2.83a1 1 0 0 1 1.41.01z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        d="M13.41 10.59a1 1 0 0 1 0-1.42l2.83-2.83a4 4 0 0 1 5.66 5.66l-2.83 2.83a1 1 0 0 1-1.42-1.42l2.83-2.83a2 2 0 0 0-2.83-2.83l-2.83 2.83a1 1 0 0 1-1.41-.01zm-5.07 5.07a1 1 0 0 1 0-1.41l7.07-7.07a1 1 0 1 1 1.41 1.41l-7.07 7.07a1 1 0 0 1-1.41 0z"
      />
    </svg>
  )
);
LinkDuo.displayName = 'LinkDuo';

// Edit / Pen Duo: secondary writing guide/angle, primary nib and body
export const EditDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M4 20h16a.75.75 0 0 1 0 1.5H4A.75.75 0 0 1 4 20zm8.38-16.79l5.41 5.41-8.79 8.79-5.41-5.41 8.79-8.79z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        d="M19.71 4.29a1.75 1.75 0 0 0-2.48 0l-1.42 1.42 5.42 5.42 1.41-1.42a1.75 1.75 0 0 0 0-2.48l-2.93-2.94zM3.05 18.05a.75.75 0 0 0 .9.9l4.47-1.12-4.25-4.25-1.12 4.47z"
      />
    </svg>
  )
);
EditDuo.displayName = 'EditDuo';

// External Link Duo: secondary base frame, primary launching arrow
export const ExternalLinkDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M5 4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6a1 1 0 0 0-2 0v6a.5.5 0 0 1-.5.5H5.5A.5.5 0 0 1 5 19V6.5a.5.5 0 0 1 .5-.5h6a1 1 0 0 0 0-2H5z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        d="M14 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V5.414l-8.293 8.293a1 1 0 0 1-1.414-1.414L18.586 4H15a1 1 0 0 1-1-1z"
      />
    </svg>
  )
);
ExternalLinkDuo.displayName = 'ExternalLinkDuo';

// Eye Duo: secondary sclera backdrop, primary pupil & outer eyelid rim
export const EyeDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M12 5C6.5 5 2 12 2 12s4.5 7 10 7 10-7 10-7-4.5-7-10-7z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 7c-4.4 0-7.8 5-7.8 5s3.4 5 7.8 5 7.8-5 7.8-5-3.4-5-7.8-5zm0-2C6.5 5 2 12 2 12s4.5 7 10 7 10-7 10-7-4.5-7-10-7zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
      />
    </svg>
  )
);
EyeDuo.displayName = 'EyeDuo';

// Send Duo: secondary trailing wing, primary forward fuselage
export const SendDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M2.38 3.39a1.25 1.25 0 0 1 1.34-.14l18 8a1.25 1.25 0 0 1 0 2.28l-18 8a1.25 1.25 0 0 1-1.74-1.4l1.86-7.13L13 12 3.84 10.99 1.98 3.86a1.25 1.25 0 0 1 .4-.47z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        d="M12.5 12a1 1 0 0 1-.95.68l-7.71.86-1.5 5.76L21.05 12 2.34 3.7l1.5 5.76 7.71.86A1 1 0 0 1 12.5 12z"
      />
    </svg>
  )
);
SendDuo.displayName = 'SendDuo';

// Monitor / Display Duo: secondary inner display screen, primary outer rim and stand
export const MonitorDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.25, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <rect
        x="5"
        y="4"
        width="14"
        height="10"
        rx="1"
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5.25v2.25H16a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5h2.25V16H5a2 2 0 0 1-2-2V4zm2 0v10h14V4H5z"
      />
    </svg>
  )
);
MonitorDuo.displayName = 'MonitorDuo';

// LogOut Duo: secondary door frame, primary exit arrow
export const LogOutDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <path
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
        d="M5 4a2 2 0 0 1 2-2h6a1 1 0 1 1 0 2H7v16h6a1 1 0 1 1 0 2H7a2 2 0 0 1-2-2V4z"
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.293 8.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L15.586 13H9a1 1 0 1 1 0-2h6.586l-2.293-2.293a1 1 0 0 1 0-1.414z"
      />
    </svg>
  )
);
LogOutDuo.displayName = 'LogOutDuo';

// Chevron Right Duo: secondary background halo, primary crisp chevron
export const ChevronRightDuo = React.forwardRef<SVGSVGElement, DuoIconProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.2, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`duo-icons ${className}`.trim()}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        className="duo-icons-secondary-layer"
        fill="currentColor"
        opacity={secondaryOpacity}
      />
      <path
        className="duo-icons-primary-layer"
        fill="currentColor"
        d="M10.293 8.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L12.586 12l-2.293-2.293a1 1 0 0 1 0-1.414z"
      />
    </svg>
  )
);
ChevronRightDuo.displayName = 'ChevronRightDuo';

