import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TahunAjaran } from '@/types';
import naikKelasRoutes from '@/routes/naik-kelas';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, UserMinus } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    nisn: string;
}

interface Kelas {
    id: number;
    nama: string;
    tingkat: number;
    nama_lengkap: string;
}

interface MappingSuggestion {
    kelas_asal_id: number;
    kelas_asal_nama: string;
    kelas_asal: Kelas;
    tingkat_tujuan: number;
    available_classes: Kelas[];
    suggested_kelas_id: number | null;
    jumlah_siswa: number;
    siswas: Siswa[];
}

interface Props {
    tahunAjaranAsal: TahunAjaran;
    tahunAjaranTujuan: TahunAjaran;
    mappingSuggestions: MappingSuggestion[];
    totalSiswa: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Akademik' },
    { title: 'Naik Kelas Massal', href: naikKelasRoutes.index().url },
    { title: 'Preview' },
];

type ActionType = 'naik' | 'tinggal' | 'keluar';

export default function Preview({
    tahunAjaranAsal,
    tahunAjaranTujuan,
    mappingSuggestions,
    totalSiswa,
}: Props) {
    const [classMapping, setClassMapping] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        mappingSuggestions.forEach((mapping) => {
            if (mapping.suggested_kelas_id) {
                initial[mapping.kelas_asal_id] = mapping.suggested_kelas_id;
            }
        });
        return initial;
    });

    const [studentActions, setStudentActions] = useState<Record<number, ActionType>>(() => {
        const initial: Record<number, ActionType> = {};
        mappingSuggestions.forEach((mapping) => {
            mapping.siswas.forEach((siswa) => {
                initial[siswa.id] = 'naik'; // Default: naik
            });
        });
        return initial;
    });

    const [confirmDialog, setConfirmDialog] = useState(false);

    // Compute selectedAll based on studentActions without causing re-renders
    const selectedAll = useMemo(() => {
        const result: Record<number, boolean> = {};
        mappingSuggestions.forEach((mapping) => {
            const allNaik = mapping.siswas.every((siswa) => studentActions[siswa.id] === 'naik');
            result[mapping.kelas_asal_id] = allNaik;
        });
        return result;
    }, [studentActions, mappingSuggestions]);

    const handleClassMappingChange = (kelasAsalId: number, kelasTujuanId: string) => {
        setClassMapping((prev) => ({
            ...prev,
            [kelasAsalId]: parseInt(kelasTujuanId),
        }));
    };

    const handleToggleAll = (kelasAsalId: number, siswas: Siswa[]) => {
        const currentState = selectedAll[kelasAsalId];
        const newState = !currentState;

        setStudentActions((prev) => {
            const newActions = { ...prev };
            siswas.forEach((siswa) => {
                newActions[siswa.id] = newState ? 'naik' : 'tinggal';
            });
            return newActions;
        });
    };

    const handleStudentActionChange = (siswaId: number, action: ActionType) => {
        setStudentActions((prev) => ({ ...prev, [siswaId]: action }));
    };

    const summary = Object.values(studentActions).reduce(
        (acc, action) => {
            acc[action]++;
            return acc;
        },
        { naik: 0, tinggal: 0, keluar: 0 } as Record<ActionType, number>
    );

    const handleProcess = () => {
        const promotions = mappingSuggestions
            .filter((mapping) => classMapping[mapping.kelas_asal_id])
            .map((mapping) => ({
                kelas_asal_id: mapping.kelas_asal_id,
                kelas_tujuan_id: classMapping[mapping.kelas_asal_id],
                students: mapping.siswas.map((siswa) => ({
                    siswa_id: siswa.id,
                    action: studentActions[siswa.id],
                })),
            }));

        router.post(naikKelasRoutes.process().url, {
            tahun_ajaran_asal_id: tahunAjaranAsal.id,
            tahun_ajaran_tujuan_id: tahunAjaranTujuan.id,
            tanggal_akhir: new Date().toISOString().split('T')[0],
            tanggal_mulai: new Date().toISOString().split('T')[0],
            promotions,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preview Naik Kelas" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={() => router.visit(naikKelasRoutes.index().url)}>
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Preview Naik Kelas</h1>
                            <p className="text-sm text-muted-foreground">
                                {tahunAjaranAsal.kode_tahun_ajaran} → {tahunAjaranTujuan.kode_tahun_ajaran}{' '}
                                ({totalSiswa} siswa)
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => setConfirmDialog(true)} size="lg">
                        Proses Naik Kelas
                    </Button>
                </div>

                {/* Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Naik Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-5 text-green-600" />
                                <span className="text-2xl font-bold">{summary.naik}</span>
                                <span className="text-sm text-muted-foreground">siswa</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tinggal Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <XCircle className="size-5 text-orange-600" />
                                <span className="text-2xl font-bold">{summary.tinggal}</span>
                                <span className="text-sm text-muted-foreground">siswa</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Keluar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <UserMinus className="size-5 text-red-600" />
                                <span className="text-2xl font-bold">{summary.keluar}</span>
                                <span className="text-sm text-muted-foreground">siswa</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Class Mapping */}
                <div className="space-y-4">
                    {mappingSuggestions.map((mapping) => (
                        <Card key={mapping.kelas_asal_id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <span>Kelas {mapping.kelas_asal_nama}</span>
                                            <ArrowRight className="size-4" />
                                            <div className="w-64">
                                                <Select
                                                    value={classMapping[mapping.kelas_asal_id]?.toString() || ''}
                                                    onValueChange={(value) =>
                                                        handleClassMappingChange(mapping.kelas_asal_id, value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Kelas Tujuan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {mapping.available_classes.map((kelas) => (
                                                            <SelectItem
                                                                key={kelas.id}
                                                                value={kelas.id.toString()}
                                                            >
                                                                {kelas.nama_lengkap}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardTitle>
                                        <Badge variant="secondary" className="mt-1">
                                            {mapping.jumlah_siswa} siswa
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`all-${mapping.kelas_asal_id}`}
                                            checked={selectedAll[mapping.kelas_asal_id]}
                                            onCheckedChange={() =>
                                                handleToggleAll(mapping.kelas_asal_id, mapping.siswas)
                                            }
                                        />
                                        <Label
                                            htmlFor={`all-${mapping.kelas_asal_id}`}
                                            className="cursor-pointer"
                                        >
                                            Pilih Semua Naik
                                        </Label>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {mapping.siswas.map((siswa) => (
                                        <div
                                            key={siswa.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{siswa.nama_lengkap}</p>
                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                    <span>NIS: {siswa.nis || '-'}</span>
                                                    <span>NISN: {siswa.nisn || '-'}</span>
                                                </div>
                                            </div>
                                            <div className="w-48">
                                                <Select
                                                    value={studentActions[siswa.id]}
                                                    onValueChange={(value: ActionType) =>
                                                        handleStudentActionChange(siswa.id, value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="naik">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="size-4 text-green-600" />
                                                                <span>Naik Kelas</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="tinggal">
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="size-4 text-orange-600" />
                                                                <span>Tinggal Kelas</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="keluar">
                                                            <div className="flex items-center gap-2">
                                                                <UserMinus className="size-4 text-red-600" />
                                                                <span>Keluar</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Naik Kelas</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin memproses naik kelas untuk {totalSiswa} siswa?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Naik Kelas:</span>
                            <span className="font-medium">{summary.naik} siswa</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tinggal Kelas:</span>
                            <span className="font-medium">{summary.tinggal} siswa</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Keluar:</span>
                            <span className="font-medium">{summary.keluar} siswa</span>
                        </div>
                        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                            Aksi ini akan memindahkan siswa ke kelas baru dan tidak dapat dibatalkan.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleProcess}>Ya, Proses Naik Kelas</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
