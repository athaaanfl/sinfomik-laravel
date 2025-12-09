import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TahunAjaran } from '@/types';
import kelulusanSiswaRoutes from '@/routes/kelulusan-siswa';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, XCircle, UserMinus } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nis: string;
    nisn: string;
    tahun_masuk: number;
    kelas_id: number;
    kelas_nama: string;
    kelas: {
        id: number;
        nama: string;
        tingkat: number;
    };
}

interface Props {
    tahunAjaran: TahunAjaran;
    tingkat: number;
    siswasByKelas: Record<string, Siswa[]>;
    totalSiswa: number;
    nextTahunAjaran: TahunAjaran | null;
    nextYearHasClasses: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Akademik' },
    { title: 'Kelulusan Siswa', href: kelulusanSiswaRoutes.index().url },
    { title: 'Preview' },
];

type ActionType = 'lulus' | 'tidak_lulus' | 'keluar';

export default function Preview({ tahunAjaran, tingkat, siswasByKelas, totalSiswa, nextTahunAjaran, nextYearHasClasses }: Props) {
    const [actions, setActions] = useState<Record<number, ActionType>>(() => {
        const initial: Record<number, ActionType> = {};
        Object.values(siswasByKelas)
            .flat()
            .forEach((siswa) => {
                initial[siswa.id] = 'lulus'; // Default: lulus
            });
        return initial;
    });

    const [confirmDialog, setConfirmDialog] = useState(false);

    // Compute selectedAll based on actions without causing re-renders
    const selectedAll = useMemo(() => {
        const result: Record<string, boolean> = {};
        Object.entries(siswasByKelas).forEach(([kelasNama, siswas]) => {
            const allLulus = siswas.every((siswa) => actions[siswa.id] === 'lulus');
            result[kelasNama] = allLulus;
        });
        return result;
    }, [actions, siswasByKelas]);

    const handleToggleAll = (kelasNama: string, siswas: Siswa[]) => {
        const currentState = selectedAll[kelasNama];
        const newState = !currentState;

        setActions((prev) => {
            const newActions = { ...prev };
            siswas.forEach((siswa) => {
                newActions[siswa.id] = newState ? 'lulus' : 'tidak_lulus';
            });
            return newActions;
        });
    };

    const handleActionChange = (siswaId: number, action: ActionType) => {
        setActions((prev) => ({ ...prev, [siswaId]: action }));
    };

    const summary = Object.entries(actions).reduce(
        (acc, [, action]) => {
            acc[action]++;
            return acc;
        },
        { lulus: 0, tidak_lulus: 0, keluar: 0 } as Record<ActionType, number>
    );

    const handleProcess = () => {
        const actionsList = Object.entries(actions).map(([siswaId, action]) => {
            const allSiswas = Object.values(siswasByKelas).flat();
            const siswa = allSiswas.find((s) => s.id === parseInt(siswaId));
            return {
                siswa_id: parseInt(siswaId),
                kelas_id: siswa?.kelas_id,
                action,
            };
        });

        router.post(kelulusanSiswaRoutes.process().url, {
            tahun_ajaran_id: tahunAjaran.id,
            tingkat,
            tanggal_lulus: new Date().toISOString().split('T')[0],
            actions: actionsList,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preview Kelulusan Siswa" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(kelulusanSiswaRoutes.index().url)}
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Preview Kelulusan Siswa</h1>
                            <p className="text-sm text-muted-foreground">
                                {tahunAjaran.kode_tahun_ajaran} - Tingkat {tingkat} ({totalSiswa}{' '}
                                siswa)
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => setConfirmDialog(true)} size="lg">
                        Proses Kelulusan
                    </Button>
                </div>

                {/* Warning if next year doesn't have classes */}
                {!nextYearHasClasses && (
                    <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="flex items-start gap-3 pt-6">
                            <XCircle className="size-5 text-orange-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-orange-900 mb-1">
                                    Peringatan: Tahun Ajaran Berikutnya Belum Siap
                                </h3>
                                <p className="text-sm text-orange-800">
                                    {!nextTahunAjaran ? (
                                        <>
                                            Tahun ajaran berikutnya belum dibuat. Siswa yang "Tidak Lulus" tidak akan bisa
                                            ditugaskan ke kelas manapun. Buat tahun ajaran baru terlebih dahulu.
                                        </>
                                    ) : (
                                        <>
                                            Tahun ajaran <strong>{nextTahunAjaran.kode_tahun_ajaran}</strong> belum memiliki
                                            kelas tingkat {tingkat}. Siswa yang "Tidak Lulus" tidak akan bisa tinggal kelas.
                                            Generate kelas untuk tahun ajaran berikutnya terlebih dahulu.
                                        </>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Lulus
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-5 text-green-600" />
                                <span className="text-2xl font-bold">{summary.lulus}</span>
                                <span className="text-sm text-muted-foreground">siswa</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tidak Lulus
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <XCircle className="size-5 text-orange-600" />
                                <span className="text-2xl font-bold">{summary.tidak_lulus}</span>
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

                {/* Student List by Class */}
                <div className="space-y-4">
                    {Object.entries(siswasByKelas).map(([kelasNama, siswas]) => (
                        <Card key={kelasNama}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Kelas {kelasNama}</CardTitle>
                                        <Badge variant="secondary">{siswas.length} siswa</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`all-${kelasNama}`}
                                            checked={selectedAll[kelasNama]}
                                            onCheckedChange={() => handleToggleAll(kelasNama, siswas)}
                                        />
                                        <Label htmlFor={`all-${kelasNama}`} className="cursor-pointer">
                                            Pilih Semua Lulus
                                        </Label>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {siswas.map((siswa) => (
                                        <div
                                            key={siswa.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{siswa.nama_lengkap}</p>
                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                    <span>NIS: {siswa.nis || '-'}</span>
                                                    <span>NISN: {siswa.nisn || '-'}</span>
                                                    <span>Tahun Masuk: {siswa.tahun_masuk}</span>
                                                </div>
                                            </div>
                                            <div className="w-48">
                                                <Select
                                                    value={actions[siswa.id]}
                                                    onValueChange={(value: ActionType) =>
                                                        handleActionChange(siswa.id, value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="lulus">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="size-4 text-green-600" />
                                                                <span>Lulus</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="tidak_lulus">
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="size-4 text-orange-600" />
                                                                <span>Tidak Lulus</span>
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
                        <DialogTitle>Konfirmasi Kelulusan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin memproses kelulusan untuk {totalSiswa} siswa?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Lulus:</span>
                            <span className="font-medium">{summary.lulus} siswa</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tidak Lulus:</span>
                            <span className="font-medium">{summary.tidak_lulus} siswa</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Keluar:</span>
                            <span className="font-medium">{summary.keluar} siswa</span>
                        </div>
                        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                            Aksi ini akan mengubah status siswa dan tidak dapat dibatalkan.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleProcess}>Ya, Proses Kelulusan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
