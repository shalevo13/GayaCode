import pidusage from 'pidusage'
import { spawn } from 'child_process'
import { performance } from 'perf_hooks'
import fs from 'fs/promises'
import path from 'path'

/**
 * Advanced Environmental Analyzer for Node.js scripts
 * Provides comprehensive monitoring and environmental impact calculation
 */
export class EnvironmentalAnalyzer {
  constructor(options = {}) {
    this.emissionFactor = options.emissionFactor || 400 // g CO₂/kWh
    this.cpuPowerCoefficient = options.cpuPowerCoefficient || 0.00008 // kW per 1% CPU
    this.memoryPowerCoefficient = options.memoryPowerCoefficient || 0.0000003 // kW per MB
    this.maxExecutionTime = options.maxExecutionTime || 60000 // 60 seconds
    this.monitoringInterval = options.monitoringInterval || 50 // 50ms for high precision
  }

  /**
   * Analyze a Node.js script for environmental impact
   */
  async analyzeScript(scriptPath) {
    const startTime = performance.now()
    let childProcess = null
    const timeline = []
    let peakCpuUsage = 0
    let peakMemoryUsage = 0
    let totalCpuTime = 0
    let totalMemoryTime = 0
    let samples = 0

    try {
      // Validate script
      await fs.access(scriptPath)
      const scriptName = path.basename(scriptPath)
      
      // Start monitoring
      childProcess = spawn('node', [scriptPath], {
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'gayacode_analysis' }
      })

      // Monitor resources with high precision
      const monitoringPromise = this.monitorProcess(
        childProcess.pid,
        timeline,
        (cpu, memory) => {
          peakCpuUsage = Math.max(peakCpuUsage, cpu)
          peakMemoryUsage = Math.max(peakMemoryUsage, memory)
          totalCpuTime += cpu
          totalMemoryTime += memory
          samples++
        }
      )

      // Execute and capture output
      const executionResult = await this.executeWithTimeout(childProcess)
      await monitoringPromise

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Calculate comprehensive metrics
      const avgCpuUsage = samples > 0 ? totalCpuTime / samples : 0
      const avgMemoryUsage = samples > 0 ? totalMemoryTime / samples : 0
      
      const energyKwh = this.calculateEnergyConsumption(
        avgCpuUsage,
        avgMemoryUsage,
        executionTime
      )
      
      const co2Grams = energyKwh * this.emissionFactor

      // Generate comprehensive analysis
      return {
        success: true,
        timestamp: new Date().toISOString(),
        scriptName,
        scriptPath,
        metrics: {
          executionTime,
          peakCpuUsage,
          avgCpuUsage,
          peakMemoryUsage: peakMemoryUsage / (1024 * 1024), // Convert to MB
          avgMemoryUsage: avgMemoryUsage / (1024 * 1024),
          energyKwh,
          co2Grams,
          samples
        },
        timeline: this.processTimeline(timeline),
        scalingProjections: this.generateScalingProjections({ energyKwh, co2Grams }),
        equivalences: this.generateEquivalences({ energyKwh, co2Grams }),
        ecoScore: this.calculateEcoScore(energyKwh, executionTime, avgCpuUsage),
        output: {
          stdout: executionResult.stdout,
          stderr: executionResult.stderr,
          exitCode: executionResult.code
        },
        analysis: {
          emissionFactor: this.emissionFactor,
          cpuPowerCoefficient: this.cpuPowerCoefficient,
          memoryPowerCoefficient: this.memoryPowerCoefficient,
          monitoringInterval: this.monitoringInterval
        }
      }

    } catch (error) {
      if (childProcess && !childProcess.killed) {
        childProcess.kill('SIGTERM')
      }
      
      return {
        success: false,
        error: error.message,
        scriptName: path.basename(scriptPath),
        scriptPath,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Monitor process with high precision
   */
  async monitorProcess(pid, timeline, onSample) {
    return new Promise((resolve) => {
      const startTime = performance.now()
      
      const monitor = setInterval(async () => {
        try {
          const stats = await pidusage(pid)
          const timestamp = performance.now() - startTime
          
          const dataPoint = {
            timestamp,
            cpu: stats.cpu,
            memory: stats.memory,
            elapsed: stats.elapsed
          }
          
          timeline.push(dataPoint)
          onSample(stats.cpu, stats.memory)
          
        } catch (error) {
          clearInterval(monitor)
          resolve()
        }
      }, this.monitoringInterval)

      setTimeout(() => {
        clearInterval(monitor)
        resolve()
      }, this.maxExecutionTime + 1000)
    })
  }

  /**
   * Execute process with timeout handling
   */
  async executeWithTimeout(childProcess) {
    return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      childProcess.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      childProcess.on('close', (code) => {
        resolve({ code, stdout, stderr })
      })

      childProcess.on('error', (error) => {
        reject(error)
      })

      setTimeout(() => {
        if (childProcess && !childProcess.killed) {
          childProcess.kill('SIGTERM')
          reject(new Error(`Script execution timeout (${this.maxExecutionTime}ms)`))
        }
      }, this.maxExecutionTime)
    })
  }

