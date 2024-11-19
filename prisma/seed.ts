import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Shopping', type: 'DEBIT' },
  { name: 'Subscription', type: 'DEBIT' },
  { name: 'Salary', type: 'CREDIT' },
  { name: 'Food', type: 'DEBIT' },
  { name: 'Transportation', type: 'DEBIT' },
  { name: 'Entertainment', type: 'DEBIT' },
  { name: 'Groceries', type: 'DEBIT' },
  { name: 'Utilities', type: 'DEBIT' },
  { name: 'Health Care', type: 'DEBIT' },
  { name: 'Housing', type: 'DEBIT' },
  { name: 'Education', type: 'DEBIT' },
  { name: 'Travel', type: 'DEBIT' },
  { name: 'Insurance', type: 'CREDIT' },
  { name: 'Personal Care', type: 'DEBIT' },
  { name: 'Investments', type: null },
  { name: 'Refunds', type: null },
  { name: 'Bonuses', type: 'CREDIT' },
  { name: 'Interest Earned', type: 'CREDIT' },
  { name: 'Clothing', type: 'DEBIT' },
  { name: 'Fitness', type: 'DEBIT' },
  { name: 'Electronics', type: 'DEBIT' },
];

const users = [
  {
    name: 'Admin',
    email: 'user@admin.com',
    isVerified: true,
    role: 'ADMIN',
  },
  {
    name: 'User One',
    email: 'one@user.com',
    isVerified: true,
  },
  {
    name: 'User Two',
    email: 'two@user.com',
    isVerified: true,
  },
  {
    name: 'User Three',
    email: 'three@user.com',
    isVerified: true,
  },
];

async function main() {
  await Promise.all([
    prisma.category.createMany({
      data: categories.map((c) => {
        return {
          ...c,
          slug: `${c.name}-${c.type}`.toLowerCase().replace(/ /g, '-'),
          icon: 'ic_' + c.name.toLowerCase().replace(/ /g, '-'),
        } as any;
      }),
    }),
    prisma.user.createMany({
      data: users as any,
    }),
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
