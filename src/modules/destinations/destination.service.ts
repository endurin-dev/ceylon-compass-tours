import { prisma } from "@/lib/prisma";
import { createDestinationSchema } from "./destination.validation";

export async function createDestination(input: unknown) {
  const data = createDestinationSchema.parse(input);
  return prisma.destination.create({
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
    },
  });
}
