import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import MainLayout from "./components/MainLayout/MainLayout";
import WebWorker from "./components/WebWorker/WebWorker";
import ServiceWorker from "./components/ServiceWorker/ServiceWorker";
import ProjectContext from "./ProjectContext";

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
