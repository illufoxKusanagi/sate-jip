import { PicForm } from "@/components/pic-form";
import { GalleryVerticalEnd } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6 items-center">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Dinas Kominfo Kabupaten Madiun
        </a>
        <PicForm className="w-2xl" />
      </div>
    </div>
  );
}
