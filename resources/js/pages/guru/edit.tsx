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
import { Guru, BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    guru: Guru;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Guru',
        href: guruRoutes.index().url,
    },
    {
        title: 'Edit Guru',
        href: '#',
    },
];

export default function Edit({ guru }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Guru" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Edit Guru
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui data guru
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Kembali
                    </Button>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <Form
                        action={guruRoutes.update(guru.id)}
                        method="put"
                        className="space-y-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input
                                            id="nip"
                                            name="nip"
                                            type="text"
                                            defaultValue={guru.nip || ''}
                                            required
                                        />
                                        <InputError message={errors.nip} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">
                                            Jenis Kelamin
                                        </Label>
                                        <Select
                                            name="gender"
                                            defaultValue={guru.gender || ''}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
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
                                            defaultValue={guru.tanggal_lahir || ''}
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
                                            defaultValue={guru.nomor_telepon || ''}
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
                                            defaultValue={guru.kualifikasi || ''}
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
                                            defaultValue={guru.alamat || ''}
                                        />
                                        <InputError message={errors.alamat} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_wali_kelas"
                                            name="is_wali_kelas"
                                            value="1"
                                            defaultChecked={!!guru.is_wali_kelas}
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
