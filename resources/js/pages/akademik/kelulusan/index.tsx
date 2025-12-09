import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TahunAjaran } from '@/types';
import kelulusanSiswaRoutes from '@/routes/kelulusan-siswa';
import { Head, router } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    tahunAjarans: TahunAjaran[];
    availableTingkat: number[];
    selectedTahunAjaranId?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Akademik' },
    { title: 'Kelulusan Siswa' },
];

export default function Index({ tahunAjarans, availableTingkat, selectedTahunAjaranId }: Props) {
    const [tahunAjaranId, setTahunAjaranId] = useState<string>(selectedTahunAjaranId?.toString() || '');
    const [tingkat, setTingkat] = useState<string>('');
    const [tanggalLulus, setTanggalLulus] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    // Reload page with tahun_ajaran_id to get available tingkat
    useEffect(() => {
        if (tahunAjaranId && tahunAjaranId !== selectedTahunAjaranId?.toString()) {
            router.visit(kelulusanSiswaRoutes.index().url, {
                data: { tahun_ajaran_id: tahunAjaranId },
                preserveState: true,
                only: ['availableTingkat', 'selectedTahunAjaranId'],
            });
            setTingkat(''); // Reset tingkat when tahun ajaran changes
        }
    }, [tahunAjaranId]);

    const handlePreview = () => {
        if (!tahunAjaranId) {
            alert('Pilih tahun ajaran terlebih dahulu');
            return;
        }

        router.post('/kelulusan-siswa/preview', {
            tahun_ajaran_id: tahunAjaranId,
            tingkat: parseInt(tingkat),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelulusan Siswa" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <GraduationCap className="size-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Kelulusan Siswa</h1>
                        <p className="text-sm text-muted-foreground">
                            Luluskan siswa tingkat akhir secara massal
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pilih Tahun Ajaran dan Tingkat</CardTitle>
                        <CardDescription>
                            Pilih tahun ajaran dan tingkat siswa yang akan diluluskan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tahun_ajaran">
                                    Tahun Ajaran <span className="text-destructive">*</span>
                                </Label>
                                <Select value={tahunAjaranId} onValueChange={setTahunAjaranId}>
                                    <SelectTrigger id="tahun_ajaran">
                                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tahunAjarans.map((ta) => (
                                            <SelectItem key={ta.id} value={ta.id.toString()}>
                                                {ta.kode_tahun_ajaran} {ta.is_active ? '(Aktif)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tingkat">
                                    Tingkat <span className="text-destructive">*</span>
                                </Label>
                                <Select 
                                    value={tingkat} 
                                    onValueChange={setTingkat}
                                    disabled={!tahunAjaranId || availableTingkat.length === 0}
                                >
                                    <SelectTrigger id="tingkat">
                                        <SelectValue placeholder={
                                            !tahunAjaranId 
                                                ? "Pilih tahun ajaran terlebih dahulu"
                                                : availableTingkat.length === 0
                                                ? "Tidak ada kelas tersedia"
                                                : "Pilih Tingkat"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTingkat.map((t) => (
                                            <SelectItem key={t} value={t.toString()}>
                                                Tingkat {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="tanggal_lulus">
                                    Tanggal Kelulusan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_lulus"
                                    type="date"
                                    value={tanggalLulus}
                                    onChange={(e) => setTanggalLulus(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tanggal ini akan digunakan sebagai tanggal lulus siswa
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button onClick={handlePreview} disabled={!tahunAjaranId || !tingkat}>
                                Tampilkan Siswa
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-base">Informasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>
                                Sistem akan menampilkan semua siswa aktif yang terdaftar di kelas tingkat
                                yang dipilih
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>Anda dapat memilih siswa mana yang lulus, tidak lulus, atau keluar</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>
                                Siswa yang lulus akan mendapat status "Lulus" dan tidak bisa naik kelas
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>
                                Siswa yang tidak lulus akan tetap aktif dan bisa diproses di menu Naik
                                Kelas
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
