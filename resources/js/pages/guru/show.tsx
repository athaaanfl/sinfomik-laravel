import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import guruRoutes from '@/routes/guru';
import { Guru, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';

interface Props {
    guru: Guru;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Guru',
        href: guruRoutes.index().url,
    },
    {
        title: 'Detail Guru',
        href: '#',
    },
];

export default function Show({ guru }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Guru - ${guru.nama}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Detail Guru
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap data guru
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 size-4" />
                            Kembali
                        </Button>
                        <Button asChild>
                            <Link href={guruRoutes.edit(guru.id)}>Edit</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pribadi</CardTitle>
                            <CardDescription>
                                Data pribadi guru
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="mt-1 size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Nama Lengkap
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {guru.nama}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium">NIP</p>
                                <p className="text-sm text-muted-foreground">
                                    {guru.nip}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Jenis Kelamin
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {guru.gender === 'laki-laki'
                                        ? 'Laki-laki'
                                        : 'Perempuan'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Tanggal Lahir
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {guru.tanggal_lahir
                                        ? new Date(
                                              guru.tanggal_lahir,
                                          ).toLocaleDateString('id-ID', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Kualifikasi
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {guru.kualifikasi || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Status Wali Kelas
                                </p>
                                {guru.is_wali_kelas ? (
                                    <Badge>Wali Kelas</Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        Bukan Wali Kelas
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kontak</CardTitle>
                            <CardDescription>
                                Data kontak dan alamat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-1 size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">
                                        {guru.user?.email || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="mt-1 size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Nomor Telepon
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {guru.nomor_telepon || '-'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium">Alamat</p>
                                <p className="text-sm text-muted-foreground">
                                    {guru.alamat || '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
