import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    auth,
    jumlahSiswa = 0,
    jumlahGuru = 0,
    jumlahKelas = 0,
    tahunAjaranAktif = null,
    daftarMataPelajaran = [],
}: {
    auth: { user: { name: string; role: string } };
    jumlahSiswa?: number;
    jumlahGuru?: number;
    jumlahKelas?: number;
    tahunAjaranAktif?: any;
    daftarMataPelajaran?: any[];
}) {
    const userRole = auth.user.role;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">
                        Selamat Datang, {auth.user.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {userRole === 'admin' ? 'Administrator Dashboard' : 'Guru Dashboard'}
                    </p>
                </div>

                {userRole === 'admin' ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border p-6 flex flex-col items-center justify-center">
                                <p className="text-3xl font-bold">{jumlahSiswa}</p>
                                <p className="text-sm text-muted-foreground">Total Siswa</p>
                            </div>
                            <div className="rounded-xl border p-6 flex flex-col items-center justify-center">
                                <p className="text-3xl font-bold">{jumlahGuru}</p>
                                <p className="text-sm text-muted-foreground">Total Guru</p>
                            </div>
                            <div className="rounded-xl border p-6 flex flex-col items-center justify-center">
                                <p className="text-3xl font-bold">{jumlahKelas}</p>
                                <p className="text-sm text-muted-foreground">Total Kelas</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Guru Dashboard (bisa diisi sesuai kebutuhan) */}
                        <div className="text-center text-muted-foreground">Dashboard Guru</div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
