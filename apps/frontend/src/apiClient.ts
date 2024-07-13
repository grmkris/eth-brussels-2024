import { createClient, type NormalizeOAS } from 'fets'
import type openapi from './openapi'

export const apiClient = createClient<NormalizeOAS<typeof openapi>>({
    endpoint: 'http://localhost:3001',
})