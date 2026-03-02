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
      if (document.body.contains(inlineScript)) {
        document.body.removeChild(inlineScript);
      }
      if (document.body.contains(zohoScript)) {
        document.body.removeChild(zohoScript);
      }

      // Zoho injects several containers into the body.
      // We must remove them so the chat widget disappears when navigating away from the dashboard.
      const zohoElements = document.querySelectorAll(
        "#zsiq_float, #zsiq_maintitle, #zsiq_byline, #zsiqwrap, [id^='zsiq']",
      );
      zohoElements.forEach((el) => el.remove());

      // Attempt to clear the $zoho window object to allow a fresh load next time
      if ((window as any).$zoho) {
        delete (window as any).$zoho;
      }
    };
  }, []);
  return null;
};

export default ChatWidget;
