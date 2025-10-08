export interface LocationData {
  id: string;
  activationDate: string;
  locationName: string;
  latitude: number;
  longitude: number;
  opdPengampu: string;
  opdType: string;
  ispName: string;
  internetSpeed: string;
  internetRatio: string;
  internetInfrastructure: string;
  jip: string;
  dropPoint: string;
  eCat: string;
  status: "active" | "inactive" | "maintenance";
}

export interface AdminData {
  id: string;
  fullName: string;
  idNumber: string;
  position: string;
  opdName: string;
  whatsappNumber: string;
}

export interface ConfigData {
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
