import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, School, BookOpen, Users, ArrowRight } from 'lucide-react';
import guruRoutes from '@/routes/guru';
import { type BreadcrumbItem } from '@/types';

interface Penugasan {
    id: number;
    kelas: {
        id: number;
        nama: string;
        tingkat: number;
    };
    mata_pelajaran: {
        id: number;
        nama: string;
    };
    tahun_ajaran: {
        nama: string;
    };
    jumlah_siswa: number;
}

interface Props {
    penugasanList: Penugasan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penilaian',
        href: guruRoutes.nilai.list.url(),
    },
];

export default function GuruNilaiList({ penugasanList }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penilaian" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Penilaian</h1>
                    <p className="text-sm text-muted-foreground">
                        Pilih kelas dan mata pelajaran untuk input nilai
                    </p>
                </div>

                {/* Penugasan List */}
                {penugasanList.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12 text-muted-foreground">
                            <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Anda belum memiliki penugasan mengajar.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {penugasanList.map((penugasan) => (
                            <Card key={penugasan.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <School className="h-4 w-4" />
                                                {penugasan.kelas.nama}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {penugasan.tahun_ajaran.nama}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            Kelas {penugasan.kelas.tingkat}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Mata Pelajaran */}
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{penugasan.mata_pelajaran.nama}</span>
                                    </div>

                                    {/* Jumlah Siswa */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{penugasan.jumlah_siswa} Siswa</span>
                                    </div>

                                    {/* Action */}
                                    <Link href={guruRoutes.nilai.index.url({ penugasan: penugasan.id })}>
                                        <Button className="w-full mt-2">
                                            Input Nilai
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
