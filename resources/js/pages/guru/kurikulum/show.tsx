import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import guruRoutes from '@/routes/guru';
import { type BreadcrumbItem } from '@/types';

interface TPPemetaan {
    id: number;
    tingkat: number;
    semester: string;
    tahun_ajaran: string;
}

interface TujuanPembelajaran {
    id: number;
    kode: string;
    deskripsi: string;
    urutan: number;
    pemetaans: TPPemetaan[];
}

interface CpElemen {
    id: number;
    deskripsi: string;
    tujuan_pembelajarans: TujuanPembelajaran[];
}

interface ElemenPembelajaran {
    id: number;
    nama: string;
    urutan: number;
    cp_elemen: CpElemen | null;
}

interface CpFase {
    id: number;
    fase: 'A' | 'B' | 'C';
    deskripsi: string;
    elemen_pembelajarans: ElemenPembelajaran[];
}

interface Kurikulum {
    id: number;
    nama: string;
    deskripsi?: string;
    cp_fases: CpFase[];
}

interface Props {
    kurikulum: Kurikulum;
}

export default function GuruKurikulumShow({ kurikulum }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kurikulum',
            href: guruRoutes.kurikulum.index.url(),
        },
        {
            title: kurikulum.nama,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kurikulum ${kurikulum.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4"> p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Kurikulum {kurikulum.nama}</h1>
                    {kurikulum.deskripsi && (
                        <p className="text-sm text-muted-foreground mt-1">{kurikulum.deskripsi}</p>
                    )}
                </div>

                {/* CP Fases */}
                {kurikulum.cp_fases.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8 text-muted-foreground">
                            Kurikulum belum memiliki CP Fase
                        </CardContent>
                    </Card>
                ) : (
                    <Accordion type="multiple" className="space-y-4">
                        {kurikulum.cp_fases.map((cpFase) => (
                            <Card key={cpFase.id}>
                                <AccordionItem value={`fase-${cpFase.id}`} className="border-0">
                                    <CardHeader>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center gap-3 text-left">
                                                <Badge variant="outline" className="text-lg">
                                                    Fase {cpFase.fase}
                                                </Badge>
                                                <div>
                                                    <CardTitle>Capaian Pembelajaran Fase {cpFase.fase}</CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {cpFase.elemen_pembelajarans.length} Elemen Pembelajaran
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                    </CardHeader>
                                    <AccordionContent>
                                        <CardContent className="space-y-4">
                                            {/* CP Fase Description */}
                                            <div className="p-4 bg-muted rounded-lg">
                                                <p className="text-sm">{cpFase.deskripsi}</p>
                                            </div>

                                            {/* Elemen Pembelajaran */}
                                            {cpFase.elemen_pembelajarans.map((elemen) => (
                                                <Card key={elemen.id}>
                                                    <CardHeader>
                                                        <CardTitle className="text-base">
                                                            {elemen.urutan}. {elemen.nama}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {elemen.cp_elemen ? (
                                                            <div className="space-y-4">
                                                                {/* CP Elemen */}
                                                                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                                                    <p className="text-sm font-medium text-blue-900 mb-1">
                                                                        Capaian Pembelajaran Elemen:
                                                                    </p>
                                                                    <p className="text-sm text-blue-800">
                                                                        {elemen.cp_elemen.deskripsi}
                                                                    </p>
                                                                </div>

                                                                {/* Tujuan Pembelajaran */}
                                                                {elemen.cp_elemen.tujuan_pembelajarans.length > 0 && (
                                                                    <div>
                                                                        <p className="font-medium mb-3">
                                                                            Tujuan Pembelajaran:
                                                                        </p>
                                                                        <div className="space-y-3">
                                                                            {elemen.cp_elemen.tujuan_pembelajarans.map((tp) => (
                                                                                <div
                                                                                    key={tp.id}
                                                                                    className="p-3 border rounded-lg hover:bg-muted/50"
                                                                                >
                                                                                    <div className="flex items-start gap-2 mb-2">
                                                                                        <Badge variant="secondary">
                                                                                            {tp.kode || `TP-${tp.urutan}`}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <p className="text-sm mb-2">{tp.deskripsi}</p>
                                                                                    {tp.pemetaans.length > 0 && (
                                                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                                                            {tp.pemetaans.map((pemetaan) => (
                                                                                                <Badge
                                                                                                    key={pemetaan.id}
                                                                                                    variant="outline"
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    Kelas {pemetaan.tingkat} •{' '}
                                                                                                    Sem. {pemetaan.semester}
                                                                                                </Badge>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground">
                                                                Belum ada CP Elemen untuk elemen ini
                                                            </p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </CardContent>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
                )}
            </div>
        </AppLayout>
    );
}
