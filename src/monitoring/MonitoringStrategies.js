import pidusage from 'pidusage'
import { IMonitoringStrategy, TimelinePoint } from '../core/interfaces/Types.js'

/**
 * High-precision process monitoring strategy
 * Implements Single Responsibility Principle - only handles process monitoring
 */
export class ProcessMonitoringStrategy extends IMonitoringStrategy {
  constructor(interval = 50) {
    super()
    this.interval = interval
  }

  /**
   * Monitor a process and collect performance data
   * @param {number} pid - Process ID to monitor
   * @param {number} maxDuration - Maximum monitoring duration in ms
   * @param {Function} onData - Callback for each data point
   * @returns {Promise<Array>} Timeline data
   */
  async monitor(pid, maxDuration, onData = null) {
    const timeline = []
    const startTime = Date.now()
    let totalCpu = 0
    let totalMemory = 0
    let samples = 0

    return new Promise((resolve, reject) => {
      const monitoringInterval = setInterval(async () => {
        try {
          const currentTime = Date.now()
          const elapsedTime = currentTime - startTime

          if (elapsedTime >= maxDuration) {
            clearInterval(monitoringInterval)
            resolve({
              timeline,
              avgCpuUsage: samples > 0 ? totalCpu / samples : 0,
              avgMemoryUsage: samples > 0 ? totalMemory / samples : 0,
              samples
            })
            return
          }

          // Get process stats
          const stats = await pidusage(pid)
          const timeSeconds = elapsedTime / 1000
          const memoryMB = stats.memory / (1024 * 1024)

          // Create timeline point
          const point = new TimelinePoint(timeSeconds, stats.cpu, memoryMB)
          timeline.push(point)

          // Update totals
          totalCpu += stats.cpu
          totalMemory += memoryMB
          samples++

          // Call callback if provided
          if (onData) {
            onData(stats.cpu, memoryMB)
          }

        } catch (error) {
          if (error.code === 'ESRCH') {
            // Process finished
            clearInterval(monitoringInterval)
            resolve({
              timeline,
              avgCpuUsage: samples > 0 ? totalCpu / samples : 0,
              avgMemoryUsage: samples > 0 ? totalMemory / samples : 0,
              samples
            })
          } else {
            clearInterval(monitoringInterval)
            reject(error)
          }
        }
      }, this.interval)
    })
  }
}

/**
 * Mock monitoring strategy for testing
 */
export class MockMonitoringStrategy extends IMonitoringStrategy {
  constructor(mockData = []) {
    super()
    this.mockData = mockData
  }

  async monitor(pid, maxDuration, onData = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timeline = this.mockData.map((point, index) => 
          new TimelinePoint(index * 0.1, point.cpu, point.memory)
        )
        
        const avgCpu = this.mockData.reduce((sum, p) => sum + p.cpu, 0) / this.mockData.length
        const avgMemory = this.mockData.reduce((sum, p) => sum + p.memory, 0) / this.mockData.length
        
        resolve({
          timeline,
          avgCpuUsage: avgCpu,
          avgMemoryUsage: avgMemory,
          samples: this.mockData.length
        })
      }, 100)
    })
  }
}
