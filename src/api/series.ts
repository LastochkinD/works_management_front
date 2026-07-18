import apiClient from './http'
import type { PaginatedResponse } from './brands'

export interface Series {
  id: number
  generation_id: number
  name: string
  created_at?: string
  updated_at?: string
  generation?: { id: number; name: string; model_id: number }
}

export default {
  getAll(params?: { generation_id?: number; page?: number; pageSize?: number; name?: string }): Promise<PaginatedResponse<Series>> {
    return apiClient.get('/series', { params })
  },
  
  getById(id: number, expand?: boolean): Promise<Series> {
    const params = expand ? { params: { expand: 'modifications' } } : {}
    return apiClient.get(`/series/${id}`, params)
  },
  
  create(data: Partial<Series>): Promise<Series> {
    return apiClient.post('/series', data)
  },
  
  update(id: number, data: Partial<Series>): Promise<Series> {
    return apiClient.put(`/series/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/series/${id}`)
  }
}