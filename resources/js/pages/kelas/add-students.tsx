import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import kelasRoutes from '@/routes/kelas';
import studentsRoutes from '@/routes/kelas/students';
import { type BreadcrumbItem, type Kelas, type Siswa } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
    kelas: {
        id: number;
        nama: string;
        tingkat: number;
    };
    availableSiswas: Siswa[];
}

export default function AddStudents({ kelas, availableSiswas }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Data Kelas',
            href: kelasRoutes.index().url,
        },
        {
            title: kelas.nama,
            href: kelasRoutes.show({ kelas: kelas.id }).url,
        },
        {
            title: 'Tambah Siswa',
            href: '#',
        },
    ];

    const [searchLeft, setSearchLeft] = useState('');
    const [searchRight, setSearchRight] = useState('');

    const [available, setAvailable] = useState<Siswa[]>(availableSiswas);
    const [selected, setSelected] = useState<Siswa[]>([]);

    // Pagination state for available students
    const [page, setPage] = useState(1);
    const perPage = 20;

    const filteredAvailable = available.filter((siswa) =>
        siswa.nama.toLowerCase().includes(searchLeft.toLowerCase()) ||
        siswa.nis?.toLowerCase().includes(searchLeft.toLowerCase())
    );
    const totalPages = Math.ceil(filteredAvailable.length / perPage);
    const paginatedAvailable = filteredAvailable.slice((page - 1) * perPage, page * perPage);

    const filteredSelected = selected.filter((siswa) =>
        siswa.nama.toLowerCase().includes(searchRight.toLowerCase()) ||
        siswa.nis?.toLowerCase().includes(searchRight.toLowerCase())
    );

    const handleSubmit = () => {
        router.post(
            studentsRoutes.store({ kelas: kelas.id }).url,
            {
                siswa_ids: selected.map((s) => s.id),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(kelasRoutes.show({ kelas: kelas.id }).url);
                },
            }
        );
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tambah Siswa - ${kelas.nama}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Siswa ke {kelas.nama}</h1>
                        <p className="text-sm text-muted-foreground">
                            Tingkat {kelas.tingkat}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(kelasRoutes.show({ kelas: kelas.id }).url)}
                    >
                        Kembali
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                    {/* Available Students (with pagination) */}
                    <div className="flex flex-col gap-3 min-h-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Siswa Tersedia</h3>
                            <span className="text-sm text-muted-foreground">
                                {filteredAvailable.length} siswa
                            </span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau NIS..."
                                value={searchLeft}
                                onChange={(e) => {
                                    setSearchLeft(e.target.value);
                                    setPage(1); // reset to page 1 on search
                                }}
                                className="pl-10"
                            />
                        </div>
                        <div className="border rounded-lg flex-1 overflow-hidden bg-card flex flex-col">
                            <ScrollArea className="h-full flex-1">
                                <div className="p-4 space-y-2">
                                    {paginatedAvailable.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            Tidak ada siswa tersedia
                                        </p>
                                    ) : (
                                        paginatedAvailable.map((siswa) => (
                                            <div
                                                key={siswa.id}
                                                onClick={() => {
                                                    setSelected([...selected, siswa]);
                                                    setAvailable(available.filter((s) => s.id !== siswa.id));
                                                }}
                                                className="p-3 rounded-md border cursor-pointer transition-colors hover:bg-primary/10 hover:border-primary"
                                            >
                                                <p className="font-medium">{siswa.nama}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    NIS: {siswa.nis}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                            {/* Pagination controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 py-2 border-t bg-muted">
                                    <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                        Prev
                                    </Button>
                                    <span className="text-xs">Halaman {page} / {totalPages}</span>
                                    <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Students (same width, improved layout) */}
                    <div className="flex flex-col gap-3 min-h-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Siswa Dipilih</h3>
                            <span className="text-sm text-muted-foreground">
                                {selected.length} siswa
                            </span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau NIS..."
                                value={searchRight}
                                onChange={(e) => setSearchRight(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="border rounded-lg flex-1 overflow-hidden bg-card flex flex-col">
                            <ScrollArea className="h-full flex-1">
                                <div className="p-4 space-y-2">
                                    {filteredSelected.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            Belum ada siswa dipilih
                                        </p>
                                    ) : (
                                        filteredSelected.map((siswa) => (
                                            <div
                                                key={siswa.id}
                                                onClick={() => {
                                                    setAvailable([...available, siswa]);
                                                    setSelected(selected.filter((s) => s.id !== siswa.id));
                                                }}
                                                className="p-3 rounded-md border cursor-pointer transition-colors hover:bg-muted/50"
                                            >
                                                <p className="font-medium">{siswa.nama}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    NIS: {siswa.nis}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => router.visit(kelasRoutes.show({ kelas: kelas.id }).url)}
                    >
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={selected.length === 0}>
                        Tambah {selected.length} Siswa
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
