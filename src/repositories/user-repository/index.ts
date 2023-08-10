import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function findByGithubId(githubId: string) {
  return prisma.user.findUnique({
    where: {
      githubId
    }
  })
}

async function createGithubUser(email: string, githubId: string){
  return prisma.user.create({
    data: {
      email,
      githubId
    }
  })
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

const userRepository = {
  findByEmail,
  findByGithubId,
  createGithubUser,
  create,
};

export default userRepository;
