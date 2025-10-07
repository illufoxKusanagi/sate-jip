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
  const renderDynamicFields = () => {
    if (formData.dataType === "OPD") {
      return (
        <div className="space-y-2">
          <Label htmlFor="opdType" className="text-sm font-medium">
            OPD Type *
          </Label>
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
          <Label htmlFor="pic" className="text-sm font-medium">
            Penanggung Jawab *
          </Label>
          <Input
            id="pic"
            value={formData.pic}
            onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
            placeholder="Enter PIC name"
            required
            className="w-full"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {editingItem ? "Edit Configuration" : "Add Configuration"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editingItem
              ? "Update the configuration settings below."
              : "Create a new configuration setting."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dataType" className="text-sm font-medium">
                Data Type *
              </Label>
              <Select
                value={formData.dataType}
                onValueChange={(value) => {
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
              <Label htmlFor="name" className="text-sm font-medium">
                Nama *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Alamat
              </Label>
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
                className="w-full"
              />
            </div>

            {renderDynamicFields()}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
