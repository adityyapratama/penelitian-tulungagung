"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

export function SubmitButton({ text = "Simpan Perubahan" }: { text?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {text}
        </>
      )}
    </Button>
  );
}