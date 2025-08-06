import { FC, PropsWithChildren } from "react";
import { Helmet } from "react-helmet";

const MetaTag: FC<PropsWithChildren<{ title: string; description: string }>> = (
  props
) => {
  const { title, description } = props;
  return (
    <Helmet>
      <meta name="description" content={description} />
      <title> {title}</title>
      {props.children}
    </Helmet>
  );
};

export default MetaTag;
