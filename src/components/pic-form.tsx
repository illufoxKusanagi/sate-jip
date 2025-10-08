"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ComponentProps, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fullName: z.string().min(4, {
    message: "Full name must be at least 4 characters.",
  }),
  idNumber: z
    .string()
    .length(18, { message: "NIP must be at least 18 characters." })
    .regex(/^\d+$/, { message: "NIP must contain only numbers." }),
  position: z.string().min(1, {
    message: "Enter a valid position.",
  }),
  opdName: z.string().min(1, {
    message: "Enter a valid Nama OPD.",
  }),
  whatsappNumber: z
    .string()
    .min(10, { message: "WhatsApp number must be at least 10 digits." })
    .max(15, { message: "WhatsApp number must not exceed 15 digits." })
    .regex(/^\d+$/, { message: "WhatsApp number must contain only numbers." }),
});

export function PicForm({ className, ...props }: ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      position: "",
      opdName: "",
      whatsappNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const picData = {
        fullName: values.fullName,
        idNumber: values.idNumber,
        position: values.position,
        opdName: values.opdName,
        whatsappNumber: values.whatsappNumber,
      };
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(picData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create PIC");
      }
      const result = await response.json();
      toast.success("Admin creation successful!!");
      form.reset();
      console.log("Admin created:", result);
      router.push("/");
    } catch (error) {
      console.error("Error creating admin: ", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create admin"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Form PIC JIP</CardTitle>
          <CardDescription>Isi form dengan benar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Lengkap <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe bin Kamis Wage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        NIP
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="20230129031129" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Jabatan
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Staff muda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="opdName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Nama Perangkat Daerah
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dinas Komunikasi dan Informatika"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Nomor Whatsapp
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="08123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Tambah Penanggungjawab"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
