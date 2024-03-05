import { useEffect, useState } from "react";

export const usePWADisplayMode = () => {
  const [PWAStatus, setPWAStatus] = useState("browser");

  const getPWADisplayMode = () => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    if (document.referrer.startsWith("android-app://")) {
      setPWAStatus("twa");
    } else if (navigator.standalone || isStandalone) {
      setPWAStatus("standalone");
    } else {
      setPWAStatus("browser");
    }

    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", (evt) => {
        let displayMode = "browser";
        setPWAStatus("browser");
        if (evt.matches) {
          displayMode = "standalone";
          setPWAStatus("standalone");
        }
      });
  };

  useEffect(() => {
    getPWADisplayMode();

    return () => {};
  }, []);

  return PWAStatus;
};
