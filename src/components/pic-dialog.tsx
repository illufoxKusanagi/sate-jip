"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminData } from "@/lib/types";

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

interface PicDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: AdminData | null;
  onSuccess?: () => void;
}

export function PicDialog({
  isOpen,
  onOpenChange,
  editingItem,
  onSuccess,
}: PicDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      // Populate form when editing
      if (editingItem) {
        form.reset({
          fullName: editingItem.nama,
          idNumber: editingItem.nip,
          position: editingItem.jabatan,
          opdName: editingItem.instansi,
          whatsappNumber: editingItem.whatsapp,
        });
      } else {
        form.reset({
          fullName: "",
          idNumber: "",
          position: "",
          opdName: "",
          whatsappNumber: "",
        });
      }
    }
  }, [isOpen, editingItem, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const adminData = {
        nama: values.fullName,
        nip: values.idNumber,
        jabatan: values.position,
        instansi: values.opdName,
        whatsapp: values.whatsappNumber,
      };

      console.log("Submitting admin data:", adminData);

      const url = editingItem ? `/api/admins/${editingItem.id}` : "/api/admins";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to save admin";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast.success(
        editingItem
          ? "Admin updated successfully!"
          : "Admin created successfully!"
      );
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save admin"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Admin" : "Add New Admin"}
          </DialogTitle>
          <DialogDescription>
            {editingItem
              ? "Update admin information"
              : "Add a new admin/PIC member"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    NIP <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 18-digit NIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Position <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter position/title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="opdName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    OPD Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter OPD name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    WhatsApp Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter WhatsApp number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingItem
                  ? "Update Admin"
                  : "Add Admin"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
