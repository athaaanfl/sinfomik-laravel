import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Eye, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import penugasanMengajarRoutes from '@/routes/penugasan-mengajar';
import mapelWaliKelasRoutes from '@/routes/mapel-wali-kelas';

interface MataPelajaran {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    tipe_penugasan: string;
}

interface Penugasan {
    mata_pelajaran: MataPelajaran;
    jumlah_kelas: number;
    kelas: Kelas[];
    tipe_penugasan: string;
}

interface Guru {
    id: number;
    nama: string;
    nip: string;
    is_wali_kelas: boolean;
    kelas_wali: string | null;
    penugasan: Penugasan[];
}

interface TahunAjaran {
    id: number;
    kode_tahun_ajaran: string;
    tahunawal: number;
    tahunakhir: number;
    is_active: boolean;
}

interface Props {
    gurus: Guru[];
    tahunAjarans: TahunAjaran[];
    selectedTahunAjaranId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penugasan Mengajar',
        href: penugasanMengajarRoutes.index().url,
    },
];

export default function Index({ gurus, tahunAjarans, selectedTahunAjaranId }: Props) {
    const [detailModal, setDetailModal] = useState<{ open: boolean; guru: Guru | null }>({
        open: false,
        guru: null,
    });

    const handleTahunAjaranChange = (value: string) => {
        router.get(penugasanMengajarRoutes.index().url, { tahun_ajaran_id: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penugasan Mengajar" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Penugasan Mengajar</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola penugasan guru mengajar mata pelajaran di kelas
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={mapelWaliKelasRoutes.index().url}>
                            <Button variant="outline" size="sm">
                                <Settings className="mr-2 size-4" />
                                Konfigurasi Mapel
                            </Button>
                        </Link>
                        <Link href={penugasanMengajarRoutes.create().url}>
                            <Button size="sm">
                                <Plus className="mr-2 size-4" />
                                Tambah Penugasan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Tahun Ajaran */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Tahun Ajaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={selectedTahunAjaranId?.toString()}
                            onValueChange={handleTahunAjaranChange}
                        >
                            <SelectTrigger className="w-full md:w-80">
                                <SelectValue placeholder="Pilih Tahun Ajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {tahunAjarans.map((ta) => (
                                    <SelectItem key={ta.id} value={ta.id.toString()}>
                                        {ta.kode_tahun_ajaran} {ta.is_active && '(Aktif)'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {gurus.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <BookOpen className="mx-auto size-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada penugasan</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Belum ada guru yang ditugaskan pada tahun ajaran ini
                                </p>
                                <Link href={penugasanMengajarRoutes.create().url}>
                                    <Button className="mt-4">
                                        <Plus className="mr-2 size-4" />
                                        Tambah Penugasan
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {/* Guru Wali Kelas */}
                        {gurus.filter(g => g.is_wali_kelas).length > 0 && (
                            <div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold">Guru Wali Kelas</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Guru yang menjabat sebagai wali kelas
                                    </p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {gurus.filter(g => g.is_wali_kelas).map((guru) => (
                                        <Card key={guru.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-base truncate">
                                                            {guru.nama}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs mt-1">
                                                            NIP: {guru.nip}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant="default" className="shrink-0 text-xs">
                                                        Wali Kelas
                                                    </Badge>
                                                </div>
                                                {guru.kelas_wali && (
                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                                        <BookOpen className="size-3 text-muted-foreground" />
                                                        <span className="text-xs font-medium">
                                                            Kelas {guru.kelas_wali}
                                                        </span>
                                                    </div>
                                                )}
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {guru.penugasan.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                                                            Mata Pelajaran
                                                        </h4>
                                                        <div className="space-y-1.5">
                                                            {guru.penugasan.slice(0, 2).map((p, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                                                                >
                                                                    <span className="text-xs font-medium truncate">
                                                                        {p.mata_pelajaran.nama}
                                                                    </span>
                                                                    <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                                                                        {p.jumlah_kelas} kelas
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                            {guru.penugasan.length > 2 && (
                                                                <p className="text-xs text-muted-foreground text-center py-1">
                                                                    +{guru.penugasan.length - 2} lainnya
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs h-8"
                                                    onClick={() => setDetailModal({ open: true, guru })}
                                                >
                                                    <Eye className="mr-2 size-3" />
                                                    Lihat Detail
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Guru Bidang Studi */}
                        {gurus.filter(g => !g.is_wali_kelas).length > 0 && (
                            <div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold">Guru Bidang Studi</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Guru yang mengajar mata pelajaran tertentu
                                    </p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {gurus.filter(g => !g.is_wali_kelas).map((guru) => (
                                        <Card key={guru.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-base truncate">
                                                            {guru.nama}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs mt-1">
                                                            NIP: {guru.nip}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {guru.penugasan.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                                                            Mata Pelajaran
                                                        </h4>
                                                        <div className="space-y-1.5">
                                                            {guru.penugasan.slice(0, 2).map((p, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                                                                >
                                                                    <span className="text-xs font-medium truncate">
                                                                        {p.mata_pelajaran.nama}
                                                                    </span>
                                                                    <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                                                                        {p.jumlah_kelas} kelas
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                            {guru.penugasan.length > 2 && (
                                                                <p className="text-xs text-muted-foreground text-center py-1">
                                                                    +{guru.penugasan.length - 2} lainnya
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs h-8"
                                                    onClick={() => setDetailModal({ open: true, guru })}
                                                >
                                                    <Eye className="mr-2 size-3" />
                                                    Lihat Detail
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Dialog
                open={detailModal.open}
                onOpenChange={(open) => setDetailModal({ open, guru: null })}
            >
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Penugasan - {detailModal.guru?.nama}</DialogTitle>
                        <DialogDescription>
                            NIP: {detailModal.guru?.nip}
                            {detailModal.guru?.is_wali_kelas && (
                                <span className="ml-2">
                                    • Wali Kelas {detailModal.guru?.kelas_wali}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {detailModal.guru?.penugasan.map((p, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold">{p.mata_pelajaran.nama}</h4>
                                    <Badge
                                        variant={
                                            p.tipe_penugasan === 'wali_kelas'
                                                ? 'secondary'
                                                : 'default'
                                        }
                                    >
                                        {p.tipe_penugasan === 'wali_kelas'
                                            ? 'Wali Kelas'
                                            : 'Bidang Studi'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {p.kelas.map((k) => (
                                        <div
                                            key={k.id}
                                            className="text-sm px-3 py-2 rounded bg-muted"
                                        >
                                            {k.nama}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
