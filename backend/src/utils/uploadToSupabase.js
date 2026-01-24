import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";

export const uploadTosupabase = async (file, folder, userId) => {
  const filePath = `${folder}/${userId}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(env.supabaseBucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(env.supabaseBucket)
    .getPublicUrl(filePath);
  return data.publicUrl;
};
