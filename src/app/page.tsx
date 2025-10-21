"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import {
  MapPin,
  Users,
  Calendar,
  BarChart3,
  Shield,
  Globe,
  ArrowRight,
  Zap,
  Building2,
  Network,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Pemetaan Infrastruktur",
      description:
        "Visualisasi peta interaktif untuk semua lokasi infrastruktur internet pemerintah Kabupaten Madiun",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Manajemen PIC",
      description:
        "Kelola data penanggung jawab (PIC) di setiap kantor pemerintah dengan sistem terintegrasi",
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      title: "Kalender Aktivitas",
      description:
        "Jadwalkan dan pantau semua kegiatan infrastruktur di seluruh OPD dengan kalender interaktif",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Analitik Data",
      description:
        "Dashboard statistik komprehensif untuk monitoring performa infrastruktur secara real-time",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Keamanan Data",
      description:
        "Sistem autentikasi dan otorisasi berbasis peran untuk melindungi data pemerintah",
    },
    {
      icon: <Network className="h-8 w-8 text-indigo-600" />,
      title: "Monitoring ISP",
      description:
        "Pantau kecepatan internet dan kualitas layanan dari berbagai penyedia ISP",
    },
  ];

  const stats = [
    {
      label: "Kantor OPD",
      value: "50+",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "Titik Lokasi",
      value: "200+",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: "Uptime System",
      value: "99.9%",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    { label: "Response Time", value: "<2s", icon: <Zap className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SATE-ITIK
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Link href="/dashboard">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto text-center">
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              Sistem Infrastruktur Pemerintah Kabupaten Madiun
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Sistem Aplikasi Terintegrasi
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Jaringan Infrastruktur Pemerintah
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Platform manajemen infrastruktur yang komprehensif untuk mengelola
            dan memantau seluruh jaringan internet pemerintah Kabupaten Madiun
            secara terpusat dan efisien.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={itemVariants}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/dashboard">
                <Globe className="mr-2 h-5 w-5" />
                Mulai Sekarang
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                Fitur Unggulan SATE-ITIK
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Solusi lengkap untuk manajemen infrastruktur pemerintah yang
              modern dan efisien
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                  Mengapa Memilih SATE-ITIK?
                </span>
              </h2>

              <div className="space-y-4">
                {[
                  "Monitoring real-time seluruh infrastruktur jaringan",
                  "Dashboard analitik yang komprehensif dan mudah dipahami",
                  "Sistem keamanan berlapis untuk melindungi data pemerintah",
                  "Interface yang user-friendly dan responsif",
                  "Integrasi dengan berbagai sistem pemerintah",
                  "Laporan otomatis dan notifikasi real-time",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AspectRatio
                ratio={16 / 9}
                className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl"
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Network className="h-20 w-20 text-blue-600 mx-auto mb-4" />
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      Visualisasi Infrastruktur Terintegrasi
                    </p>
                  </div>
                </div>
              </AspectRatio>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <motion.div
          className="container mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Siap Memulai Transformasi Digital?
          </motion.h2>

          <motion.p
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Bergabunglah dengan revolusi manajemen infrastruktur pemerintah yang
            lebih efisien dan modern
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/dashboard">
                <Globe className="mr-2 h-5 w-5" />
                Mulai Sekarang
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SATE-ITIK</span>
            </div>

            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 Pemerintah Kabupaten Madiun.</p>
              <p className="text-sm">
                Sistem Aplikasi Terintegrasi - Jaringan Infrastruktur Pemerintah
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
