import apiClient from './http'
import type { PaginatedResponse } from './brands'

export interface Generation {
  id: number
  model_id: number
  name: string
  created_at?: string
  updated_at?: string
  model?: { id: number; name: string; brand_id: number }
}

export default {
  getAll(params?: { model_id?: number; page?: number; pageSize?: number; name?: string }): Promise<PaginatedResponse<Generation>> {
    return apiClient.get('/generations', { params })
  },
  
  getById(id: number, expand?: boolean): Promise<Generation> {
    const params = expand ? { params: { expand: 'series' } } : {}
    return apiClient.get(`/generations/${id}`, params)
  },
  
  create(data: Partial<Generation>): Promise<Generation> {
    return apiClient.post('/generations', data)
  },
  
  update(id: number, data: Partial<Generation>): Promise<Generation> {
    return apiClient.put(`/generations/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/generations/${id}`)
  }
}