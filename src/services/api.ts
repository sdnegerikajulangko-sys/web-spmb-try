// Service to interact with Google Apps Script Backend

// To use the real backend, replace this URL with your deployed Google Apps Script Web App URL
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyAScqGXVbmreMwHkwbNzER1phC69MDFfvYCk5a9QZf0ed9wTjHg2l7J9W2a29-DQ0Weg/exec"; 

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'file' | 'textarea';
  options?: string[];
  required: boolean;
}

export interface PanduanDokumen {
  id: string;
  icon: 'FileDigit' | 'FileBadge' | 'FileImage' | 'FileText';
  title: string;
  description: string;
}

export interface AppSettings {
  namaSekolah: string;
  alamat: string;
  telepon: string;
  email: string;
  deskripsi: string;
  statusPendaftaran: 'Buka' | 'Tutup';
  formFields: FormField[];
  persyaratanDaftarUlang?: string;
  tanggalDaftarUlang?: string;
  tanggalPengumuman?: string;
  logoSekolah?: string;
  kopSurat?: string;
  namaKepalaSekolah?: string;
  tandaTanganKepalaSekolah?: string;
  stempelSekolah?: string;
  tahunPendaftaran?: string;
  nomorSurat?: string;
  tempatSurat?: string;
  tanggalSurat?: string;
  nipKepalaSekolah?: string;
  catatanTambahan?: string;
  gambarHeaderBeranda?: string;
  koordinatSekolah?: string;
  sambutanKepalaSekolah?: string;
  fotoKepalaSekolah?: string;
  visiSekolah?: string;
  misiSekolah?: string;
  panduanJudul?: string;
  panduanDeskripsi?: string;
  panduanPeringatan?: string;
  panduanDokumen?: PanduanDokumen[];
  panduanAlur?: string[];
}

export interface RegistrationData {
  [key: string]: any;
}

export interface AdminData extends RegistrationData {
  Timestamp: string;
  'No Pendaftaran': string;
  Status: 'Proses' | 'Lulus' | 'Tidak Lulus';
  'Alasan Penolakan'?: string;
}

// --- AUTH HELPER FUNCTIONS ---
export const getStoredUser = () => {
  const stored = localStorage.getItem('user_session');
  return stored ? JSON.parse(stored) : null;
};

export const clearStoredUser = () => {
  localStorage.removeItem('user_session');
};

// --- MOCK DATA INITIALIZATION ---
const getInitialMockSettings = (): AppSettings => {
  const defaultSettings: AppSettings = {
    namaSekolah: "SD Negeri Kajulangko",
    alamat: "Jl. Pendidikan, Desa Kajulangko, Kec. Ampana Tete",
    telepon: "+62 822-9294-5790",
    email: "sdnegerikajulangko@gmail.com",
    deskripsi: "Mencetak generasi penerus bangsa yang Beriman, Kompeten, Mandiri, Berdaya Saing Global, Adaptif dan Responsif Terhadap Perkembangan Zaman.",
    statusPendaftaran: "Buka",
    persyaratanDaftarUlang: "1. Membawa Bukti Kelulusan\n2. Fotokopi Akta\n3. Fotokopi KK",
    tanggalDaftarUlang: "2026-07-15",
    tanggalPengumuman: "",
    logoSekolah: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    tahunPendaftaran: new Date().getFullYear().toString(),
    koordinatSekolah: "-0.9071117,121.5844096",
    sambutanKepalaSekolah: "Selamat datang di website resmi SPMB SD Negeri Kajulangko...",
    fotoKepalaSekolah: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    visiSekolah: "Menjadi sekolah dasar unggulan...",
    misiSekolah: "1. Menyelenggarakan pembelajaran aktif...",
    formFields: [
      { id: "Nama Lengkap", label: "Nama Lengkap", type: "text", required: true },
      { id: "NIK", label: "NIK", type: "text", required: true }
    ],
    panduanJudul: "Panduan Pendaftaran SPMB",
    panduanDeskripsi: "Persiapkan dokumen berikut...",
    panduanPeringatan: "Pastikan semua dokumen jelas...",
    panduanDokumen: [
      { id: "1", icon: "FileDigit", title: "Kartu Keluarga (KK)", description: "Asli atau fotokopi." }
    ],
    panduanAlur: ["Siapkan dokumen", "Isi formulir", "Kirim"]
  };

  const stored = localStorage.getItem('mockSettings');
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch (e) {
      console.error(e);
    }
  }
  return defaultSettings;
};

