import { spawn } from 'child_process'
import { performance } from 'perf_hooks'
import fs from 'fs/promises'
import path from 'path'
import { 
  AnalysisResult, 
  PerformanceMetrics, 
  AnalyzerConfig 
} from '../core/interfaces/Types.js'
import { ProcessMonitoringStrategy } from '../monitoring/MonitoringStrategies.js'
import { 
  EnergyCalculationStrategy,
  CO2CalculationStrategy,
  EcoScoreCalculationStrategy,
  EquivalencesCalculationStrategy,
  ScalingCalculationStrategy
} from '../calculations/CalculationStrategies.js'
import { validateFilePath } from '../utils/Formatters.js'

/**
 * Refactored Environmental Analyzer
 * Follows SOLID principles with dependency injection and strategy patterns
 */
export class EnvironmentalAnalyzer {
  constructor(options = {}, strategies = {}) {
    this.config = new AnalyzerConfig(options)
    this.config.validate()
    
    // Dependency injection for strategies (Open/Closed Principle)
    this.monitoringStrategy = strategies.monitoring || new ProcessMonitoringStrategy(this.config.monitoringInterval)
    this.energyCalculator = strategies.energy || new EnergyCalculationStrategy(this.config)
    this.co2Calculator = strategies.co2 || new CO2CalculationStrategy(this.config.emissionFactor)
    this.ecoScoreCalculator = strategies.ecoScore || new EcoScoreCalculationStrategy()
    this.equivalencesCalculator = strategies.equivalences || new EquivalencesCalculationStrategy()
    this.scalingCalculator = strategies.scaling || new ScalingCalculationStrategy()
  }

  /**
   * Analyze a Node.js script for environmental impact
   * @param {string} scriptPath - Path to the script to analyze
   * @returns {Promise<AnalysisResult>} Analysis results
   */
  async analyzeScript(scriptPath) {
    const startTime = performance.now()
    
    try {
      // Validate script path
      if (!(await validateFilePath(scriptPath))) {
        throw new Error(`Script not found: ${scriptPath}`)
      }

      const scriptName = path.basename(scriptPath)
      console.log(`🔍 Starting analysis of: ${scriptName}`)

      // Execute and monitor the script
      const executionResult = await this.executeAndMonitor(scriptPath)
      
      if (!executionResult.success) {
        return new AnalysisResult({
          success: false,
          error: executionResult.error,
          scriptName,
          scriptPath
        })
      }

      // Calculate environmental metrics
      const metrics = this.calculateMetrics(executionResult)
      
      // Calculate additional insights
      const ecoScore = this.ecoScoreCalculator.calculate({ 
        metrics, 
        executionTime: executionResult.executionTime 
      })
      
      const equivalences = this.equivalencesCalculator.calculate({
        energyKwh: metrics.energyKwh,
        co2Grams: metrics.co2Grams
      })
      
      const scalingProjections = this.scalingCalculator.calculate({
        energyKwh: metrics.energyKwh,
        co2Grams: metrics.co2Grams
      })

      const analysisTime = performance.now() - startTime
      console.log(`✅ Analysis completed in ${analysisTime.toFixed(0)}ms`)

      return new AnalysisResult({
        success: true,
        scriptName,
        scriptPath,
        metrics,
        timeline: executionResult.timeline,
        ecoScore,
        equivalences,
        scalingProjections,
        analysis: {
          emissionFactor: this.config.emissionFactor,
          cpuPowerCoefficient: this.config.cpuPowerCoefficient,
          memoryPowerCoefficient: this.config.memoryPowerCoefficient,
          monitoringInterval: this.config.monitoringInterval,
          analysisTime
        }
      })

    } catch (error) {
      console.error(`❌ Analysis failed: ${error.message}`)
      return new AnalysisResult({
        success: false,
        error: error.message,
        scriptName: path.basename(scriptPath),
        scriptPath
      })
    }
  }

  /**
   * Execute script and monitor its performance
   * @param {string} scriptPath - Path to script
   * @returns {Promise<Object>} Execution results with monitoring data
   */
  async executeAndMonitor(scriptPath) {
    const startTime = performance.now()
    let childProcess = null
    let peakCpuUsage = 0
    let peakMemoryUsage = 0

    try {
      // Start the process
      childProcess = spawn('node', [scriptPath], {
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'gayacode_analysis' }
      })

      // Start monitoring
      const monitoringPromise = this.monitoringStrategy.monitor(
        childProcess.pid,
        this.config.maxExecutionTime,
        (cpu, memory) => {
          peakCpuUsage = Math.max(peakCpuUsage, cpu)
          peakMemoryUsage = Math.max(peakMemoryUsage, memory)
        }
      )

      // Wait for process to complete
      const processPromise = new Promise((resolve) => {
        childProcess.on('close', (code, signal) => {
          const executionTime = performance.now() - startTime
          
          if (signal) {
            resolve({
              success: false,
              error: `Process terminated by signal: ${signal}`,
              executionTime
            })
            return
          }

          resolve({
            success: true,
            executionTime,
            peakCpuUsage,
            peakMemoryUsage,
            exitCode: code
          })
        })

        childProcess.on('error', (error) => {
          resolve({
            success: false,
            error: `Process error: ${error.message}`,
            executionTime: performance.now() - startTime
          })
        })
      })

      // Set up timeout
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          if (childProcess && !childProcess.killed) {
            childProcess.kill('SIGTERM')
          }
          resolve({
            success: false,
            error: `Process timed out after ${this.config.maxExecutionTime}ms`,
            executionTime: this.config.maxExecutionTime
          })
        }, this.config.maxExecutionTime)
      })

      // Wait for first to complete: process or timeout
      const processResult = await Promise.race([processPromise, timeoutPromise])
      
      if (!processResult.success) {
        return processResult
      }

      // Wait for monitoring to complete
      try {
        const monitoringResult = await monitoringPromise
        return {
          ...processResult,
          ...monitoringResult
        }
      } catch (error) {
        // If monitoring fails, return process result with defaults
        return {
          ...processResult,
          avgCpuUsage: peakCpuUsage || 0,
          avgMemoryUsage: peakMemoryUsage || 0,
          samples: 1,
          timeline: []
        }
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to start process: ${error.message}`,
        executionTime: performance.now() - startTime
      }
    }
  }

  /**
   * Calculate environmental metrics from execution results
   * @param {Object} executionResult - Results from script execution
   * @returns {PerformanceMetrics} Calculated metrics
   */
  calculateMetrics(executionResult) {
    const {
      executionTime,
      peakCpuUsage,
      peakMemoryUsage,
      avgCpuUsage,
      avgMemoryUsage,
      samples
    } = executionResult

    // Calculate energy consumption
    const energyKwh = this.energyCalculator.calculate({
      avgCpuUsage,
      avgMemoryUsage,
      executionTime
    })

    // Calculate CO2 emissions
    const co2Grams = this.co2Calculator.calculate(energyKwh)

    return new PerformanceMetrics({
      executionTime,
      peakCpuUsage,
      avgCpuUsage,
      peakMemoryUsage,
      avgMemoryUsage,
      samples,
      energyKwh,
      co2Grams
    })
  }
}
