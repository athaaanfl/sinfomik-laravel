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
import mataPelajaranRoutes from '@/routes/mata-pelajaran';
import { type BreadcrumbItem, type MataPelajaran, type ElemenPembelajaran } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import * as React from 'react';

interface ShowProps {
    mataPelajaran: MataPelajaran & {
        elemen_pembelajarans: ElemenPembelajaran[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mata Pelajaran',
        href: mataPelajaranRoutes.index().url,
    },
    {
        title: 'Detail Mata Pelajaran',
        href: '#',
    },
];

export default function Show({ mataPelajaran }: ShowProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(mataPelajaranRoutes.show({ mata_pelajaran: mataPelajaran.id }).url, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Mata Pelajaran - ${mataPelajaran.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Mata Pelajaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Informasi lengkap tentang mata pelajaran
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Mata Pelajaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama Mata Pelajaran
                                </p>
                                <p className="text-base font-semibold">{mataPelajaran.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <code className="text-sm">{mataPelajaran.slug}</code>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Jumlah Elemen Pembelajaran
                                </p>
                                <Badge variant="secondary" className="mt-1">
                                    {mataPelajaran.elemen_pembelajarans?.length || 0} Elemen
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Elemen Pembelajaran</CardTitle>
                        <Button
                            size="sm"
                            onClick={() => alert('Fitur tambah elemen belum tersedia')}
                        >
                            <Plus className="mr-2 size-4" />
                            Tambah Elemen
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {mataPelajaran.elemen_pembelajarans?.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-8">
                                Belum ada elemen pembelajaran untuk mata pelajaran ini
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Urutan</TableHead>
                                        <TableHead>Nama Elemen</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mataPelajaran.elemen_pembelajarans?.map((elemen) => (
                                        <TableRow key={elemen.id}>
                                            <TableCell className="w-20">
                                                <Badge variant="outline">{elemen.urutan}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {elemen.nama}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => alert('Fitur edit elemen belum tersedia')}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.visit(
                                mataPelajaranRoutes.edit({ mata_pelajaran: mataPelajaran.id }).url
                            )
                        }
                    >
                        <Edit className="mr-2 size-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
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
                            Apakah Anda yakin ingin menghapus mata pelajaran{' '}
                            <span className="font-semibold">{mataPelajaran.name}</span>? Semua
                            elemen pembelajaran terkait juga akan terhapus. Tindakan ini tidak
                            dapat dibatalkan.
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
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
