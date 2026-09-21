"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

const ChatBox: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    let script: HTMLScriptElement | null = null;

    // The support widget is non-critical. Waiting until the browser is idle keeps
    // it from competing with the banner, fonts and room data during first paint.
    const loadWidget = () => {
      if (document.querySelector('script[data-tawk-widget="true"]')) return;

      script = document.createElement("script");
      script.src = "https://embed.tawk.to/67e3bba4591d01190a171ab1/1in8p9uud";
      script.async = true;
      script.charset = "UTF-8";
      script.dataset.tawkWidget = "true";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
    };

    const timeoutId = window.setTimeout(loadWidget, 5000);

    // Optionally return a cleanup function to remove the script if the component unmounts
    return () => {
      window.clearTimeout(timeoutId);
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [pathname]);

  return null;
};

export default ChatBox;
