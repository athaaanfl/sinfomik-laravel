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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import kelasRoutes from '@/routes/kelas';
import { type BreadcrumbItem, type TahunAjaran, type Kelas, type Guru } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Users, UserCheck, School, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface IndexProps {
    tahunAjarans: TahunAjaran[];
    selectedTahunAjaranId: number;
    kelasByTingkat: Record<number, Kelas[]>;
    gurus: Guru[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelas',
        href: kelasRoutes.index().url,
    },
];

export default function Index({
    tahunAjarans,
    selectedTahunAjaranId,
    kelasByTingkat,
    gurus,
}: IndexProps) {
    const [selectedKelas, setSelectedKelas] = React.useState<number | null>(null);
    const [isWaliKelasDialogOpen, setIsWaliKelasDialogOpen] = React.useState(false);
    const [selectedGuruId, setSelectedGuruId] = React.useState<number | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [newKelasNama, setNewKelasNama] = React.useState('');
    const [newKelasTingkat, setNewKelasTingkat] = React.useState<number>(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [kelasToDelete, setKelasToDelete] = React.useState<Kelas | null>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);

    const page = usePage();
    const prevFlashRef = React.useRef({ success: '', error: '', info: '' });

    React.useEffect(() => {
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

    const handleTahunAjaranChange = (tahunAjaranId: string) => {
        router.visit(kelasRoutes.index().url, {
            data: { tahun_ajaran_id: tahunAjaranId },
            preserveState: false,
        });
    };

    const handleOpenWaliKelasDialog = (kelas: Kelas) => {
        setSelectedKelas(kelas.id);
        setSelectedGuruId(kelas.homeroom_teacher_id || null);
        setIsWaliKelasDialogOpen(true);
    };

    const handleUpdateWaliKelas = () => {
        if (!selectedKelas) return;

        setIsUpdating(true);
        router.put(
            kelasRoutes.update({ kelas: selectedKelas }).url,
            { homeroom_teacher_id: selectedGuruId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsWaliKelasDialogOpen(false);
                    setSelectedKelas(null);
                    setSelectedGuruId(null);
                },
                onFinish: () => {
                    setIsUpdating(false);
                },
            }
        );
    };

    const handleGenerateBatch = () => {
        if (!newKelasNama.trim()) return;

        setIsUpdating(true);
        router.post(
            kelasRoutes.store().url,
            {
                tahun_ajaran_id: selectedTahunAjaranId,
                nama: newKelasNama,
                tingkat: newKelasTingkat,
                homeroom_teacher_id: null,
            },
            {
                onFinish: () => {
                    setIsUpdating(false);
                    setIsCreateDialogOpen(false);
                    setNewKelasNama('');
                    setNewKelasTingkat(1);
                },
            }
        );
    };

    const handleOpenDeleteDialog = (kelas: Kelas) => {
        setKelasToDelete(kelas);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteKelas = () => {
        if (!kelasToDelete) return;

        setIsUpdating(true);
        router.delete(
            kelasRoutes.destroy({ kelas: kelasToDelete.id }).url,
            {
                preserveState: false,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setKelasToDelete(null);
                },
                onFinish: () => {
                    setIsUpdating(false);
                },
            }
        );
    };

    const selectedTahunAjaran = tahunAjarans.find((ta) => ta.id === selectedTahunAjaranId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kelola Kelas</h1>
                        <p className="text-sm text-muted-foreground">
                            Manajemen kelas per tahun ajaran dan penugasan wali kelas
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 size-4" />
                            Tambah Kelas
                        </Button>
                    </div>
                </div>

                {/* Filter Tahun Ajaran */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pilih Tahun Ajaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={selectedTahunAjaranId?.toString()}
                            onValueChange={handleTahunAjaranChange}
                        >
                            <SelectTrigger className="w-full md:w-80">
                                <SelectValue placeholder="Pilih Tahun Ajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {tahunAjarans.map((ta) => (
                                    <SelectItem key={ta.id} value={ta.id.toString()}>
                                        {ta.kode_tahun_ajaran} {ta.is_active ? '(Aktif)' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Kelas by Tingkat */}
                {Object.keys(kelasByTingkat).length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <School className="size-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Kelas</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Tahun ajaran ini belum memiliki kelas. Tambah kelas terlebih dahulu.
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="mr-2 size-4" />
                                Tambah Kelas Sekarang
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    Object.entries(kelasByTingkat).map(([tingkat, kelasList]) => (
                        <Card key={tingkat}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <School className="size-5" />
                                    Kelas Tingkat {tingkat}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {kelasList.map((kelas) => (
                                        <Card key={kelas.id} className="overflow-hidden">
                                            <CardHeader className="bg-muted/50 pb-3">
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    <span>{kelas.nama}</span>
                                                    <Badge variant="outline">
                                                        Tingkat {kelas.tingkat}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-4 space-y-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <UserCheck className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        Wali Kelas:
                                                    </span>
                                                    <span className="font-medium">
                                                        {kelas.wali_kelas?.nama || (
                                                            <span className="text-muted-foreground italic">
                                                                Belum ditentukan
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        Jumlah Siswa:
                                                    </span>
                                                    <Badge variant="secondary">
                                                        {kelas.siswas_count || 0} siswa
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2 pt-2">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => handleOpenWaliKelasDialog(kelas)}
                                                        >
                                                            <UserCheck className="mr-2 size-4" />
                                                            {kelas.wali_kelas ? 'Ganti' : 'Set'} Wali Kelas
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() =>
                                                                router.visit(
                                                                    kelasRoutes.show({ kelas: kelas.id }).url
                                                                )
                                                            }
                                                        >
                                                            <Users className="mr-2 size-4" />
                                                            Kelola Siswa
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => handleOpenDeleteDialog(kelas)}
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Hapus Kelas
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Dialog Update Wali Kelas */}
            <Dialog open={isWaliKelasDialogOpen} onOpenChange={setIsWaliKelasDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Wali Kelas</DialogTitle>
                        <DialogDescription>
                            Pilih guru yang akan menjadi wali kelas
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="guru">Pilih Guru</Label>
                            <Select
                                value={selectedGuruId?.toString() || 'none'}
                                onValueChange={(value) =>
                                    setSelectedGuruId(value === 'none' ? null : parseInt(value))
                                }
                            >
                                <SelectTrigger id="guru">
                                    <SelectValue placeholder="Pilih Guru" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="none">Tidak Ada</SelectItem>
                                    {gurus.map((guru) => (
                                        <SelectItem key={guru.id} value={guru.id.toString()}>
                                            {guru.nama} {guru.nip && `(${guru.nip})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsWaliKelasDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleUpdateWaliKelas} disabled={isUpdating}>
                            {isUpdating ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Generate Batch */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kelas untuk {selectedTahunAjaran?.kode_tahun_ajaran}</DialogTitle>
                        <DialogDescription>
                            Isi data kelas yang ingin dibuat untuk tahun ajaran ini
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tingkat">Tingkat</Label>
                            <Select
                                value={newKelasTingkat.toString()}
                                onValueChange={(value) => setNewKelasTingkat(parseInt(value))}
                            >
                                <SelectTrigger id="tingkat">
                                    <SelectValue placeholder="Pilih Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((t) => (
                                        <SelectItem key={t} value={t.toString()}>
                                            Tingkat {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kelas</Label>
                            <Input
                                id="nama"
                                value={newKelasNama}
                                onChange={(e) => setNewKelasNama(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                setNewKelasNama('');
                                setNewKelasTingkat(1);
                            }}
                            disabled={isUpdating}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleGenerateBatch}
                            disabled={isUpdating || !newKelasNama.trim()}
                        >
                            {isUpdating ? 'Membuat...' : 'Buat Kelas'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Kelas</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kelas {kelasToDelete?.tingkat}{kelasToDelete?.nama}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                            <p className="font-semibold mb-2">Peringatan:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Kelas tidak dapat dihapus jika masih memiliki siswa aktif</li>
                                <li>Pastikan semua siswa sudah dikeluarkan dari kelas</li>
                                <li>Aksi ini tidak dapat dibatalkan</li>
                            </ul>
                        </div>
                        {kelasToDelete && (
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Kelas:</span>
                                    <span className="font-medium">{kelasToDelete.tingkat}{kelasToDelete.nama}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Jumlah Siswa:</span>
                                    <span className="font-medium">{kelasToDelete.siswas_count || 0} siswa</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Wali Kelas:</span>
                                    <span className="font-medium">
                                        {kelasToDelete.wali_kelas?.nama || 'Belum ditentukan'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setKelasToDelete(null);
                            }}
                            disabled={isUpdating}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteKelas}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Menghapus...' : 'Hapus Kelas'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
