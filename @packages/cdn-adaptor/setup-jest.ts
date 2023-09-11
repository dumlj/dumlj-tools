import { server } from '@dumlj/mock-server-lib'

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
