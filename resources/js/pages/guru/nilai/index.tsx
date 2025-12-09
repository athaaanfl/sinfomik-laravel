import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import guruRoutes from '@/routes/guru';
import { type BreadcrumbItem } from '@/types';

interface Siswa {
    id: number;
    nis: string;
    nama_lengkap: string;
}

interface TpPemetaan {
    id: number;
    tp_id: number;
    tp_kode: string;
    tp_deskripsi: string;
    elemen_nama: string;
}

interface Nilai {
    id?: number;
    siswa_id: number;
    tujuan_pembelajaran_id: number;
    nilai?: number;
    catatan?: string;
}

interface PenugasanMengajar {
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
        id: number;
        nama: string;
        semester: string;
    };
}

interface Props {
    penugasan: PenugasanMengajar;
    siswas: Siswa[];
    tpPemetaans: TpPemetaan[];
    nilais: Nilai[];
}

interface NilaiFormData {
    [key: string]: {
        nilai: string;
        catatan: string;
    };
}

export default function GuruNilaiIndex({ penugasan, siswas, tpPemetaans, nilais }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Penilaian',
            href: guruRoutes.nilai.list.url(),
        },
        {
            title: `${penugasan.kelas.nama} - ${penugasan.mata_pelajaran.nama}`,
        },
    ];

    // Initialize form data
    const [formData, setFormData] = useState<NilaiFormData>(() => {
        const initial: NilaiFormData = {};
        siswas.forEach((siswa) => {
            tpPemetaans.forEach((tp) => {
                const key = `${siswa.id}-${tp.tp_id}`;
                const existingNilai = nilais.find(
                    (n) => n.siswa_id === siswa.id && n.tujuan_pembelajaran_id === tp.tp_id
                );
                initial[key] = {
                    nilai: existingNilai?.nilai?.toString() || '',
                    catatan: existingNilai?.catatan || '',
                };
            });
        });
        return initial;
    });

    const { post, processing } = useForm();

    const handleInputChange = (siswaId: number, tpId: number, field: 'nilai' | 'catatan', value: string) => {
        const key = `${siswaId}-${tpId}`;
        setFormData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Transform data for backend
        const payload: Array<{
            siswa_id: number;
            tujuan_pembelajaran_id: number;
            nilai: number | null;
            catatan: string;
        }> = [];

        siswas.forEach((siswa) => {
            tpPemetaans.forEach((tp) => {
                const key = `${siswa.id}-${tp.tp_id}`;
                const data = formData[key];
                
                // Only include if nilai is filled
                if (data.nilai.trim() !== '') {
                    const nilaiValue = parseFloat(data.nilai);
                    if (!isNaN(nilaiValue) && nilaiValue >= 0 && nilaiValue <= 100) {
                        payload.push({
                            siswa_id: siswa.id,
                            tujuan_pembelajaran_id: tp.tp_id,
                            nilai: nilaiValue,
                            catatan: data.catatan.trim(),
                        });
                    }
                }
            });
        });

        post(guruRoutes.nilai.store.url({ penugasan: penugasan.id }), {
            data: { nilais: payload },
            preserveScroll: true,
        });
    };

    // Group TPs by elemen
    const groupedTPs = tpPemetaans.reduce((acc, tp) => {
        if (!acc[tp.elemen_nama]) {
            acc[tp.elemen_nama] = [];
        }
        acc[tp.elemen_nama].push(tp);
        return acc;
    }, {} as Record<string, TpPemetaan[]>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Penilaian ${penugasan.mata_pelajaran.nama} - ${penugasan.kelas.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Penilaian</h1>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{penugasan.kelas.nama}</Badge>
                        <Badge variant="outline">{penugasan.mata_pelajaran.nama}</Badge>
                        <Badge>{penugasan.tahun_ajaran.nama}</Badge>
                        <Badge>{penugasan.tahun_ajaran.semester}</Badge>
                    </div>
                </div>

                {/* Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Informasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Jumlah Siswa</p>
                                <p className="font-semibold text-lg">{siswas.length}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Jumlah TP</p>
                                <p className="font-semibold text-lg">{tpPemetaans.length}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Nilai Terisi</p>
                                <p className="font-semibold text-lg">
                                    {nilais.filter((n) => n.nilai !== undefined && n.nilai !== null).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* No Data State */}
                {tpPemetaans.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8 text-muted-foreground">
                            Belum ada TP yang dipetakan untuk kelas dan semester ini.
                        </CardContent>
                    </Card>
                ) : siswas.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8 text-muted-foreground">
                            Belum ada siswa di kelas ini.
                        </CardContent>
                    </Card>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Input Nilai</CardTitle>
                                <CardDescription>
                                    Masukkan nilai untuk setiap siswa pada setiap Tujuan Pembelajaran. Nilai harus
                                    antara 0-100.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Grid Container with horizontal scroll */}
                                <div className="overflow-x-auto">
                                    <div className="min-w-max">
                                        {/* Header Row */}
                                        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `200px repeat(${tpPemetaans.length}, 180px)` }}>
                                            <div className="font-bold p-2 bg-muted rounded sticky left-0">Siswa</div>
                                            {tpPemetaans.map((tp) => (
                                                <div key={tp.id} className="p-2 bg-muted rounded">
                                                    <p className="font-semibold text-sm">{tp.tp_kode}</p>
                                                    <p className="text-xs text-muted-foreground truncate" title={tp.tp_deskripsi}>
                                                        {tp.tp_deskripsi}
                                                    </p>
                                                    <Badge variant="secondary" className="text-xs mt-1">
                                                        {tp.elemen_nama}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Student Rows */}
                                        <div className="space-y-2">
                                            {siswas.map((siswa, idx) => (
                                                <div
                                                    key={siswa.id}
                                                    className="grid gap-2"
                                                    style={{ gridTemplateColumns: `200px repeat(${tpPemetaans.length}, 180px)` }}
                                                >
                                                    <div className="p-2 bg-muted/50 rounded sticky left-0 flex items-center">
                                                        <div>
                                                            <p className="font-medium text-sm">{siswa.nama_lengkap}</p>
                                                            <p className="text-xs text-muted-foreground">{siswa.nis}</p>
                                                        </div>
                                                    </div>
                                                    {tpPemetaans.map((tp) => {
                                                        const key = `${siswa.id}-${tp.tp_id}`;
                                                        const nilai = formData[key]?.nilai || '';
                                                        const catatan = formData[key]?.catatan || '';

                                                        return (
                                                            <div key={tp.id} className="space-y-1">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    step="1"
                                                                    placeholder="0-100"
                                                                    value={nilai}
                                                                    onChange={(e) =>
                                                                        handleInputChange(siswa.id, tp.tp_id, 'nilai', e.target.value)
                                                                    }
                                                                    className="h-9 text-center"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Catatan..."
                                                                    value={catatan}
                                                                    onChange={(e) =>
                                                                        handleInputChange(siswa.id, tp.tp_id, 'catatan', e.target.value)
                                                                    }
                                                                    className="h-8 text-xs"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end mt-6">
                                    <Button type="submit" disabled={processing} size="lg">
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Menyimpan...' : 'Simpan Nilai'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
