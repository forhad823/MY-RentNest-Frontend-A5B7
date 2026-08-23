"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export const revalidatePropertiesCache = async () => {
  revalidateTag("properties", {
    expire: 0,
  });
  revalidatePath("/");
  revalidatePath("/properties");
};



