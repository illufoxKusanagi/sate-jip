// src/components/location-form.tsx
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ComponentProps, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  locationName: z
    .string()
    .min(2, "Location name must be at least 2 characters."),
  activationDate: z.string().min(1, "Please select an activation date."),
  latitude: z.coerce
    .number<number>({ message: "Please enter a valid latitude number" })
    .min(-90, { message: "Latitude must be ≥ -90" })
    .max(90, { message: "Latitude must be ≤ 90" }),
  longitude: z.coerce
    .number<number>({ message: "Please enter a valid longitude number" })
    .min(-180, { message: "Longitude must be ≥ -180" })
    .max(180, { message: "Longitude must be ≤ 180" }),
  opdPengampu: z.string().min(1, "Please select OPD Pengampu."),
  opdType: z.string().min(1, "Please select OPD Type."),
  ispName: z.string().min(1, "Please select ISP Name."),
  internetSpeed: z.coerce
    .number<number>({ message: "Please enter a valid internet speed number" })
    .min(1, { message: "Speed must be at least 1 Mbps" }),
  internetRatio: z.string().min(1, "Please select internet ratio."),
  internetInfrastructure: z
    .string()
    .min(1, "Please select internet infrastructure."),
  jip: z.string().min(1, "Please select JIP status."),
  dropPoint: z.string().optional(),
  eCat: z.string().min(1, "Please select E-Cat."),
});

