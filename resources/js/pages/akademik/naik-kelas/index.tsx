import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TahunAjaran } from '@/types';
import naikKelasRoutes from '@/routes/naik-kelas';
import { Head, router } from '@inertiajs/react';
import { ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    tahunAjarans: TahunAjaran[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Akademik' },
    { title: 'Naik Kelas Massal' },
];

export default function Index({ tahunAjarans }: Props) {
    const [tahunAjaranAsalId, setTahunAjaranAsalId] = useState<string>('');
    const [tahunAjaranTujuanId, setTahunAjaranTujuanId] = useState<string>('');
    const [tanggalAkhir, setTanggalAkhir] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [tanggalMulai, setTanggalMulai] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    const handlePreview = () => {
        if (!tahunAjaranAsalId || !tahunAjaranTujuanId) {
            alert('Pilih tahun ajaran asal dan tujuan terlebih dahulu');
            return;
        }

        if (tahunAjaranAsalId === tahunAjaranTujuanId) {
            alert('Tahun ajaran asal dan tujuan tidak boleh sama');
            return;
        }

        router.post('/naik-kelas/preview', {
            tahun_ajaran_asal_id: tahunAjaranAsalId,
            tahun_ajaran_tujuan_id: tahunAjaranTujuanId,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Naik Kelas Massal" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <ArrowUpCircle className="size-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Naik Kelas Massal</h1>
                        <p className="text-sm text-muted-foreground">
                            Pindahkan siswa ke tingkat berikutnya secara massal
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pilih Tahun Ajaran</CardTitle>
                        <CardDescription>
                            Pilih tahun ajaran asal dan tujuan untuk naik kelas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tahun_ajaran_asal">
                                    Tahun Ajaran Asal <span className="text-destructive">*</span>
                                </Label>
                                <Select value={tahunAjaranAsalId} onValueChange={setTahunAjaranAsalId}>
                                    <SelectTrigger id="tahun_ajaran_asal">
                                        <SelectValue placeholder="Pilih Tahun Ajaran Asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tahunAjarans.map((ta) => (
                                            <SelectItem key={ta.id} value={ta.id.toString()}>
                                                {ta.kode_tahun_ajaran}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Tahun ajaran yang siswa-siswanya akan dinaikkan
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tahun_ajaran_tujuan">
                                    Tahun Ajaran Tujuan <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={tahunAjaranTujuanId}
                                    onValueChange={setTahunAjaranTujuanId}
                                >
                                    <SelectTrigger id="tahun_ajaran_tujuan">
                                        <SelectValue placeholder="Pilih Tahun Ajaran Tujuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tahunAjarans.map((ta) => (
                                            <SelectItem key={ta.id} value={ta.id.toString()}>
                                                {ta.kode_tahun_ajaran}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Tahun ajaran tujuan untuk siswa yang naik kelas
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_akhir">
                                    Tanggal Akhir Kelas Lama <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_akhir"
                                    type="date"
                                    value={tanggalAkhir}
                                    onChange={(e) => setTanggalAkhir(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tanggal berakhirnya siswa di kelas lama
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_mulai">
                                    Tanggal Mulai Kelas Baru <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="date"
                                    value={tanggalMulai}
                                    onChange={(e) => setTanggalMulai(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tanggal mulainya siswa di kelas baru
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={handlePreview}
                                disabled={!tahunAjaranAsalId || !tahunAjaranTujuanId}
                            >
                                Tampilkan Mapping Kelas
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
                                Sistem akan menampilkan semua siswa aktif dari tahun ajaran asal (kecuali
                                tingkat 12)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>
                                Anda dapat mengubah mapping kelas tujuan dan memilih siswa mana yang naik,
                                tinggal, atau keluar
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>
                                Siswa yang tinggal kelas akan dipindahkan ke kelas tingkat yang sama di
                                tahun ajaran baru
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <p>Siswa tingkat 12 harus diproses di menu "Kelulusan Siswa" terlebih dahulu</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
