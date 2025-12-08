import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TahunAjaran } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import penugasanMengajarRoutes from '@/routes/penugasan-mengajar';

interface Guru {
    id: number;
    nama: string;
    nip: string;
    nama_lengkap: string;
}

interface MataPelajaran {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    tingkat: number;
}

interface Props {
    gurus: Guru[];
    mataPelajarans: MataPelajaran[];
    tahunAjarans: TahunAjaran[];
    tahunAjaranAktif: TahunAjaran | null;
    kelasGrouped: Record<number, Kelas[]>;
}

interface FormData {
    guru_id: string;
    mata_pelajaran_id: string;
    tahun_ajaran_id: string;
    scope: 'semua' | 'tingkat' | 'kelas';
    tingkat_ids: number[];
    kelas_ids: number[];
    keterangan: string;
}

interface FormErrors {
    guru_id?: string;
    mata_pelajaran_id?: string;
    tahun_ajaran_id?: string;
    scope?: string;
    tingkat_ids?: string;
    kelas_ids?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penugasan Mengajar',
        href: penugasanMengajarRoutes.index().url,
    },
    {
        title: 'Tambah Penugasan',
        href: penugasanMengajarRoutes.create().url,
    },
];

export default function Create({
    gurus,
    mataPelajarans,
    tahunAjarans,
    tahunAjaranAktif,
    kelasGrouped,
}: Props) {
    const [kelasData, setKelasData] = useState<Record<number, Kelas[]>>(kelasGrouped);
    const [formData, setFormData] = useState<FormData>({
        guru_id: '',
        mata_pelajaran_id: '',
        tahun_ajaran_id: tahunAjaranAktif?.id.toString() || '',
        scope: 'semua',
        tingkat_ids: [],
        kelas_ids: [],
        keterangan: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    // Load kelas when tahun ajaran changes
    useEffect(() => {
        if (formData.tahun_ajaran_id) {
            fetch(`/penugasan-mengajar/kelas-by-tahun-ajaran?tahun_ajaran_id=${formData.tahun_ajaran_id}`)
                .then((res) => res.json())
                .then((data) => setKelasData(data))
                .catch(console.error);
        }
    }, [formData.tahun_ajaran_id]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.guru_id) newErrors.guru_id = 'Guru harus dipilih';
        if (!formData.mata_pelajaran_id) newErrors.mata_pelajaran_id = 'Mata pelajaran harus dipilih';
        if (!formData.tahun_ajaran_id) newErrors.tahun_ajaran_id = 'Tahun ajaran harus dipilih';
        
        if (formData.scope === 'tingkat' && formData.tingkat_ids.length === 0) {
            newErrors.tingkat_ids = 'Minimal pilih 1 tingkat';
        }
        
        if (formData.scope === 'kelas' && formData.kelas_ids.length === 0) {
            newErrors.kelas_ids = 'Minimal pilih 1 kelas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setProcessing(true);
        router.post(penugasanMengajarRoutes.store().url, formData as any, {
            onError: (errors) => {
                setErrors(errors as FormErrors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleTingkatToggle = (tingkat: number) => {
        setFormData(prev => ({
            ...prev,
            tingkat_ids: prev.tingkat_ids.includes(tingkat)
                ? prev.tingkat_ids.filter(t => t !== tingkat)
                : [...prev.tingkat_ids, tingkat]
        }));
    };

    const handleKelasToggle = (kelasId: number) => {
        setFormData(prev => ({
            ...prev,
            kelas_ids: prev.kelas_ids.includes(kelasId)
                ? prev.kelas_ids.filter(k => k !== kelasId)
                : [...prev.kelas_ids, kelasId]
        }));
    };

    const tingkatList = Object.keys(kelasData).map(Number).sort();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Penugasan Mengajar" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.visit(penugasanMengajarRoutes.index().url)}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Penugasan Mengajar</h1>
                        <p className="text-sm text-muted-foreground">
                            Tugaskan guru untuk mengajar mata pelajaran di kelas
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Penugasan</CardTitle>
                            <CardDescription>
                                Pilih guru, mata pelajaran, dan kelas yang akan ditugaskan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Guru */}
                            <div className="space-y-2">
                                <Label htmlFor="guru_id">
                                    Pilih Guru <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.guru_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, guru_id: value }))}
                                >
                                    <SelectTrigger id="guru_id">
                                        <SelectValue placeholder="Pilih Guru" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gurus.map((guru) => (
                                            <SelectItem key={guru.id} value={guru.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{guru.nama}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        NIP: {guru.nip}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.guru_id && (
                                    <p className="text-sm text-destructive">{errors.guru_id}</p>
                                )}
                            </div>

                            {/* Mata Pelajaran */}
                            <div className="space-y-2">
                                <Label htmlFor="mata_pelajaran_id">
                                    Mata Pelajaran <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.mata_pelajaran_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, mata_pelajaran_id: value }))}
                                >
                                    <SelectTrigger id="mata_pelajaran_id">
                                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mataPelajarans.map((mapel) => (
                                            <SelectItem key={mapel.id} value={mapel.id.toString()}>
                                                <span className="font-medium">{mapel.nama}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.mata_pelajaran_id && (
                                    <p className="text-sm text-destructive">{errors.mata_pelajaran_id}</p>
                                )}
                            </div>

                            {/* Tahun Ajaran */}
                            <div className="space-y-2">
                                <Label htmlFor="tahun_ajaran_id">
                                    Tahun Ajaran <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.tahun_ajaran_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, tahun_ajaran_id: value }))}
                                >
                                    <SelectTrigger id="tahun_ajaran_id" className="w-full">
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
                                {errors.tahun_ajaran_id && (
                                    <p className="text-sm text-destructive">{errors.tahun_ajaran_id}</p>
                                )}
                            </div>

                            {/* Scope Penugasan */}
                            <div className="space-y-4">
                                <Label>
                                    Ruang Lingkup Penugasan <span className="text-destructive">*</span>
                                </Label>
                                <RadioGroup
                                    value={formData.scope}
                                    onValueChange={(value) => 
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            scope: value as FormData['scope'],
                                            tingkat_ids: [],
                                            kelas_ids: []
                                        }))
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="semua" id="scope-semua" />
                                        <Label htmlFor="scope-semua" className="font-normal cursor-pointer">
                                            Semua Kelas
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="tingkat" id="scope-tingkat" />
                                        <Label htmlFor="scope-tingkat" className="font-normal cursor-pointer">
                                            Per Tingkat
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="kelas" id="scope-kelas" />
                                        <Label htmlFor="scope-kelas" className="font-normal cursor-pointer">
                                            Kelas Tertentu
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Tingkat Selection */}
                            {formData.scope === 'tingkat' && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Pilih Tingkat</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {tingkatList.map((tingkat) => (
                                            <div
                                                key={tingkat}
                                                className="flex items-center space-x-2 p-2 rounded-md border hover:bg-accent transition-colors"
                                            >
                                                <Checkbox
                                                    id={`tingkat-${tingkat}`}
                                                    checked={formData.tingkat_ids.includes(tingkat)}
                                                    onCheckedChange={() => handleTingkatToggle(tingkat)}
                                                />
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`tingkat-${tingkat}`}
                                                        className="text-sm font-medium cursor-pointer"
                                                    >
                                                        Tingkat {tingkat}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {kelasData[tingkat]?.length || 0} kelas
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.tingkat_ids && (
                                        <p className="text-sm text-destructive">{errors.tingkat_ids}</p>
                                    )}
                                </div>
                            )}

                            {/* Kelas Selection */}
                            {formData.scope === 'kelas' && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Pilih Kelas</Label>
                                    {tingkatList.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-6">
                                            Tidak ada kelas tersedia untuk tahun ajaran ini
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {tingkatList.map((tingkat) => (
                                                <Card key={tingkat}>
                                                    <CardHeader className="pb-2 pt-3 px-3">
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle className="text-sm font-medium">
                                                                Tingkat {tingkat}
                                                            </CardTitle>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {kelasData[tingkat]?.length || 0} kelas
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="px-3 pb-3">
                                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                            {kelasData[tingkat]?.map((kelas) => (
                                                                <div
                                                                    key={kelas.id}
                                                                    className="flex items-center space-x-2 p-2 rounded-md border hover:bg-accent transition-colors"
                                                                >
                                                                    <Checkbox
                                                                        id={`kelas-${kelas.id}`}
                                                                        checked={formData.kelas_ids.includes(kelas.id)}
                                                                        onCheckedChange={() => handleKelasToggle(kelas.id)}
                                                                    />
                                                                    <Label
                                                                        htmlFor={`kelas-${kelas.id}`}
                                                                        className="cursor-pointer text-sm font-medium"
                                                                    >
                                                                        {kelas.nama}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                    {errors.kelas_ids && (
                                        <p className="text-sm text-destructive">{errors.kelas_ids}</p>
                                    )}
                                </div>
                            )}

                            {/* Keterangan */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                                <Textarea
                                    id="keterangan"
                                    placeholder="Tambahkan keterangan jika diperlukan..."
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(penugasanMengajarRoutes.index().url)}
                                    disabled={processing}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Penugasan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
