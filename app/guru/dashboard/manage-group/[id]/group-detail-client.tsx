"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Users, BookCopy, UsersRound, Plus, Edit, BarChart3, List, Copy, Check } from "lucide-react";
import { EditGroupDetailModal } from "./edit-group-modal";
import { AssignedContentList } from "./assigned-content-list";
import { AddContentDialog } from "./add-content-dialog";
import { GroupMemberList } from "./group-member-list";
import { GroupMemberPerformanceList } from "./group-member-performance-list";
import { InviteMemberForm } from "./invite-member-form"; 
import type { GroupWithDetails, GroupContentWithDetails, GroupMemberWithDetails, PerformanceData } from "../lib/data";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

dayjs.locale("id");

type AssignedContentItem = GroupContentWithDetails;
type MemberItem = GroupMemberWithDetails; 

interface GroupDetailClientProps {
    group: GroupWithDetails;
    initialAssignedContent: AssignedContentItem[]; 
    initialMembers: MemberItem[]; 
    performanceData: PerformanceData[];
    guruId: number;
}

export default function GroupDetailClient({
    group,
    initialAssignedContent,
    initialMembers,
    performanceData,
    guruId
}: GroupDetailClientProps) {

    const [isAddContentOpen, setIsAddContentOpen] = useState(false);
    const [isEditDetailOpen, setIsEditDetailOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const memberCount = group._count?.GroupMember ?? initialMembers.length;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setInviteLink(`${window.location.origin}/invite/${group.group_id}`);
        }
    }, [group.group_id]);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).style.display = 'none';
    };

    const handleCopy = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink).then(() => {
            toast.success("Link undangan disalin!");
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }).catch(err => {
            console.error("Gagal menyalin link:", err);
            toast.error("Gagal menyalin link.");
        });
    };

    return (
        <div className="space-y-6">
            <Card className="border-border">
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
                    <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center flex-shrink-0 relative">
                           {group.group_thumbnail ? (
                             <Image
                               src={group.group_thumbnail}
                               alt={`Thumbnail ${group.group_name}`}
                               fill
                               className="object-cover"
                               onError={handleError}
                             />
                           ) : (
                              <Users className="w-8 h-8 text-muted-foreground" />
                           )}
                         </div>
                         <div>
                            <CardTitle className="text-2xl font-bold">{group.group_name || 'Grup Tanpa Nama'}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mt-1">
                                {memberCount} Anggota
                                {group.created_at && ` • Dibuat ${dayjs(group.created_at).format('DD MMMM YYYY')}`}
                            </CardDescription>
                         </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditDetailOpen(true)} className="w-full sm:w-auto">
                        <Edit className="w-3 h-3 mr-2"/> Edit Detail
                    </Button>
                </CardHeader>
                
                <CardContent className="pt-4 pb-6 border-t border-border">
                    <Label htmlFor="invite-link" className="text-sm font-medium">
                        Link Undangan Grup
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                        Bagikan link ini agar member bisa bergabung ke grup Anda.
                    </p>
                    <div className="flex w-full max-w-md items-center space-x-2">
                        <Input
                            id="invite-link"
                            value={inviteLink}
                            readOnly
                            className="bg-muted/50"
                            placeholder="Memuat link..."
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                            disabled={!inviteLink || isCopied}
                            aria-label="Salin link undangan"
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content"><BookCopy className="w-4 h-4 mr-2"/>Konten Ditugaskan</TabsTrigger>
                    <TabsTrigger value="members"><UsersRound className="w-4 h-4 mr-2"/>Anggota Grup</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Daftar Konten</CardTitle>
                                <CardDescription>Game yang ditugaskan untuk grup ini.</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setIsAddContentOpen(true)}>
                                <Plus className="w-4 h-4 mr-2"/> Tambah Konten
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <AssignedContentList
                                groupId={group.group_id}
                                assignedContent={initialAssignedContent}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="members" className="mt-4">
                    <Tabs defaultValue="performance" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                             <TabsTrigger value="performance"><BarChart3 className="w-4 h-4 mr-2"/>Performa</TabsTrigger>
                             <TabsTrigger value="list"><List className="w-4 h-4 mr-2"/>Daftar Anggota</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="performance" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performa Anggota</CardTitle>
                                    <CardDescription>Skor dan aktivitas member di grup ini (hanya yang sudah berprogres).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <GroupMemberPerformanceList
                                        performanceData={performanceData}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="list" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Daftar Anggota</CardTitle>
                                    <CardDescription>Kelola semua member yang ada di grup ini.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <GroupMemberList
                                        groupId={group.group_id}
                                        members={initialMembers}
                                    />
                                </CardContent>
                                <CardFooter className="border-t border-border pt-6">
                                    <InviteMemberForm 
                                        groupId={group.group_id}
                                        groupName={group.group_name || 'Grup Anda'}
                                    />
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>

             <AddContentDialog
                isOpen={isAddContentOpen}
                onClose={() => setIsAddContentOpen(false)}
                groupId={group.group_id}
                guruId={guruId}
             />
             
             {isEditDetailOpen && (
                 <EditGroupDetailModal
                     isOpen={isEditDetailOpen}
                     onClose={() => setIsEditDetailOpen(false)}
                     group={group}
                 />
             )}
        </div>
    );
}
