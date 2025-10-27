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

export interface ServerData {
  id: string;
  rackName: string; // Rak A, B, C, D
  unitPosition: number; // 1-42
  unitSize: number; // How many U it occupies
  serverName: string;
  brand: string;
  serialNumber: string;
  assetNumber: string;
  ipAddress: string;
  status: "online" | "offline" | "maintenance" | "standby";
  specifications: {
    cpu?: string;
    ram?: string;
    storage?: string;
    os?: string;
  };
  // TODO : Parse json format, which database output, using this before
  // sending api response
  // responseArray =  "[{"id":"blah", "type":"blah", ...}, {"id":"blah2",.... },...]"
  // <Item[]> JSON.parse(responseArray)
  installedApps: string[];
  notes?: string;
}
