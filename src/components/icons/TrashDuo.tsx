import * as React from 'react';

export interface TrashDuoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  secondaryOpacity?: number | string;
}

export const TrashDuo = React.forwardRef<SVGSVGElement, TrashDuoProps>(
  ({ size = 24, className = '', secondaryOpacity = 0.3, ...props }, ref) => {
    return (
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
          opacity={secondaryOpacity}
          fill="currentColor"
          d="M6.5 8h11a.75.75 0 0 1 .74.82l-.95 10.45A2.75 2.75 0 0 1 14.56 21.5H9.44a2.75 2.75 0 0 1-2.73-2.23L5.76 8.82A.75.75 0 0 1 6.5 8z"
        />
        <path
          className="duo-icons-primary-layer"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 5h4.25V3.75A1.75 1.75 0 0 1 11 2h2a1.75 1.75 0 0 1 1.75 1.75V5H19a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm5 5.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75zm4 0a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75z"
        />
      </svg>
    );
  }
);

TrashDuo.displayName = 'TrashDuo';

export const Trash = TrashDuo;
export const Trash2 = TrashDuo;
export default TrashDuo;
