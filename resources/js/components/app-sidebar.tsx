import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import siswaRoutes from '@/routes/siswa';
import guruRoutes from '@/routes/guru';
import tahunAjaranRoutes from '@/routes/tahun-ajaran';
import mataPelajaranRoutes from '@/routes/mata-pelajaran';
import kelasRoutes from '@/routes/kelas';
import penugasanMengajarRoutes from '@/routes/penugasan-mengajar';
import kelulusanSiswaRoutes from '@/routes/kelulusan-siswa';
import naikKelasRoutes from '@/routes/naik-kelas';
import { type NavItem, type NavGroup } from '@/types';
import { UserRole } from '@/types/enums';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, BookOpenCheck, Calendar, ClipboardList, Folder, GraduationCap, LayoutGrid, School, Settings, User, UsersRound, ArrowUpCircle } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    // (hapus menu Repository dan Documentation)
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const userRole = auth.user?.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const navGroups: NavGroup[] = [];

    // Add admin-only menu items
    if (userRole === UserRole.ADMIN) {
        mainNavItems.push(
            {
                title: 'Data Siswa',
                href: siswaRoutes.index(),
                icon: GraduationCap,
            },
            {
                title: 'Data Guru',
                href: guruRoutes.index(),
                icon: UsersRound,
            },
            {
                title: 'Data Kelas',
                href: kelasRoutes.index().url,
                icon: School,
            },
            {
                title: 'Tahun Ajaran',
                href: tahunAjaranRoutes.index(),
                icon: Calendar,
            },
            {
                title: 'Mata Pelajaran',
                href: mataPelajaranRoutes.index(),
                icon: BookOpenCheck,
            },
            {
                title: 'Penugasan Mengajar',
                href: penugasanMengajarRoutes.index(),
                icon: ClipboardList,
            }
        );

        // Add Manajemen Akademik group
        navGroups.push({
            title: 'Manajemen Akademik',
            items: [
                {
                    title: 'Kelulusan Siswa',
                    href: kelulusanSiswaRoutes.index(),
                    icon: GraduationCap,
                },
                {
                    title: 'Naik Kelas Massal',
                    href: naikKelasRoutes.index(),
                    icon: ArrowUpCircle,
                },
            ],
        });
    }

    // Add guru-only menu items
    if (userRole === UserRole.GURU) {
        mainNavItems.push(
            {
                title: 'Kelas Saya',
                href: guruRoutes.kelas.index.url(),
                icon: School,
            },
            {
                title: 'Kurikulum',
                href: guruRoutes.kurikulum.index.url(),
                icon: BookOpen,
            },
            {
                title: 'Penilaian',
                href: guruRoutes.nilai.list.url(),
                icon: ClipboardList,
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {navGroups.map((group) => (
                    <NavMain key={group.title} items={group.items} groupLabel={group.title} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
