"use client";

import { PageStructure } from "@/components/layout/page-structure";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AppWindow,
  Server,
  Database,
  HardDrive,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PauseCircle,
} from "lucide-react";

export default function DataCentralDashboard() {
  // Mock data
  const stats = {
    installedApps: 12,
    unallocatedRacks: 5,
    allocatedRacks: 15,
    totalServers: 42,
    serverStatus: {
      online: 38,
      offline: 1,
      maintenance: 2,
      standby: 1,
    },
  };

  return (
    <PageStructure>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="heading-1 text-center">
            Dashboard Pusat Data Pemerintah
          </h1>
          <p className="text-muted-foreground text-center">
            Overview Dashboard Pusat Data Pemerintah Kabupaten Madiun
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aplikasi terinstall
              </CardTitle>
              <AppWindow className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.installedApps}</div>
              <p className="text-xs text-muted-foreground">Aplikasi aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rak Tersedia
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unallocatedRacks}</div>
              <p className="text-xs text-muted-foreground">Rak tersedia</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rak teralokasi
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.allocatedRacks}</div>
              <p className="text-xs text-muted-foreground">
                Saat ini digunakan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Server
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServers}</div>
              <p className="text-xs text-muted-foreground">
                Server fisik & virtual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Server Status Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Status Server
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.serverStatus.online}
                </div>
                <p className="text-xs text-muted-foreground">Operational</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offline</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.serverStatus.offline}
                </div>
                <p className="text-xs text-muted-foreground">Down / Error</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Maintenance
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.serverStatus.maintenance}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sedang ada perawatan
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Standby</CardTitle>
                <PauseCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.serverStatus.standby}
                </div>
                <p className="text-xs text-muted-foreground">Siap di-deploy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageStructure>
  );
}
