import { AxiosInstance } from 'axios'

export class AxiosConcurrencyHandler {
  private maxRequests = 5
  private ttlInterval = 200
  private pendingRequests = 0

  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  setInterceptors() {
    this.axiosInstance.interceptors.request.use((config) => {
      return new Promise((resolve) => {
        let interval = setInterval(() => {
          if (this.pendingRequests < this.maxRequests) {
            this.pendingRequests++
            clearInterval(interval)
            resolve(config)
          }
        }, this.ttlInterval)
      })
    })

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1)
        return Promise.resolve(response)
      },
      (error) => {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1)
        return Promise.reject(error)
      }
    )
  }
}
