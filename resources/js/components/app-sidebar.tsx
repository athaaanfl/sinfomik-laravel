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
import { type NavItem } from '@/types';
import { UserRole } from '@/types/enums';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, BookOpenCheck, Calendar, ClipboardList, Folder, GraduationCap, LayoutGrid, School, Settings, User, UsersRound } from 'lucide-react';
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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
