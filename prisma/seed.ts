// prisma/seed.ts
import pkg from '@prisma/client'
import fs from 'fs'
import path from 'path'
const { PrismaClient, CareEventType } = pkg
const prisma = new PrismaClient()

async function main() {
  if (process.env.SEED_EXAMPLE_DATA !== 'true') {
    console.log('Skipping example seed data')
    return
  }
  const user = await prisma.user.create({ data: { email: 'user@example.com' } })
  const room = await prisma.room.create({ data: { name: 'Living Room' } })
  const file = path.join(process.cwd(), 'src', '__fixtures__', 'plants.json')
  const list = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const item of list) {
    await prisma.plant.create({
      data: {
        name: item.name,
        species: item.scientificName || undefined,
        imageUrl: item.image || undefined,
        ownerId: user.id,
        roomId: room.id,
        lastWatered: item.lastWatered ? new Date(item.lastWatered) : undefined,
        nextWater: item.nextWater ? new Date(item.nextWater) : undefined,
        lastFertilized: item.lastFertilized
          ? new Date(item.lastFertilized)
          : undefined,
        nextFertilize: item.nextFertilize
          ? new Date(item.nextFertilize)
          : undefined,
        wateringFrequency: item.waterPlan?.interval || undefined,
        waterAmount: item.waterPlan?.volume || undefined,
        notes: item.notes || undefined,
        carePlan: item.carePlan || undefined,
      },
    })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
