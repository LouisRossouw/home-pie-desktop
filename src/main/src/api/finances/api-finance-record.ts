import { requireSession } from '@main/src/session'

export async function apiGetFinanceRecord(month: number, year: number) {
  const apiClient = await requireSession()
  try {
    const { response, data } = await apiClient.GET('/api/finances/records/get_record/' as any, {
      params: { query: { month, year } }
    } as any)
    if (response.status === 200) return (data as any).value
    return undefined
  } catch (error) {
    console.error('apiGetFinanceRecord error:', error)
    return undefined
  }
}

export async function apiSetFinanceRecord(month: number, year: number, value: any) {
  const apiClient = await requireSession()
  try {
     // Search for existing record
     const { response: checkResponse, data: checkData } = await apiClient.GET('/api/finances/records/get_record/' as any, {
        params: { query: { month, year } }
     } as any)

     if (checkResponse.status === 200 && (checkData as any)?.value !== null) {
        const id = (checkData as any).id
        const { response } = await apiClient.PUT(`/api/finances/records/${id}/` as any, {
            body: { month, year, value }
        })
        return response.status === 200
     } else {
        const { response } = await apiClient.POST('/api/finances/records/' as any, {
            body: { month, year, value }
        })
        return response.status === 201
     }
  } catch (error) {
    console.error('apiSetFinanceRecord error:', error)
    return false
  }
}
