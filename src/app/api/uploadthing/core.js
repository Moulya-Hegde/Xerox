import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req) => {
  return { id: "guest-user" };
};

export const ourFileRouter = {
 pdfUploader: f({
    pdf: {
      maxFileSize: "10MB",
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete (PDF):", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
};
