import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import webhook from './routes/webhook.js'

const app = new Hono()

app.get('/', (c) => c.text('Finance Tracker Bot Running!'))
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }))
app.route('/webhook', webhook)

const port = Number(process.env.PORT) || 3000

serve({
  fetch: app.fetch,
  port,
})

console.log(`🚀 Server is running on http://localhost:${port}`)
console.log(`📊 Finance Tracker Bot ready!`)
