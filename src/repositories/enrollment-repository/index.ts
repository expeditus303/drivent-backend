import { prisma } from "@/config";
import { Enrollment, Prisma } from "@prisma/client";
import { CreateAddressParams, UpdateAddressParams } from "../address-repository";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId }
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function createOrUpdateEnrollmentWithAddress(userId: number, createdEnrollment: CreateEnrollmentParams, updatedEnrollment: UpdateEnrollmentParams, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const enrollment = await tx.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
    });
    await tx.address.upsert({
      where: {
        enrollmentId: enrollment.id,
      },
      create: {
        ...createdAddress,
        Enrollment: { connect: { id: enrollment.id } },
      },
      update: updatedAddress,
    });
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findById,
  createOrUpdateEnrollmentWithAddress,
};

export default enrollmentRepository;
