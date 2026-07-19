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

export interface GenerationsResponse {
  success: boolean
  data: Generation[]
}

export default {
  async getAll(params?: { model_id?: number; page?: number; pageSize?: number; name?: string }): Promise<PaginatedResponse<Generation>> {
    const response = await apiClient.get<GenerationsResponse>('/generations', { params }) as unknown as GenerationsResponse
    const items = response.data || []
    return {
      items,
      total: items.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || items.length || 50
    }
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