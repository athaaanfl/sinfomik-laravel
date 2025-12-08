import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import siswaRoutes from '@/routes/siswa';
import { type BreadcrumbItem, type Siswa } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import * as React from 'react';

interface Props {
    siswa: Siswa;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: siswaRoutes.index().url,
    },
    {
        title: 'Edit Siswa',
        href: '#',
    },
];

export default function Edit({ siswa }: Props) {
    const [datePickerOpen, setDatePickerOpen] = React.useState(false);

    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: siswa.nama_lengkap || '',
        nama_panggilan: siswa.nama_panggilan || '',
        nis: siswa.nis || '',
        nisn: siswa.nisn || '',
        tahun_masuk: siswa.tahun_masuk || new Date().getFullYear(),
        status: siswa.status || ('Aktif' as 'Aktif' | 'Non Aktif'),
        gender: siswa.gender || ('' as 'laki-laki' | 'perempuan' | ''),
        tanggal_lahir: siswa.tanggal_lahir || '',
        tempat_lahir: siswa.tempat_lahir || '',
        agama: siswa.agama || '',
        alamat: siswa.alamat || '',
        nomor_telepon: siswa.nomor_telepon || '',
        nama_ayah: siswa.nama_ayah || '',
        nama_ibu: siswa.nama_ibu || '',
        nomor_telepon_wali: siswa.nomor_telepon_wali || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(siswaRoutes.update({ siswa: siswa.id }).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${siswa.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Data Siswa</h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui data siswa {siswa.nama_lengkap}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Data Pribadi */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Pribadi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_lengkap">
                                        Nama Lengkap <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nama_lengkap"
                                        value={data.nama_lengkap}
                                        onChange={(e) =>
                                            setData('nama_lengkap', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.nama_lengkap && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_lengkap}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_panggilan">Nama Panggilan</Label>
                                    <Input
                                        id="nama_panggilan"
                                        value={data.nama_panggilan}
                                        onChange={(e) =>
                                            setData('nama_panggilan', e.target.value)
                                        }
                                    />
                                    {errors.nama_panggilan && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_panggilan}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nis">NIS</Label>
                                        <Input
                                            id="nis"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                        />
                                        {errors.nis && (
                                            <p className="text-sm text-destructive">
                                                {errors.nis}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nisn">NISN</Label>
                                        <Input
                                            id="nisn"
                                            value={data.nisn}
                                            onChange={(e) => setData('nisn', e.target.value)}
                                        />
                                        {errors.nisn && (
                                            <p className="text-sm text-destructive">
                                                {errors.nisn}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">
                                        Jenis Kelamin <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.gender}
                                        onValueChange={(value) =>
                                            setData('gender', value as 'laki-laki' | 'perempuan')
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && (
                                        <p className="text-sm text-destructive">{errors.gender}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                    <Input
                                        id="tempat_lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) =>
                                            setData('tempat_lahir', e.target.value)
                                        }
                                    />
                                    {errors.tempat_lahir && (
                                        <p className="text-sm text-destructive">
                                            {errors.tempat_lahir}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="tanggal_lahir"
                                                className="w-full justify-between font-normal"
                                            >
                                                {data.tanggal_lahir 
                                                    ? new Date(data.tanggal_lahir + 'T00:00:00').toLocaleDateString('id-ID', { 
                                                        day: '2-digit', 
                                                        month: 'long', 
                                                        year: 'numeric' 
                                                    })
                                                    : "Pilih tanggal"}
                                                <CalendarIcon className="size-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={data.tanggal_lahir ? new Date(data.tanggal_lahir + 'T00:00:00') : undefined}
                                                captionLayout="dropdown"
                                                fromYear={1900}
                                                toYear={2100}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const year = date.getFullYear();
                                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                                        const day = String(date.getDate()).padStart(2, '0');
                                                        setData('tanggal_lahir', `${year}-${month}-${day}`);
                                                    }
                                                    setDatePickerOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_lahir}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agama">Agama</Label>
                                    <Input
                                        id="agama"
                                        value={data.agama}
                                        onChange={(e) => setData('agama', e.target.value)}
                                    />
                                    {errors.agama && (
                                        <p className="text-sm text-destructive">{errors.agama}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Sekolah & Kontak */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Sekolah & Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tahun_masuk">
                                        Tahun Masuk <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="tahun_masuk"
                                        type="number"
                                        value={data.tahun_masuk}
                                        onChange={(e) =>
                                            setData('tahun_masuk', parseInt(e.target.value))
                                        }
                                        required
                                    />
                                    {errors.tahun_masuk && (
                                        <p className="text-sm text-destructive">
                                            {errors.tahun_masuk}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value as 'Aktif' | 'Non Aktif')
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Aktif">Aktif</SelectItem>
                                            <SelectItem value="Non Aktif">Non Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-destructive">{errors.alamat}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                                    <Input
                                        id="nomor_telepon"
                                        value={data.nomor_telepon}
                                        onChange={(e) =>
                                            setData('nomor_telepon', e.target.value)
                                        }
                                    />
                                    {errors.nomor_telepon && (
                                        <p className="text-sm text-destructive">
                                            {errors.nomor_telepon}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_ayah">Nama Ayah</Label>
                                    <Input
                                        id="nama_ayah"
                                        value={data.nama_ayah}
                                        onChange={(e) => setData('nama_ayah', e.target.value)}
                                    />
                                    {errors.nama_ayah && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_ayah}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_ibu">Nama Ibu</Label>
                                    <Input
                                        id="nama_ibu"
                                        value={data.nama_ibu}
                                        onChange={(e) => setData('nama_ibu', e.target.value)}
                                    />
                                    {errors.nama_ibu && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_ibu}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nomor_telepon_wali">
                                        Nomor Telepon Wali
                                    </Label>
                                    <Input
                                        id="nomor_telepon_wali"
                                        value={data.nomor_telepon_wali}
                                        onChange={(e) =>
                                            setData('nomor_telepon_wali', e.target.value)
                                        }
                                    />
                                    {errors.nomor_telepon_wali && (
                                        <p className="text-sm text-destructive">
                                            {errors.nomor_telepon_wali}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
