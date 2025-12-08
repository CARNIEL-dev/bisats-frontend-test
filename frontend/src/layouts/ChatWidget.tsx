import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    const inlineScript = document.createElement("script");
    inlineScript.type = "text/javascript";
    inlineScript.text =
      "window.$zoho=window.$zoho || {};" +
      "$zoho.salesiq=$zoho.salesiq||{ready:function(){}};";

    const zohoScript = document.createElement("script");
    zohoScript.id = "zsiqscript";
    zohoScript.src = process.env.REACT_APP_ZOHO_URL!;
    zohoScript.defer = true;

    document.body.appendChild(inlineScript);
    document.body.appendChild(zohoScript);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(inlineScript);
      document.body.removeChild(zohoScript);
    };
  }, []);
  return null;
};

export default ChatWidget;
