import { LiveAssets, TestAssets } from "../utils/assets";

const isDev = process.env.REACT_APP_NODE_ENV === "development";
export const assets = isDev ? TestAssets : LiveAssets;

export const TokenData = [
  {
    id: assets.xNGN,
    tokenName: assets.xNGN,
    networks: [
      {
        label: "BudPay",
        value: "budpay",
      },
      {
        label: "Novac",
        value: "novac",
      },
    ],
    currentBalance: "0",
    tokenLogo: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.9359 12.0002C23.9359 18.5927 18.5917 23.937 11.9993 23.937C5.40674 23.937 0.0625 18.5927 0.0625 12.0002C0.0625 5.40772 5.40674 0.0634766 11.9993 0.0634766C18.5917 0.0634766 23.9359 5.40772 23.9359 12.0002Z"
          fill="#F5BB00"
        />
        <g clip-path="url(#clip0_13703_32107)">
          <path
            d="M6.44141 6.21973H9.17741L14.6854 15.8317V6.21973H17.0254V18.9997H14.2174L8.78141 9.65773V18.9997H6.44141V6.21973Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_13703_32107">
            <rect
              width="12"
              height="13"
              fill="white"
              transform="translate(6 6)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    id: assets.USDT,
    tokenName: assets.USDT,
    networks: [
      {
        value: "Sol",
        label: "Sol",
      },
      {
        value: "ERC",
        label: "ERC",
      },
      {
        value: "BEP",
        label: "BEP",
      },
    ],
    currentBalance: "0",
    tokenLogo: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.9359 12.0002C23.9359 18.5927 18.5917 23.937 11.9993 23.937C5.40674 23.937 0.0625 18.5927 0.0625 12.0002C0.0625 5.40772 5.40674 0.0634766 11.9993 0.0634766C18.5917 0.0634766 23.9359 5.40772 23.9359 12.0002Z"
          fill="#00A478"
        />
        <path
          d="M10.7738 11.7908V9.70254H7.94141V7.87207H15.8561V9.72832H13.0238V11.7908H10.7738Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.72266 12.023C6.72266 11.327 8.99913 10.7598 11.8315 10.7598C14.6638 10.7598 16.9403 11.327 16.9403 12.023C16.9403 12.7191 14.6638 13.2863 11.8315 13.2863C8.99913 13.2863 6.72266 12.7191 6.72266 12.023ZM16.5168 12.023C16.3315 11.7652 14.7962 10.966 11.8315 10.966C8.86677 10.966 7.33148 11.7395 7.14619 12.023C7.33148 12.2809 8.86677 12.6676 11.8315 12.6676C14.8227 12.6676 16.3315 12.2809 16.5168 12.023Z"
          fill="white"
        />
        <path
          d="M13.0243 12.4357V10.992C12.6537 10.9662 12.2567 10.9404 11.8596 10.9404C11.489 10.9404 11.1449 10.9404 10.8008 10.9662V12.41C11.1184 12.41 11.489 12.4357 11.8596 12.4357C12.2567 12.4615 12.6537 12.4615 13.0243 12.4357Z"
          fill="white"
        />
        <path
          d="M11.8323 13.2869C11.4617 13.2869 11.1176 13.2869 10.7734 13.2611V17.1025H12.997V13.2354C12.6264 13.2611 12.2293 13.2869 11.8323 13.2869Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    id: assets.BTC,
    tokenName: assets.BTC,
    networks: [
      {
        value: "Sol",
        label: "Sol",
      },
      {
        value: "ERC",
        label: "ERC",
      },
      {
        value: "BEP",
        label: "BEP",
      },
    ],
    currentBalance: "0",
    tokenLogo: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.6385 14.9031C22.0358 21.3317 15.5243 25.2437 9.0949 23.641C2.66853 22.0382 -1.24385 15.5267 0.359278 9.09847C1.96128 2.6691 8.4724 -1.24365 14.8999 0.359098C21.3289 1.96185 25.2409 8.4741 23.6382 14.9031H23.6385Z"
          fill="#F7931A"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.6156 10.6063C15.7774 9.52304 14.9526 8.94073 13.8249 8.55227L14.1907 7.08493L13.2973 6.86233L12.9411 8.29101C12.7066 8.2325 12.4654 8.1773 12.2258 8.1226L12.5845 6.68451L11.6918 6.46191L11.3257 7.92875C11.1314 7.88449 10.9406 7.84073 10.7554 7.79469L10.7564 7.79011L9.52463 7.48255L9.28702 8.43652C9.28702 8.43652 9.94972 8.5884 9.93573 8.59781C10.2975 8.68812 10.3631 8.92751 10.3519 9.11728L9.93522 10.7889C9.96015 10.7953 9.99246 10.8044 10.0281 10.8187L9.93395 10.7953L9.3496 13.137C9.30534 13.2469 9.19315 13.4117 8.94028 13.3491C8.94918 13.3621 8.29107 13.1871 8.29107 13.1871L7.84766 14.2098L9.01024 14.4995C9.14149 14.5324 9.27114 14.5662 9.39938 14.5997L9.39948 14.5997C9.48248 14.6214 9.56488 14.6429 9.64673 14.6639L9.2771 16.1482L10.1693 16.3708L10.5356 14.9025C10.779 14.9686 11.0156 15.0297 11.2471 15.0872L10.8823 16.5487L11.7755 16.7713L12.1451 15.2899C13.6682 15.5781 14.8137 15.4619 15.2953 14.0846C15.6838 12.9754 15.2762 12.3356 14.4749 11.9182C15.0585 11.7831 15.4981 11.3992 15.6153 10.6063H15.6156ZM13.5746 13.4679C13.321 14.4859 11.7273 14.0647 10.9987 13.8722L10.9986 13.8722C10.9334 13.8549 10.8751 13.8395 10.8253 13.8271L11.3158 11.8609C11.3767 11.8761 11.451 11.8928 11.5352 11.9117C12.289 12.0808 13.8336 12.4275 13.5748 13.4679H13.5746ZM11.6867 10.9993C12.2946 11.1615 13.6198 11.515 13.8506 10.5902C14.0866 9.64416 12.7981 9.35901 12.1688 9.21974C12.098 9.20409 12.0356 9.19028 11.9846 9.17758L11.5399 10.9609C11.582 10.9714 11.6314 10.9845 11.6867 10.9993Z"
          fill="white"
        />
      </svg>
    ),
  },

  {
    id: assets.SOL,
    tokenName: assets.SOL,
    networks: [
      {
        value: "Sol",
        label: "Sol",
      },
      {
        value: "ERC",
        label: "ERC",
      },
      {
        value: "BEP",
        label: "BEP",
      },
    ],
    currentBalance: "0",
    tokenLogo: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="12" fill="#0A0E12" />
        <path
          d="M18.219 15.134L16.1441 17.2846C16.099 17.3313 16.0445 17.3686 15.9838 17.394C15.9232 17.4195 15.8577 17.4326 15.7916 17.4326H5.95572C5.90879 17.4326 5.86288 17.4193 5.82363 17.3944C5.78439 17.3696 5.75351 17.3341 5.73481 17.2925C5.7161 17.251 5.71037 17.205 5.71833 17.1603C5.72629 17.1156 5.74759 17.0741 5.77961 17.0409L7.85605 14.8903C7.90103 14.8437 7.95543 14.8066 8.01587 14.7811C8.07633 14.7557 8.14154 14.7425 8.20748 14.7424H18.0429C18.0898 14.7424 18.1357 14.7556 18.175 14.7805C18.2142 14.8054 18.245 14.8408 18.2638 14.8824C18.2825 14.924 18.2882 14.97 18.2802 15.0147C18.2723 15.0594 18.251 15.1008 18.219 15.134ZM16.1441 10.8033C16.099 10.7566 16.0445 10.7194 15.9838 10.6939C15.9232 10.6685 15.8577 10.6553 15.7916 10.6554H5.95572C5.90879 10.6554 5.86288 10.6686 5.82363 10.6935C5.78439 10.7184 5.75351 10.7538 5.73481 10.7954C5.7161 10.837 5.71037 10.883 5.71833 10.9277C5.72629 10.9723 5.74759 11.0138 5.77961 11.047L7.85605 13.1976C7.90103 13.2442 7.95543 13.2813 8.01587 13.3068C8.07633 13.3322 8.14154 13.3454 8.20748 13.3455H18.0429C18.0898 13.3455 18.1357 13.3323 18.175 13.3074C18.2142 13.2825 18.245 13.2471 18.2638 13.2055C18.2825 13.1639 18.2882 13.118 18.2802 13.0733C18.2723 13.0286 18.251 12.9871 18.219 12.9539L16.1441 10.8033ZM5.95572 9.25854H15.7916C15.8577 9.25857 15.9232 9.24546 15.9838 9.22C16.0445 9.19454 16.099 9.1573 16.1441 9.11058L18.219 6.95999C18.251 6.92682 18.2723 6.88534 18.2802 6.84064C18.2882 6.79594 18.2825 6.74997 18.2638 6.70837C18.245 6.66677 18.2142 6.63136 18.175 6.60649C18.1357 6.58161 18.0898 6.56836 18.0429 6.56836H8.20748C8.14154 6.56847 8.07633 6.58166 8.01587 6.60711C7.95543 6.63256 7.90103 6.66973 7.85605 6.71632L5.78014 8.86691C5.74816 8.90004 5.72687 8.94148 5.71889 8.98612C5.71091 9.03078 5.71659 9.07672 5.73523 9.1183C5.75388 9.15988 5.78467 9.19529 5.82383 9.2202C5.863 9.24511 5.90884 9.25843 5.95572 9.25854Z"
          fill="url(#paint0_linear_13703_32192)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_13703_32192"
            x1="6.7758"
            y1="17.6915"
            x2="16.6983"
            y2="6.11776"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.08" stopColor="#9945FF" />
            <stop offset="0.3" stopColor="#8752F3" />
            <stop offset="0.5" stopColor="#5497D5" />
            <stop offset="0.6" stopColor="#43B4CA" />
            <stop offset="0.72" stopColor="#28E0B9" />
            <stop offset="0.97" stopColor="#19FB9B" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: assets.ETH,
    tokenName: assets.ETH,
    networks: [
      {
        value: "Sol",
        label: "Sol",
      },
      {
        value: "ERC",
        label: "ERC",
      },
      {
        value: "BEP",
        label: "BEP",
      },
    ],
    currentBalance: "0",
    tokenLogo: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.9359 12.0002C23.9359 18.5927 18.5917 23.937 11.9993 23.937C5.40674 23.937 0.0625 18.5927 0.0625 12.0002C0.0625 5.40772 5.40674 0.0634766 11.9993 0.0634766C18.5917 0.0634766 23.9359 5.40772 23.9359 12.0002Z"
          fill="#627FEB"
        />
        <g opacity="0.8">
          <path
            d="M11.9604 6.46191L11.8867 6.71251V13.9843L11.9604 14.0579L15.3359 12.0627L11.9604 6.46191Z"
            fill="white"
          />
          <path
            d="M11.9614 6.46191L8.58594 12.0627L11.9614 14.058V10.5284V6.46191Z"
            fill="white"
          />
          <path
            d="M11.9595 15.1564L11.918 15.207V17.7974L11.9595 17.9187L15.337 13.1621L11.9595 15.1564Z"
            fill="white"
          />
          <path
            d="M11.9614 17.9188V15.1564L8.58594 13.1621L11.9614 17.9188Z"
            fill="white"
          />
          <path
            d="M11.9609 14.0578L15.3364 12.0626L11.9609 10.5283V14.0578Z"
            fill="white"
          />
          <path
            d="M8.58594 12.0626L11.9614 14.0578V10.5283L8.58594 12.0626Z"
            fill="white"
          />
        </g>
      </svg>
    ),
  },
];

