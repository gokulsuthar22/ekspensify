import { PrismaClient } from '@prisma/client';
import { categories } from './data/categories';
import { customCategoryIcons } from './data/custom-category-icons';
import { media } from './data/media';
import { users } from './data/users';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({ data: users as any });
  await prisma.media.createMany({ data: media as any });
  await Promise.all([
    prisma.category.createMany({ data: categories as any }),
    prisma.customCategoryIcon.createMany({ data: customCategoryIcons as any }),
  ]);
  console.log('Data seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
