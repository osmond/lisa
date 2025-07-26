// prisma/seed.ts
import { PrismaClient, CareEventType } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  if (process.env.SEED_EXAMPLE_DATA !== 'true') {
    console.log('Skipping example seed data')
    return
  }
  const user = await prisma.user.create({ data: { email: 'user@example.com' } })
  const room = await prisma.room.create({ data: { name: 'Living Room' } })
  const snake = await prisma.plant.create({
    data: {
      name: 'Snake Plant',
      species: 'Sansevieria trifasciata',
      imageUrl: 'https://source.unsplash.com/featured/?snake%20plant',
      createdAt: new Date(),
      ownerId: user.id,
      roomId: room.id,
    },
  })
  const pothos = await prisma.plant.create({
    data: {
      name: 'Pothos',
      species: 'Epipremnum aureum',
      imageUrl: 'https://source.unsplash.com/featured/?pothos',
      createdAt: new Date(),
      ownerId: user.id,
      roomId: room.id,
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
