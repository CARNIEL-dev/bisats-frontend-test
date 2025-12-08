import { APP_ROUTES } from "@/constants/app_route";

const NAV_LINKS = [
  { title: "About us", href: APP_ROUTES.ABOUT },
  { title: "Resources", href: APP_ROUTES.RESOURCES },
  // { title: "Contact", href: "/contact" },
];

const footerData = {
  site: {
    title: "Pages",
    links: [
      { name: "Home", url: APP_ROUTES.HOME },
      { name: "Terms and Conditions", url: APP_ROUTES.TERMS },

      { name: "T&C for Merchants", url: APP_ROUTES.TERMS },
      { name: "Policy", url: APP_ROUTES.POLICY },
      { name: "Resources", url: APP_ROUTES.RESOURCES },
      { name: "FAQs", url: APP_ROUTES.FAQ },
    ],
  },
  connect: {
    title: "CONNECT",
    links: [
      { name: "X (Twitter)", url: "https://x.com/bisatsglobal?s=21" },
      {
        name: "Instagram",
        url: "https://www.instagram.com/bisats_official?igsh=MWV6a3oydWpka2hzaw%3D%3D&utm_source=qr",
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/share/1DBT8ggYhD/?mibextid=wwXIfr",
      },
    ],
  },
  contact: {
    title: "Contact",
    links: [{ name: "support@Bisats.com", url: "mailto:support@Bisats.com" }],
  },
};

const LoggedInLinks = [
  {
    title: "Support",
    link: "mailto:support@Bisats.com",
  },
  {
    title: "FAQs",
    link: APP_ROUTES.FAQ,
  },
  {
    title: "Terms of Service",
    link: APP_ROUTES.TERMS,
  },
];

export default NAV_LINKS;
export { footerData, LoggedInLinks };
