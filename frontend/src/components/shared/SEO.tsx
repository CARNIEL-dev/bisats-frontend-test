import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const DEFAULT_TITLE = "Bisats";
const DEFAULT_DESCRIPTION = "Welcome to Bisats";

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  children,
}) => {
  return (
    <Helmet
      defaultTitle={DEFAULT_TITLE}
      titleTemplate={`%s | ${DEFAULT_TITLE}`}
    >
      {/* Primary tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

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
