import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import MainLayout from "./components/MainLayout/MainLayout";
import WebWorker from "./components/WebWorker/WebWorker";
import ServiceWorker from "./components/ServiceWorker/ServiceWorker";
import ProjectContext from "./ProjectContext";
import XSS from "./components/XSS/XSS";
import WithoutA11Y from "./components/Accessibility/WithoutA11Y";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/web-worker",
          element: <WebWorker />,
        },
        {
          path: "/service-worker",
          element: <ServiceWorker />,
        },
        {
          path: "xss",
          element: <XSS />,
        },
        {
          path: "accessibility",
          element: <WithoutA11Y />,
        },
      ],
    },
  ]);
  return (
    <div className="app">
      <ProjectContext>
        <RouterProvider router={routes} />
      </ProjectContext>
    </div>
  );
}

export default App;
