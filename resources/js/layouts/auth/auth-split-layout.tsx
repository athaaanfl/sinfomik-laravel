import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-sky-300 to-pink-300 p-10 text-white lg:flex dark:border-r">
                {/* Gradasi background dan logo di tengah */}
                <div className="flex flex-col items-center justify-center -mt-16">
                    <img src="/binekas-transparent.png" alt="Logo" className="mb-6 w-50 h-50 drop-shadow-xl" />
                    <h2 className="text-3xl font-bold mb-2 text-center drop-shadow-lg">Sinfomik</h2>
                </div>
                {/* Tidak ada quote */}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <img src="/logo-binekas.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
