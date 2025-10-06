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
import { ComponentProps, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfigData } from "@/lib/types";
import { id } from "zod/v4/locales";

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
  const [opdData, setOpdData] = useState<ConfigData[]>([]);
  const [ispData, setIspData] = useState<ConfigData[]>([]);
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

  const fetchOpdOptions = async () => {
    try {
      const response = await fetch("/api/configs");

      if (!response.ok) {
        throw new Error(`Failed to fetch congis: ${response.status}`);
      }

      const allData: ConfigData[] = await response.json();

      const opdConfigs = allData.filter((item) => item.dataType === "OPD");
      const ispConfigs = allData.filter((item) => item.dataType === "ISP");

      setOpdData(opdConfigs);
      setIspData(ispConfigs);
    } catch (error) {
      console.error("Unexpected error: ", error);
      toast.error("Failed to load OPD and ISP data. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchOpdOptions();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const locationData = {
        locationName: values.locationName,
        activationDate: values.activationDate.toString(),
        longitude: values.longitude,
        latitude: values.latitude,
        opdPengampu: values.opdPengampu,
        opdType: values.opdType,
        ispName: values.ispName,
        internetSpeed: values.internetSpeed,
        internetRatio: values.internetRatio,
        internetInfrastructure: values.internetInfrastructure,
        jip: values.jip === "true",
        dropPoint: values.dropPoint || null,
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
        let errorMessage = "Failed to create location";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast.success("Location created successfully!");
      form.reset();
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

  const selectedOpdName = form.watch("opdPengampu");
  useEffect(() => {
    if (selectedOpdName) {
      const selectedOpd = opdData.find(
        (opd) => opd.dataConfig.name === selectedOpdName
      );
      if (selectedOpd?.dataConfig.opdType) {
        form.setValue("opdType", selectedOpd.dataConfig.opdType);
      }
    } else {
      form.setValue("opdType", "");
    }
  }, [selectedOpdName, opdData, form]);

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
                          {opdData.map((opd) => (
                            <SelectItem
                              value={opd.dataConfig.name}
                              key={opd.id}
                            >
                              {opd.dataConfig.name}
                            </SelectItem>
                          ))}
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
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                          placeholder="Akan terisi otomatis berdasarkan OPD Pengampu"
                        />
                      </FormControl>
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
                          {ispData.map((isp) => (
                            <SelectItem
                              value={isp.dataConfig.name}
                              key={isp.id}
                            >
                              {isp.dataConfig.name}
                            </SelectItem>
                          ))}
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
    </div>
  );
}
