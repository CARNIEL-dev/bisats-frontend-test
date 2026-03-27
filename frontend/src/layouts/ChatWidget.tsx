import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    const zohoUrl = process.env.REACT_APP_ZOHO_URL;

    if (!zohoUrl) {
      console.warn("REACT_APP_ZOHO_URL is missing from environment variables.");
      return;
    }

    // Initialize the Zoho SalesIQ object
    (window as any).$zoho = (window as any).$zoho || {};
    (window as any).$zoho.salesiq =
      (window as any).$zoho.salesiq || { ready: function () {} };

    // Load the Zoho script
    const zohoScript = document.createElement("script");
    zohoScript.id = "zsiqscript";
    zohoScript.src = zohoUrl;
    zohoScript.defer = true;
    document.head.appendChild(zohoScript);

    // Cleanup on unmount
    return () => {
      if (document.head.contains(zohoScript)) {
        document.head.removeChild(zohoScript);
      }

      // Remove all Zoho-injected DOM elements
      const zohoElements = document.querySelectorAll(
        "#zsiq_float, #zsiq_maintitle, #zsiq_byline, #zsiqwrap, [id^='zsiq']",
      );
      zohoElements.forEach((el) => el.remove());

      // Clear the $zoho window object for fresh load next time
      if ((window as any).$zoho) {
        delete (window as any).$zoho;
      }
    };
  }, []);

  return null;
};

export default ChatWidget;
