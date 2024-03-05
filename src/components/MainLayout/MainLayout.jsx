import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { useContext, useEffect } from "react";
import { MainContext } from "../../ProjectContext";
import { usePWADisplayMode } from "../ServiceWorker/usePWADisplayMode";

function MainLayout() {
  const [_, dispatch] = useContext(MainContext);
  const PWAStatus = usePWADisplayMode();

  useEffect(() => {
    dispatch({
      type: "UPDATE_PWA_STATUS",
      value: PWAStatus,
    });
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      dispatch({
        type: "UPDATE_DEFERRED_PROMPT",
        value: event,
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      dispatch({
        type: "UPDATE_PWA_INSTALLED",
        value: true,
      });
    });

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      dispatch({
        type: "UPDATE_PWA_INSTALLED",
        value: true,
      });
    }

    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", (evt) => {
        let displayMode = "browser";
        dispatch({
          type: "UPDATE_PWA_STATUS",
          value: "browser",
        });
        if (evt.matches) {
          displayMode = "standalone";
          dispatch({
            type: "UPDATE_PWA_STATUS",
            value: "standalone",
          });
        }
      });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);
  return (
    <div>
      <Header />
      <div className="p-5">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
