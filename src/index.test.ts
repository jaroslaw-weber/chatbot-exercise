import { Hono } from 'hono'
import { describe, it, expect } from 'bun:test'
import { app } from './index'

describe('Hello World', () => {
  it('responds with Hello World on GET /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello World!')
  })
})
