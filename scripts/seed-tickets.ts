import { nanoid } from "nanoid";
import db from "@/lib/db/connection";
import { ticketCategories, tickets, ticketReplies } from "@/lib/db/schema";

async function seedTickets() {
  try {
    console.log("🌱 Seeding tickets and replies...");

    // First, check if categories exist
    const categories = await db.select().from(ticketCategories).limit(5);

    if (categories.length === 0) {
      console.log(
        "⚠️  No categories found. Creating default categories first..."
      );

      const defaultCategories = [
        {
          id: nanoid(),
          name: "Technical Support",
          description: "Hardware and software technical issues",
          color: "#3b82f6",
          icon: "wrench",
          sortOrder: 1,
          isActive: true,
        },
        {
          id: nanoid(),
          name: "Network Issues",
          description: "Internet and network connectivity problems",
          color: "#10b981",
          icon: "wifi",
          sortOrder: 2,
          isActive: true,
        },
        {
          id: nanoid(),
          name: "Account & Access",
          description: "Login, password, and access issues",
          color: "#f59e0b",
          icon: "key",
          sortOrder: 3,
          isActive: true,
        },
        {
          id: nanoid(),
          name: "General Inquiry",
          description: "General questions and information requests",
          color: "#8b5cf6",
          icon: "help-circle",
          sortOrder: 4,
          isActive: true,
        },
      ];

      await db.insert(ticketCategories).values(defaultCategories);
      console.log("✅ Created default categories");

      // Refresh categories
      const newCategories = await db.select().from(ticketCategories).limit(5);
      categories.push(...newCategories);
    }

    const categoryIds = categories.map((c) => c.id);

    // Generate ticket numbers
    const generateTicketNumber = (index: number) => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const sequence = (index + 1).toString().padStart(4, "0");
      return `TKT-${year}${month}-${sequence}`;
    };

    // Dummy ticket data
    const dummyTickets = [
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(0),
        subject: "Cannot access email account",
        description:
          "I've been trying to log into my email account for the past 2 hours but keep getting an 'invalid credentials' error. I'm sure my password is correct. Can you please help?",
        submittedBy: "John Doe",
        email: "john.doe@example.com",
        phone: "+62 812 3456 7890",
        categoryId: categoryIds[2] || categoryIds[0], // Account & Access
        priority: "tinggi" as const,
        status: "dalam_progress" as const,
        source: "web" as const,
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        assignedTo: "admin-001",
        firstResponseAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(1),
        subject: "Printer not working",
        description:
          "The office printer on the 3rd floor is showing 'Paper Jam' error but there's no paper stuck inside. We've tried restarting it multiple times.",
        submittedBy: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+62 813 9876 5432",
        categoryId: categoryIds[0] || categoryIds[0], // Technical Support
        priority: "sedang" as const,
        status: "menunggu_jawaban" as const,
        source: "web" as const,
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        assignedTo: "admin-001",
        firstResponseAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(2),
        subject: "Very slow internet connection",
        description:
          "Internet speed has been extremely slow since this morning. Download speed is less than 1 Mbps when it should be 100 Mbps. Affecting entire department.",
        submittedBy: "Ahmad Rizki",
        email: "ahmad.rizki@example.com",
        phone: "+62 821 1234 5678",
        categoryId: categoryIds[1] || categoryIds[0], // Network Issues
        priority: "urgent" as const,
        status: "terbuka" as const,
        source: "web" as const,
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(3),
        subject: "Software installation request",
        description:
          "I need Adobe Photoshop installed on my workstation for the upcoming marketing campaign. Please install the latest version.",
        submittedBy: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+62 822 5555 6666",
        categoryId: categoryIds[0] || categoryIds[0], // Technical Support
        priority: "rendah" as const,
        status: "selesai" as const,
        source: "web" as const,
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        assignedTo: "admin-002",
        firstResponseAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(4),
        subject: "VPN connection issues",
        description:
          "Unable to connect to company VPN from home. Getting error code 809. Tried reinstalling the VPN client but problem persists.",
        submittedBy: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "+62 823 7777 8888",
        categoryId: categoryIds[1] || categoryIds[0], // Network Issues
        priority: "tinggi" as const,
        status: "dalam_progress" as const,
        source: "web" as const,
        ipAddress: "203.0.113.45",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        assignedTo: "admin-001",
        firstResponseAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(5),
        subject: "Password reset request",
        description:
          "I forgot my password and the reset email is not arriving. I've checked spam folder as well. Please help reset my account password.",
        submittedBy: "Lisa Anderson",
        email: "lisa.a@example.com",
        categoryId: categoryIds[2] || categoryIds[0], // Account & Access
        priority: "sedang" as const,
        status: "ditutup" as const,
        source: "web" as const,
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        assignedTo: "admin-002",
        firstResponseAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        resolvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        closedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(6),
        subject: "How to access shared drive?",
        description:
          "I'm new to the team and need access to the department shared drive. What are the steps to get access?",
        submittedBy: "David Kumar",
        email: "david.kumar@example.com",
        phone: "+62 824 3333 4444",
        categoryId: categoryIds[3] || categoryIds[0], // General Inquiry
        priority: "rendah" as const,
        status: "selesai" as const,
        source: "web" as const,
        ipAddress: "192.168.1.106",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        assignedTo: "admin-001",
        firstResponseAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        resolvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        id: nanoid(),
        ticketNumber: generateTicketNumber(7),
        subject: "Computer keeps freezing",
        description:
          "My workstation freezes randomly throughout the day. Have to force restart 3-4 times daily. It's affecting my productivity significantly.",
        submittedBy: "Emily Rodriguez",
        email: "emily.r@example.com",
        phone: "+62 825 9999 0000",
        categoryId: categoryIds[0] || categoryIds[0], // Technical Support
        priority: "urgent" as const,
        status: "terbuka" as const,
        source: "web" as const,
        ipAddress: "192.168.1.107",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    ];

    // Insert tickets
    await db.insert(tickets).values(dummyTickets);
    console.log(`✅ Created ${dummyTickets.length} tickets`);

    // Create replies for some tickets
    const ticketRepliesData = [
      // Replies for ticket 0 (dalam_progress)
      {
        id: nanoid(),
        ticketId: dummyTickets[0].id,
        message:
          "Thank you for contacting support. I've checked your account and it appears to be locked due to multiple failed login attempts. I'm resetting it now.",
        authorId: "admin-001",
        authorName: "Support Agent Alice",
        authorEmail: "alice@support.com",
        isStaffReply: true,
        isInternal: false,
        ipAddress: "192.168.1.10",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: nanoid(),
        ticketId: dummyTickets[0].id,
        message:
          "Thank you! I can access my account now. Really appreciate the quick response!",
        authorId: "customer-001",
        authorName: "John Doe",
        authorEmail: "john.doe@example.com",
        isStaffReply: false,
        isInternal: false,
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 90 * 60 * 1000),
      },

      // Replies for ticket 1 (menunggu_jawaban)
      {
        id: nanoid(),
        ticketId: dummyTickets[1].id,
        message:
          "I've checked the printer logs remotely. Can you please open the rear panel and check if there's any paper debris? Also, please send me a photo of the error screen.",
        authorId: "admin-001",
        authorName: "Support Agent Alice",
        authorEmail: "alice@support.com",
        isStaffReply: true,
        isInternal: false,
        ipAddress: "192.168.1.10",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },

      // Replies for ticket 3 (selesai)
      {
        id: nanoid(),
        ticketId: dummyTickets[3].id,
        message:
          "I've installed Adobe Photoshop CC 2024 on your workstation. Please restart your computer and you should see it in your applications.",
        authorId: "admin-002",
        authorName: "Support Agent Bob",
        authorEmail: "bob@support.com",
        isStaffReply: true,
        isInternal: false,
        ipAddress: "192.168.1.11",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: nanoid(),
        ticketId: dummyTickets[3].id,
        message: "Perfect! It's working now. Thank you so much!",
        authorId: "customer-003",
        authorName: "Sarah Johnson",
        authorEmail: "sarah.j@example.com",
        isStaffReply: false,
        isInternal: false,
        ipAddress: "192.168.1.103",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },

      // Replies for ticket 4 (dalam_progress)
      {
        id: nanoid(),
        ticketId: dummyTickets[4].id,
        message:
          "Error 809 is usually caused by firewall settings. Can you try disabling your firewall temporarily to see if that resolves the issue?",
        authorId: "admin-001",
        authorName: "Support Agent Alice",
        authorEmail: "alice@support.com",
        isStaffReply: true,
        isInternal: false,
        ipAddress: "192.168.1.10",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: nanoid(),
        ticketId: dummyTickets[4].id,
        message:
          "I disabled the firewall but still getting the same error. What should I try next?",
        authorId: "customer-004",
        authorName: "Michael Chen",
        authorEmail: "michael.chen@example.com",
        isStaffReply: false,
        isInternal: false,
        ipAddress: "203.0.113.45",
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },

      // Replies for ticket 5 (ditutup)
      {
        id: nanoid(),
        ticketId: dummyTickets[5].id,
        message:
          "I've manually reset your password and sent the temporary password to your recovery email. Please check and let me know if you received it.",
        authorId: "admin-002",
        authorName: "Support Agent Bob",
        authorEmail: "bob@support.com",
        isStaffReply: true,
        isInternal: false,
        ipAddress: "192.168.1.11",
        createdAt: new Date(Date.now() - 46 * 60 * 60 * 1000),
      },
      {
        id: nanoid(),
        ticketId: dummyTickets[5].id,
        message:
          "Got it! Successfully logged in. Thanks for your help. You can close this ticket.",
        authorId: "customer-005",
        authorName: "Lisa Anderson",
        authorEmail: "lisa.a@example.com",
        isStaffReply: false,
        isInternal: false,
        ipAddress: "192.168.1.105",
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      },

      // Replies for ticket 6 (selesai)
      {
        id: nanoid(),
        ticketId: dummyTickets[6].id,
        message:
          "Welcome to the team! I've granted you access to the shared drive. You can access it at \\\\server\\shared\\department. Let me know if you have any issues.",
        authorId: "admin-001",
        authorName: "Support Agent Alice",
        authorEmail: "alice@support.com",
        isStaffReply: true,
        isInternal: false,
        ipAddress: "192.168.1.10",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
      {
        id: nanoid(),
        ticketId: dummyTickets[6].id,
        message: "Perfect! I can access it now. Thank you!",
        authorId: "customer-006",
        authorName: "David Kumar",
        authorEmail: "david.kumar@example.com",
        isStaffReply: false,
        isInternal: false,
        ipAddress: "192.168.1.106",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ];

    // Insert replies
    await db.insert(ticketReplies).values(ticketRepliesData);
    console.log(`✅ Created ${ticketRepliesData.length} ticket replies`);

    console.log("✅ Seeding completed successfully!");
    console.log(
      `\n📊 Summary:\n   - ${dummyTickets.length} tickets created\n   - ${ticketRepliesData.length} replies created\n`
    );
  } catch (error) {
    console.error("❌ Error seeding tickets:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedTickets();
