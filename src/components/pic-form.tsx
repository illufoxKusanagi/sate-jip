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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ComponentProps } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  idNumber: z.email({
    message: "Please enter a valid email address.",
  }),
  position: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  opdName: z.string({
    message: "Please select a opdName.",
  }),
  whatsappNumber: z.string().min(2, {
    message: "whatsappNumber must be at least 2 characters.",
  }),
});

export function PicForm({ className, ...props }: ComponentProps<"div">) {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle form submission here
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Form titik internet</CardTitle>
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
                      <FormLabel>Nama Lengkap *</FormLabel>
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
                      <FormLabel>NIP *</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <Input placeholder="20230129031129" {...field} />
                        </div>
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
                      <FormLabel>Jabatan *</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <Input placeholder="Staff muda" {...field} />
                        </div>
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
                      <FormLabel>Nama Perangkat Daerah *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Perangkat Daerah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Dinas Komunikasi dan Informatika
                          </SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nomor Whatsapp *</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <Input placeholder="Staff muda" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By submitting this form, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
