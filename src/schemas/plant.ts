import { z } from 'zod'

export const plantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: z.string().optional().or(z.literal('')),
  species: z.string().optional(),
  lastWatered: z.string().optional(),
  nextWater: z.string().optional(),
  lastFertilized: z.string().optional(),
  nextFertilize: z.string().optional(),
  wateringFrequency: z.preprocess(v => (v === '' || v === null ? undefined : Number(v)), z.number().optional()),
  fertilizingFrequency: z.preprocess(v => (v === '' || v === null ? undefined : Number(v)), z.number().optional()),
  waterAmount: z.preprocess(v => (v === '' || v === null ? undefined : Number(v)), z.number().optional()),
  room: z.string().optional(),
  notes: z.string().optional(),
  careLevel: z.string().optional(),
  diameter: z.preprocess(v => (v === '' || v === null ? undefined : Number(v)), z.number().optional()),
  soil: z.string().optional(),
  light: z.string().optional(),
  humidity: z.preprocess(v => (v === '' || v === null ? undefined : Number(v)), z.number().optional()),
  carePlan: z.any().optional().nullable(),
  waterPlan: z
    .object({
      interval: z.number().optional(),
      volume_ml: z.number().optional(),
      volume_oz: z.number().optional(),
    })
    .optional()
    .nullable(),
})

export type PlantForm = z.infer<typeof plantSchema>
