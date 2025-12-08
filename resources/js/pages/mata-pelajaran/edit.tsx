import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import mataPelajaranRoutes from '@/routes/mata-pelajaran';
import { type BreadcrumbItem, type MataPelajaran } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';

interface EditProps {
    mataPelajaran: MataPelajaran;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mata Pelajaran',
        href: mataPelajaranRoutes.index().url,
    },
    {
        title: 'Edit Mata Pelajaran',
        href: '#',
    },
];

export default function Edit({ mataPelajaran }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: mataPelajaran.name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(mataPelajaranRoutes.show({ mata_pelajaran: mataPelajaran.id }).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Mata Pelajaran" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Mata Pelajaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui informasi mata pelajaran
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
                            <CardTitle>Informasi Mata Pelajaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nama Mata Pelajaran <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Matematika"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Slug Saat Ini</Label>
                                <code className="block rounded bg-muted px-3 py-2 text-sm">
                                    {mataPelajaran.slug}
                                </code>
                                <p className="text-xs text-muted-foreground">
                                    Slug akan diperbarui otomatis jika nama diubah
                                </p>
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
                            Perbarui
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
