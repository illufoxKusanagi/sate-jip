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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ServerData } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  rackName: z.string().min(1, "Rack name is required"),
  unitPosition: z
    .number()
    .min(1, "Unit position must be at least 1")
    .max(42, "Unit position cannot exceed 42"),
  unitSize: z
    .number()
    .min(1, "Unit size must be at least 1")
    .max(10, "Unit size cannot exceed 10"),
  serverName: z.string().min(1, "Server name is required"),
  brand: z.string().min(1, "Brand is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  assetNumber: z.string().min(1, "Asset number is required"),
  ipAddress: z.string().min(1, "IP address is required"),
  status: z.enum(["online", "offline", "maintenance", "standby"]),
  cpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  os: z.string().optional(),
  installedApps: z.string().optional(),
  notes: z.string().optional(),
});

interface ServerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: ServerData | null;
  onSuccess?: () => void;
}

export function ServerDialog({
  isOpen,
  onOpenChange,
  editingItem,
  onSuccess,
}: ServerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rackName: "",
      unitPosition: 1,
      unitSize: 1,
      serverName: "",
      brand: "",
      serialNumber: "",
      assetNumber: "",
      ipAddress: "",
      status: "offline",
      cpu: "",
      ram: "",
      storage: "",
      os: "",
      installedApps: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        form.reset({
          rackName: editingItem.rackName,
          unitPosition: editingItem.unitPosition,
          unitSize: editingItem.unitSize,
          serverName: editingItem.serverName,
          brand: editingItem.brand,
          serialNumber: editingItem.serialNumber || "",
          assetNumber: editingItem.assetNumber,
          ipAddress: editingItem.ipAddress || "",
          status: editingItem.status,
          cpu: (editingItem.specifications as any)?.cpu || "",
          ram: (editingItem.specifications as any)?.ram || "",
          storage: (editingItem.specifications as any)?.storage || "",
          os: (editingItem.specifications as any)?.os || "",
          installedApps: Array.isArray(editingItem.installedApps)
            ? editingItem.installedApps.join(", ")
            : "",
          notes: editingItem.notes || "",
        });
      } else {
        form.reset();
      }
    }
  }, [isOpen, editingItem, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const serverData = {
        rackName: values.rackName,
        unitPosition: values.unitPosition,
        unitSize: values.unitSize,
        serverName: values.serverName,
        brand: values.brand,
        serialNumber: values.serialNumber,
        assetNumber: values.assetNumber,
        ipAddress: values.ipAddress,
        status: values.status,
        specifications: {
          cpu: values.cpu || undefined,
          ram: values.ram || undefined,
          storage: values.storage || undefined,
          os: values.os || undefined,
        },
        installedApp: values.installedApps
          ? values.installedApps.split(",").map((app) => app.trim())
          : [],
        notes: values.notes || "",
      };

      const url = editingItem
        ? `/api/server-data/${editingItem.id}`
        : "/api/server-data";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        throw new Error("Failed to save server");
      }

      toast.success(
        editingItem
          ? "Server updated successfully!"
          : "Server created successfully!"
      );
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving server:", error);
      toast.error("Failed to save server");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Server" : "Add New Server"}
          </DialogTitle>
          <DialogDescription>
            {editingItem
              ? "Update server information"
              : "Add a new server to the rack"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rackName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rack Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rack" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Rak A">Rak A</SelectItem>
                        <SelectItem value="Rak B">Rak B</SelectItem>
                        <SelectItem value="Rak C">Rak C</SelectItem>
                        <SelectItem value="Rak D">Rak D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="standby">Standby</SelectItem>
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
                name="unitPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Unit Position (1-42){" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="42"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Unit Size (U) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Server Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="WEB-SERVER-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Brand <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Dell" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      IP Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Serial Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="SN123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Asset Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="AST-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold mb-4">Specifications (Optional)</p>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPU</FormLabel>
                      <FormControl>
                        <Input placeholder="Intel Xeon E5-2670" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RAM</FormLabel>
                      <FormControl>
                        <Input placeholder="64GB DDR4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage</FormLabel>
                      <FormControl>
                        <Input placeholder="2TB SSD RAID 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="os"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating System</FormLabel>
                      <FormControl>
                        <Input placeholder="Ubuntu 22.04 LTS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="installedApps"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Installed Applications</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apache, MySQL, PHP (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingItem
                  ? "Update Server"
                  : "Add Server"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
