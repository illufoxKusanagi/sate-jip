export interface LocationData {
  id: string;
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
