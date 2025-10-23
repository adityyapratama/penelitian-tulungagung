"use client";

import React, { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { InviteByEmail, SimpleActionResult } from "../../../lib/actions"; 
import { toast } from "sonner";

interface InviteMemberFormProps {
    groupId: string;
    groupName: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="sm">
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengirim...
                </>
            ) : (
                <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Undangan
                </>
            )}
        </Button>
    );
}

export function InviteMemberForm({ groupId, groupName }: InviteMemberFormProps) {
    const [state, formAction] = useActionState<SimpleActionResult, FormData>(
        InviteByEmail,
        null
    );
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.error) {
            toast.error("Gagal Mengirim", { description: state.error });
        }
        if (state?.success) {
            toast.success("Terkirim!", { description: state.success });
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4 w-full">
            <input type="hidden" name="groupId" value={groupId} />
            <input type="hidden" name="groupName" value={groupName} />
            <div className="space-y-2">
                <Label htmlFor="email-invite" className="text-sm font-medium">
                    Undang via Email
                </Label>
                <div className="flex w-full items-center space-x-2">
                    <Input
                        id="email-invite"
                        name="email"
                        type="email"
                        placeholder="email@member.com"
                        required
                        className="flex-1"
                    />
                    <SubmitButton />
                </div>
                 <p className="text-xs text-muted-foreground">
                    Member akan menerima email berisi link untuk bergabung ke grup ini.
                 </p>
            </div>
        </form>
    );
}