import { CreateGroupForm } from "../_components/create-group-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateGroupPage() {
  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/guru/dashboard/manage-group">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Buat Grup Baru
          </h1>
          <p className="text-muted-foreground">
            Isi detail di bawah ini untuk membuat grup belajar baru.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl mx-auto border-border">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5"/>
                  Detail Grup
              </CardTitle>
              <CardDescription>
                  Masukkan nama grup dan unggah thumbnail jika diinginkan.
              </CardDescription>
          </CardHeader>
          <CardContent>
             <CreateGroupForm />
          </CardContent>
      </Card>
    </div>
  );
}