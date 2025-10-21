import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCategories } from "../lib/data";
import CreateStoryForm from "../_components/create-form";

export default async function CreateStoryPage() {
  const categories = await GetCategories();

  const validCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="container mx-auto py-4 px-4 md:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/guru/dashboard/manage-stories">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Buat Cerita Interaktif</CardTitle>
          <p className="text-muted-foreground">
            Isi detail untuk cerita interaktif baru Anda.
          </p>
        </CardHeader>
        <CardContent>
          <CreateStoryForm categories={validCategories} />
        </CardContent>
      </Card>
    </div>
  );
}