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
import { Label } from "./ui/label";
import {
  Form,
  FormControl,
  FormDescription,
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
import { zodResolver } from "@hookform/resolvers/zod"; // FIXED: Proper import
import { z } from "zod";

const formSchema = z.object({
  locationName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  coordinate: z.email({
    message: "Please enter a valid email address.",
  }),
  opdPengampu: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  opdType: z.string({
    message: "Please select a opdType.",
  }),
  ispName: z.string().min(2, {
    message: "ispName must be at least 2 characters.",
  }),
  internetSpeed: z.string().min(1, {
    message: "Please enter your years of internetSpeed.",
  }),
  internetRatio: z.string().min(1, {
    message: "Please enter expected internetRatio.",
  }),
  internetInfrastructure: z.string().min(1, {
    message: "Please enter expected InternetInfrastructure",
  }),
  jip: z.string().min(1, {
    message: "Please enter jip",
  }),
  dropPoint: z.string().min(1, {
    message: "Please enter drop point",
  }),
  eCat: z.string().min(1, {
    message: "please enter eCat",
  }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "",
      coordinate: "",
      opdPengampu: "",
      opdType: "",
      ispName: "",
      internetSpeed: "",
      internetRatio: "",
      internetInfrastructure: "",
      jip: "",
      dropPoint: "",
      eCat: "",
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
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kecamatan Balerejo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="coordinate"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Latitude (Garis Lintang) *</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Input
                              placeholder="-7.541858083799367"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coordinate"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Longitude (Garis Bujur) *</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Input
                              placeholder="111.65312443469108"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="opdPengampu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OPD Pengampu *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a opdType" />
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

                {/* opdType Dropdown Field */}
                <FormField
                  control={form.control}
                  name="opdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis OPD *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a opdType" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">OPD Utama</SelectItem>
                          <SelectItem value="marketing">OPD Utama</SelectItem>
                          <SelectItem value="finance">OPD Pendukung</SelectItem>
                          <SelectItem value="operations">Publik</SelectItem>
                          <SelectItem value="design">Non OPD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ispName Field */}
                <FormField
                  control={form.control}
                  name="ispName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama ISP *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih nama ISP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">Kominfo</SelectItem>
                          <SelectItem value="marketing">Telkom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* internetSpeed Field */}
                <FormField
                  control={form.control}
                  name="internetSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecepatan (MBps) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan kecepatan interent dalam satuan MBps (Mega Bit
                        per Detik)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* internetRatio Field */}
                <FormField
                  control={form.control}
                  name="internetRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rasio *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih nama ISP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">1:1</SelectItem>
                          <SelectItem value="marketing">Up To</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="internetInfrastructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Infrastruktur Internet *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih nama ISP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">Kabel</SelectItem>
                          <SelectItem value="marketing">Nirkabel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jip *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih nama ISP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">true</SelectItem>
                          <SelectItem value="marketing">false</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eCat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ECat *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih nama ISP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Internet Mix Gedung Puspem
                          </SelectItem>
                          <SelectItem value="marketing">
                            Internet Mix Mal Pelayan Publik
                          </SelectItem>
                          <SelectItem value="marketing">
                            Internet Mix OPD/30 lokasi
                          </SelectItem>
                          <SelectItem value="marketing">
                            Internet Mix Wifi/10 lokasi
                          </SelectItem>
                          <SelectItem value="marketing">
                            Internet Kecamaatan/15 lokasi
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Application
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
