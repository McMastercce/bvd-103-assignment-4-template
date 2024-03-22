import { z } from 'zod'
import { type ZodRouter } from 'koa-zod-router'
import { bookCollection } from '../database_access'
import { ObjectId } from 'mongodb'

export default function createOrUpdateBook (router: ZodRouter): void {
  router.register({
    name: 'create or update a book',
    method: 'post',
    path: '/books',
    validate: {
      body: z.object({
        id: z.string().optional(),
        name: z.string(),
        price: z.coerce.number(),
        description: z.string(),
        author: z.string(),
        image: z.string()
      })
    },
    handler: async (ctx, next) => {
      const body = ctx.request.body

      if (typeof body.id === 'string') {
        const id = body.id
        try {
          const result = await bookCollection.replaceOne({ _id: { $eq: ObjectId.createFromHexString(id) } }, {
            id,
            name: body.name,
            description: body.description,
            price: body.price,
            author: body.author,
            image: body.image
          })
          if (result.modifiedCount === 1) {
            ctx.body = { id }
          } else {
            ctx.statusCode = 404
          }
        } catch (e) {
          ctx.statusCode = 500
        }
      } else {
        try {
          const result = await bookCollection.insertOne({
            name: body.name,
            description: body.description,
            price: body.price,
            author: body.author,
            image: body.image
          })
          ctx.body = { id: result.insertedId }
        } catch (e) {
          ctx.statusCode = 500
        }
      }
      await next()
    }
  })
}
