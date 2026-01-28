import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";

interface MulterFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const uploadTosupabase = async (
  file: MulterFile,
  folder: string,
  userId: string,
): Promise<string> => {
  const filePath = `${folder}/${userId}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(env.supabaseBucket as string)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(env.supabaseBucket as string)
    .getPublicUrl(filePath);
  return data.publicUrl;
};
