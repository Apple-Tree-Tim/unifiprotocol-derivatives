import { useContext, useMemo } from 'react'
import { LoadingContext } from 'Stores/Loading/LoadingProvider'

export const useLoading = () => {
  const {
    state: { loading, totalRequests }
  } = useContext(LoadingContext)

  const isLoading = useMemo(() => {
    return loading !== totalRequests
  }, [loading, totalRequests])

  return {
    loading,
    totalRequests,
    isLoading
  }
}
