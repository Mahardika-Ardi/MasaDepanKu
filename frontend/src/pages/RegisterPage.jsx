import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const isDisabled = useMemo(() => {
    return (
      status.loading || !form.name || !form.email || form.password.length < 6
    );
  }, [form, status.loading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setStatus({ loading: true, message: "", error: false });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.Success) {
        throw new Error(data.Message || "Register gagal");
      }

      setStatus({
        loading: false,
        message: "Register berhasil. Silakan login.",
        error: false,
      });
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 700);
    } catch (error) {
      setStatus({ loading: false, message: error.message, error: true });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1f2128] px-4 py-10">
      <section className="w-full max-w-[450px] rounded-[22px] border border-black/25 bg-[#17191f] p-10 text-[#e9e9ea] shadow-[0_18px_35px_rgba(0,0,0,0.45)]">
        <h1 className="mb-7 text-[53px] font-semibold leading-[0.95] tracking-[-0.025em] text-[#f3f3f3]">
          Bergabung dengan MasaDepanKu.id
        </h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="sr-only">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama"
              className="h-[43px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="h-[43px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Kata sandi
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Kata sandi (6+ karakter)"
              className="h-[43px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 pr-24 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#3a98e6] hover:text-[#64b5f6]"
            >
              {showPassword ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>

          <p className="pt-1 text-[14px] leading-[1.45] text-[#8a909b]">
            Dengan mengeklik Setuju & Bergabung, Anda menyetujui
            <span className="text-[#3a98e6]"> Perjanjian Pengguna</span>,
            <span className="text-[#3a98e6]"> Kebijakan Privasi</span>, dan
            <span className="text-[#3a98e6]"> Kebijakan Cookie</span>{" "}
            MasaDepanKu.id.
          </p>

          {status.message ? (
            <p
              className={`text-sm ${status.error ? "text-red-400" : "text-emerald-400"}`}
            >
              {status.message}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="submit"
              disabled={isDisabled}
              className="h-[44px] rounded-full bg-[#0c66c2] text-[14px] font-semibold text-white transition hover:bg-[#0a5ab0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status.loading ? "Memproses..." : "Lanjutkan"}
            </button>
            <button
              type="button"
              className="flex h-[44px] items-center justify-center gap-2 rounded-full bg-white text-[14px] font-medium text-[#212529] transition hover:bg-[#f3f3f3]"
            >
              <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#d7d7d7] text-[11px] font-semibold text-[#ea4335]">
                G
              </span>
              Masuk dengan Google
            </button>
          </div>
        </form>

        <p className="mt-7 text-center text-[20px] text-[#b8bcc4]">
          Sudah bergabung di MasaDepanku.id?
          <Link
            to="/login"
            className="ml-1 font-medium text-[#3a98e6] hover:text-[#64b5f6]"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
