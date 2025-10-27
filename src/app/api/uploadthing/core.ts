import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  ticketAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 3 },
    text: { maxFileSize: "2MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      // Add authentication check here if needed
      return { userId: "user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
