import { requireSession } from '@main/src/session'

export async function apiGetFinanceSetting(key: string) {
  const apiClient = await requireSession()
  try {
    const { response, data } = await apiClient.GET(`/api/finances/settings/${key}/` as any, {})
    if (response.status === 200) return (data as any).value
    return undefined
  } catch (error) {
    console.error('apiGetFinanceSetting error:', error)
    return undefined
  }
}

export async function apiSetFinanceSetting(key: string, value: any) {
  const apiClient = await requireSession()
  try {
    // Check if it exists first to decide between PUT and POST, 
    // or just try to update and if 404, create.
    // ViewSet usually supports both if configured, but let's be explicit.
    const { response: checkResponse, data: checkData } = await apiClient.GET(`/api/finances/settings/${key}/` as any, {})

    if (checkResponse.status === 200 && (checkData as any)?.value !== null) {
        const { response } = await apiClient.PUT(`/api/finances/settings/${key}/` as any, {
            body: { key, value }
        })
        return response.status === 200
    } else {
        const { response } = await apiClient.POST('/api/finances/settings/' as any, {
            body: { key, value }
        })
        return response.status === 201
    }
  } catch (error) {
    console.error('apiSetFinanceSetting error:', error)
    return false
  }
}