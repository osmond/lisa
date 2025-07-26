// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.plant.createMany({
    data: [
      {
        name: 'Snake Plant',
        species: 'Sansevieria trifasciata',
        // omit room if you haven’t modelled it
        imageUrl: 'https://source.unsplash.com/featured/?snake%20plant',
        createdAt: new Date(),
      },
      {
        name: 'Pothos',
        species: 'Epipremnum aureum',
        imageUrl: 'https://source.unsplash.com/featured/?pothos',
        createdAt: new Date(),
      },
      // …more plants as you like…
    ],
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
