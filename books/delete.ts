import { z } from 'zod'
import { type ZodRouter } from 'koa-zod-router'
import { bookCollection } from '../database_access'
import { ObjectId } from 'mongodb'

export default function deleteBook (router: ZodRouter): void {
  router.register({
    name: 'delete a book',
    method: 'delete',
    path: '/books/:id',
    validate: {
      params: z.object({
        id: z.string()
      })
    },
    handler: async (ctx, next) => {
      const id = ctx.request.params.id
      const objectId = ObjectId.createFromHexString(id)
      const result = await bookCollection.deleteOne({ _id: { $eq: objectId } })
      if (result.deletedCount === 1) {
        ctx.body = {}
      } else {
        ctx.statusCode = 404
      }
      await next()
    }
  })
}
