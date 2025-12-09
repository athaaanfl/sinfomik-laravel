import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Layers, ArrowRight } from 'lucide-react';
import guruRoutes from '@/routes/guru';
import { type BreadcrumbItem } from '@/types';

interface MataPelajaran {
    id: number;
    nama: string;
    deskripsi?: string;
    jumlah_fase: number;
}

interface Props {
    mataPelajaranList: MataPelajaran[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kurikulum',
        href: guruRoutes.kurikulum.index.url(),
    },
];

export default function GuruKurikulumIndex({ mataPelajaranList }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kurikulum" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Kurikulum</h1>
                    <p className="text-sm text-muted-foreground">
                        Kurikulum mata pelajaran yang Anda ampu
                    </p>
                </div>

                {/* Mata Pelajaran List */}
                {mataPelajaranList.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12 text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Anda belum memiliki penugasan mata pelajaran.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mataPelajaranList.map((mapel) => (
                            <Card key={mapel.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Layers className="h-5 w-5" />
                                        {mapel.nama}
                                    </CardTitle>
                                    {mapel.deskripsi && (
                                        <CardDescription className="mt-2">
                                            {mapel.deskripsi}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Jumlah Fase */}
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {mapel.jumlah_fase} Fase CP
                                        </Badge>
                                    </div>

                                    {/* Action */}
                                    <Link href={guruRoutes.kurikulum.show.url({ mataPelajaran: mapel.id })}>
                                        <Button className="w-full" variant="outline">
                                            Lihat Kurikulum
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
