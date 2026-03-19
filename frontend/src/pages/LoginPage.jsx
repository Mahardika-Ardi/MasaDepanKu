import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const isDisabled = useMemo(() => {
    return status.loading || !form.email || !form.password;
  }, [form, status.loading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();
      localStorage.setItem("token", data.token);

      if (!response.ok || !data.Success) {
        throw new Error(data.Message || "Login gagal");
      }

      const token = data?.Information?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      setStatus({ loading: false, message: "Login berhasil.", error: false });
    } catch (error) {
      setStatus({ loading: false, message: error.message, error: true });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1f2128] px-4 py-10">
      <section className="w-full max-w-[450px] rounded-[22px] border border-black/25 bg-[#17191f] p-10 text-[#e9e9ea] shadow-[0_18px_35px_rgba(0,0,0,0.45)]">
        <h1 className="mb-7 text-[53px] font-semibold leading-[0.95] tracking-[-0.025em] text-[#f3f3f3]">
          Masuk ke MasaDepanKu.Id
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="loginEmail" className="sr-only">
              Email
            </label>
            <input
              id="loginEmail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="h-[43px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
            />
          </div>

          <div>
            <label htmlFor="loginPassword" className="sr-only">
              Kata sandi
            </label>
            <input
              id="loginPassword"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kata sandi"
              className="h-[43px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
            />
          </div>

          {status.message ? (
            <p
              className={`text-sm ${status.error ? "text-red-400" : "text-emerald-400"}`}
            >
              {status.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isDisabled}
            className="h-[44px] w-full rounded-full bg-[#0c66c2] text-[14px] font-semibold text-white transition hover:bg-[#0a5ab0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status.loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="mt-7 text-center text-[18px] text-[#b8bcc4]">
          Belum punya akun?
          <Link
            to="/register"
            className="ml-1 font-medium text-[#3a98e6] hover:text-[#64b5f6]"
          >
            Daftar
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
