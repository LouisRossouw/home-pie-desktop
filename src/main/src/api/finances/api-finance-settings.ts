import { requireSession } from '@main/src/session'

export async function apiGetAllFinanceSettings() {
  const apiClient = await requireSession()
  try {
    const { response, data } = await apiClient.GET('/api/finances/settings/' as any, {})
    if (response.status === 200) {
      return (data as any[]).reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, any>)
    }
    return {}
  } catch (error) {
    console.error('apiGetAllFinanceSettings error:', error)
    return {}
  }
}
