import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const DEFAULT_TITLE =
  "Bisats | Nigeria's Leading Peer-to-Peer Cryptocurrency Trading Platform";
const DEFAULT_DESCRIPTION =
  "Bisats makes crypto trading simple in Nigeria. Enjoy fast, secure, and seamless peer-to-peer Bitcoin and crypto transactions powered by blockchain automation.";
const DEFAULT_KEYWORDS =
  "best peer-to-peer crypto exchange Nigeria, how to buy bitcoin instantly in Nigeria, best crypto exchange Nigeria, bitcoin to naira, crypto trading platform Nigeria, buy bitcoin Nigeria, sell bitcoin Nigeria, fast crypto trading, secure crypto platform, crypto exchange Nigeria, cryptocurrency, blockchain, peer-to-peer trading, Nigeria crypto exchange, bitcoin, Bisats, Bisats Nigeria, Automated P2P, trusted P2P in Nigeria, Bybit, Binance";

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image,
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
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:secure_url" content={image} />}
      {image && <meta property="og:image:type" content="image/jpeg" />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}
      {image && <meta property="og:image:alt" content={title} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