export function LocationForm({ className, ...props }: ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "",
      latitude: undefined,
      longitude: undefined,
      opdPengampu: "",
      opdType: "",
      ispName: "",
      internetSpeed: undefined,
      internetRatio: "",
      internetInfrastructure: "",
      jip: "",
      dropPoint: "",
      eCat: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Transform form data to match your API schema
      const locationData = {
        locationName: values.locationName,
        activationDate: values.activationDate,
        longitude: values.longitude,
        latitude: values.latitude,
        opdPengampu: values.opdPengampu,
        opdType: values.opdType,
        ispName: values.ispName,
        internetSpeed: values.internetSpeed, // Already a number due to coerce!
        internetRatio: values.internetRatio,
        internetInfrastructure: values.internetInfrastructure,
        jip: values.jip === "true", // Convert string to boolean
        dropPoint: values.dropPoint || null, // Handle optional field
        eCat: values.eCat,
      };

      console.log("Submitting data:", locationData);

      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        // throw new Error(errorData.error || "Failed to create location");
        let errorMessage = "Failed to create location";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast.success("Location created successfully!");
      form.reset(); // Reset form after successful submission
      console.log("Location created:", result);
      router.push("/");
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create location"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Form Titik Internet</CardTitle>
          <CardDescription>Isi form dengan lengkap dan benar</CardDescription>
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
                      <FormLabel>
                        Nama Lokasi <span className="text-red-500">*</span>
                      </FormLabel>
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
                    name="latitude"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Latitude (Garis Lintang){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="-7.541858083799367"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Range: -90 to 90 degrees
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Longitude (Garis Bujur){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="111.65312443469108"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Range: -180 to 180 degrees
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="activationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tanggal aktivasi <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Pilih tanggal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="opdPengampu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        OPD Pengampu <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih OPD Pengampu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dinas Komunikasi dan Informatika">
                            Dinas Komunikasi dan Informatika
                          </SelectItem>
                          <SelectItem value="Dinas Pendidikan">
                            Dinas Pendidikan
                          </SelectItem>
                          <SelectItem value="Dinas Kesehatan">
                            Dinas Kesehatan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="opdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Jenis OPD <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis OPD" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OPD Utama">OPD Utama</SelectItem>
                          <SelectItem value="OPD Pendukung">
                            OPD Pendukung
                          </SelectItem>
                          <SelectItem value="Publik">Publik</SelectItem>
                          <SelectItem value="Non OPD">Non OPD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ispName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama ISP <span className="text-red-500">*</span>
                      </FormLabel>
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
                          <SelectItem value="KOMINFO">Kominfo</SelectItem>
                          <SelectItem value="TELKOM">Telkom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internetSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Kecepatan (Mbps) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          min="1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan kecepatan internet dalam satuan Mbps
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internetRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Rasio <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih rasio internet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1:1">1:1</SelectItem>
                          <SelectItem value="Up To">Up To</SelectItem>
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
                      <FormLabel>
                        Infrastruktur Internet{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih infrastruktur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="KABEL">Kabel</SelectItem>
                          <SelectItem value="WIRELESS">Nirkabel</SelectItem>
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
                      <FormLabel>
                        Status JIP <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status JIP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Checked</SelectItem>
                          <SelectItem value="false">Unchecked</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dropPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Drop Point <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih drop point (opsional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MMR">MMR</SelectItem>
                          <SelectItem value="MPP">MPP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Drop point bersifat opsional
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eCat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-Cat <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori E-Cat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Internet Mix Gedung Puspem">
                            Internet Mix Gedung Puspem
                          </SelectItem>
                          <SelectItem value="Internet Mix Mal Pelayan Publik">
                            Internet Mix Mal Pelayan Publik
                          </SelectItem>
                          <SelectItem value="Internet Mix OPD/30 lokasi">
                            Internet Mix OPD/30 lokasi
                          </SelectItem>
                          <SelectItem value="Internet Mix Wifi/10 lokasi">
                            Internet Mix Wifi/10 lokasi
                          </SelectItem>
                          <SelectItem value="Internet Kecamatan/15 lokasi">
                            Internet Kecamatan/15 lokasi
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Tambah Lokasi"}
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

// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { ComponentProps, useState } from "react";

// const formSchema = z.object({
//   locationName: z.string().min(2, {
//     message: "Full name must be at least 2 characters.",
//   }),
//   latitude: z.coerce
//     .number({ error: "Please enter a valid latitude" })
//     .gte(-90, { message: "Latitude must be ≥ -90" })
//     .lte(90, { message: "Latitude must be ≤ 90" }),
//   longitude: z.coerce
//     .number({ error: "Please enter a valid longitude" })
//     .gte(-180, { message: "Longitude must be ≥ -180" })
//     .lte(180, { message: "Longitude must be ≤ 180" }),

//   opdPengampu: z.string().min(10, {
//     message: "Phone number must be at least 10 digits.",
//   }),
//   opdType: z.string({
//     message: "Please select a opdType.",
//   }),
//   ispName: z.string().min(2, {
//     message: "ispName must be at least 2 characters.",
//   }),
//   internetSpeed: z.string().min(1, {
//     message: "Please enter your years of internetSpeed.",
//   }),
//   internetRatio: z.string().min(1, {
//     message: "Please enter expected internetRatio.",
//   }),
//   internetInfrastructure: z.string().min(1, {
//     message: "Please enter expected InternetInfrastructure",
//   }),
//   jip: z.string().min(1, {
//     message: "Please enter jip",
//   }),
//   dropPoint: z.string().min(1, {
//     message: "Please enter drop point",
//   }),
//   eCat: z.string().min(1, {
//     message: "please enter eCat",
//   }),
// });

// export function LocationForm({ className, ...props }: ComponentProps<"div">) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       locationName: "",
//       latitude: 90,
//       longitude: 180,
//       opdPengampu: "",
//       opdType: "",
//       ispName: "",
//       internetSpeed: "",
//       internetRatio: "",
//       internetInfrastructure: "",
//       jip: "",
//       dropPoint: "",
//       eCat: "",
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true);
//     try {
//       const locationData = {
//         locationName: values.locationName,
//         coordinate: `${values.latitude}`,
//       };
//     } catch (error) {}
//     console.log(values);
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader className="text-center">
//           <CardTitle className="text-xl">Form titik internet</CardTitle>
//           <CardDescription>Isi form dengan benar</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <div className="flex flex-col gap-6">
//                 <FormField
//                   control={form.control}
//                   name="locationName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Lokasi *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Kecamatan Balerejo" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="latitude"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel>Latitude (Garis Lintang) *</FormLabel>
//                         <FormControl>
//                           <div className="flex flex-col gap-2">
//                             <Input
//                               placeholder="-7.541858083799367"
//                               {...field}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="longitude"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel>Longitude (Garis Bujur) *</FormLabel>
//                         <FormControl>
//                           <div className="flex flex-col gap-2">
//                             <Input
//                               placeholder="111.65312443469108"
//                               {...field}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Phone Field */}
//                 <FormField
//                   control={form.control}
//                   name="opdPengampu"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>OPD Pengampu *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a opdType" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">
//                             Dinas Komunikasi dan Informatika
//                           </SelectItem>
//                           <SelectItem value="marketing">Marketing</SelectItem>
//                           <SelectItem value="sales">Sales</SelectItem>
//                           <SelectItem value="hr">Human Resources</SelectItem>
//                           <SelectItem value="finance">Finance</SelectItem>
//                           <SelectItem value="operations">Operations</SelectItem>
//                           <SelectItem value="design">Design</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="opdType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Jenis OPD *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a opdType" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">OPD Utama</SelectItem>
//                           <SelectItem value="marketing">OPD Utama</SelectItem>
//                           <SelectItem value="finance">OPD Pendukung</SelectItem>
//                           <SelectItem value="operations">Publik</SelectItem>
//                           <SelectItem value="design">Non OPD</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="ispName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Nama ISP *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Pilih nama ISP" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">Kominfo</SelectItem>
//                           <SelectItem value="marketing">Telkom</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="internetSpeed"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Kecepatan (MBps) *</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="5"
//                           min="0"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Masukkan kecepatan interent dalam satuan MBps (Mega Bit
//                         per Detik)
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="internetRatio"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Rasio *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Pilih nama ISP" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">1:1</SelectItem>
//                           <SelectItem value="marketing">Up To</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="internetInfrastructure"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Infrastruktur Internet *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Pilih nama ISP" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">Kabel</SelectItem>
//                           <SelectItem value="marketing">Nirkabel</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="jip"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Jip *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Pilih nama ISP" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">true</SelectItem>
//                           <SelectItem value="marketing">false</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="eCat"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>ECat *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Pilih nama ISP" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">
//                             Internet Mix Gedung Puspem
//                           </SelectItem>
//                           <SelectItem value="marketing">
//                             Internet Mix Mal Pelayan Publik
//                           </SelectItem>
//                           <SelectItem value="marketing">
//                             Internet Mix OPD/30 lokasi
//                           </SelectItem>
//                           <SelectItem value="marketing">
//                             Internet Mix Wifi/10 lokasi
//                           </SelectItem>
//                           <SelectItem value="marketing">
//                             Internet Kecamaatan/15 lokasi
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Button type="submit" className="w-full">
//                 Submit Application
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>

//       <div className="text-muted-foreground text-center text-xs text-balance">
//         By submitting this form, you agree to our{" "}
//         <a href="#" className="underline underline-offset-4 hover:text-primary">
//           Terms of Service
//         </a>{" "}
//         and{" "}
//         <a href="#" className="underline underline-offset-4 hover:text-primary">
//           Privacy Policy
//         </a>
//         .
//       </div>
//     </div>
//   );
// }
