import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import guruRoutes from '@/routes/guru';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Guru',
        href: guruRoutes.index().url,
    },
    {
        title: 'Tambah Guru',
        href: '#',
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Guru" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Tambah Guru
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Tambahkan data guru baru
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <Form
                        action={guruRoutes.store()}
                        method="post"
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Lengkap
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input
                                            id="nip"
                                            name="nip"
                                            type="text"
                                            required
                                        />
                                        <InputError message={errors.nip} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">
                                            Jenis Kelamin
                                        </Label>
                                        <Select name="gender" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="L">
                                                    Laki-laki
                                                </SelectItem>
                                                <SelectItem value="P">
                                                    Perempuan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_lahir">
                                            Tanggal Lahir
                                        </Label>
                                        <Input
                                            id="tanggal_lahir"
                                            name="tanggal_lahir"
                                            type="date"
                                            required
                                        />
                                        <InputError
                                            message={errors.tanggal_lahir}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_telepon">
                                            Nomor Telepon
                                        </Label>
                                        <Input
                                            id="nomor_telepon"
                                            name="nomor_telepon"
                                            type="text"
                                            required
                                        />
                                        <InputError
                                            message={errors.nomor_telepon}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kualifikasi">
                                            Kualifikasi
                                        </Label>
                                        <Input
                                            id="kualifikasi"
                                            name="kualifikasi"
                                            type="text"
                                            placeholder="Contoh: S1 Pendidikan Matematika"
                                        />
                                        <InputError
                                            message={errors.kualifikasi}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="alamat">Alamat</Label>
                                        <Textarea
                                            id="alamat"
                                            name="alamat"
                                            rows={3}
                                        />
                                        <InputError message={errors.alamat} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_wali_kelas"
                                            name="is_wali_kelas"
                                            value="1"
                                            className="size-4 rounded border-gray-300"
                                        />
                                        <Label
                                            htmlFor="is_wali_kelas"
                                            className="font-normal"
                                        >
                                            Wali Kelas
                                        </Label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href={guruRoutes.index()}>Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Simpan
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
