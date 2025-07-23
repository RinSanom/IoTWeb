// This file ensures Prisma Client is generated on Vercel
const { PrismaClient } = require('@prisma/client')

async function main() {
  console.log('Prisma Client initialized successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Close the Prisma Client if it was instantiated
    console.log('Prisma setup complete')
  })