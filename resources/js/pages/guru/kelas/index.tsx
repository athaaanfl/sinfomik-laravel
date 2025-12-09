import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Head, Link } from '@inertiajs/react';
import { School, Users, BookOpen, ArrowRight } from 'lucide-react';
import guruRoutes from '@/routes/guru';
import { type BreadcrumbItem } from '@/types';

interface MataPelajaran {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    tingkat: number;
    tahun_ajaran: string;
    jumlah_siswa: number;
    mata_pelajarans: MataPelajaran[];
}

interface Props {
    kelasList: Kelas[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelas Saya',
        href: guruRoutes.kelas.index.url(),
    },
];

export default function GuruKelasIndex({ kelasList }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas Saya" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Kelas Saya</h1>
                    <p className="text-sm text-muted-foreground">
                        Daftar kelas yang Anda ampu
                    </p>
                </div>

                {/* Kelas List */}
                {kelasList.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12 text-muted-foreground">
                            <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Anda belum memiliki penugasan kelas.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {kelasList.map((kelas) => (
                            <Card key={kelas.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{kelas.nama}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {kelas.tahun_ajaran}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">Tingkat {kelas.tingkat}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Jumlah Siswa */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{kelas.jumlah_siswa} Siswa</span>
                                    </div>

                                    {/* Mata Pelajaran */}
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Mata Pelajaran:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {kelas.mata_pelajarans.map((mapel) => (
                                                <Badge key={mapel.id} variant="secondary" className="text-xs">
                                                    {mapel.nama}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <Link href={guruRoutes.kelas.show.url({ kelas: kelas.id })}>
                                        <Button className="w-full mt-2" variant="outline">
                                            Lihat Detail
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
