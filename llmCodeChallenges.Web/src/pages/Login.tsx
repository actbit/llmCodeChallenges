import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import { authApi } from "../api/auth";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authApi.login({ email, password });
      // Set a simple cookie so Header can detect logged-in state.
      document.cookie = `auth_token=${result.userId}; path=/; SameSite=Lax`;
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="relative flex h-auto min-h-screen w-full flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-lg py-5 flex-1">
              <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
                Login to your account
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap items-end gap-4 px-4 py-3 mx-auto min-w-[45vw]">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
                    <input
                      placeholder="Enter your email"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1c2127] focus:border-[#3b4754] h-14 placeholder:text-[#9dabb9] p-[15px] text-base font-normal leading-normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-end gap-4 px-4 py-3 mx-auto min-w-[45vw]">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-white text-base font-medium leading-normal pb-2">Password</p>
                    <input
                      placeholder="Enter your password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1c2127] focus:border-[#3b4754] h-14 placeholder:text-[#9dabb9] p-[15px] text-base font-normal leading-normal"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="flex px-4 py-3 mx-auto min-w-[45vw]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0d6ecc] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">{loading ? "Logging in..." : "Login"}</span>
                  </button>
                </div>
                {error && (
                  <p className="px-4 text-[#fca5a5] text-sm font-normal leading-normal">{error}</p>
                )}
              </form>
              <Link
                to="/signup"
                className="text-[#9dabb9] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline"
              >
                Don't have an account? Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;

