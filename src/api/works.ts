import apiClient from './http'
import type { PaginatedResponse } from './brands'

export interface Work {
  id: number
  code: string
  name: string
  created_at?: string
  updated_at?: string
  standards?: WorkStandard[]
}

export interface WorkStandard {
  id: number
  work_id: number
  brand_id?: number
  model_id?: number
  generation_id?: number
  series_id?: number
  modification_id?: number
  value: number
  level: string
  work?: Work
}

export default {
  getAll(params?: { code?: string; name?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<Work>> {
    return apiClient.get('/works', { params })
  },
  
  getById(id: number, expand?: boolean): Promise<Work> {
    const params = expand ? { params: { expand: 'standards' } } : {}
    return apiClient.get(`/works/${id}`, params)
  },
  
  create(data: Partial<Work>): Promise<Work> {
    return apiClient.post('/works', data)
  },
  
  update(id: number, data: Partial<Work>): Promise<Work> {
    return apiClient.put(`/works/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/works/${id}`)
  }
}