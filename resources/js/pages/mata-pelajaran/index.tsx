import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import mataPelajaranRoutes from '@/routes/mata-pelajaran';
import { Head, router, useForm } from '@inertiajs/react';
import { BookOpen, Edit, Plus, Trash2, ChevronRight, Target, Layers, GraduationCap, MoreVertical } from 'lucide-react';
import React from 'react';
import type { MataPelajaran, CpFase, ElemenPembelajaran, CpElemen, TujuanPembelajaran } from '@/types';
import { cn } from '@/lib/utils';

interface IndexProps {
    mataPelajarans: MataPelajaran[];
    semesters: Array<{ id: number; tahun_ajaran_id: number; tipe: string; tahun_ajaran?: { kode_tahun_ajaran: string } }>;
}

export default function Index({ mataPelajarans, semesters }: IndexProps) {
    // Selection state untuk Miller Columns
    const [selectedMapel, setSelectedMapel] = React.useState<MataPelajaran | null>(null);
    const [selectedFase, setSelectedFase] = React.useState<CpFase | null>(null);
    const [selectedElemen, setSelectedElemen] = React.useState<ElemenPembelajaran | null>(null);
    const [selectedCpElemen, setSelectedCpElemen] = React.useState<CpElemen | null>(null);

    // Dialog states
    const [showMapelDialog, setShowMapelDialog] = React.useState(false);
    const [showFaseDialog, setShowFaseDialog] = React.useState(false);
    const [showElemenDialog, setShowElemenDialog] = React.useState(false);
    const [showCpElemenDialog, setShowCpElemenDialog] = React.useState(false);
    const [showTpDialog, setShowTpDialog] = React.useState(false);
    const [showTpViewDialog, setShowTpViewDialog] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [deleteTarget, setDeleteTarget] = React.useState<{ type: string; id: number; name: string } | null>(null);
    const [selectedTpView, setSelectedTpView] = React.useState<TujuanPembelajaran | null>(null);

    // Forms
    const mapelForm = useForm({ name: '', id: null as number | null });
    const faseForm = useForm({ 
        mata_pelajaran_id: null as number | null, 
        fase: '', 
        deskripsi: '',
        id: null as number | null
    });
    const elemenForm = useForm({ 
        cp_fase_id: null as number | null, 
        nama: '', 
        urutan: 1,
        id: null as number | null
    });
    const cpElemenForm = useForm({ 
        elemen_pembelajaran_id: null as number | null, 
        deskripsi: '',
        id: null as number | null
    });
    const tpForm = useForm({ 
        cp_elemen_id: null as number | null, 
        deskripsi: '', 
        urutan: 1,
        pemetaans: [] as Array<{ tingkat: number; semester_id: number }>,
        id: null as number | null
    });

    const breadcrumbs = [
        { title: 'Mata Pelajaran' }
    ];

    const handleSelectMapel = (mapel: MataPelajaran) => {
        console.log('Selected Mapel:', mapel);
        setSelectedMapel(mapel);
        setSelectedFase(null);
        setSelectedElemen(null);
        setSelectedCpElemen(null);
    };

    const handleSelectFase = (fase: CpFase) => {
        console.log('Selected Fase:', fase);
        setSelectedFase(fase);
        setSelectedElemen(null);
        setSelectedCpElemen(null);
    };

    const handleSelectElemen = (elemen: ElemenPembelajaran) => {
        setSelectedElemen(elemen);
        setSelectedCpElemen(null);
    };

    const handleSelectCpElemen = (cpElemen: CpElemen) => {
        setSelectedCpElemen(cpElemen);
    };

    // CRUD Handlers
    const handleAddFase = () => {
        if (!selectedMapel) return;
        faseForm.reset();
        faseForm.setData({ 
            mata_pelajaran_id: selectedMapel.id, 
            fase: '', 
            deskripsi: '',
            id: null
        });
        setShowFaseDialog(true);
    };

    const handleAddElemen = () => {
        if (!selectedFase) return;
        elemenForm.reset();
        elemenForm.setData({ 
            cp_fase_id: selectedFase.id, 
            nama: '', 
            urutan: (selectedFase.elemen_pembelajarans?.length || 0) + 1,
            id: null
        });
        setShowElemenDialog(true);
    };

    const handleAddCpElemen = () => {
        if (!selectedElemen) return;
        cpElemenForm.reset();
        cpElemenForm.setData({ 
            elemen_pembelajaran_id: selectedElemen.id, 
            deskripsi: '',
            id: null
        });
        setShowCpElemenDialog(true);
    };

    const handleEditCpElemen = () => {
        if (!selectedElemen?.cp_elemen) return;
        
        cpElemenForm.setData({
            elemen_pembelajaran_id: selectedElemen.id,
            deskripsi: selectedElemen.cp_elemen.deskripsi,
            id: selectedElemen.cp_elemen.id
        });
        setShowCpElemenDialog(true);
    };

    const handleAddTp = () => {
        if (!selectedElemen?.cp_elemen) return;
        
        tpForm.reset();
        tpForm.setData({ 
            cp_elemen_id: selectedElemen.cp_elemen.id, 
            deskripsi: '', 
            urutan: (selectedElemen.cp_elemen.tujuan_pembelajarans?.length || 0) + 1,
            pemetaans: [],
            id: null
        });
        setShowTpDialog(true);
    };

    // Edit handlers
    const handleEditMapel = (mapel: MataPelajaran) => {
        mapelForm.setData({ name: mapel.name, id: mapel.id });
        setShowMapelDialog(true);
    };

    const handleEditFase = (fase: CpFase) => {
        faseForm.setData({
            mata_pelajaran_id: fase.mata_pelajaran_id,
            fase: fase.fase,
            deskripsi: fase.deskripsi,
            id: fase.id
        });
        setShowFaseDialog(true);
    };

    const handleEditElemen = (elemen: ElemenPembelajaran) => {
        elemenForm.setData({
            cp_fase_id: elemen.cp_fase_id,
            nama: elemen.nama,
            urutan: elemen.urutan,
            id: elemen.id
        });
        setShowElemenDialog(true);
    };

    const handleEditTp = (tp: TujuanPembelajaran) => {
        const pemetaans = tp.tp_pemetaans?.map(pm => ({
            tingkat: pm.tingkat,
            semester_id: pm.semester_id,
            id: pm.id
        })) || [];
        
        tpForm.setData({
            cp_elemen_id: tp.cp_elemen_id,
            deskripsi: tp.deskripsi,
            urutan: tp.urutan,
            pemetaans: pemetaans,
            id: tp.id
        });
        setShowTpDialog(true);
    };

    // Delete handlers
    const handleDelete = (type: string, id: number, name: string) => {
        setDeleteTarget({ type, id, name });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        let deleteUrl: string;
        
        switch(deleteTarget.type) {
            case 'mapel':
                deleteUrl = `/mata-pelajaran/${deleteTarget.id}`;
                break;
            case 'fase':
                deleteUrl = `/mata-pelajaran/cp-fase/${deleteTarget.id}`;
                break;
            case 'elemen':
                deleteUrl = `/mata-pelajaran/elemen/${deleteTarget.id}`;
                break;
            case 'cpElemen':
                deleteUrl = `/mata-pelajaran/cp-elemen/${deleteTarget.id}`;
                break;
            case 'tp':
                deleteUrl = `/mata-pelajaran/tp/${deleteTarget.id}`;
                break;
            default:
                return;
        }

        router.delete(deleteUrl, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteTarget(null);
                router.reload();
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mata Pelajaran">
                <style>{`
                    @media (max-width: 768px) {
                        .snap-x {
                            scroll-snap-type: x mandatory;
                            -webkit-overflow-scrolling: touch;
                        }
                        .snap-start {
                            scroll-snap-align: start;
                        }
                    }
                `}</style>
            </Head>
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mata Pelajaran</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola struktur mata pelajaran: Mata Pelajaran, CP Fase, Elemen, CP Elemen, TP
                        </p>
                    </div>
                    <Button onClick={() => setShowMapelDialog(true)}>
                        <Plus className="mr-2 size-4" />
                        Tambah Mata Pelajaran
                    </Button>
                </div>

                {/* Miller Columns Layout */}
                <Card className="flex-1 overflow-hidden shadow-sm">
                    <CardContent className="p-0 h-full">
                        <TooltipProvider delayDuration={300}>
                            <div className="flex h-full divide-x divide-border/50 overflow-x-auto snap-x snap-mandatory md:overflow-x-hidden">
                            {/* Column 1: Mata Pelajaran */}
                            <div className="w-full md:w-64 flex-shrink-0 bg-muted/20 snap-start">
                                <div className="h-[57px] px-4 border-b bg-background/80 backdrop-blur-sm flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-primary/10">
                                            <BookOpen className="size-4 text-primary" />
                                        </div>
                                        <span className="font-semibold text-sm">Mata Pelajaran</span>
                                    </div>
                                </div>
                                <ScrollArea className="h-[calc(100%-57px)]">
                                    {mataPelajarans.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <BookOpen className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                                            <p className="text-sm text-muted-foreground">Belum ada mata pelajaran</p>
                                        </div>
                                    ) : (
                                        <div className="p-2">
                                            {mataPelajarans.map((mapel) => (
                                                <ContextMenu key={mapel.id}>
                                                    <ContextMenuTrigger asChild>
                                                        <div
                                                            className={cn(
                                                                "relative rounded-lg hover:bg-accent/50 transition-all duration-200 group",
                                                                selectedMapel?.id === mapel.id && "bg-primary/10 hover:bg-primary/15 border border-primary/20"
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() => handleSelectMapel(mapel)}
                                                                className="w-full text-left p-3 flex items-center justify-between"
                                                            >
                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                    <div className={cn(
                                                                        "p-1.5 rounded-md transition-colors",
                                                                        selectedMapel?.id === mapel.id ? "bg-primary/20" : "bg-muted"
                                                                    )}>
                                                                        <BookOpen className={cn(
                                                                            "size-3.5 flex-shrink-0",
                                                                            selectedMapel?.id === mapel.id && "text-primary"
                                                                        )} />
                                                                    </div>
                                                                    <span className="font-medium text-sm truncate">{mapel.name}</span>
                                                                </div>
                                                                <ChevronRight className={cn(
                                                                    "size-4 flex-shrink-0 transition-all duration-200",
                                                                    selectedMapel?.id === mapel.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                                                )} />
                                                            </button>
                                                        </div>
                                                    </ContextMenuTrigger>
                                                    <ContextMenuContent>
                                                        <ContextMenuItem onClick={() => handleEditMapel(mapel)}>
                                                            <Edit className="size-3.5 mr-2" />
                                                            Edit
                                                        </ContextMenuItem>
                                                        <ContextMenuSeparator />
                                                        <ContextMenuItem 
                                                            onClick={() => handleDelete('mapel', mapel.id, mapel.name)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="size-3.5 mr-2" />
                                                            Hapus
                                                        </ContextMenuItem>
                                                    </ContextMenuContent>
                                                </ContextMenu>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Column 2: CP Fase */}
                            {selectedMapel && (
                                <div className="w-full md:w-80 flex-shrink-0 bg-muted/10 snap-start">
                                    <div className="h-[57px] px-4 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-blue-500/10">
                                                <GraduationCap className="size-4 text-blue-600" />
                                            </div>
                                            <span className="font-semibold text-sm">CP Fase</span>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-500/10" onClick={handleAddFase}>
                                            <Plus className="size-4" />
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[calc(100%-57px)]">
                                        {!selectedMapel.cp_fases || selectedMapel.cp_fases.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <GraduationCap className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <p className="text-sm text-muted-foreground">Belum ada CP Fase</p>
                                                <p className="text-xs text-muted-foreground mt-1">Klik tombol + untuk menambah</p>
                                            </div>
                                        ) : (
                                            <div className="p-2 space-y-2">
                                                {selectedMapel.cp_fases.map((fase) => (
                                                    <ContextMenu key={fase.id}>
                                                        <ContextMenuTrigger asChild>
                                                            <div
                                                                className={cn(
                                                                    "relative rounded-lg hover:bg-accent/50 transition-all duration-200 group border",
                                                                    selectedFase?.id === fase.id 
                                                                        ? "bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800" 
                                                                        : "bg-card border-transparent hover:border-border"
                                                                )}
                                                            >
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            onClick={() => handleSelectFase(fase)}
                                                                            className="w-full text-left p-3"
                                                                        >
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <Badge 
                                                                                    variant={selectedFase?.id === fase.id ? "default" : "outline"}
                                                                                    className={cn(
                                                                                        "font-semibold",
                                                                                        selectedFase?.id === fase.id && "bg-blue-600"
                                                                                    )}
                                                                                >
                                                                                    Fase {fase.fase}
                                                                                </Badge>
                                                                                <ChevronRight className={cn(
                                                                                    "size-4 flex-shrink-0 transition-all duration-200",
                                                                                    selectedFase?.id === fase.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                                                )} />
                                                                            </div>
                                                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                                                {fase.deskripsi}
                                                                            </p>
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="right" className="max-w-sm">
                                                                        <p className="text-xs">{fase.deskripsi}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </ContextMenuTrigger>
                                                        <ContextMenuContent>
                                                            <ContextMenuItem onClick={() => handleEditFase(fase)}>
                                                                <Edit className="size-3.5 mr-2" />
                                                                Edit
                                                            </ContextMenuItem>
                                                            <ContextMenuSeparator />
                                                            <ContextMenuItem 
                                                                onClick={() => handleDelete('fase', fase.id, `Fase ${fase.fase}`)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="size-3.5 mr-2" />
                                                                Hapus
                                                            </ContextMenuItem>
                                                        </ContextMenuContent>
                                                    </ContextMenu>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            )}

                            {/* Column 3: Elemen */}
                            {selectedFase && (
                                <div className="w-full md:w-64 flex-shrink-0 bg-muted/10 snap-start">
                                    <div className="h-[57px] px-4 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-purple-500/10">
                                                <Layers className="size-4 text-purple-600" />
                                            </div>
                                            <span className="font-semibold text-sm">Elemen</span>
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-500/10" onClick={handleAddElemen}>
                                            <Plus className="size-4" />
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[calc(100%-57px)]">
                                        {!selectedFase.elemen_pembelajarans || selectedFase.elemen_pembelajarans.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Layers className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <p className="text-sm text-muted-foreground">Belum ada Elemen</p>
                                                <p className="text-xs text-muted-foreground mt-1">Klik tombol + untuk menambah</p>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                {selectedFase.elemen_pembelajarans.map((elemen) => (
                                                    <ContextMenu key={elemen.id}>
                                                        <ContextMenuTrigger asChild>
                                                            <div
                                                                className={cn(
                                                                    "relative rounded-lg hover:bg-accent/50 transition-all duration-200 group",
                                                                    selectedElemen?.id === elemen.id && "bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20"
                                                                )}
                                                            >
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            onClick={() => handleSelectElemen(elemen)}
                                                                            className="w-full text-left p-3 flex items-center justify-between"
                                                                        >
                                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                                <div className={cn(
                                                                                    "p-1.5 rounded-md transition-colors",
                                                                                    selectedElemen?.id === elemen.id ? "bg-purple-500/20" : "bg-muted"
                                                                                )}>
                                                                                    <Layers className={cn(
                                                                                        "size-3.5 flex-shrink-0",
                                                                                        selectedElemen?.id === elemen.id && "text-purple-600"
                                                                                    )} />
                                                                                </div>
                                                                                <span className="text-sm font-medium truncate">{elemen.nama}</span>
                                                                            </div>
                                                                            <ChevronRight className={cn(
                                                                                "size-4 flex-shrink-0 transition-all duration-200",
                                                                                selectedElemen?.id === elemen.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                                            )} />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="right">
                                                                        <p className="text-xs">{elemen.nama}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </ContextMenuTrigger>
                                                        <ContextMenuContent>
                                                            <ContextMenuItem onClick={() => handleEditElemen(elemen)}>
                                                                <Edit className="size-3.5 mr-2" />
                                                                Edit
                                                            </ContextMenuItem>
                                                            <ContextMenuSeparator />
                                                            <ContextMenuItem 
                                                                onClick={() => handleDelete('elemen', elemen.id, elemen.nama)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="size-3.5 mr-2" />
                                                                Hapus
                                                            </ContextMenuItem>
                                                        </ContextMenuContent>
                                                    </ContextMenu>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            )}

                            {/* Column 4: CP Elemen & TP List */}
                            {selectedElemen && (
                                <div className="flex-1 min-w-0 bg-background snap-start w-full">
                                    <div className="h-[57px] px-4 border-b bg-background/80 backdrop-blur-sm flex items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-orange-500/10">
                                                <Target className="size-4 text-orange-600" />
                                            </div>
                                            <span className="font-semibold text-sm">CP Elemen & Tujuan Pembelajaran</span>
                                        </div>
                                    </div>
                                    <ScrollArea className="h-[calc(100%-57px)]">
                                        <div className="p-4 space-y-6">
                                            {/* CP Elemen Section */}
                                            {selectedElemen.cp_elemen ? (
                                                <ContextMenu>
                                                    <ContextMenuTrigger asChild>
                                                        <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-50/20 dark:from-blue-950/30 dark:to-blue-950/10 shadow-sm">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                                                    <div className="p-1 rounded bg-blue-500/20">
                                                                        <GraduationCap className="size-3.5 text-blue-600" />
                                                                    </div>
                                                                    Capaian Pembelajaran Elemen
                                                                </h3>
                                                            </div>
                                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                                {selectedElemen.cp_elemen.deskripsi}
                                                            </p>
                                                        </div>
                                                    </ContextMenuTrigger>
                                                    <ContextMenuContent>
                                                        <ContextMenuItem onClick={handleEditCpElemen}>
                                                            <Edit className="size-3.5 mr-2" />
                                                            Edit
                                                        </ContextMenuItem>
                                                        <ContextMenuSeparator />
                                                        <ContextMenuItem 
                                                            onClick={() => handleDelete('cpElemen', selectedElemen.cp_elemen!.id, 'CP Elemen')}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="size-3.5 mr-2" />
                                                            Hapus
                                                        </ContextMenuItem>
                                                    </ContextMenuContent>
                                                </ContextMenu>
                                            ) : (
                                                <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-50/20 dark:from-blue-950/30 dark:to-blue-950/10 shadow-sm">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-semibold text-sm flex items-center gap-2">
                                                            <div className="p-1 rounded bg-blue-500/20">
                                                                <GraduationCap className="size-3.5 text-blue-600" />
                                                            </div>
                                                            Capaian Pembelajaran Elemen
                                                        </h3>
                                                        <Button size="sm" variant="outline" className="h-7" onClick={handleAddCpElemen}>
                                                            <Plus className="size-3 mr-1" />
                                                            Tambah CP
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground italic text-center py-2">
                                                        Belum ada capaian pembelajaran untuk elemen ini
                                                    </p>
                                                </div>
                                            )}

                                            {/* Tujuan Pembelajaran List */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                                        <div className="p-1 rounded bg-orange-500/20">
                                                            <Target className="size-3.5 text-orange-600" />
                                                        </div>
                                                        Tujuan Pembelajaran
                                                    </h3>
                                                    <Button size="sm" variant="outline" className="h-7" onClick={handleAddTp}>
                                                        <Plus className="size-3 mr-1" />
                                                        Tambah TP
                                                    </Button>
                                                </div>
                                                
                                                {!selectedElemen.cp_elemen || !selectedElemen.cp_elemen.tujuan_pembelajarans?.length ? (
                                                    <div className="text-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
                                                        <Target className="size-10 mx-auto mb-3 text-muted-foreground/50" />
                                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                                            Belum ada Tujuan Pembelajaran
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Klik tombol "Tambah TP" untuk menambah
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {selectedElemen.cp_elemen?.tujuan_pembelajarans?.map((tp) => (
                                                            <ContextMenu key={tp.id}>
                                                                <ContextMenuTrigger asChild>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div
                                                                                onClick={() => {
                                                                                    setSelectedTpView(tp);
                                                                                    setShowTpViewDialog(true);
                                                                                }}
                                                                                className="border rounded-lg p-4 bg-card hover:shadow-md hover:border-orange-200 transition-all duration-200 group cursor-pointer"
                                                                            >
                                                                                <div className="flex items-start gap-3">
                                                                                    <Badge variant="secondary" className="text-xs mt-0.5 bg-orange-100 text-orange-700 border-orange-200 flex-shrink-0">
                                                                                        {tp.kode || `TP-${tp.id}`}
                                                                                    </Badge>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm mb-3 leading-relaxed text-foreground/90 line-clamp-3">{tp.deskripsi}</p>
                                                                                        {tp.tp_pemetaans && tp.tp_pemetaans.length > 0 && (
                                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                                {tp.tp_pemetaans.map((pemetaan) => (
                                                                                                    <Badge 
                                                                                                        key={pemetaan.id} 
                                                                                                        variant="outline" 
                                                                                                        className="text-xs bg-muted/50 font-normal"
                                                                                                    >
                                                                                                        Kelas {pemetaan.tingkat} • {pemetaan.semester?.tipe}
                                                                                                    </Badge>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="left" className="max-w-md">
                                                                            <p className="text-xs">Klik untuk lihat detail lengkap</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </ContextMenuTrigger>
                                                                <ContextMenuContent>
                                                                    <ContextMenuItem onClick={() => handleEditTp(tp)}>
                                                                        <Edit className="size-3.5 mr-2" />
                                                                        Edit
                                                                    </ContextMenuItem>
                                                                    <ContextMenuSeparator />
                                                                    <ContextMenuItem 
                                                                        onClick={() => handleDelete('tp', tp.id, tp.kode || `TP-${tp.id}`)}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <Trash2 className="size-3.5 mr-2" />
                                                                        Hapus
                                                                    </ContextMenuItem>
                                                                </ContextMenuContent>
                                                            </ContextMenu>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>

                {/* Mata Pelajaran Dialog */}
                <Dialog open={showMapelDialog} onOpenChange={setShowMapelDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
                            <DialogDescription>
                                Tambahkan mata pelajaran baru untuk 
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (mapelForm.data.id) {
                                mapelForm.put(`/mata-pelajaran/${mapelForm.data.id}`, {
                                    onSuccess: () => {
                                        setShowMapelDialog(false);
                                        mapelForm.reset();
                                        router.reload();
                                    },
                                });
                            } else {
                                mapelForm.post(mataPelajaranRoutes.index().url, {
                                    onSuccess: () => {
                                        setShowMapelDialog(false);
                                        mapelForm.reset();
                                        router.reload();
                                    },
                                });
                            }
                        }}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Mata Pelajaran</Label>
                                    <Input
                                        id="name"
                                        value={mapelForm.data.name}
                                        onChange={(e) => mapelForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Matematika"
                                        required
                                    />
                                    {mapelForm.errors.name && (
                                        <p className="text-sm text-destructive">{mapelForm.errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowMapelDialog(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={mapelForm.processing}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* CP Fase Dialog */}
                <Dialog open={showFaseDialog} onOpenChange={setShowFaseDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{faseForm.data.id ? 'Edit' : 'Tambah'} CP Fase</DialogTitle>
                            <DialogDescription>
                                Capaian Pembelajaran per Fase untuk {selectedMapel?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const url = faseForm.data.id 
                                ? `/mata-pelajaran/cp-fase/${faseForm.data.id}`
                                : '/mata-pelajaran/cp-fase';
                            
                            if (faseForm.data.id) {
                                faseForm.put(url, {
                                    onSuccess: () => {
                                        setShowFaseDialog(false);
                                        faseForm.reset();
                                        router.reload();
                                    },
                                });
                            } else {
                                faseForm.post(url, {
                                    onSuccess: () => {
                                        setShowFaseDialog(false);
                                        faseForm.reset();
                                        router.reload();
                                    },
                                });
                            }
                        }}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fase">Fase</Label>
                                    <Select
                                        value={faseForm.data.fase}
                                        onValueChange={(value) => faseForm.setData('fase', value)}
                                    >
                                        <SelectTrigger id="fase">
                                            <SelectValue placeholder="Pilih Fase" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Fase A (Kelas 1-2)</SelectItem>
                                            <SelectItem value="B">Fase B (Kelas 3-4)</SelectItem>
                                            <SelectItem value="C">Fase C (Kelas 5-6)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {faseForm.errors.fase && (
                                        <p className="text-sm text-destructive">{faseForm.errors.fase}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi_fase">Deskripsi Capaian</Label>
                                    <Textarea
                                        id="deskripsi_fase"
                                        value={faseForm.data.deskripsi}
                                        onChange={(e) => faseForm.setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi capaian pembelajaran untuk fase ini..."
                                        rows={10}
                                        required
                                        className="resize-y min-h-[120px]"
                                    />
                                    {faseForm.errors.deskripsi && (
                                        <p className="text-sm text-destructive">{faseForm.errors.deskripsi}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowFaseDialog(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={faseForm.processing}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Elemen Dialog */}
                <Dialog open={showElemenDialog} onOpenChange={setShowElemenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{elemenForm.data.id ? 'Edit' : 'Tambah'} Elemen Pembelajaran</DialogTitle>
                            <DialogDescription>
                                Elemen untuk CP Fase {selectedFase?.fase}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const url = elemenForm.data.id 
                                ? `/mata-pelajaran/elemen/${elemenForm.data.id}`
                                : '/mata-pelajaran/elemen';
                            
                            if (elemenForm.data.id) {
                                elemenForm.put(url, {
                                    onSuccess: () => {
                                        setShowElemenDialog(false);
                                        elemenForm.reset();
                                        router.reload();
                                    },
                                });
                            } else {
                                elemenForm.post(url, {
                                    onSuccess: () => {
                                        setShowElemenDialog(false);
                                        elemenForm.reset();
                                        router.reload();
                                    },
                                });
                            }
                        }}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_elemen">Nama Elemen</Label>
                                    <Input
                                        id="nama_elemen"
                                        value={elemenForm.data.nama}
                                        onChange={(e) => elemenForm.setData('nama', e.target.value)}
                                        placeholder="Contoh: Bilangan, Geometri, dll"
                                        required
                                    />
                                    {elemenForm.errors.nama && (
                                        <p className="text-sm text-destructive">{elemenForm.errors.nama}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowElemenDialog(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={elemenForm.processing}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* CP Elemen Dialog */}
                <Dialog open={showCpElemenDialog} onOpenChange={setShowCpElemenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{cpElemenForm.data.id ? 'Edit' : 'Tambah'} CP Elemen</DialogTitle>
                            <DialogDescription>
                                Capaian Pembelajaran untuk elemen {selectedElemen?.nama}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const url = cpElemenForm.data.id 
                                ? `/mata-pelajaran/cp-elemen/${cpElemenForm.data.id}`
                                : '/mata-pelajaran/cp-elemen';
                            
                            if (cpElemenForm.data.id) {
                                cpElemenForm.put(url, {
                                    onSuccess: () => {
                                        setShowCpElemenDialog(false);
                                        cpElemenForm.reset();
                                        router.reload();
                                    },
                                });
                            } else {
                                cpElemenForm.post(url, {
                                    onSuccess: () => {
                                        setShowCpElemenDialog(false);
                                        cpElemenForm.reset();
                                        router.reload();
                                    },
                                });
                            }
                        }}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi_cp_elemen">Deskripsi Capaian</Label>
                                    <Textarea
                                        id="deskripsi_cp_elemen"
                                        value={cpElemenForm.data.deskripsi}
                                        onChange={(e) => cpElemenForm.setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi capaian pembelajaran untuk elemen ini..."
                                        rows={10}
                                        required
                                        className="resize-y min-h-[120px]"
                                    />
                                    {cpElemenForm.errors.deskripsi && (
                                        <p className="text-sm text-destructive">{cpElemenForm.errors.deskripsi}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCpElemenDialog(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={cpElemenForm.processing}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* TP Dialog */}
                <Dialog open={showTpDialog} onOpenChange={setShowTpDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{tpForm.data.id ? 'Edit' : 'Tambah'} Tujuan Pembelajaran</DialogTitle>
                            <DialogDescription>
                                Kode TP otomatis: MAPEL-TINGKAT-URUTAN. Tambahkan pemetaan untuk generate kode.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const url = tpForm.data.id 
                                ? `/mata-pelajaran/tp/${tpForm.data.id}`
                                : '/mata-pelajaran/tp';
                            
                            if (tpForm.data.id) {
                                tpForm.put(url, {
                                    onSuccess: () => {
                                        setShowTpDialog(false);
                                        tpForm.reset();
                                        router.reload();
                                    },
                                });
                            } else {
                                tpForm.post(url, {
                                    onSuccess: () => {
                                        setShowTpDialog(false);
                                        tpForm.reset();
                                        router.reload();
                                    },
                                });
                            }
                        }}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi_tp">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi_tp"
                                        value={tpForm.data.deskripsi}
                                        onChange={(e) => tpForm.setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi tujuan pembelajaran..."
                                        rows={8}
                                        required
                                        className="resize-y min-h-[100px]"
                                    />
                                    {tpForm.errors.deskripsi && (
                                        <p className="text-sm text-destructive">{tpForm.errors.deskripsi}</p>
                                    )}
                                </div>
                                
                                {/* Pemetaan Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Pemetaan (Tingkat & Semester)</Label>
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => {
                                                tpForm.setData('pemetaans', [
                                                    ...tpForm.data.pemetaans,
                                                    { tingkat: 1, semester_id: semesters?.[0]?.id || 0 }
                                                ]);
                                            }}
                                        >
                                            <Plus className="size-3 mr-1" />
                                            Tambah Pemetaan
                                        </Button>
                                    </div>
                                    
                                    {tpForm.data.pemetaans.length === 0 ? (
                                        <div className="text-center p-4 border-2 border-dashed rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                Belum ada pemetaan. Klik "Tambah Pemetaan" untuk menambah.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {tpForm.data.pemetaans.map((pemetaan, index) => (
                                                <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/50">
                                                    <div className="flex-1 space-y-2">
                                                        <div>
                                                            <Label className="text-xs">Tingkat</Label>
                                                            <Select
                                                                value={pemetaan.tingkat.toString()}
                                                                onValueChange={(value) => {
                                                                    const newPemetaans = [...tpForm.data.pemetaans];
                                                                    newPemetaans[index].tingkat = parseInt(value);
                                                                    tpForm.setData('pemetaans', newPemetaans);
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[1, 2, 3, 4, 5, 6].map((tingkat) => (
                                                                        <SelectItem key={tingkat} value={tingkat.toString()}>
                                                                            Kelas {tingkat}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs">Semester</Label>
                                                            <Select
                                                                value={pemetaan.semester_id.toString()}
                                                                onValueChange={(value) => {
                                                                    const newPemetaans = [...tpForm.data.pemetaans];
                                                                    newPemetaans[index].semester_id = parseInt(value);
                                                                    tpForm.setData('pemetaans', newPemetaans);
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {semesters?.map((semester) => (
                                                                        <SelectItem key={semester.id} value={semester.id.toString()}>
                                                                            {semester.tahun_ajaran?.kode_tahun_ajaran} - {semester.tipe}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-destructive"
                                                        onClick={() => {
                                                            const newPemetaans = tpForm.data.pemetaans.filter((_, i) => i !== index);
                                                            tpForm.setData('pemetaans', newPemetaans);
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {tpForm.errors.pemetaans && (
                                        <p className="text-sm text-destructive">{tpForm.errors.pemetaans}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowTpDialog(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={tpForm.processing || tpForm.data.pemetaans.length === 0}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* TP View Dialog */}
                <Dialog open={showTpViewDialog} onOpenChange={setShowTpViewDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                                    {selectedTpView?.kode || `TP-${selectedTpView?.id}`}
                                </Badge>
                                <span>Detail Tujuan Pembelajaran</span>
                            </DialogTitle>
                            <DialogDescription>
                                Informasi lengkap tujuan pembelajaran
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Deskripsi</Label>
                                <div className="p-4 bg-muted/50 rounded-lg border">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedTpView?.deskripsi}</p>
                                </div>
                            </div>
                            
                            {selectedTpView?.tp_pemetaans && selectedTpView.tp_pemetaans.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Pemetaan Kelas & Semester</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedTpView.tp_pemetaans.map((pemetaan) => (
                                            <div key={pemetaan.id} className="p-3 border rounded-lg bg-card">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded bg-orange-100">
                                                        <GraduationCap className="size-3.5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Kelas {pemetaan.tingkat}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {pemetaan.semester?.tahun_ajaran?.kode_tahun_ajaran} • {pemetaan.semester?.tipe}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowTpViewDialog(false)}
                            >
                                Tutup
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    if (selectedTpView) {
                                        handleEditTp(selectedTpView);
                                        setShowTpViewDialog(false);
                                    }
                                }}
                            >
                                <Edit className="size-4 mr-2" />
                                Edit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus <span className="font-semibold">{deleteTarget?.name}</span>?
                                <br />
                                <span className="text-destructive">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.</span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteTarget(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button 
                                type="button" 
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                <Trash2 className="size-4 mr-2" />
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
