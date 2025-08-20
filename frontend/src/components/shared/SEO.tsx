import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  keywords?: string;
}

const DEFAULT_TITLE =
  "Bisats | Nigeria's Leading Peer-to-Peer Cryptocurrency Trading Platform";
const DEFAULT_DESCRIPTION =
  "Bisats makes crypto trading simple in Nigeria. Enjoy fast, secure, and seamless peer-to-peer Bitcoin and crypto transactions powered by blockchain automation.";
const DEFAULT_KEYWORDS =
  "best peer-to-peer crypto exchange Nigeria, how to buy bitcoin instantly in Nigeria, best crypto exchange Nigeria, bitcoin to naira, crypto trading platform Nigeria, buy bitcoin Nigeria, sell bitcoin Nigeria, fast crypto trading, secure crypto platform, crypto exchange Nigeria, cryptocurrency, blockchain, peer-to-peer trading, Nigeria crypto exchange, bitcoin";

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  children,
}) => {
  return (
    <Helmet defaultTitle={DEFAULT_TITLE} titleTemplate={`%s ${DEFAULT_TITLE}`}>
      {/* Primary tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {
        children /* allow extra tags per-page (e.g. <meta property="og:image" ... />) */
      }
    </Helmet>
  );
};

export default SEO;
