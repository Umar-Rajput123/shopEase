import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const data = await login(formData);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid credentials provided."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#fbfbf9] px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-500 hover:text-black mb-6 transition-colors"
        >
          ← Return to Home
        </Link>

        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-semibold mb-2">
            Maison Identification
          </p>

          <h1 className="font-editorial text-4xl font-normal text-neutral-950">
            Sign In to the House
          </h1>

          <p className="mt-2 text-xs text-neutral-500 font-light">
            Access your private account, reserved creations, and orders.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-neutral-200 bg-white p-8 sm:p-10 space-y-6 shadow-sm"
        >
          {message && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs text-center uppercase tracking-luxury">
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="client@luxury.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0a0a0a] text-white text-xs uppercase tracking-luxury-wide font-medium hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors shadow-md"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <div className="pt-4 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500 font-light">
              Do not have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-neutral-950 underline underline-offset-4 hover:text-neutral-600 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;