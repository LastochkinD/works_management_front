import apiClient from './http'
import type { PaginatedResponse } from './brands'

export interface Model {
  id: number
  brand_id: number
  name: string
  created_at?: string
  updated_at?: string
  brand?: { id: number; name: string }
}

export default {
  getAll(params?: { brand_id?: number; page?: number; pageSize?: number; name?: string }): Promise<PaginatedResponse<Model>> {
    return apiClient.get('/models', { params })
  },
  
  getById(id: number, expand?: boolean): Promise<Model> {
    const params = expand ? { params: { expand: 'generations' } } : {}
    return apiClient.get(`/models/${id}`, params)
  },
  
  create(data: Partial<Model>): Promise<Model> {
    return apiClient.post('/models', data)
  },
  
  update(id: number, data: Partial<Model>): Promise<Model> {
    return apiClient.put(`/models/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/models/${id}`)
  }
}