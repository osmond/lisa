// prisma/seed.ts
import { PrismaClient, CareEventType } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const snake = await prisma.plant.create({
    data: {
      name: 'Snake Plant',
      species: 'Sansevieria trifasciata',
      imageUrl: 'https://source.unsplash.com/featured/?snake%20plant',
      createdAt: new Date(),
    },
  })
  const pothos = await prisma.plant.create({
    data: {
      name: 'Pothos',
      species: 'Epipremnum aureum',
      imageUrl: 'https://source.unsplash.com/featured/?pothos',
      createdAt: new Date(),
    },
  })

  await prisma.careEvent.createMany({
    data: [
      { plantId: snake.id, type: CareEventType.WATER, date: new Date() },
      { plantId: snake.id, type: CareEventType.FERTILIZE, date: new Date() },
      { plantId: pothos.id, type: CareEventType.WATER, date: new Date() },
      { plantId: pothos.id, type: CareEventType.REPOT, date: new Date() },
    ],
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
