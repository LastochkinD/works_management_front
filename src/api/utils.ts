import apiClient from './http'

export interface EntityChain {
  brand?: { id: number; name: string }
  model?: { id: number; name: string }
  generation?: { id: number; name: string }
  series?: { id: number; name: string }
  modification?: { id: number; name: string }
}

export default {
  getEntityChain(params: {
    modification_id?: number
    series_id?: number
    generation_id?: number
    model_id?: number
    brand_id?: number
  }): Promise<EntityChain> {
    return apiClient.get('/utils/entity-chain', { params })
  }
}