import apiClient from './http'
import type { PaginatedResponse } from './brands'

export interface Modification {
  id: number
  series_id: number
  name: string
  created_at?: string
  updated_at?: string
  series?: { id: number; name: string; generation_id: number }
}

export interface ModificationsResponse {
  success: boolean
  data: Modification[]
}

export default {
  async getAll(params?: { series_id?: number; page?: number; pageSize?: number; name?: string }): Promise<PaginatedResponse<Modification>> {
    const response = await apiClient.get<ModificationsResponse>('/modifications', { params }) as unknown as ModificationsResponse
    const items = response.data || []
    return {
      items,
      total: items.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || items.length || 50
    }
  },
  
  getById(id: number): Promise<Modification> {
    return apiClient.get(`/modifications/${id}`)
  },
  
  create(data: Partial<Modification>): Promise<Modification> {
    return apiClient.post('/modifications', data)
  },
  
  update(id: number, data: Partial<Modification>): Promise<Modification> {
    return apiClient.put(`/modifications/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/modifications/${id}`)
  }
}