import { rest } from 'msw'
import type { setupServer } from 'msw/lib/node'
const config = {
  s3: {
    errorBucket: ['no-s3', 'no-data', 'no-origin'],
  },
  oss: {
    errorBucket: ['no-oss', 'no-data', 'no-origin'],
  },
}

export const cdnHandlers: Parameters<typeof setupServer> = [
  rest.get('https://s3.mock.dev/:bucket/:key', (req, res, ctx) => {
    const conf = config.s3

    if (conf.errorBucket.includes(req.params.bucket as string)) {
      return res(ctx.status(404))
    }
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        origin: 's3',
      })
    )
  }),
  rest.get('https://oss.mock.dev/:bucket/:key', (req, res, ctx) => {
    const conf = config.oss
    if (conf.errorBucket.includes(req.params.bucket as string)) {
      return res(ctx.status(404))
    }
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        origin: 'oss',
      })
    )
  }),
  rest.get('https://origin.mock.dev/:bucket/:key', (req, res, ctx) => {
    if (req.params.bucket.includes('no-origin')) {
      return res(ctx.status(404))
    }
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        origin: 'origin',
      })
    )
  }),
]
