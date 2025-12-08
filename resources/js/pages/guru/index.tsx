import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import guruRoutes from '@/routes/guru';
import { Guru, PaginatedData, BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    gurus: PaginatedData<Guru>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Guru',
        href: guruRoutes.index().url,
    },
];

export default function Index({ gurus }: Props) {
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; guru: Guru | null }>({
        open: false,
        guru: null,
    });

    const handleDelete = () => {
        if (deleteModal.guru) {
            router.delete(guruRoutes.destroy(deleteModal.guru.id), {
                preserveScroll: true,
                onSuccess: () => setDeleteModal({ open: false, guru: null }),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Guru" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Data Guru
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data guru sekolah
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={guruRoutes.create()}>
                            <Plus className="mr-2 size-4" />
                            Tambah Guru
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>NIP</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>No. Telepon</TableHead>
                                <TableHead>Wali Kelas</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gurus.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data guru
                                    </TableCell>
                                </TableRow>
                            ) : (
                                gurus.data.map((guru, index) => (
                                    <TableRow key={guru.id}>
                                        <TableCell>
                                            {(gurus.current_page - 1) *
                                                gurus.per_page +
                                                index +
                                                1}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {guru.user?.name}
                                        </TableCell>
                                        <TableCell>{guru.nip}</TableCell>
                                        <TableCell>{guru.user?.email}</TableCell>
                                        <TableCell>
                                            {guru.gender === 'laki-laki'
                                                ? 'Laki-laki'
                                                : 'Perempuan'}
                                        </TableCell>
                                        <TableCell>
                                            {guru.nomor_telepon}
                                        </TableCell>
                                        <TableCell>
                                            {guru.is_wali_kelas ? (
                                                <Badge>Ya</Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Tidak
                                                </Badge>
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
                                                        href={guruRoutes.show(
                                                            guru.id,
                                                        )}
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
                                                        href={guruRoutes.edit(
                                                            guru.id,
                                                        )}
                                                    >
                                                        <SquarePen className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeleteModal({ open: true, guru })
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
                {gurus.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {(gurus.current_page - 1) * gurus.per_page + 1} -{' '}
                            {Math.min(
                                gurus.current_page * gurus.per_page,
                                gurus.total,
                            )}{' '}
                            dari {gurus.total} guru
                        </p>
                        <div className="flex gap-2">
                            {gurus.links.map((link, index) => (
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
            <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, guru: null })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Konfirmasi Hapus Data
                        </DialogTitle>
                        <DialogDescription className="text-center space-y-3 pt-3">
                            <p>Apakah Anda yakin ingin menghapus data guru:</p>
                            <p className="text-base font-semibold text-foreground">
                                {deleteModal.guru?.user?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tindakan ini tidak dapat dibatalkan dan semua data terkait akan terhapus permanen.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ open: false, guru: null })}
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
