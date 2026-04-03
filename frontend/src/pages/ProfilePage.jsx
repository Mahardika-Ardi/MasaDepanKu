import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilePhotoFallback from "../assets/profile/photo_profile.png";
import bannerImage from "../assets/profile/ilustrasi_laptop.png";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const topNav = ["Halaman Utama", "Jaringan Saya", "Pekerjaan", "Pesan"];
const scoreFields = [
  { key: "bahasa_indonesia", label: "Nilai Mata Pelajaran Bahasa Indonesia" },
  { key: "bahasa_inggris", label: "Nilai Mata Pelajaran Bahasa Inggris" },
  { key: "matematika", label: "Nilai Mata Pelajaran Matematika" },
  { key: "konsentrasi_keahlian", label: "Nilai Mata Pelajaran Konsentrasi Keahlian" },
];

const emptyScores = scoreFields.reduce((accumulator, field) => {
  accumulator[field.key] = "";
  return accumulator;
}, {});

const fallbackProfile = {
  user: {
    name: "Salman Falah Taqiyuddin",
    email: "",
    role: "USER",
  },
  photo_path: null,
  profil_detail: {
    first_name: "Salman",
    last_name: "Falah Taqiyuddin",
    motto: "Aspiring Mobile App Developer | Transforming Ideas into Reality with Flutter & Dart",
    country: "Indonesia",
    city: "Kota Malang",
    scores: emptyScores,
  },
};

function safeParseJson(raw) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function splitName(fullName = "") {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return { first_name: "", last_name: "" };
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return { first_name: parts[0], last_name: "" };
  }

  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}

function normalizeScores(scores) {
  return scoreFields.reduce((accumulator, field) => {
    accumulator[field.key] = scores?.[field.key] ?? "";
    return accumulator;
  }, {});
}

function buildUpdatePayload(formData) {
  const payload = {};

  for (const key of ["first_name", "last_name", "motto", "country", "city"]) {
    const value = formData[key]?.trim();
    if (value) {
      payload[key] = value;
    }
  }

  const scores = {};

  for (const field of scoreFields) {
    const value = formData.scores?.[field.key];
    if (value !== "" && value !== null && value !== undefined) {
      scores[field.key] = Number(value);
    }
  }

  if (Object.keys(scores).length > 0) {
    payload.scores = scores;
  }

  return payload;
}

function buildProfileState(payload) {
  const profile = payload ?? {};
  const detail = profile.profil_detail ?? {};
  const nameFromUser = profile.user?.name ?? "";
  const names = detail.first_name || detail.last_name
    ? {
        first_name: detail.first_name ?? "",
        last_name: detail.last_name ?? "",
      }
    : splitName(nameFromUser);

  return {
    user: {
      name: nameFromUser || fallbackProfile.user.name,
      email: profile.user?.email ?? fallbackProfile.user.email,
      role: profile.user?.role ?? fallbackProfile.user.role,
    },
    photo_path: profile.photo_path ?? null,
    profil_detail: {
      first_name: names.first_name,
      last_name: names.last_name,
      motto: detail.motto ?? fallbackProfile.profil_detail.motto,
      country: detail.country ?? fallbackProfile.profil_detail.country,
      city: detail.city ?? fallbackProfile.profil_detail.city,
      scores: normalizeScores(detail.scores ?? detail.raport),
    },
  };
}

function buildFormState(profile) {
  return {
    first_name: profile.profil_detail.first_name ?? "",
    last_name: profile.profil_detail.last_name ?? "",
    motto: profile.profil_detail.motto ?? "",
    country: profile.profil_detail.country ?? "",
    city: profile.profil_detail.city ?? "",
    scores: normalizeScores(profile.profil_detail.scores),
  };
}

