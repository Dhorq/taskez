import { prisma } from "../../lib/prisma";

export const createUser = async (
  email: string,
  name: string,
  hashedPassword: string,
) => {
  return prisma.user.create({
    data: { email, name, password: hashedPassword },
    select: { id: true, email: true, name: true, createdAt: true },
  });
};