// export const DUMMY_HISTORY = [];

const DUMMY_HISTORY = [
  {
    id: "nfieijoi4rdfhhefhnf",
    to: "USDT",
    from: "SOL",
    fromAmount: 1,
    toAmount: 195,
    rate: 195,
    timestamp: "2025-03-15T16:00:00Z",
  },
  {
    id: "nfieijoi4rhtfhnf",
    to: "USDT",
    from: "ETH",
    fromAmount: 0.5,
    toAmount: 2250,
    rate: 4500,
    timestamp: "2025-04-15T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn1",
    to: "USDT",
    from: "BTC",
    fromAmount: 0.01,
    toAmount: 350,
    rate: 35000,
    timestamp: "2025-04-16T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn2",
    to: "USDT",
    from: "xNGN",
    fromAmount: 1000,
    toAmount: 22,
    rate: 0.022,
    timestamp: "2025-04-17T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn3",
    to: "USDT",
    from: "SOL",
    fromAmount: 2,
    toAmount: 390,
    rate: 195,
    timestamp: "2025-04-18T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn4",
    to: "USDT",
    from: "ETH",
    fromAmount: 0.1,
    toAmount: 450,
    rate: 4500,
    timestamp: "2025-04-19T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn5",
    to: "USDT",
    from: "BTC",
    fromAmount: 0.005,
    toAmount: 175,
    rate: 35000,
    timestamp: "2025-04-20T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn6",
    to: "USDT",
    from: "xNGN",
    fromAmount: 500,
    toAmount: 11,
    rate: 0.022,
    timestamp: "2025-04-21T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn7",
    to: "USDT",
    from: "SOL",
    fromAmount: 1.5,
    toAmount: 292.5,
    rate: 195,
    timestamp: "2025-04-22T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn8",
    to: "USDT",
    from: "ETH",
    fromAmount: 0.05,
    toAmount: 112.5,
    rate: 4500,
    timestamp: "2025-04-23T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn9",
    to: "USDT",
    from: "BTC",
    fromAmount: 0.0025,
    toAmount: 87.5,
    rate: 35000,
    timestamp: "2025-04-24T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn10",
    to: "USDT",
    from: "xNGN",
    fromAmount: 250,
    toAmount: 5.5,
    rate: 0.022,
    timestamp: "2025-04-25T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn11",
    to: "USDT",
    from: "SOL",
    fromAmount: 0.5,
    toAmount: 97.5,
    rate: 195,
    timestamp: "2025-04-26T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn12",
    to: "USDT",
    from: "ETH",
    fromAmount: 0.02,
    toAmount: 90,
    rate: 4500,
    timestamp: "2025-04-27T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn13",
    to: "USDT",
    from: "BTC",
    fromAmount: 0.00125,
    toAmount: 43.75,
    rate: 35000,
    timestamp: "2025-04-28T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn14",
    to: "USDT",
    from: "xNGN",
    fromAmount: 125,
    toAmount: 2.75,
    rate: 0.022,
    timestamp: "2025-04-29T12:00:00Z",
  },
  {
    id: "nfieijoi4rdfhhefhn15",
    to: "USDT",
    from: "SOL",
    fromAmount: 0.25,
    toAmount: 48.75,
    rate: 195,
    timestamp: "2025-04-30T12:00:00Z",
  },
];

export { DUMMY_HISTORY };
