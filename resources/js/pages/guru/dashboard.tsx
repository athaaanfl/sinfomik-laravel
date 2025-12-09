import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Head } from '@inertiajs/react';
import { BookOpen, Users, ClipboardList, GraduationCap } from 'lucide-react';
import guruRoutes from '@/routes/guru';

interface MataPelajaranItem {
    id: number;
    nama: string;
    kelas_id: number;
    penugasan_id: number;
}

interface KelasItem {
    id: number;
    nama: string;
    tingkat: number;
    jumlah_siswa: number;
    penugasan_id: number;
}

interface MataPelajaranWithKelas {
    id: number;
    nama: string;
    kelas: KelasItem[];
}

interface DataWaliKelas {
    kelas: {
        id: number;
        nama: string;
        tingkat: number;
        tahun_ajaran: string;
        jumlah_siswa: number;
    };
    mata_pelajaran: MataPelajaranItem[];
}

interface DataBidangStudi {
    mata_pelajaran: MataPelajaranWithKelas[];
}

interface Props {
    isWaliKelas: boolean;
    dataWaliKelas?: DataWaliKelas;
    dataBidangStudi?: DataBidangStudi;
    tahunAjaran?: {
        id: number;
        nama: string;
    };
    error?: string;
}

export default function GuruDashboard({ isWaliKelas, dataWaliKelas, dataBidangStudi, tahunAjaran, error }: Props) {
    if (error) {
        return (
            <AppLayout>
                <Head title="Dashboard Guru" />
                <div className="container mx-auto p-6">
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="text-yellow-800">Informasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-yellow-700">{error}</p>
                            <p className="text-sm text-yellow-600 mt-2">
                                Silakan hubungi admin untuk penugasan mengajar Anda.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Dashboard Guru" />
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Guru</h1>
                    {tahunAjaran && (
                        <p className="text-muted-foreground">Tahun Ajaran {tahunAjaran.nama}</p>
                    )}
                </div>

                {/* Wali Kelas View */}
                {isWaliKelas && dataWaliKelas && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Wali Kelas
                                </CardTitle>
                                <CardDescription>
                                    Anda adalah wali kelas {dataWaliKelas.kelas.nama}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-lg">Kelas {dataWaliKelas.kelas.nama}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Tingkat {dataWaliKelas.kelas.tingkat} • {dataWaliKelas.kelas.jumlah_siswa} Siswa
                                            </p>
                                        </div>
                                        <Link href={guruRoutes.kelas.show.url({ kelas: dataWaliKelas.kelas.id })}>
                                            <Button>
                                                <Users className="h-4 w-4 mr-2" />
                                                Lihat Siswa
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Mata Pelajaran yang Diampu
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {dataWaliKelas.mata_pelajaran.map((mapel) => (
                                        <Card key={mapel.id}>
                                            <CardHeader>
                                                <CardTitle className="text-base">{mapel.nama}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <Link href={guruRoutes.kurikulum.show.url({ mataPelajaran: mapel.id })}>
                                                    <Button variant="outline" className="w-full" size="sm">
                                                        <BookOpen className="h-4 w-4 mr-2" />
                                                        Lihat Kurikulum
                                                    </Button>
                                                </Link>
                                                <Link href={guruRoutes.nilai.index.url({ penugasan: mapel.penugasan_id })}>
                                                    <Button className="w-full" size="sm">
                                                        <ClipboardList className="h-4 w-4 mr-2" />
                                                        Input Nilai
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Guru Bidang Studi View */}
                {!isWaliKelas && dataBidangStudi && (
                    <div className="space-y-6">
                        {dataBidangStudi.mata_pelajaran.map((mapel) => (
                            <Card key={mapel.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        {mapel.nama}
                                    </CardTitle>
                                    <CardDescription>
                                        Mengajar di {mapel.kelas.length} kelas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <Link href={guruRoutes.kurikulum.show.url({ mataPelajaran: mapel.id })}>
                                            <Button variant="outline">
                                                <BookOpen className="h-4 w-4 mr-2" />
                                                Lihat Kurikulum {mapel.nama}
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {mapel.kelas.map((kelas) => (
                                            <Card key={kelas.id}>
                                                <CardHeader>
                                                    <CardTitle className="text-base flex items-center justify-between">
                                                        Kelas {kelas.nama}
                                                        <Badge variant="secondary">Tingkat {kelas.tingkat}</Badge>
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {kelas.jumlah_siswa} Siswa
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <Link href={guruRoutes.kelas.show.url({ kelas: kelas.id })}>
                                                        <Button variant="outline" className="w-full" size="sm">
                                                            <Users className="h-4 w-4 mr-2" />
                                                            Lihat Siswa
                                                        </Button>
                                                    </Link>
                                                    <Link href={guruRoutes.nilai.index.url({ penugasan: kelas.penugasan_id })}>
                                                        <Button className="w-full" size="sm">
                                                            <ClipboardList className="h-4 w-4 mr-2" />
                                                            Input Nilai
                                                        </Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
