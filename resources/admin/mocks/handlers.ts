import { http, HttpResponse } from 'msw'
import { mockDashboardSummary } from './data/dashboard'
import { mockOrders, type MockOrder } from './data/orders'
import { mockProducts } from './data/products'
import { mockCustomers } from './data/customers'
import { mockAnalyticsSummary } from './data/analytics'

export const handlers = [
  // Dashboard
  http.get('/api/dashboard/summary', () => {
    return HttpResponse.json(mockDashboardSummary)
  }),

  // Orders
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const status = url.searchParams.get('status')
    const paymentStatus = url.searchParams.get('payment_status')
    const fulfillmentType = url.searchParams.get('fulfillment_type')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    let filtered = [...mockOrders]

    if (status) {
      filtered = filtered.filter((o) => o.status === status)
    }
    if (paymentStatus) {
      filtered = filtered.filter((o) => o.paymentStatus === paymentStatus)
    }
    if (fulfillmentType) {
      filtered = filtered.filter((o) => o.fulfillmentType === fulfillmentType)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginated = filtered.slice(start, end)

    // Return format: { data, total, page, pageSize } - adapter supports this format
    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const order = mockOrders.find((o) => o.id === params.id)
    if (!order) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(order)
  }),

  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    const body = await request.json() as { status: string }
    const order = mockOrders.find((o) => o.id === params.id)
    if (!order) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }
    order.status = body.status as MockOrder['status']
    order.updatedAt = new Date().toISOString()
    return HttpResponse.json(order)
  }),

  // Fulfillment
  http.get('/api/fulfillment/queues', () => {
    const toPack = mockOrders.filter((o) => o.status === 'confirmed')
    const toShip = mockOrders.filter((o) => o.status === 'processing' && o.fulfillmentType === 'shipping')
    const toPickup = mockOrders.filter((o) => o.status === 'processing' && o.fulfillmentType === 'pickup')

    return HttpResponse.json({
      toPack: toPack.map((o) => ({ ...o, queueType: 'toPack' })),
      toShip: toShip.map((o) => ({ ...o, queueType: 'toShip' })),
      toPickup: toPickup.map((o) => ({ ...o, queueType: 'toPickup' })),
    })
  }),

  // Products
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const lowStock = url.searchParams.get('lowStock') === 'true'
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    let filtered = [...mockProducts]
    if (lowStock) {
      filtered = filtered.filter((p) => p.stock <= p.lowStockThreshold)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginated = filtered.slice(start, end)

    // Return format: { data, total, page, pageSize } - adapter supports this format
    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.patch('/api/products/:id/stock', async ({ params, request }) => {
    const body = await request.json() as { stock: number }
    const product = mockProducts.find((p) => p.id === params.id)
    if (!product) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }
    product.stock = body.stock
    return HttpResponse.json(product)
  }),

  // Customers
  http.get('/api/customers', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginated = mockCustomers.slice(start, end)

    // Return format: { data, total, page, pageSize } - adapter supports this format
    return HttpResponse.json({
      data: paginated,
      total: mockCustomers.length,
      page,
      pageSize,
    })
  }),

  // Analytics
  http.get('/api/analytics/summary', () => {
    return HttpResponse.json(mockAnalyticsSummary)
  }),
]
