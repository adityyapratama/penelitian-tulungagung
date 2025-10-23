"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Group } from "@/lib/generated/prisma";
import { EditGroupForm } from "../_components/edit-group-form";

interface EditGroupDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group;
}

export const EditGroupDetailModal = ({ isOpen, onClose, group }: EditGroupDetailModalProps) => {
    if (!isOpen) return null;

    return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px] p-0">
                {/* Tambahkan Header Dialog DI SINI */}
                <DialogHeader className="pt-6 px-6">
                    <DialogTitle>Edit Detail Grup</DialogTitle>
                    <DialogDescription>
                        Ubah nama atau thumbnail untuk grup <span className="font-semibold">{group.group_name}</span>.
                    </DialogDescription>
                </DialogHeader>
                
                <EditGroupForm
                    group={group}
                    onSuccess={onClose} 
                />
            </DialogContent>
        </Dialog>
    );
};