import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

function MainLayout() {
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
