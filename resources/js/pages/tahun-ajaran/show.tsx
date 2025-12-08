import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import tahunAjaranRoutes from '@/routes/tahun-ajaran';
import { type BreadcrumbItem, type TahunAjaran } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import * as React from 'react';

interface ShowProps {
    tahunAjaran: TahunAjaran;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tahun Ajaran',
        href: tahunAjaranRoutes.index().url,
    },
    {
        title: 'Detail Tahun Ajaran',
        href: '#',
    },
];

export default function Show({ tahunAjaran }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(tahunAjaranRoutes.show({ tahun_ajaran: tahunAjaran.id }).url, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Tahun Ajaran - ${tahunAjaran.kode_tahun_ajaran}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Tahun Ajaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap tentang tahun ajaran
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tahun Ajaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Kode Tahun Ajaran
                                </p>
                                <p className="text-base">{tahunAjaran.kode_tahun_ajaran}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <div className="mt-1">
                                    <Badge
                                        variant={tahunAjaran.is_active ? 'default' : 'secondary'}
                                    >
                                        {tahunAjaran.is_active ? 'Aktif' : 'Non-Aktif'}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Tahun Awal
                                </p>
                                <p className="text-base">{formatDate(tahunAjaran.tahunawal)}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Tahun Akhir
                                </p>
                                <p className="text-base">{formatDate(tahunAjaran.tahunakhir)}</p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground">Periode</p>
                                <p className="text-base">
                                    {formatDate(tahunAjaran.tahunawal)} -{' '}
                                    {formatDate(tahunAjaran.tahunakhir)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.visit(
                                tahunAjaranRoutes.edit({ tahun_ajaran: tahunAjaran.id }).url
                            )
                        }
                    >
                        <Edit className="mr-2 size-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Hapus
                    </Button>
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus tahun ajaran{' '}
                            <span className="font-semibold">{tahunAjaran.kode_tahun_ajaran}</span>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
