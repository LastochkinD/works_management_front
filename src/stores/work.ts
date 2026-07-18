import { defineStore } from 'pinia'
import { works } from '@/api'
import type { Work, PaginatedResponse } from '@/api'

export const useWorkStore = defineStore('work', {
  state: () => ({
    works: [] as Work[],
    currentWork: null as Work | null,
    loading: false as boolean,
    pagination: {
      page: 1,
      pageSize: 50,
      total: 0
    }
  }),

  getters: {
    getById: (state) => (id: number) => state.works.find(w => w.id === id)
  },

  actions: {
    async fetchAll(params?: { code?: string; name?: string; page?: number; pageSize?: number }) {
      this.loading = true
      try {
        const response = await works.getAll(params)
        this.works = response.items || []
        this.pagination = {
          page: response.page || 1,
          pageSize: response.pageSize || 50,
          total: response.total || 0
        }
      } catch (error) {
        console.error('Failed to fetch works:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: number) {
      this.loading = true
      try {
        this.currentWork = await works.getById(id, true)
      } catch (error) {
        console.error('Failed to fetch work:', error)
      } finally {
        this.loading = false
      }
    },

    async create(data: Partial<Work>) {
      this.loading = true
      try {
        const work = await works.create(data)
        this.works.unshift(work)
        return work
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async update(id: number, data: Partial<Work>) {
      this.loading = true
      try {
        const updatedWork = await works.update(id, data)
        const index = this.works.findIndex(w => w.id === id)
        if (index !== -1) {
          this.works[index] = updatedWork
        }
        this.currentWork = updatedWork
        return updatedWork
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async remove(id: number) {
      this.loading = true
      try {
        await works.remove(id)
        this.works = this.works.filter(w => w.id !== id)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.currentWork = null
      this.works = []
      this.pagination = {
        page: 1,
        pageSize: 50,
        total: 0
      }
    }
  }
})

export default useWorkStore