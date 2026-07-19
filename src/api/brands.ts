import apiClient from './http'

export interface Brand {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface BrandsResponse {
  success: boolean
  data: Brand[]
}

export default {
  async getAll(params?: { page?: number; pageSize?: number; name?: string }): Promise<PaginatedResponse<Brand>> {
    const response = await apiClient.get<BrandsResponse>('/brands', { params }) as unknown as BrandsResponse
    const items = response.data || []
    return {
      items,
      total: items.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || items.length || 50
    }
  },
  
  getById(id: number, expand?: boolean): Promise<Brand> {
    const params = expand ? { params: { expand: 'models' } } : {}
    return apiClient.get(`/brands/${id}`, params)
  },
  
  create(data: Partial<Brand>): Promise<Brand> {
    return apiClient.post('/brands', data)
  },
  
  update(id: number, data: Partial<Brand>): Promise<Brand> {
    return apiClient.put(`/brands/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/brands/${id}`)
  }
}