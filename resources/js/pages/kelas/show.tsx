import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Users, School, Calendar, UserCheck } from 'lucide-react';
import { Kelas, Siswa, TahunAjaran, BreadcrumbItem } from '@/types';
import kelasRoutes from '@/routes/kelas';
import studentsRoutes from '@/routes/kelas/students';
import { toast } from 'sonner';

interface KelasSiswa extends Siswa {
  pivot: {
    start_date: string;
    end_date: string | null;
  };
}

interface Guru {
  id: number;
  nama: string;
  nip: string;
}

interface Props {
  kelas: Kelas & {
    kelas_master: {
      id: number;
      nama: string;
      tingkat: number;
    };
    tahun_ajaran: TahunAjaran;
    homeroom_teacher_id: number | null;
    wali_kelas: {
      id: number;
      nama: string;
      nip: string;
    } | null;
    siswas: KelasSiswa[];
  };
  availableSiswas: Siswa[];
  allGurus: Guru[];
}

export default function Show({ kelas: kelasData, availableSiswas, allGurus }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Data Kelas',
      href: kelasRoutes.index().url,
    },
    {
      title: kelasData.kelas_master?.nama || kelasData.nama,
      href: '#',
    },
  ];

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWaliKelasDialog, setShowWaliKelasDialog] = useState(false);
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    kelasData.homeroom_teacher_id?.toString() || ''
  );

  const page = usePage();
  const prevFlashRef = useRef({ success: '', error: '', info: '' });

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

  const siswaToRemove = kelasData.siswas?.find(s => s.id === selectedSiswaId);

  const handleAddSiswa = () => {
    // Navigate to add students page
    router.visit(studentsRoutes.add({ kelas: kelasData.id }).url);
  };

  const handleRemoveSiswa = () => {
    if (!selectedSiswaId) return;

    setIsSubmitting(true);
    router.delete(
      `/kelas/${kelasData.id}/students/${selectedSiswaId}`,
      {
        preserveState: false,
        onSuccess: () => {
          setShowRemoveDialog(false);
          setSelectedSiswaId(null);
        },
        onFinish: () => setIsSubmitting(false),
      }
    );
  };

  const handleUpdateWaliKelas = () => {
    if (!selectedGuruId) {
      toast.error('Pilih guru terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    router.put(
      `/kelas/${kelasData.id}`,
      { homeroom_teacher_id: selectedGuruId === '' ? null : parseInt(selectedGuruId) },
      {
        preserveState: false,
        onSuccess: () => {
          setShowWaliKelasDialog(false);
        },
        onFinish: () => setIsSubmitting(false),
      }
    );
  };

  const activeSiswas = (kelasData.siswas as KelasSiswa[])?.filter(s => !s.pivot.end_date) || [];
  const inactiveSiswas = (kelasData.siswas as KelasSiswa[])?.filter(s => s.pivot.end_date) || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Kelas ${kelasData.kelas_master?.nama || kelasData.nama}`} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={kelasRoutes.index().url}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Kelas {kelasData.kelas_master?.nama || kelasData.nama}
              </h1>
              <p className="text-sm text-muted-foreground">
                Tingkat {kelasData.kelas_master?.tingkat || kelasData.tingkat} • {kelasData.tahun_ajaran?.tahun || kelasData.tahun_ajaran?.kode_tahun_ajaran}
              </p>
            </div>
          </div>

          <Button onClick={handleAddSiswa}>
            <UserPlus className="mr-2 size-4" />
            Tambah Siswa
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa Aktif</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSiswas.length}</div>
              <p className="text-xs text-muted-foreground">
                Siswa yang terdaftar aktif
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowWaliKelasDialog(true)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wali Kelas</CardTitle>
              <School className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-2xl font-bold">
                    {kelasData.wali_kelas?.nama || '-'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {kelasData.wali_kelas?.nip || 'Belum ditentukan'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <UserCheck className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tahun Ajaran</CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kelasData.tahun_ajaran?.tahun || kelasData.tahun_ajaran?.kode_tahun_ajaran}</div>
              {kelasData.tahun_ajaran?.tanggal_mulai && kelasData.tahun_ajaran?.tanggal_selesai && (
                <p className="text-xs text-muted-foreground">
                  {new Date(kelasData.tahun_ajaran.tanggal_mulai).toLocaleDateString('id-ID')} -{' '}
                  {new Date(kelasData.tahun_ajaran.tanggal_selesai).toLocaleDateString('id-ID')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Students Table */}
        {activeSiswas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Siswa Aktif</CardTitle>
              <CardDescription>
                Siswa yang saat ini terdaftar di kelas {kelasData.kelas_master?.nama || kelasData.nama}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tanggal Masuk</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSiswas.map((siswa) => (
                    <TableRow key={siswa.id}>
                      <TableCell>{siswa.nis}</TableCell>
                      <TableCell>{siswa.nama}</TableCell>
                      <TableCell>
                        {new Date(siswa.pivot.start_date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSiswaId(siswa.id);
                            setShowRemoveDialog(true);
                          }}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Remove Siswa Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Siswa dari Kelas</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus siswa <strong>{siswaToRemove?.nama}</strong> dari
              kelas {kelasData.kelas_master?.nama || kelasData.nama}?
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-semibold mb-2">Perhatian:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Siswa akan langsung dihapus dari kelas</li>
              <li>Data tidak akan tersimpan di riwayat</li>
              <li>Aksi ini tidak dapat dibatalkan</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleRemoveSiswa}
              disabled={isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? 'Menghapus...' : 'Hapus Siswa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wali Kelas Dialog */}
      <Dialog open={showWaliKelasDialog} onOpenChange={setShowWaliKelasDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atur Wali Kelas</DialogTitle>
            <DialogDescription>
              Pilih guru yang akan menjadi wali kelas. Sistem akan otomatis membuat penugasan
              mata pelajaran untuk guru tersebut.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guru">Wali Kelas</Label>
              <Select
                value={selectedGuruId}
                onValueChange={setSelectedGuruId}
              >
                <SelectTrigger id="guru">
                  <SelectValue placeholder="Pilih guru" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tidak ada wali kelas</SelectItem>
                  {allGurus.map((guru) => (
                    <SelectItem key={guru.id} value={guru.id.toString()}>
                      {guru.nama} - {guru.nip}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-semibold mb-2">Informasi:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Guru akan ditugaskan mengajar mata pelajaran wali kelas</li>
                <li>Penugasan akan dibuat otomatis berdasarkan konfigurasi</li>
                <li>Perubahan akan diterapkan segera</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowWaliKelasDialog(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdateWaliKelas}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
