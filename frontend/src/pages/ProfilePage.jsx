import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilePhotoFallback from "../assets/profile/photo_profile.png";
import bannerImage from "../assets/profile/ilustrasi_laptop.png";
import API_BASE_URL from "../utils/apiBaseUrl";

const topNav = ["Halaman Utama", "Pekerjaan"];

const scoreFields = [
  { key: "BI", label: "Bahasa Indonesia" },
  { key: "MTK", label: "Matematika" },
  { key: "Bing", label: "Bahasa Inggris" },
];

const fallbackProfile = {
  photo_path: null,
  profil_detail: {
    jurusan: "Belum diisi",
    raport: {
      BI: "",
      MTK: "",
      Bing: "",
    },
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

function extractApiMessage(payload, fallback) {
  return payload?.Message || payload?.message || fallback;
}

function normalizeRaport(raport) {
  return {
    BI: raport?.BI ?? "",
    MTK: raport?.MTK ?? "",
    Bing: raport?.Bing ?? "",
  };
}

function mapProfile(payload) {
  const detail = payload?.profil_detail ?? payload?.profilDetail;
  const photoPath = payload?.photo_path ?? payload?.photoProfiles?.file ?? null;

  return {
    photo_path: photoPath,
    profil_detail: {
      jurusan: detail?.jurusan ?? "Belum diisi",
      raport: normalizeRaport(detail?.raport ?? detail?.raportScore),
    },
  };
}

function resolveImageSource(photoPath, cacheKey) {
  if (!photoPath) {
    return profilePhotoFallback;
  }

  if (
    photoPath.startsWith("http://") ||
    photoPath.startsWith("https://") ||
    photoPath.startsWith("/")
  ) {
    if (!cacheKey) {
      return photoPath;
    }

    const separator = photoPath.includes("?") ? "&" : "?";
    return `${photoPath}${separator}v=${cacheKey}`;
  }

  return profilePhotoFallback;
}

async function fetchProfile(token) {
  const endpoints = ["/profile/getSpecificProfile", "/profile/getSpecific"];
  let lastMessage = "Gagal mengambil data profil";

  for (const endpoint of endpoints) {
    const requestUrl = `${API_BASE_URL}${endpoint}?t=${Date.now()}`;
    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const raw = await response.text();
    const data = safeParseJson(raw);

    if (response.ok && data?.Success) {
      return data.Information;
    }

    if (response.status === 401) {
      throw new Error("Sesi login berakhir. Silakan login ulang.");
    }

    lastMessage = extractApiMessage(data, lastMessage);
  }

  throw new Error(lastMessage);
}

function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [notice, setNotice] = useState({ text: "", error: false });
  const [imageCacheKey, setImageCacheKey] = useState(Date.now());

  const [jurusan, setJurusan] = useState("");
  const [raport, setRaport] = useState(normalizeRaport(null));
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);
      setNotice({ text: "", error: false });

      try {
        const info = await fetchProfile(token);
        const mapped = mapProfile(info);

        setProfile(mapped);
        setImageCacheKey(Date.now());
        setJurusan(mapped.profil_detail.jurusan === "Belum diisi" ? "" : mapped.profil_detail.jurusan);
        setRaport(normalizeRaport(mapped.profil_detail.raport));
      } catch (error) {
        const fallback = "Gagal mengambil data profil";
        if (error?.message === "Sesi login berakhir. Silakan login ulang.") {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        const message =
          error?.message === "Failed to fetch"
            ? `Tidak bisa terhubung ke server profile. Endpoint aktif: ${API_BASE_URL}/profile/getSpecificProfile`
            : error?.message || fallback;

        setNotice({ text: message, error: true });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, token]);

  const scoreCards = useMemo(
    () =>
      scoreFields.map((field) => ({
        ...field,
        value: profile.profil_detail.raport[field.key] ?? "Belum diisi",
      })),
    [profile],
  );

  const profileImage = previewUrl || resolveImageSource(profile.photo_path, imageCacheKey);

  const openEditModal = () => {
    setNotice({ text: "", error: false });
    setJurusan(profile.profil_detail.jurusan === "Belum diisi" ? "" : profile.profil_detail.jurusan);
    setRaport(normalizeRaport(profile.profil_detail.raport));
    setPhotoFile(null);
    setPreviewUrl("");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setPhotoFile(null);
    setPreviewUrl("");
  };

  const handleScoreChange = (key, value) => {
    setRaport((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setPhotoFile(file);

    if (!file) {
      setPreviewUrl("");
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!photoFile) {
      setNotice({ text: "Pilih foto profil terlebih dahulu.", error: true });
      return;
    }

    setSaving(true);
    setNotice({ text: "", error: false });

    try {
      const payload = new FormData();
      payload.append("file", photoFile);
      payload.append("jurusan", jurusan.trim());
      payload.append(
        "raport",
        JSON.stringify({
          BI: Number(raport.BI || 0),
          MTK: Number(raport.MTK || 0),
          Bing: Number(raport.Bing || 0),
        }),
      );

      const response = await fetch(`${API_BASE_URL}/profile/updateProfile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const raw = await response.text();
      const data = safeParseJson(raw);

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok || !data?.Success) {
        throw new Error(extractApiMessage(data, "Gagal menyimpan profil"));
      }

      const mapped = mapProfile(data.Information);
      setProfile(mapped);
      setJurusan(mapped.profil_detail.jurusan === "Belum diisi" ? "" : mapped.profil_detail.jurusan);
      setRaport(normalizeRaport(mapped.profil_detail.raport));
      setImageCacheKey(Date.now());

      try {
        const freshInfo = await fetchProfile(token);
        const freshMapped = mapProfile(freshInfo);
        setProfile(freshMapped);
        setJurusan(freshMapped.profil_detail.jurusan === "Belum diisi" ? "" : freshMapped.profil_detail.jurusan);
        setRaport(normalizeRaport(freshMapped.profil_detail.raport));
        setImageCacheKey(Date.now());
      } catch {
        // Keep the successful update response as source of truth if refresh fails.
      }

      setPhotoFile(null);
      setPreviewUrl("");
      setIsEditOpen(false);
      setNotice({ text: "Profil berhasil diperbarui.", error: false });
    } catch (error) {
      const message =
        error?.message === "Failed to fetch"
          ? `Tidak bisa terhubung ke server saat update profil. Endpoint aktif: ${API_BASE_URL}/profile/updateProfile`
          : error?.message || "Gagal menyimpan profil";

      setNotice({ text: message, error: true });
    } finally {
      setSaving(false);
    }
  };

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
            <button type="button" className="text-[13px] hover:text-white">🔔</button>
            <button type="button" className="text-[13px] hover:text-white">🔍</button>
            <button type="button" className="text-[13px] hover:text-white">👤</button>
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
                className="absolute bottom-4 right-4 rounded-full bg-[#2a2d38]/80 px-4 py-2 text-[12px] font-semibold text-[#c5cad6] backdrop-blur-sm transition hover:bg-[#34384a] hover:text-white"
              >
                Edit Profil
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
                <h1 className="text-[22px] font-bold leading-tight text-white">Profil Saya</h1>
                <p className="text-[14px] leading-relaxed text-[#aeb4c2]">
                  Jurusan: {profile.profil_detail.jurusan || "Belum diisi"}
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
              </div>
            </div>
          </article>

          <section className="rounded-[20px] border border-white/5 bg-[#1d2027] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-semibold text-white">Nilai Mata Pelajaran</h2>
                <p className="mt-1 text-[12px] text-[#8b92a1]">Nilai raport yang sudah tersimpan.</p>
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
                onClick={closeEditModal}
                className="rounded-full border border-white/10 px-3 py-2 text-[12px] text-[#b7becb] transition hover:border-white/20 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSave}>
              <input
                name="jurusan"
                value={jurusan}
                onChange={(event) => setJurusan(event.target.value)}
                placeholder="Jurusan"
                className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
              />

              <div>
                <label className="mb-2 block text-[12px] text-[#cfd5e2]" htmlFor="photo-file">
                  Foto Profil
                </label>
                <input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-3 py-2 text-[12px] text-[#f2f2f2] file:mr-3 file:rounded-md file:border-0 file:bg-[#0c66c2] file:px-3 file:py-2 file:text-white"
                />
              </div>

              {scoreFields.map((field) => (
                <input
                  key={field.key}
                  inputMode="decimal"
                  type="number"
                  name={field.key}
                  value={raport[field.key]}
                  onChange={(event) => handleScoreChange(field.key, event.target.value)}
                  placeholder={`Nilai ${field.label}`}
                  className="h-[42px] w-full rounded-[10px] border border-[#5a5f6a] bg-transparent px-4 text-[14px] text-[#f2f2f2] outline-none placeholder:text-[#7f8591] focus:border-[#9ca3af]"
                />
              ))}

              {notice.text ? (
                <p className={`text-sm ${notice.error ? "text-red-400" : "text-emerald-400"}`}>
                  {notice.text}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
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
