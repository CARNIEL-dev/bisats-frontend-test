const NAV_LINKS = [
  { title: "About us", href: "/about" },
  { title: "Resources", href: "/resources" },
  { title: "Contact", href: "/contact" },
];

const footerData = {
  site: {
    title: "Pages",
    links: [
      { name: "Home", url: "#" },
      { name: "Terms and Conditions", url: "/terms&condition" },

      { name: "T&C for Merchants", url: "/terms&condition" },
      { name: "Policy", url: "/policy" },
      { name: "Resources", url: "/resources" },
      { name: "FAQs", url: "/faqs" },
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
    link: "/faqs",
  },
  {
    title: "Terms of Service",
    link: "terms&condition",
  },
];

export default NAV_LINKS;
export { footerData, LoggedInLinks };
