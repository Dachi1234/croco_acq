export function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.91667 2.26667L3.025 5.86667C2.275 6.45 1.66667 7.69167 1.66667 8.63333V14.8083C1.66667 16.7417 3.24167 18.325 5.175 18.325H14.825C16.7583 18.325 18.3333 16.7417 18.3333 14.8167V8.75C18.3333 7.74167 17.6583 6.45 16.8333 5.875L12.0833 2.26667C10.9167 1.45 9.04167 1.39167 7.91667 2.26667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.9917V12.4917"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PromoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Megaphone body — vec-1 at x=0 y=0, scale 15.624/15.625 x 18.75/18.75 ≈ 1:1 */}
      <g transform="translate(0, 0) scale(1, 1)">
        <path
          d="M13.251 0.600586C14.2283 0.584397 15.0253 1.39955 15.0254 2.37305V16.377C15.0253 17.3434 14.2414 18.1492 13.2812 18.1494C13.2713 18.1494 13.261 18.1496 13.251 18.1494L13.0645 18.1367C12.6326 18.0827 12.2338 17.8679 11.9492 17.5313L8.92383 13.9521C8.66116 13.6415 8.2752 13.4619 7.86816 13.4619H3.125C1.73327 13.4619 0.599664 12.3293 0.599609 10.9375V7.8125C0.599609 6.42075 1.73325 5.28711 3.125 5.28711H7.86816C8.22424 5.28711 8.56403 5.15063 8.81934 4.9082L8.92383 4.79785L11.9492 1.21875C12.2742 0.834216 12.7487 0.609147 13.251 0.600586Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      </g>
      {/* Sound wave — vec-0 at x=16.876 y=7.032, viewBox 3.125x4.688, fits in 3.124x4.686 */}
      <g transform="translate(16.876, 7.032) scale(0.9997, 0.9996)">
        <path
          d="M0.78125 0.599609C1.74226 0.599636 2.52539 1.3828 2.52539 2.34375C2.52539 3.30468 1.74224 4.08786 0.78125 4.08789C0.68127 4.08789 0.59961 4.00643 0.599609 3.90625C0.599609 3.80617 0.681171 3.72461 0.78125 3.72461C1.54341 3.72458 2.16211 3.10587 2.16211 2.34375C2.16211 1.58158 1.54336 0.962917 0.78125 0.962891C0.68123 0.962891 0.599609 0.881369 0.599609 0.78125C0.599609 0.681131 0.68123 0.599609 0.78125 0.599609Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
      {/* Handle — vec-2 at x=1.562 y=12.442, viewBox 4.6875x7.5586, fits in 4.688x7.558 */}
      <g transform="translate(1.562, 12.442) scale(1.0001, 0.9999)">
        <path
          d="M0.78125 0.599609C0.881302 0.599609 0.962863 0.681104 0.962891 0.78125V5.21484C0.962914 5.97696 1.58157 6.5957 2.34375 6.5957C3.10593 6.5957 3.72459 5.97696 3.72461 5.21484V1.46484C3.72461 1.36482 3.80613 1.2832 3.90625 1.2832C4.00637 1.2832 4.08789 1.36482 4.08789 1.46484V5.21484C4.08787 6.17586 3.3047 6.95898 2.34375 6.95898C1.3828 6.95898 0.599633 6.17586 0.599609 5.21484V0.78125C0.599637 0.681104 0.681198 0.599609 0.78125 0.599609Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
      {/* Small detail — vec-3 at x=6.25 y=7.812, viewBox 1.5625x3.125, fits in 1.562x3.126 */}
      <g transform="translate(6.25, 7.812) scale(0.9997, 1.0003)">
        <path
          d="M0.78125 0.599609C0.881359 0.599609 0.962891 0.681141 0.962891 0.78125V2.34375C0.962891 2.44377 0.881369 2.52539 0.78125 2.52539C0.681131 2.52539 0.599609 2.44377 0.599609 2.34375V0.78125C0.599609 0.681141 0.681141 0.599609 0.78125 0.599609Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

export function BlogIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3333 1.66667H6.66667C3.33333 1.66667 1.66667 3.33333 1.66667 6.66667V17.5C1.66667 17.9583 2.04167 18.3333 2.5 18.3333H13.3333C16.6667 18.3333 18.3333 16.6667 18.3333 13.3333V6.66667C18.3333 3.33333 16.6667 1.66667 13.3333 1.66667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83333 7.91667H14.1667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83333 12.0833H11.6667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.19751 11.62L9.00084 7.81667C9.45251 7.365 9.45251 6.635 9.00084 6.18333L5.19751 2.38"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
