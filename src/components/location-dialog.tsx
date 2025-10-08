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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfigData, LocationData } from "@/lib/types";

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
  internetSpeed: z
    .string({ message: "Please enter a valid internet speed" })
    .min(1, { message: "Speed must be at least 1 Mbps" }),
  internetRatio: z.string().min(1, "Please select internet ratio."),
  internetInfrastructure: z
    .string()
    .min(1, "Please select internet infrastructure."),
  jip: z.string().min(1, "Please select JIP status."),
  dropPoint: z.string().optional(),
  eCat: z.string().min(1, "Please select E-Cat."),
});

interface LocationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: LocationData | null;
  onSuccess?: () => void;
}

export function LocationDialog({
  isOpen,
  onOpenChange,
  editingItem,
  onSuccess,
}: LocationDialogProps) {
  const [opdData, setOpdData] = useState<ConfigData[]>([]);
  const [ispData, setIspData] = useState<ConfigData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "",
      activationDate: "",
      latitude: undefined,
      longitude: undefined,
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

  const fetchOpdOptions = async () => {
    try {
      const response = await fetch("/api/configs");

      if (!response.ok) {
        throw new Error(`Failed to fetch configs: ${response.status}`);
      }

      const rawData = await response.json();
      // Parse dataConfig JSON string to object
      const allData: ConfigData[] = rawData.map((item: any) => ({
        ...item,
        dataConfig:
          typeof item.dataConfig === "string"
            ? JSON.parse(item.dataConfig)
            : item.dataConfig,
      }));

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
    if (isOpen) {
      fetchOpdOptions();

      // Populate form when editing
      if (editingItem) {
        form.reset({
          locationName: editingItem.locationName,
          activationDate: editingItem.activationDate,
          latitude: editingItem.latitude,
          longitude: editingItem.longitude,
          opdPengampu: editingItem.opdPengampu,
          opdType: editingItem.opdType,
          ispName: editingItem.ispName,
          internetSpeed: editingItem.internetSpeed,
          internetRatio: editingItem.internetRatio,
          internetInfrastructure: editingItem.internetInfrastructure,
          jip: editingItem.jip ? "true" : "false",
          dropPoint: editingItem.dropPoint || "",
          eCat: editingItem.eCat,
        });
      } else {
        form.reset({
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
        });
      }
    }
  }, [isOpen, editingItem, form]);

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

      const url = editingItem
        ? `/api/locations/${editingItem.id}`
        : "/api/locations";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to save location";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast.success(
        editingItem
          ? "Location updated successfully!"
          : "Location created successfully!"
      );
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save location"
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Location" : "Add New Location"}
          </DialogTitle>
          <DialogDescription>
            {editingItem
              ? "Update location information"
              : "Add a new internet location"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
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
                    <FormItem>
                      <FormLabel>
                        Latitude <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="-7.541858083799367"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
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
                    <FormItem>
                      <FormLabel>
                        Longitude <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="111.65312443469108"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
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
                      <Input type="date" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih OPD Pengampu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {opdData.map((opd) => (
                          <SelectItem value={opd.dataConfig.name} key={opd.id}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih nama ISP" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ispData.map((isp) => (
                          <SelectItem value={isp.dataConfig.name} key={isp.id}>
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
                    <FormDescription className="text-xs">
                      Masukkan kecepatan internet dalam satuan Mbps
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih rasio" />
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
                        Infrastruktur <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                        value={field.value}
                      >
                        <FormControl>
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
                      <FormLabel>Drop Point</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih drop point (opsional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MMR">MMR</SelectItem>
                          <SelectItem value="MPP">MPP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Drop point bersifat opsional
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eCat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      E-Cat <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
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
                  ? "Update Location"
                  : "Add Location"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
