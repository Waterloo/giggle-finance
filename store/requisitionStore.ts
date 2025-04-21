import { defineStore, acceptHMRUpdate } from 'pinia'

export interface JobsList {
  success: boolean;
  message: string;
  result: {
    jobs: Job[];
  }
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


export interface Job {
  id: number;
  jobType: string;
  date: string;
  startTime: string;
  endTime: string;
  slotsCount: number;
  latestBasePay: string;
  isSigned: boolean;
  createdAt: Date;
  updatedAt: Date;
  profilePicturesURLs: string[];
}


export const useRequisitionStore = defineStore('requisitionStore', () => {
  const requisitions = ref<Job[]>([])
  const currentRequisition = ref<Requisition | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRequisitions = async (date: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<JobsList>('https://giggle-api.giggleappdevop.workers.dev/api/v1/job', {
        method: 'GET',
        params: {
          date,
          page: currentPage.value,
          limit: itemsPerPage.value
        }
      })
      requisitions.value = response.result.jobs
      totalCount.value = response.pagination.totalItems
      currentPage.value = response.pagination.currentPage
      itemsPerPage.value = response.pagination.itemsPerPage
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const getRequisitionById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<RequisitionDetailResponse>(`/api/requisition/${id}`, {
        method: 'GET'
      })
      if (response.success) {
        currentRequisition.value = response
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const createRequisition = async (requisition: RequisitionRequest) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<RequisitionDetailResponse>('/api/requisition', {
        method: 'POST',
        body: requisition
      })
      if (response.success) {
        await fetchRequisitions(requisition.eventDate)
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  return {
    requisitions,
    currentRequisition,
    totalCount,
    currentPage,
    itemsPerPage,
    loading,
    error,
    fetchRequisitions,
    getRequisitionById,
    createRequisition,
  }
})

// Enable hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRequisitionStore, import.meta.hot))
}