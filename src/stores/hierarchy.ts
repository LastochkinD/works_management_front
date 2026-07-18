import { defineStore } from 'pinia'
import { brands, models, generations, series, modifications, utils } from '@/api'
import type { Brand, Model, Generation, Series, Modification, EntityChain } from '@/api'

export const useHierarchyStore = defineStore('hierarchy', {
  state: () => ({
    brands: [] as Brand[],
    models: [] as Model[],
    generations: [] as Generation[],
    series: [] as Series[],
    modifications: [] as Modification[],
    loading: false as boolean
  }),

  getters: {
    brandById: (state) => (id: number) => state.brands.find(b => b.id === id),
    modelById: (state) => (id: number) => state.models.find(m => m.id === id),
    generationById: (state) => (id: number) => state.generations.find(g => g.id === id),
    seriesById: (state) => (id: number) => state.series.find(s => s.id === id),
    modificationById: (state) => (id: number) => state.modifications.find(m => m.id === id)
  },

  actions: {
    async fetchBrands() {
      this.loading = true
      try {
        const response = await brands.getAll()
        this.brands = response.items || []
      } catch (error) {
        console.error('Failed to fetch brands:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchModels(brandId: number) {
      this.loading = true
      this.models = []
      this.generations = []
      this.series = []
      this.modifications = []
      
      try {
        const response = await models.getAll({ brand_id: brandId })
        this.models = response.items || []
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchGenerations(modelId: number) {
      this.loading = true
      this.generations = []
      this.series = []
      this.modifications = []
      
      try {
        const response = await generations.getAll({ model_id: modelId })
        this.generations = response.items || []
      } catch (error) {
        console.error('Failed to fetch generations:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSeries(generationId: number) {
      this.loading = true
      this.series = []
      this.modifications = []
      
      try {
        const response = await series.getAll({ generation_id: generationId })
        this.series = response.items || []
      } catch (error) {
        console.error('Failed to fetch series:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchModifications(seriesId: number) {
      this.loading = true
      this.modifications = []
      
      try {
        const response = await modifications.getAll({ series_id: seriesId })
        this.modifications = response.items || []
      } catch (error) {
        console.error('Failed to fetch modifications:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchEntityChain(params: {
      modification_id?: number
      series_id?: number
      generation_id?: number
      model_id?: number
      brand_id?: number
    }): Promise<EntityChain> {
      try {
        return await utils.getEntityChain(params)
      } catch (error) {
        console.error('Failed to fetch entity chain:', error)
        return {}
      }
    },

    reset() {
      this.models = []
      this.generations = []
      this.series = []
      this.modifications = []
    }
  }
})

export default useHierarchyStore