import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import penugasanMengajarRoutes from '@/routes/penugasan-mengajar';
import mapelWaliKelasRoutes from '@/routes/mapel-wali-kelas';

interface MataPelajaran {
    id: number;
    nama: string;
}

interface MapelWaliKelas {
    id: number;
    mata_pelajaran_id: number;
    mata_pelajaran: MataPelajaran;
    tingkat_allowed: number[];
    is_active: boolean;
    urutan: number;
}

interface Props {
    mapelWaliKelas: MapelWaliKelas[];
    availableMataPelajaran: MataPelajaran[];
    allMataPelajaran: MataPelajaran[];
}

interface FormData {
    mata_pelajaran_id: string;
    tingkat_allowed: number[];
    is_active: boolean;
}

interface FormErrors {
    mata_pelajaran_id?: string;
    tingkat_allowed?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penugasan Mengajar',
        href: penugasanMengajarRoutes.index().url,
    },
    {
        title: 'Konfigurasi Mapel Wali Kelas',
        href: mapelWaliKelasRoutes.index().url,
    },
];

const tingkatOptions = [1, 2, 3, 4, 5, 6];

export default function KonfigurasiMapelWaliKelas({
    mapelWaliKelas,
    availableMataPelajaran,
    allMataPelajaran,
}: Props) {
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<{
        open: boolean;
        data: MapelWaliKelas | null;
    }>({ open: false, data: null });
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        id: number | null;
    }>({ open: false, id: null });
    
    const [formData, setFormData] = useState<FormData>({
        mata_pelajaran_id: '',
        tingkat_allowed: [],
        is_active: true,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const resetForm = () => {
        setFormData({
            mata_pelajaran_id: '',
            tingkat_allowed: [],
            is_active: true,
        });
        setErrors({});
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.mata_pelajaran_id) {
            newErrors.mata_pelajaran_id = 'Mata pelajaran harus dipilih';
        }
        
        if (formData.tingkat_allowed.length === 0) {
            newErrors.tingkat_allowed = 'Minimal pilih 1 tingkat';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenAddModal = () => {
        resetForm();
        setAddModal(true);
    };

    const handleOpenEditModal = (data: MapelWaliKelas) => {
        setFormData({
            mata_pelajaran_id: data.mata_pelajaran_id.toString(),
            tingkat_allowed: data.tingkat_allowed,
            is_active: data.is_active,
        });
        setEditModal({ open: true, data });
    };

    const handleTingkatToggle = (tingkat: number) => {
        setFormData(prev => ({
            ...prev,
            tingkat_allowed: prev.tingkat_allowed.includes(tingkat)
                ? prev.tingkat_allowed.filter(t => t !== tingkat)
                : [...prev.tingkat_allowed, tingkat]
        }));
    };

    const handleSubmitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setProcessing(true);
        router.post(mapelWaliKelasRoutes.store().url, formData as any, {
            onError: (errors) => {
                setErrors(errors as FormErrors);
                setProcessing(false);
            },
            onSuccess: () => {
                setAddModal(false);
                resetForm();
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm() || !editModal.data) return;

        setProcessing(true);
        router.put(mapelWaliKelasRoutes.update(editModal.data.id).url, formData as any, {
            onError: (errors) => {
                setErrors(errors as FormErrors);
                setProcessing(false);
            },
            onSuccess: () => {
                setEditModal({ open: false, data: null });
                resetForm();
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleDelete = () => {
        if (!deleteModal.id) return;

        setProcessing(true);
        router.delete(mapelWaliKelasRoutes.destroy(deleteModal.id).url, {
            onSuccess: () => {
                setDeleteModal({ open: false, id: null });
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleToggleActive = (id: number) => {
        router.patch(mapelWaliKelasRoutes.toggle(id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Konfigurasi Mapel Wali Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(penugasanMengajarRoutes.index().url)}
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Konfigurasi Mapel Wali Kelas</h1>
                            <p className="text-sm text-muted-foreground">
                                Atur mata pelajaran yang diajarkan oleh wali kelas
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleOpenAddModal} size="sm">
                        <Plus className="mr-2 size-4" />
                        Tambah Mata Pelajaran
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Mata Pelajaran Wali Kelas</CardTitle>
                        <CardDescription>
                            Mata pelajaran yang akan otomatis ditugaskan ke wali kelas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mapelWaliKelas.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Belum ada konfigurasi mata pelajaran wali kelas
                                </p>
                                <Button onClick={handleOpenAddModal} className="mt-4">
                                    <Plus className="mr-2 size-4" />
                                    Tambah Mata Pelajaran
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {mapelWaliKelas.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="transition-all hover:shadow-md"
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-semibold">
                                                            {item.mata_pelajaran.nama}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            Berlaku untuk tingkat:
                                                        </span>
                                                        <div className="flex gap-1">
                                                            {item.tingkat_allowed.sort((a, b) => a - b).map((tingkat) => (
                                                                <Badge key={tingkat} variant="outline" className="text-xs px-1.5 py-0">
                                                                    Tingkat {tingkat}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex items-center space-x-2 px-2 py-1 rounded-md border">
                                                        <Label
                                                            htmlFor={`active-${item.id}`}
                                                            className="text-xs cursor-pointer font-medium"
                                                        >
                                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </Label>
                                                        <Switch
                                                            id={`active-${item.id}`}
                                                            checked={item.is_active}
                                                            onCheckedChange={() => handleToggleActive(item.id)}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleOpenEditModal(item)}
                                                    >
                                                        <Edit className="size-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            setDeleteModal({ open: true, id: item.id })
                                                        }
                                                    >
                                                        <Trash2 className="size-3 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Modal */}
            <Dialog open={addModal} onOpenChange={(open) => { 
                setAddModal(open); 
                if (!open) resetForm(); 
            }}>
                <DialogContent className="max-w-2xl">
                    <form onSubmit={handleSubmitAdd}>
                        <DialogHeader>
                            <DialogTitle>Tambah Mata Pelajaran Wali Kelas</DialogTitle>
                            <DialogDescription>
                                Pilih mata pelajaran dan tingkat yang akan diajarkan oleh wali kelas
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="mata_pelajaran_id" className="text-sm font-medium">
                                    Mata Pelajaran <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.mata_pelajaran_id}
                                    onValueChange={(value) => 
                                        setFormData(prev => ({ ...prev, mata_pelajaran_id: value }))
                                    }
                                >
                                    <SelectTrigger id="mata_pelajaran_id">
                                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableMataPelajaran.map((mapel) => (
                                            <SelectItem
                                                key={mapel.id}
                                                value={mapel.id.toString()}
                                            >
                                                {mapel.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.mata_pelajaran_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.mata_pelajaran_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Tingkat <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {tingkatOptions.map((tingkat) => (
                                        <div
                                            key={tingkat}
                                            className="flex items-center space-x-2 p-2 rounded-md border hover:bg-accent transition-colors"
                                        >
                                            <Checkbox
                                                id={`tingkat-add-${tingkat}`}
                                                checked={formData.tingkat_allowed.includes(tingkat)}
                                                onCheckedChange={() => handleTingkatToggle(tingkat)}
                                            />
                                            <Label
                                                htmlFor={`tingkat-add-${tingkat}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                Tingkat {tingkat}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.tingkat_allowed && (
                                    <p className="text-sm text-destructive">
                                        {errors.tingkat_allowed}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 p-2 rounded-md border bg-muted/50">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({ ...prev, is_active: checked }))
                                    }
                                />
                                <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                                    Aktifkan mata pelajaran ini
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAddModal(false)}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog
                open={editModal.open}
                onOpenChange={(open) => {
                    setEditModal({ open, data: null });
                    if (!open) resetForm();
                }}
            >
                <DialogContent className="max-w-2xl">
                    <form onSubmit={handleSubmitEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Mata Pelajaran Wali Kelas</DialogTitle>
                            <DialogDescription>
                                Ubah tingkat yang akan diajarkan oleh wali kelas
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Mata Pelajaran</Label>
                                <div className="px-3 py-2 border rounded-md bg-muted text-sm font-medium">
                                    {editModal.data?.mata_pelajaran.nama}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Tingkat <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {tingkatOptions.map((tingkat) => (
                                        <div
                                            key={tingkat}
                                            className="flex items-center space-x-2 p-2 rounded-md border hover:bg-accent transition-colors"
                                        >
                                            <Checkbox
                                                id={`tingkat-edit-${tingkat}`}
                                                checked={formData.tingkat_allowed.includes(tingkat)}
                                                onCheckedChange={() => handleTingkatToggle(tingkat)}
                                            />
                                            <Label
                                                htmlFor={`tingkat-edit-${tingkat}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                Tingkat {tingkat}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.tingkat_allowed && (
                                    <p className="text-sm text-destructive">
                                        {errors.tingkat_allowed}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 p-2 rounded-md border bg-muted/50">
                                <Switch
                                    id="is_active_edit"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({ ...prev, is_active: checked }))
                                    }
                                />
                                <Label htmlFor="is_active_edit" className="text-sm font-medium cursor-pointer">
                                    Aktifkan mata pelajaran ini
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditModal({ open: false, data: null })}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal({ open, id: null })}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Konfigurasi</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus konfigurasi ini? Tindakan ini tidak
                            dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ open: false, id: null })}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            {processing ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
