import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, ClipboardList, School, Users } from 'lucide-react';
import guruRoutes from '@/routes/guru';
import { type BreadcrumbItem } from '@/types';
import type { Siswa } from '@/types';

interface MataPelajaran {
    id: number;
    nama: string;
    penugasan_id: number;
}

interface Props {
    kelas: {
        id: number;
        nama: string;
        tingkat: number;
        tahun_ajaran: string;
    };
    siswas: Siswa[];
    mataPelajarans: MataPelajaran[];
}

export default function GuruKelasShow({ kelas, siswas, mataPelajarans }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kelas Saya',
            href: guruRoutes.kelas.index.url(),
        },
        {
            title: kelas.nama,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kelas ${kelas.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kelas {kelas.nama}</h1>
                        <p className="text-sm text-muted-foreground">
                            Tingkat {kelas.tingkat} • {kelas.tahun_ajaran} • {siswas.length} Siswa
                        </p>
                    </div>
                </div>

                {/* Mata Pelajaran Actions */}
                {mataPelajarans.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {mataPelajarans.map((mapel) => (
                                    <div key={mapel.id} className="flex gap-2">
                                        <Link href={guruRoutes.kurikulum.show.url({ mataPelajaran: mapel.id })}>
                                            <Button variant="outline" size="sm">
                                                <BookOpen className="h-4 w-4 mr-2" />
                                                Kurikulum {mapel.nama}
                                            </Button>
                                        </Link>
                                        <Link href={guruRoutes.nilai.index.url({ penugasan: mapel.penugasan_id })}>
                                            <Button size="sm">
                                                <ClipboardList className="h-4 w-4 mr-2" />
                                                Nilai {mapel.nama}
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Daftar Siswa */}
                <div className="rounded-lg border bg-card">
                    {siswas.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Belum ada siswa di kelas ini
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>NISN</TableHead>
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead>Nama Panggilan</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {siswas.map((siswa, index) => (
                                    <TableRow key={siswa.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{siswa.nis || '-'}</TableCell>
                                        <TableCell>{siswa.nisn || '-'}</TableCell>
                                        <TableCell className="font-medium">{siswa.nama_lengkap}</TableCell>
                                        <TableCell>{siswa.nama_panggilan || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={siswa.gender === 'laki-laki' ? 'default' : 'secondary'}>
                                                    {siswa.gender === 'laki-laki' ? 'L' : 'P'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={siswa.status === 'Aktif' ? 'default' : 'destructive'}>
                                                    {siswa.status}
                                                </Badge>
                                            </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}