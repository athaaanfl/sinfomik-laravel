import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import siswaRoutes from '@/routes/siswa';
import { type BreadcrumbItem, type PaginatedData, type Siswa } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    siswas: PaginatedData<Siswa>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: siswaRoutes.index().url,
    },
];

export default function Index({ siswas }: Props) {
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; siswa: Siswa | null }>({
        open: false,
        siswa: null,
    });

    const handleDelete = () => {
        if (deleteModal.siswa) {
            router.delete(siswaRoutes.show({ siswa: deleteModal.siswa.id }).url, {
                preserveScroll: true,
                onSuccess: () => setDeleteModal({ open: false, siswa: null }),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Siswa</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data siswa sekolah
                        </p>
                    </div>
                    <Link href={siswaRoutes.create().url}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Tambah Siswa
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>NIS</TableHead>
                                <TableHead>Nama Lengkap</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Tahun Masuk</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {siswas.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data siswa
                                    </TableCell>
                                </TableRow>
                            ) : (
                                siswas.data.map((siswa, index) => (
                                    <TableRow key={siswa.id}>
                                        <TableCell>
                                            {(siswas.current_page - 1) *
                                                siswas.per_page +
                                                index +
                                                1}
                                        </TableCell>
                                        <TableCell>{siswa.nis || '-'}</TableCell>
                                        <TableCell className="font-medium">
                                            {siswa.nama_lengkap}
                                        </TableCell>
                                        <TableCell>{siswa.gender}</TableCell>
                                        <TableCell>{siswa.tahun_masuk}</TableCell>
                                        <TableCell>
                                            {siswa.status === 'Aktif' ? (
                                                <Badge>Aktif</Badge>
                                            ) : (
                                                <Badge variant="secondary">Non-Aktif</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={siswaRoutes.show({ siswa: siswa.id })}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={siswaRoutes.edit({ siswa: siswa.id })}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeleteModal({ open: true, siswa })
                                                    }
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
                {siswas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {(siswas.current_page - 1) * siswas.per_page + 1} -{' '}
                            {Math.min(
                                siswas.current_page * siswas.per_page,
                                siswas.total,
                            )}{' '}
                            dari {siswas.total} siswa
                        </p>
                        <div className="flex gap-2">
                            {siswas.links.map((link, index) => (
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
            <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, siswa: null })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Konfirmasi Hapus Data
                        </DialogTitle>
                        <DialogDescription className="text-center space-y-3 pt-3">
                            <p>Apakah Anda yakin ingin menghapus data siswa:</p>
                            <p className="text-base font-semibold text-foreground">
                                {deleteModal.siswa?.nama_lengkap}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tindakan ini tidak dapat dibatalkan dan semua data terkait akan terhapus permanen.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ open: false, siswa: null })}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            className="flex-1"
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
