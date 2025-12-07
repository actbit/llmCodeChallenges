import { Link } from "react-router-dom";
import { useMemo } from "react";

function Header() {
  const isLoggedIn = useMemo(() => {
    // Check if auth token exists in cookies
    const authToken = document.cookie.split("; ").find((row) => row.startsWith("auth_token="));

    return !!authToken;
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-10 py-3">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity"
        >
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect width="48" height="48" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Code Challenge
          </h2>
        </Link>
        <div className="flex items-center gap-9">
          <Link to={"/"} className="text-white text-sm font-medium leading-normal">
            Explore
          </Link>
          <Link to={"/publish"} className="text-white text-sm font-medium leading-normal">
            Publish
          </Link>
        </div>
      </div>
      {!isLoggedIn && (
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-[#3b4754] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#283039] transition-colors">
              <span className="truncate">Login</span>
            </button>
          </Link>
          <Link to="/signup">
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0d6ecc] transition-colors">
              <span className="truncate">Sign up</span>
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
export default Header;
