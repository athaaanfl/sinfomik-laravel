import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    success?: string;
    error?: string;
    info?: string;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Siswa {
    id: number;
    nama_lengkap: string;
    nama: string;
    nama_panggilan?: string;
    nis?: string;
    nisn?: string;
    tahun_masuk: number;
    status: 'Aktif' | 'Non Aktif';
    gender: 'laki-laki' | 'perempuan';
    tanggal_lahir?: string;
    tempat_lahir?: string;
    agama?: string;
    alamat?: string;
    nomor_telepon?: string;
    nama_ayah?: string;
    nama_ibu?: string;
    nomor_telepon_wali?: string;
    created_at: string;
    updated_at: string;
}

export interface Guru {
    id: number;
    user_id: number;
    nama: string;
    nip: string;
    gender: 'laki-laki' | 'perempuan';
    tanggal_lahir?: string;
    nomor_telepon?: string;
    alamat?: string;
    kualifikasi?: string;
    is_wali_kelas: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface TahunAjaran {
    id: number;
    kode_tahun_ajaran: string;
    tahun: string;
    tahunawal: string;
    tahunakhir: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface MataPelajaran {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    cp_fases?: CpFase[];
}

export interface CpFase {
    id: number;
    mata_pelajaran_id: number;
    fase: 'A' | 'B' | 'C';
    deskripsi: string;
    created_at: string;
    updated_at: string;
    mata_pelajaran?: MataPelajaran;
    elemen_pembelajarans?: ElemenPembelajaran[];
}

export interface ElemenPembelajaran {
    id: number;
    cp_fase_id: number;
    nama: string;
    urutan: number;
    created_at: string;
    updated_at: string;
    cp_fase?: CpFase;
    cp_elemen?: CpElemen;
}

export interface CpElemen {
    id: number;
    elemen_pembelajaran_id: number;
    deskripsi: string;
    created_at: string;
    updated_at: string;
    elemen_pembelajaran?: ElemenPembelajaran;
    tujuan_pembelajarans?: TujuanPembelajaran[];
}

export interface TujuanPembelajaran {
    id: number;
    cp_elemen_id: number;
    kode?: string;
    deskripsi: string;
    urutan: number;
    created_at: string;
    updated_at: string;
    cp_elemen?: CpElemen;
    tp_pemetaans?: TPPemetaan[];
}

export interface TPPemetaan {
    id: number;
    tujuan_pembelajaran_id: number;
    tingkat: number;
    semester_id: number;
    created_at: string;
    updated_at: string;
    semester?: Semester;
}

export interface Semester {
    id: number;
    tahun_ajaran_id: number;
    tipe: 'Ganjil' | 'Genap';
    created_at: string;
    updated_at: string;
    tahun_ajaran?: TahunAjaran;
}

export interface KelasMaster {
    id: number;
    nama: string;
    tingkat: number;
    created_at: string;
    updated_at: string;
}

export interface KelasSiswa {
    id: number;
    kelas_id: number;
    siswa_id: number;
    start_date: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
    siswa?: Siswa;
    nama?: string;
}

export interface Kelas {
    id: number;
    tahun_ajaran_id: number;
    nama: string; // Direct column in kelas table (e.g., "A", "B")
    tingkat: number; // Direct column in kelas table (1-12)
    homeroom_teacher_id?: number;
    nama_lengkap?: string; // Accessor: tingkat + nama (contoh: "1A")
    created_at: string;
    updated_at: string;
    tahun_ajaran?: TahunAjaran;
    wali_kelas?: Guru;
    guru?: Guru;
    homeroom_teacher?: Guru;
    wali_kelas?: Guru;
    siswas?: KelasSiswa[];
    siswas_count?: number;
    jumlah_siswa?: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
