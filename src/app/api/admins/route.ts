import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { admins } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allAdmins = await db.select().from(admins).orderBy(asc(admins.nama));

    return NextResponse.json(allAdmins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newAdmin = {
      nama: data.fullName || "",
      nip: data.idNumber || "",
      jabatan: data.position || "",
      instansi: data.opdName || "",
      whatsapp: data.whatsappNumber || "",
    };

    const result = await db.insert(admins).values(newAdmin);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}

// // src/app/api/admins/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db/connection";
// import { admins, type NewAdmin } from "@/lib/db/schema";
// import { asc } from "drizzle-orm";

// export async function GET() {
//   try {
//     const allAdmins = await db.select().from(admins).orderBy(asc(admins.nama));

//     return NextResponse.json(allAdmins);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch admins" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.json();

//     const newAdmin: NewAdmin = {
//       id: data.id || `admin_${Date.now()}`,
//       nama: data.nama,
//       nip: data.nip || "",
//       jabatan: data.jabatan,
//       instansi: data.instansi,
//       whatsapp: data.whatsapp,
//     };

//     const result = await db.insert(admins).values(newAdmin);

//     return NextResponse.json({ success: true, result });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     return NextResponse.json(
//       { error: "Failed to create admin" },
//       { status: 500 }
//     );
//   }
// }
