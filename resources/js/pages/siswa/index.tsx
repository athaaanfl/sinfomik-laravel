import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2, Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface Props {
    siswas: PaginatedData<Siswa>;
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: siswaRoutes.index().url,
    },
];

export default function Index({ siswas, filters }: Props) {
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; siswa: Siswa | null }>({
        open: false,
        siswa: null,
    });
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

    const page = usePage();
    const prevFlashRef = useRef({ success: '', error: '', info: '' });

    // Show toast notifications
    useEffect(() => {
        const currentSuccess = page.props.success as string | undefined;
        const currentError = page.props.error as string | undefined;
        const currentInfo = page.props.info as string | undefined;

        if (currentSuccess && currentSuccess !== prevFlashRef.current.success) {
            toast.success('Berhasil!', {
                description: currentSuccess,
            });
            prevFlashRef.current.success = currentSuccess;
        }
        if (currentError && currentError !== prevFlashRef.current.error) {
            toast.error('Terjadi Kesalahan!', {
                description: currentError,
            });
            prevFlashRef.current.error = currentError;
        }
        if (currentInfo && currentInfo !== prevFlashRef.current.info) {
            toast.info('Informasi', {
                description: currentInfo,
            });
            prevFlashRef.current.info = currentInfo;
        }
    }, [page.props.success, page.props.error, page.props.info]);

    // Dynamic search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    siswaRoutes.index().url,
                    search ? { search } : {},
                    { preserveState: true, preserveScroll: true }
                );
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submit still works for Enter key
    };

    const clearSearch = () => {
        setSearch('');
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === siswas.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(siswas.data.map((s) => s.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        router.post(
            siswaRoutes.index().url.replace('/siswa', '/siswa/bulk-destroy'),
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setBulkDeleteModal(false);
                    setSelectedIds([]);
                },
            }
        );
    };

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
                    <div className="flex gap-2">
                        {selectedIds.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={() => setBulkDeleteModal(true)}
                            >
                                <Trash2 className="mr-2 size-4" />
                                Hapus {selectedIds.length} Terpilih
                            </Button>
                        )}
                        <Link href={siswaRoutes.create().url}>
                            <Button>
                                <Plus className="mr-2 size-4" />
                                Tambah Siswa
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIS, NISN, atau nama..."
                            className="pl-8 pr-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0.5 top-0.5 h-8 w-8 p-0"
                                onClick={clearSearch}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedIds.length === siswas.data.length && siswas.data.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>No</TableHead>
                                <TableHead>NIS</TableHead>
                                <TableHead>Nama Lengkap</TableHead>
                                <TableHead>Nama Panggilan</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Kelas Aktif</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {siswas.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data siswa
                                    </TableCell>
                                </TableRow>
                            ) : (
                                siswas.data.map((siswa, index) => (
                                    <TableRow key={siswa.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(siswa.id)}
                                                onCheckedChange={() => toggleSelect(siswa.id)}
                                            />
                                        </TableCell>
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
                                        <TableCell>
                                            {siswa.nama_panggilan || '-'}
                                        </TableCell>
                                        <TableCell>{siswa.gender}</TableCell>
                                        <TableCell>
                                            {siswa.kelas_aktif ? (
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">{siswa.kelas_aktif.nama_lengkap}</div>
                                                    <div className="text-xs text-muted-foreground">{siswa.kelas_aktif.tahun_ajaran}</div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Belum ada kelas</span>
                                            )}
                                        </TableCell>
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
                                    preserveState
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

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog open={bulkDeleteModal} onOpenChange={setBulkDeleteModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Konfirmasi Hapus Massal
                        </DialogTitle>
                        <DialogDescription className="text-center space-y-3 pt-3">
                            <p>Apakah Anda yakin ingin menghapus {selectedIds.length} siswa yang dipilih?</p>
                            <p className="text-sm text-muted-foreground">
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setBulkDeleteModal(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleBulkDelete}
                            className="flex-1"
                        >
                            Ya, Hapus Semua
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
