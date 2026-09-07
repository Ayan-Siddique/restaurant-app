import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-6">
      <div className="flex-1">
        <a className="text-xl font-bold">Restaurant</a>
      </div>

      <div className="flex-none flex items-center gap-4">
        <ul className="menu menu-horizontal px-1">
          <li>
             <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/menu">Menu</Link>
          </li>
        </ul>

        <ThemeToggle />
      </div>
    </div>
  );
}

export default Navbar;