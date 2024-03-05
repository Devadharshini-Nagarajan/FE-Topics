import { createContext, useReducer } from "react";

const initialState = {
  deferredPrompt: null,
  isPWAInstalled: false,
  pwaStatus: "browser",
  name: "deva kd",
};
export const MainContext = createContext(initialState);

const reducer = (state, payload) => {
  switch (payload.type) {
    case "UPDATE_DEFERRED_PROMPT":
      return { ...state, deferredPrompt: payload.value };
    case "UPDATE_PWA_INSTALLED":
      return { ...state, isPWAInstalled: payload.value };
    case "UPDATE_PWA_STATUS":
      return { ...state, pwaStatus: payload.value };

    default:
      return state;
  }
};

const ProjectContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MainContext.Provider value={[state, dispatch]}>
      {children}
    </MainContext.Provider>
  );
};
export default ProjectContext;
