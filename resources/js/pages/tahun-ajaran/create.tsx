import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import tahunAjaranRoutes from '@/routes/tahun-ajaran';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tahun Ajaran',
        href: tahunAjaranRoutes.index().url,
    },
    {
        title: 'Tambah Tahun Ajaran',
        href: tahunAjaranRoutes.create().url,
    },
];

export default function Create() {
    const [tahunAwalOpen, setTahunAwalOpen] = React.useState(false);
    const [tahunAkhirOpen, setTahunAkhirOpen] = React.useState(false);

    const { data, setData, post, processing, errors } = useForm({
        kode_tahun_ajaran: '',
        tahunawal: '',
        tahunakhir: '',
        is_active: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(tahunAjaranRoutes.index().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Tahun Ajaran" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Tahun Ajaran Baru</h1>
                        <p className="text-sm text-muted-foreground">
                            Isi formulir untuk menambahkan data tahun ajaran baru
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Tahun Ajaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kode_tahun_ajaran">
                                    Kode Tahun Ajaran <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="kode_tahun_ajaran"
                                    value={data.kode_tahun_ajaran}
                                    onChange={(e) => setData('kode_tahun_ajaran', e.target.value)}
                                />
                                {errors.kode_tahun_ajaran && (
                                    <p className="text-sm text-destructive">
                                        {errors.kode_tahun_ajaran}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tahunawal">
                                        Tahun Awal
                                    </Label>
                                    <Popover open={tahunAwalOpen} onOpenChange={setTahunAwalOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="tahunawal"
                                                className="w-full justify-between font-normal"
                                            >
                                                {data.tahunawal
                                                    ? new Date(data.tahunawal).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              day: '2-digit',
                                                              month: 'long',
                                                              year: 'numeric',
                                                          }
                                                      )
                                                    : 'Pilih tanggal'}
                                                <CalendarIcon className="size-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    data.tahunawal
                                                        ? new Date(data.tahunawal + 'T00:00:00')
                                                        : undefined
                                                }
                                                captionLayout="dropdown"
                                                fromYear={1900}
                                                toYear={2100}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const year = date.getFullYear();
                                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                                        const day = String(date.getDate()).padStart(2, '0');
                                                        setData('tahunawal', `${year}-${month}-${day}`);
                                                    }
                                                    setTahunAwalOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tahunakhir">
                                        Tahun Akhir
                                    </Label>
                                    <Popover open={tahunAkhirOpen} onOpenChange={setTahunAkhirOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="tahunakhir"
                                                className="w-full justify-between font-normal"
                                            >
                                                {data.tahunakhir
                                                    ? new Date(data.tahunakhir).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              day: '2-digit',
                                                              month: 'long',
                                                              year: 'numeric',
                                                          }
                                                      )
                                                    : 'Pilih tanggal'}
                                                <CalendarIcon className="size-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    data.tahunakhir
                                                        ? new Date(data.tahunakhir + 'T00:00:00')
                                                        : undefined
                                                }
                                                captionLayout="dropdown"
                                                fromYear={1900}
                                                toYear={2100}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const year = date.getFullYear();
                                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                                        const day = String(date.getDate()).padStart(2, '0');
                                                        setData('tahunakhir', `${year}-${month}-${day}`);
                                                    }
                                                    setTahunAkhirOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked as boolean)
                                    }
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Set sebagai tahun ajaran aktif
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
