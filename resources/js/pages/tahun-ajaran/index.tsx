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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import tahunAjaranRoutes from '@/routes/tahun-ajaran';
import { type BreadcrumbItem, type PaginatedData, type TahunAjaran } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    tahunAjarans: PaginatedData<TahunAjaran>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tahun Ajaran',
        href: tahunAjaranRoutes.index().url,
    },
];

export default function Index({ tahunAjarans }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteId) return;

        setIsDeleting(true);
        router.delete(tahunAjaranRoutes.destroy({ tahun_ajaran: deleteId }).url, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteId(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tahun Ajaran" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Tahun Ajaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data tahun ajaran sekolah
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={tahunAjaranRoutes.create().url}>
                            <Plus className="mr-2 size-4" />
                            Tambah Tahun Ajaran
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Periode</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tahunAjarans.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        Belum ada data tahun ajaran
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tahunAjarans.data.map((tahunAjaran, index) => (
                                    <TableRow key={tahunAjaran.id}>
                                        <TableCell>
                                            {(tahunAjarans.current_page - 1) *
                                                tahunAjarans.per_page +
                                                index +
                                                1}
                                        </TableCell>
                                            <TableCell className="font-medium">
                                                {tahunAjaran.kode_tahun_ajaran}
                                            </TableCell>
                                            <TableCell>
                                                {tahunAjaran.tahunawal && tahunAjaran.tahunakhir
                                                    ? `${formatDate(tahunAjaran.tahunawal)} - ${formatDate(tahunAjaran.tahunakhir)}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {tahunAjaran.is_active ? (
                                                    <Badge variant="default">Aktif</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Non-Aktif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={
                                                                tahunAjaranRoutes.show({
                                                                    tahun_ajaran: tahunAjaran.id,
                                                                }).url
                                                            }
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={
                                                                tahunAjaranRoutes.edit({
                                                                    tahun_ajaran: tahunAjaran.id,
                                                                }).url
                                                            }
                                                        >
                                                            <Edit className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteId(tahunAjaran.id)}
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                </div>

                {/* Pagination */}
                {tahunAjarans.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {(tahunAjarans.current_page - 1) * tahunAjarans.per_page + 1} -{' '}
                            {Math.min(
                                tahunAjarans.current_page * tahunAjarans.per_page,
                                tahunAjarans.total,
                            )}{' '}
                            dari {tahunAjarans.total} tahun ajaran
                        </p>
                        <div className="flex gap-2">
                            {tahunAjarans.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                >
                                    <Button
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Konfirmasi Hapus Data
                        </DialogTitle>
                        <DialogDescription className="text-center space-y-3 pt-3">
                            <p>Apakah Anda yakin ingin menghapus tahun ajaran ini?</p>
                            <p className="text-sm text-muted-foreground">
                                Tindakan ini tidak dapat dibatalkan dan semua data terkait akan terhapus permanen.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
