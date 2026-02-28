import { requireSession } from '@main/src/session'

export async function apiGetFinanceRecords() {
  const apiClient = await requireSession()
  try {
    const { response, data } = await apiClient.GET('/api/finances/records/' as any, {})
    if (response.status === 200) return data as any[]
    return []
  } catch (error) {
    console.error('apiGetFinanceRecords error:', error)
    return []
  }
}