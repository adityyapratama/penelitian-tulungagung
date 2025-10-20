"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateArticleCategory } from "../../lib/actions";
import { ActionResult } from "@/lib/executeAction";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Simpan Kategori"}
    </Button>
  );
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult, FormData>(
    CreateArticleCategory,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast.error("gagal membuat kategori", {
        description: state.error,
      });
    }
    if (state?.success) {
      toast.success("Berhasil membuat kategori!", {
        description: state.success,
      });
      formRef.current?.reset();
      const timer = setTimeout(() => {
        router.push("/admin/dashboard/manage-articles/categories");
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <form ref={formRef} action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Tambahkan Kategori Artikel Baru
            </CardTitle>
            <CardDescription>
              Isi nama untuk kategori baru di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="category" className="font-semibold">
                Nama Kategori
              </Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g., Local History"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard/manage-articles/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Batal
              </Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
