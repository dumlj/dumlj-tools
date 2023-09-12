import { rest } from 'msw'
import type { setupServer } from 'msw/lib/node'
const mockBody = {
  test: 1,
}
export const apiTestHandlers: Parameters<typeof setupServer> = [
  rest.get('http://localhost/api/test', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'success',
        data: mockBody,
      })
    )
  }),
]
