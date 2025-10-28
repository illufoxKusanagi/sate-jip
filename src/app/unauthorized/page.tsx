"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { useEffect, Suspense } from "react";

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();
  const from = searchParams.get("from") || "/dashboard";

  useEffect(() => {
    if (isAdmin()) {
      router.push(from);
    }
  }, [isAdmin, from, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-primary-50 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border border-primary-100">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-primary-100 p-6 rounded-full">
                <Lock className="w-16 h-16 text-secondary-600" />
              </div>
            </div>
          </div>
          {/* Title */}
          <h1 className="heading-1 text-center mb-4">Akses Terbatas</h1>

          {/* Subtitle */}
          <p className="text-lg text-center text-muted-foreground mb-8">
            Anda tidak memiliki izin untuk mengakses halaman ini
          </p>

          {/* Info Box */}
          <div className="bg-primary-foreground border-l-4 border-secondary-500 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="heading-3 mb-2">Halaman Khusus Administrator</p>
                <p className="text-sm leading-relaxed">
                  Halaman yang Anda coba akses hanya tersedia untuk{" "}
                  <strong>Administrator</strong>.
                </p>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="default"
              size="lg"
              className="gap-2 bg-primary-600 hover:bg-primary-700"
            >
              <Home className="w-4 h-4" />
              <span>Ke Dashboard</span>
            </Button>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-8 mt-8 pt-6 border-t border-border">
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

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
