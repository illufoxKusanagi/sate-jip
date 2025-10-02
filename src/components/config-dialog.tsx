import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ConfigData {
  id: string;
  dataType: string;
  dataConfig: {
    name: string;
    address?: string;
    opdType?: string;
    pic?: string;
  };
  createdAt: string;
}

interface FormData {
  dataType: string;
  name: string;
  address: string;
  opdType: string;
  pic: string;
}

interface ConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: ConfigData | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ConfigDialog({
  isOpen,
  onOpenChange,
  editingItem,
  formData,
  setFormData,
  onSubmit,
}: ConfigDialogProps) {
  // Dynamic field rendering based on dataType
  const renderDynamicFields = () => {
    if (formData.dataType === "OPD") {
      return (
        <div className="space-y-2">
          <Label htmlFor="opdType">OPD Type *</Label>
          <Select
            value={formData.opdType}
            onValueChange={(value) =>
              setFormData({ ...formData, opdType: value })
            }
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select OPD type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPD Utama">OPD Utama</SelectItem>
              <SelectItem value="OPD Pendukung">OPD Pendukung</SelectItem>
              <SelectItem value="Publik">Publik</SelectItem>
              <SelectItem value="Non OPD">Non OPD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (formData.dataType === "ISP") {
      return (
        <div className="space-y-2">
          <Label htmlFor="pic">Penanggung Jawab *</Label>
          <Input
            id="pic"
            value={formData.pic}
            onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
            placeholder="Enter PIC name"
            required
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Configuration" : "Add Configuration"}
          </DialogTitle>
          <DialogDescription>
            {editingItem
              ? "Update the configuration settings below."
              : "Create a new configuration setting."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dataType">Data Type *</Label>
              <Select
                value={formData.dataType}
                onValueChange={(value) => {
                  // Reset type-specific fields when changing dataType
                  setFormData({
                    ...formData,
                    dataType: value,
                    opdType: "",
                    pic: "",
                  });
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPD">OPD</SelectItem>
                  <SelectItem value="ISP">ISP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                placeholder="Enter address"
              />
            </div>

            {/* Dynamic fields based on dataType */}
            {renderDynamicFields()}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
