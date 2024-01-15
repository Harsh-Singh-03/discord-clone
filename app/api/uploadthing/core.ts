import { createUploadthing, type FileRouter } from "uploadthing/next";
import { fetchUser } from "@/lib/auth-service";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imgfile: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    }
  })
    .middleware(async () => {
      const self = await fetchUser();
      if(!self || !self.success || !self.user) throw new Error('Unauthorized!!')

      return { user: self.user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    })
} satisfies FileRouter;
 
export type OurFileRouterr = typeof ourFileRouter;