function resolveImageSource(photoPath) {
  if (!photoPath) {
    return profilePhotoFallback;
  }

  if (photoPath.startsWith("http://") || photoPath.startsWith("https://") || photoPath.startsWith("/")) {
    return photoPath;
  }

  return profilePhotoFallback;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(fallbackProfile);
  const [form, setForm] = useState(buildFormState(fallbackProfile));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [notice, setNotice] = useState({ text: "", error: false });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/profile/getSpecific`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const raw = await response.text();
        const data = safeParseJson(raw);

        if (!response.ok || !data?.Success) {
          throw new Error(data?.Message || "Gagal mengambil data profil");
        }

        const nextProfile = buildProfileState(data.Information);
        setProfile(nextProfile);
        setForm(buildFormState(nextProfile));
      } catch (error) {
        setNotice({ text: error.message, error: true });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, token]);

  const displayName = useMemo(() => {
    const firstName = profile.profil_detail.first_name?.trim();
    const lastName = profile.profil_detail.last_name?.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    return fullName || profile.user.name;
  }, [profile]);

  const displayLocation = useMemo(() => {
    const city = profile.profil_detail.city?.trim();
    const country = profile.profil_detail.country?.trim();

    if (city && country) {
      return `${city}, ${country}`;
    }

    return city || country || "Lokasi belum diisi";
  }, [profile]);

  const scoreCards = useMemo(() => {
    return scoreFields.map((field) => ({
      ...field,
      value: profile.profil_detail.scores?.[field.key] || "Belum diisi",
    }));
  }, [profile]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleScoreChange = (fieldKey, value) => {
    setForm((previous) => ({
      ...previous,
      scores: {
        ...previous.scores,
        [fieldKey]: value,
      },
    }));
  };

  const openEditModal = () => {
    setNotice({ text: "", error: false });
    setForm(buildFormState(profile));
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    setNotice({ text: "", error: false });

    try {
      const payload = buildUpdatePayload(form);

      const response = await fetch(`${API_BASE_URL}/profile/updateProfile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      const data = safeParseJson(raw);

      if (!response.ok || !data?.Success) {
        throw new Error(data?.Message || "Gagal menyimpan profil");
      }

      const nextProfile = buildProfileState(data.Information);
      setProfile(nextProfile);
      setForm(buildFormState(nextProfile));
      setIsEditOpen(false);
      setNotice({ text: "Profil berhasil diperbarui.", error: false });
    } catch (error) {
      setNotice({ text: error.message, error: true });
    } finally {
      setSaving(false);
    }
  };

  const profileImage = resolveImageSource(profile.photo_path);

  return (
    <main className="min-h-screen bg-[#191b22] text-[#d7dae2]">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-3 lg:px-6">
        <header className="mb-6 h-10 rounded-[2px] bg-[#23262d] px-5 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
          <nav className="flex h-full items-center justify-center gap-8 text-[12px] text-[#b7becb]">
            {topNav.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === "Halaman Utama") {
                    navigate("/beranda");
                  }
                }}
                className="transition hover:text-white"
              >
                {item}
              </button>
            ))}
            <button type="button" className="text-[13px] hover:text-white">
              🔔
            </button>
            <button type="button" className="text-[13px] hover:text-white">
              🔍
            </button>
            <button type="button" className="text-[13px] hover:text-white">
              👤
            </button>
          </nav>
        </header>

        <div className="mx-auto max-w-[760px] space-y-4">
          <article className="overflow-hidden rounded-[20px] border border-white/5 bg-[#1d2027] shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
            <div className="relative h-[220px] w-full overflow-hidden bg-gradient-to-br from-[#111318] via-[#1a1d26] to-[#0e1015]">
              <img
                src={bannerImage}
                alt="Banner profil"
                className="absolute right-0 top-0 h-full w-auto object-cover opacity-90"
              />
              <button
                type="button"
                onClick={openEditModal}
                className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#2a2d38]/80 text-[#c5cad6] backdrop-blur-sm transition hover:bg-[#34384a] hover:text-white"
                aria-label="Edit profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            <div className="relative px-6 pb-6">
              <div className="absolute -top-14 left-6">
                <img
                  src={profileImage}
                  alt="Foto profil"
                  className="h-[112px] w-[112px] rounded-full border-4 border-[#1d2027] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div className="pt-16" />

              <div className="space-y-1">
                <h1 className="text-[22px] font-bold leading-tight text-white">
                  {displayName}
                </h1>
                <p className="text-[14px] leading-relaxed text-[#aeb4c2]">
                  {profile.profil_detail.motto}
                </p>
                <p className="text-[12px] text-[#7f8899]">
                  {displayLocation}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openEditModal}
                  className="rounded-full bg-[#1284ff] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2d93ff]"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#3f4553] px-5 py-2 text-[13px] font-semibold text-[#d7dae2] transition hover:border-[#5d6578] hover:text-white"
                >
                  Lihat Publik
                </button>
              </div>
            </div>
          </article>

          <section className="rounded-[20px] border border-white/5 bg-[#1d2027] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-semibold text-white">Nilai Mata Pelajaran</h2>
                <p className="mt-1 text-[12px] text-[#8b92a1]">
                  Nilai yang sudah diinput user akan tampil di sini.
                </p>
              </div>
              <button
                type="button"
                onClick={openEditModal}
                className="rounded-full border border-[#3d4557] px-4 py-2 text-[12px] font-semibold text-[#cfd5e2] transition hover:border-[#6387c5] hover:text-white"
              >
                Perbarui Nilai
              </button>
            </div>

            {loading ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {scoreFields.map((field) => (
                  <div key={field.key} className="animate-pulse rounded-[14px] border border-white/5 bg-[#232833] p-4">
                    <div className="h-3 w-3/4 rounded bg-white/10" />
                    <div className="mt-3 h-6 w-20 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {scoreCards.map((item) => (
                  <article key={item.key} className="rounded-[14px] border border-white/5 bg-[#232833] p-4">
                    <p className="text-[12px] leading-relaxed text-[#aeb4c2]">{item.label}</p>
                    <p className="mt-2 text-[22px] font-semibold text-white">{item.value}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          {notice.text ? (
            <p className={`text-sm ${notice.error ? "text-red-400" : "text-emerald-400"}`}>
              {notice.text}
            </p>
          ) : null}
        </div>
      </div>

      {isEditOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-[520px] rounded-[28px] border border-white/5 bg-[#1b1d23] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.65)] max-h-[calc(100vh-32px)] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-[34px] font-semibold leading-none text-white">Edit Profile</h2>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full border border-white/10 px-3 py-2 text-[12px] text-[#b7becb] transition hover:border-white/20 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleInputChange}
                placeholder="Nama Depan"
                className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
              />
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleInputChange}
                placeholder="Nama Belakang"
                className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
              />
              <input
                name="motto"
                value={form.motto}
                onChange={handleInputChange}
                placeholder="Moto Profesional"
                className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
              />

              {scoreFields.map((field) => (
                <input
                  key={field.key}
                  inputMode="decimal"
                  type="number"
                  name={field.key}
                  value={form.scores[field.key]}
                  onChange={(event) => handleScoreChange(field.key, event.target.value)}
                  placeholder={field.label}
                  className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
                />
              ))}

              <input
                name="country"
                value={form.country}
                onChange={handleInputChange}
                placeholder="Negara"
                className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleInputChange}
                placeholder="Kota"
                className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
              />

              {notice.text ? (
                <p className={`text-sm ${notice.error ? "text-red-400" : "text-emerald-400"}`}>
                  {notice.text}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="h-[44px] rounded-full border border-[#4b5160] text-[14px] font-semibold text-[#cfd4df] transition hover:border-[#697187] hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-[44px] rounded-full bg-[#0c66c2] text-[14px] font-semibold text-white transition hover:bg-[#0a5ab0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Memproses..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default ProfilePage;