let mockSettings: AppSettings = getInitialMockSettings();

const saveMockSettings = (settings: AppSettings) => {
  mockSettings = settings;
  try {
    localStorage.setItem('mockSettings', JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
};

const getInitialMockData = (): AdminData[] => {
  const stored = localStorage.getItem('mockData');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      Timestamp: new Date().toISOString(),
      'No Pendaftaran': "SPMB-2026-001",
      'Nama Lengkap': "Afdhal Aditya",
      'NIK': "1234567890123456",
      Status: "Proses"
    }
  ];
};

let mockData: AdminData[] = getInitialMockData();

const saveMockData = (data: AdminData[]) => {
  mockData = data;
  localStorage.setItem('mockData', JSON.stringify(data));
};

// --- API EXPORTS ---

export const getSettings = async (): Promise<AppSettings> => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockSettings };
  }
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getSettings&t=${Date.now()}`);
    const result = await response.json();
    if (result.status === "success") {
      return {
        ...result.data,
        formFields: typeof result.data.formFields === 'string' ? JSON.parse(result.data.formFields) : result.data.formFields
      };
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const updateSettings = async (settings: Partial<AppSettings>) => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 800));
    saveMockSettings({ ...mockSettings, ...settings });
    return { status: "success" };
  }
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "updateSettings", settings }),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export const loginAdmin = async (username: string, password: string) => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (username === 'admin' && password === 'admin123') {
      const userData = {
        email: mockSettings.email,
        name: "Administrator"
      };
      localStorage.setItem('user_session', JSON.stringify(userData));
      return { status: "success", user: userData };
    }
    return { status: "error", message: "Username atau password salah" };
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", username, password }),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    const result = await response.json();
    if (result.status === "success") {
      localStorage.setItem('user_session', JSON.stringify(result.user));
    }
    return result;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutAdmin = () => {
  clearStoredUser();
  return { status: "success" };
};

export const submitRegistration = async (data: RegistrationData) => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (mockSettings.statusPendaftaran === 'Tutup') {
      return { status: "error", message: "Pendaftaran sedang ditutup." };
    }
    const year = mockSettings.tahunPendaftaran || new Date().getFullYear().toString();
    const newEntry: AdminData = {
      ...data,
      Timestamp: new Date().toISOString(),
      'No Pendaftaran': `SPMB-${year}-${String(mockData.length + 1).padStart(3, '0')}`,
      Status: 'Proses'
    };
    saveMockData([...mockData, newEntry]);
    return { status: "success", noPendaftaran: newEntry['No Pendaftaran'] };
  }
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting registration:", error);
    throw error;
  }
};

export const getRegistrations = async (): Promise<AdminData[]> => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [...mockData];
  }
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?t=${Date.now()}`);
    const result = await response.json();
    return result.status === "success" ? result.data : [];
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error;
  }
};

export const updateStatus = async (noPendaftaran: string, newStatus: string, alasan?: string) => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockData.findIndex(d => d['No Pendaftaran'] === noPendaftaran);
    if (index !== -1) {
      const newData = [...mockData];
      newData[index] = { ...newData[index], Status: newStatus as any };
      if (alasan !== undefined) newData[index]['Alasan Penolakan'] = alasan;
      saveMockData(newData);
      return { status: "success" };
    }
    throw new Error("Data not found");
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "updateStatus", noPendaftaran, newStatus, alasan }),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const checkStatus = async (noPendaftaran: string) => {
  if (!GAS_WEB_APP_URL) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const student = mockData.find(d => d['No Pendaftaran'] === noPendaftaran);
    if (student) {
      const namaKey = Object.keys(student).find(k => k.toLowerCase().includes('nama')) || 'Nama Lengkap';
      return { 
        status: "success", 
        data: {
          noPendaftaran: student['No Pendaftaran'],
          namaLengkap: student[namaKey] || 'Siswa',
          status: student.Status,
          alasanPenolakan: student['Alasan Penolakan']
        }
      };
    }
    return { status: "error", message: "Data tidak ditemukan" };
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "checkStatus", noPendaftaran }),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error checking status:", error);
    throw error;
  }
};