  /**
   * Calculate energy consumption with improved accuracy
   */
  calculateEnergyConsumption(avgCpuUsage, avgMemoryBytes, executionTimeMs) {
    const executionTimeHours = executionTimeMs / (1000 * 60 * 60)
    const memoryMB = avgMemoryBytes / (1024 * 1024)
    
    // More sophisticated energy calculation
    const cpuEnergyKwh = (avgCpuUsage * this.cpuPowerCoefficient) * executionTimeHours
    const memoryEnergyKwh = (memoryMB * this.memoryPowerCoefficient) * executionTimeHours
    
    // Add base system overhead (estimated)
    const baseOverheadKwh = 0.0001 * executionTimeHours // 0.1W base overhead
    
    return cpuEnergyKwh + memoryEnergyKwh + baseOverheadKwh
  }

  /**
   * Process timeline data for visualization
   */
  processTimeline(timeline) {
    // Smooth data and add derived metrics
    return timeline.map((point, index) => ({
      ...point,
      memoryMB: point.memory / (1024 * 1024),
      timeSeconds: point.timestamp / 1000,
      // Add moving averages for smoother visualization
      cpuSmooth: index >= 2 ? 
        (timeline[index-2].cpu + timeline[index-1].cpu + point.cpu) / 3 : 
        point.cpu,
      memorySmooth: index >= 2 ? 
        (timeline[index-2].memory + timeline[index-1].memory + point.memory) / 3 : 
        point.memory
    }))
  }

  /**
   * Generate scaling projections
   */
  generateScalingProjections(baseMetrics) {
    const scales = [
      { label: '1K executions', scale: 1000, icon: '📦' },
      { label: '10K executions', scale: 10000, icon: '🏭' },
      { label: '100K executions', scale: 100000, icon: '🌆' },
      { label: '1M executions', scale: 1000000, icon: '🌍' }
    ]
    
    return scales.map(({ label, scale, icon }) => ({
      label,
      scale,
      icon,
      energyKwh: baseMetrics.energyKwh * scale,
      co2Grams: baseMetrics.co2Grams * scale,
      co2Kg: (baseMetrics.co2Grams * scale) / 1000,
      // Add time projections
      totalHours: (baseMetrics.energyKwh * scale) / 0.1, // Assuming 100W average
      yearlyImpact: {
        energy: baseMetrics.energyKwh * scale * 365,
        co2: baseMetrics.co2Grams * scale * 365
      }
    }))
  }

  /**
   * Generate environmental equivalences
   */
  generateEquivalences({ energyKwh, co2Grams }) {
    return {
      energy: {
        smartphoneCharges: {
          value: (energyKwh * 1000) / 15, // 15Wh per charge
          unit: 'phone charges',
          icon: '📱'
        },
        ledBulbHours: {
          value: (energyKwh * 1000) / 9, // 9W LED
          unit: 'hours of LED light',
          icon: '💡'
        },
        laptopMinutes: {
          value: (energyKwh * 1000 * 60) / 65, // 65W laptop
          unit: 'minutes of laptop use',
          icon: '💻'
        },
        coffeeBrewing: {
          value: (energyKwh * 1000) / 1000, // 1kW coffee machine
          unit: 'cups of coffee brewed',
          icon: '☕'
        }
      },
      co2: {
        carDistance: {
          value: co2Grams / 0.12, // 120g CO₂/km
          unit: 'meters driven by car',
          icon: '🚗'
        },
        treeAbsorption: {
          value: co2Grams / (22000 / (365 * 24 * 3600)), // 22kg CO₂/year per tree
          unit: 'seconds of tree absorption',
          icon: '🌳'
        },
        breathingTime: {
          value: co2Grams / (0.5 / 60), // 0.5g CO₂/minute exhaled
          unit: 'minutes of human breathing',
          icon: '🫁'
        },
        flights: {
          value: co2Grams / 90000, // 90kg CO₂ per hour of flight
          unit: 'seconds of commercial flight',
          icon: '✈️'
        }
      }
    }
  }

  /**
   * Calculate eco-score (0-100, higher is better)
   */
  calculateEcoScore(energyKwh, executionTime, avgCpuUsage) {
    // Scoring based on efficiency metrics
    const energyScore = Math.max(0, 100 - (energyKwh * 10000000)) // Scaled for typical script energy
    const timeScore = Math.max(0, 100 - (executionTime / 1000)) // Penalty for long execution
    const cpuScore = Math.max(0, 100 - avgCpuUsage) // Penalty for high CPU usage
    
    // Weighted average
    const score = (energyScore * 0.4 + timeScore * 0.3 + cpuScore * 0.3)
    
    return {
      overall: Math.min(100, Math.max(0, score)),
      breakdown: {
        energy: energyScore,
        time: timeScore,
        cpu: cpuScore
      },
      grade: this.getGrade(score)
    }
  }

  /**
   * Get letter grade from score
   */
  getGrade(score) {
    if (score >= 90) return { letter: 'A+', color: '#22c55e' }
    if (score >= 80) return { letter: 'A', color: '#16a34a' }
    if (score >= 70) return { letter: 'B', color: '#65a30d' }
    if (score >= 60) return { letter: 'C', color: '#ca8a04' }
    if (score >= 50) return { letter: 'D', color: '#ea580c' }
    return { letter: 'F', color: '#dc2626' }
  }
}
