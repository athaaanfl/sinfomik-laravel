import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import siswaRoutes from '@/routes/siswa';
import { type BreadcrumbItem, type Siswa } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, MapPin, Phone, User } from 'lucide-react';

interface Props {
    siswa: Siswa;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: siswaRoutes.index().url,
    },
    {
        title: 'Detail Siswa',
        href: '#',
    },
];

export default function Show({ siswa }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${siswa.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Data Siswa</h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap data siswa
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 size-4" />
                            Kembali
                        </Button>
                        <Link href={siswaRoutes.edit({ siswa: siswa.id })}>
                            <Button>
                                <Edit className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Data Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                    Nama Lengkap
                                </div>
                                <div className="col-span-2 text-sm">
                                    {siswa.nama_lengkap}
                                </div>
                            </div>

                            {siswa.nama_panggilan && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                        Nama Panggilan
                                    </div>
                                    <div className="col-span-2 text-sm">
                                        {siswa.nama_panggilan}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                    NIS
                                </div>
                                <div className="col-span-2 text-sm">
                                    {siswa.nis || '-'}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                    NISN
                                </div>
                                <div className="col-span-2 text-sm">
                                    {siswa.nisn || '-'}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                    Jenis Kelamin
                                </div>
                                <div className="col-span-2 text-sm">
                                    {siswa.gender}
                                </div>
                            </div>

                            {siswa.tempat_lahir && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                        Tempat Lahir
                                    </div>
                                    <div className="col-span-2 text-sm">
                                        {siswa.tempat_lahir}
                                    </div>
                                </div>
                            )}

                            {siswa.tanggal_lahir && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                        Tanggal Lahir
                                    </div>
                                    <div className="col-span-2 text-sm">
                                        {new Date(siswa.tanggal_lahir).toLocaleDateString(
                                            'id-ID',
                                            {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            },
                                        )}
                                    </div>
                                </div>
                            )}

                            {siswa.agama && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                        Agama
                                    </div>
                                    <div className="col-span-2 text-sm">{siswa.agama}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Data Sekolah */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Sekolah</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                    Tahun Masuk
                                </div>
                                <div className="col-span-2 text-sm">
                                    {siswa.tahun_masuk}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                    Status
                                </div>
                                <div className="col-span-2">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                            siswa.status === 'aktif'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                        }`}
                                    >
                                        {siswa.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {siswa.alamat && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">Alamat</div>
                                        <div className="text-sm text-muted-foreground">
                                            {siswa.alamat}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {siswa.nomor_telepon && (
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">
                                            Nomor Telepon
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {siswa.nomor_telepon}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Data Orang Tua/Wali */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Orang Tua/Wali</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {siswa.nama_ayah && (
                                <div className="flex items-start gap-3">
                                    <User className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">Nama Ayah</div>
                                        <div className="text-sm text-muted-foreground">
                                            {siswa.nama_ayah}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {siswa.nama_ibu && (
                                <div className="flex items-start gap-3">
                                    <User className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">Nama Ibu</div>
                                        <div className="text-sm text-muted-foreground">
                                            {siswa.nama_ibu}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {siswa.nomor_telepon_wali && (
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 size-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">
                                            Nomor Telepon Wali
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {siswa.nomor_telepon_wali}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Sistem</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                Dibuat pada
                            </div>
                            <div className="col-span-2 text-sm">
                                {new Date(siswa.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 text-sm font-medium text-muted-foreground">
                                Terakhir diperbarui
                            </div>
                            <div className="col-span-2 text-sm">
                                {new Date(siswa.updated_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
