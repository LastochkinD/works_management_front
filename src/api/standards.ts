import apiClient from './http'
import type { PaginatedResponse } from './brands'
import type { Work, WorkStandard } from './works'

export interface WorkStandardItem {
  id: number
  work_id: number
  brand_id?: number | null
  model_id?: number | null
  generation_id?: number | null
  series_id?: number | null
  modification_id?: number | null
  value: number
  level: 'global' | 'brand' | 'model' | 'generation' | 'series' | 'modification'
  work?: Work
  brand?: { id: number; name: string }
  model?: { id: number; name: string }
  generation?: { id: number; name: string }
  series?: { id: number; name: string }
  modification?: { id: number; name: string }
}

export default {
  getAll(params?: { 
    work_id?: number; 
    brand_id?: number;
    page?: number; 
    pageSize?: number 
  }): Promise<PaginatedResponse<WorkStandardItem>> {
    return apiClient.get('/work-standards', { params })
  },
  
  getById(id: number): Promise<WorkStandardItem> {
    return apiClient.get(`/work-standards/${id}`)
  },
  
  create(data: Partial<WorkStandardItem>): Promise<WorkStandardItem> {
    return apiClient.post('/work-standards', data)
  },
  
  update(id: number, data: Partial<WorkStandardItem>): Promise<WorkStandardItem> {
    return apiClient.put(`/work-standards/${id}`, data)
  },
  
  remove(id: number): Promise<void> {
    return apiClient.delete(`/work-standards/${id}`)
  },
  
  resolve(params: {
    work_id: number
    brand_id?: number
    model_id?: number
    generation_id?: number
    series_id?: number
    modification_id?: number
  }): Promise<{
    standard: WorkStandardItem
    work: Work
  } | null> {
    return apiClient.get('/work-standards/resolve', { params })
  }
}