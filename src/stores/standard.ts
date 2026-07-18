import { defineStore } from 'pinia'
import { standards } from '@/api'
import type { WorkStandardItem, PaginatedResponse } from '@/api'

export const useStandardStore = defineStore('standard', {
  state: () => ({
    standards: [] as WorkStandardItem[],
    currentStandard: null as WorkStandardItem | null,
    loading: false as boolean,
    pagination: {
      page: 1,
      pageSize: 50,
      total: 0
    }
  }),

  getters: {
    getById: (state) => (id: number) => state.standards.find(s => s.id === id)
  },

  actions: {
    async fetchAll(params?: { 
      work_id?: number; 
      brand_id?: number;
      page?: number; 
      pageSize?: number 
    }) {
      this.loading = true
      try {
        const response = await standards.getAll(params)
        this.standards = response.items || []
        this.pagination = {
          page: response.page || 1,
          pageSize: response.pageSize || 50,
          total: response.total || 0
        }
      } catch (error) {
        console.error('Failed to fetch standards:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: number) {
      this.loading = true
      try {
        this.currentStandard = await standards.getById(id)
      } catch (error) {
        console.error('Failed to fetch standard:', error)
      } finally {
        this.loading = false
      }
    },

    async create(data: Partial<WorkStandardItem>) {
      this.loading = true
      try {
        const standard = await standards.create(data)
        this.standards.unshift(standard)
        return standard
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async update(id: number, data: Partial<WorkStandardItem>) {
      this.loading = true
      try {
        const updatedStandard = await standards.update(id, data)
        const index = this.standards.findIndex(s => s.id === id)
        if (index !== -1) {
          this.standards[index] = updatedStandard
        }
        this.currentStandard = updatedStandard
        return updatedStandard
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async remove(id: number) {
      this.loading = true
      try {
        await standards.remove(id)
        this.standards = this.standards.filter(s => s.id !== id)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async resolve(params: {
      work_id: number
      brand_id?: number
      model_id?: number
      generation_id?: number
      series_id?: number
      modification_id?: number
    }) {
      this.loading = true
      try {
        const result = await standards.resolve(params)
        return result
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.currentStandard = null
      this.standards = []
      this.pagination = {
        page: 1,
        pageSize: 50,
        total: 0
      }
    }
  }
})

export default useStandardStore