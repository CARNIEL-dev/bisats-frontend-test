const NAV_LINKS = [
  { title: "About us", href: "/about" },
  { title: "Blog", href: "/blog" },
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
      { name: "Blog", url: "/blog" },
      { name: "FAQs", url: "/faqs" },
    ],
  },
  connect: {
    title: "CONNECT",
    links: [
      { name: "X (Twitter)", url: "#" },
      { name: "Instagram", url: "#" },
      { name: "Facebook", url: "#" },
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
