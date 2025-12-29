"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z
    .string()
    .min(20, "Please provide more details (min 20 characters)"),
  email: z.email("Invalid email address"),
  submittedBy: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  priority: z.enum(["rendah", "sedang", "tinggi", "urgent"]),
});

type TicketFormValues = z.infer<typeof formSchema>;

interface Category {
  id: string;
  name: string;
  description: string;
}

export function TicketForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      email: "",
      submittedBy: "",
      phone: "",
      categoryId: "",
      priority: "sedang",
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/tickets/categories");
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  async function onSubmit(values: TicketFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit ticket");
      }

      toast.success(
        `Ticket #${result.data[0].ticketNumber} created successfully!`
      );
      setTicketNumber(result.data.ticketNumber);
      form.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit ticket";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (ticketNumber) {
    return (
      <div className="flex flex-col max-w-2xl p-6 text-center justify-center">
        <div className="rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950 p-8">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
            Tiket berhasil dikirim!
          </h2>
          <p className="text-lg mb-4">
            Nomor tiket Anda adalah:
            <span className="font-mono font-bold text-xl ml-2">
              {ticketNumber}
            </span>
          </p>
          <p className="text-muted-foreground mb-6">
            Kami telah mengirimkan email konfirmasi ke alamat email yang Anda
            berikan. Anda dapat memantau status tiket Anda menggunakan nomor
            tiket di atas.
          </p>
          <Button onClick={() => setTicketNumber(null)}>
            Kirim Tiket Lainnya
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen max-w-2xl mx-auto p-6">
      <h1 className="heading-1 mb-2">Buat Tiket</h1>
      <p className="text-muted-foreground mb-6">
        Berikan detail sebanyak mungkin untuk membantu tim kami menangani tiket
        Anda dengan cepat.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="submittedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Telepon (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+62 812 3456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategory</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rendah">🟢 Rendah</SelectItem>
                    <SelectItem value="sedang">🟡 Sedang</SelectItem>
                    <SelectItem value="tinggi">🟠 Tinggi</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seberapa urgent issue yang Anda hadapi?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject *</FormLabel>
                <FormControl>
                  <Input placeholder="Ringkasan masalah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi masalah..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum 20 karakter. Termasuk pesan error atau langkah-langkah
                  untuk mengulangi.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Tiket"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
