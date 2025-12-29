"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Globe } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-secondary-50 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border border-primary-100">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-primary-100 p-6 rounded-full">
                <Shield className="w-16 h-16 text-secondary-600" />
              </div>
            </div>
          </div>
          <h1 className="heading-1 text-center mb-4">Akses Ditolak</h1>
          <p className="text-lg text-center text-muted-foreground mb-8">
            Maaf, aplikasi ini hanya dapat diakses dari Indonesia
          </p>
          <div className="bg-primary-foreground border-l-4 border-secondary-500 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="heading-3 text-primary-900 mb-2">
                  Pembatasan Geografis
                </h3>
                <p className="text-sm text-primary-800 leading-relaxed">
                  Sistem <strong>SATE ITIK</strong> (Sistem Aplikasi Terpadu
                  .....) milik Dinas Komunikasi dan Informatika Kabupaten Madiun
                  hanya dapat diakses dari wilayah Indonesia untuk keamanan dan
                  kepatuhan regulasi.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Globe className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>
                Jika Anda berada di Indonesia dan menerima pesan ini, silakan
                periksa pengaturan VPN atau proxy Anda
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              size="lg"
              className="bg-primary-600 hover:bg-primary-700"
            >
              Refresh Halaman
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Dinas Komunikasi dan Informatika Kabupaten Madiun
              <br />© 2025 - Sistem SATE ITIK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
