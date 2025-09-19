/**
 * Core interfaces and types for the GayaCode system
 * Following the Interface Segregation Principle (ISP)
 */

/**
 * Base interface for analysis results
 */
export class AnalysisResult {
  constructor(data = {}) {
    this.success = data.success || false
    this.error = data.error || null
    this.timestamp = data.timestamp || new Date().toISOString()
    this.scriptName = data.scriptName || ''
    this.scriptPath = data.scriptPath || ''
    this.metrics = data.metrics || null
    this.timeline = data.timeline || []
    this.ecoScore = data.ecoScore || null
    this.equivalences = data.equivalences || null
    this.scalingProjections = data.scalingProjections || null
    this.analysis = data.analysis || null
  }
}

/**
 * Performance metrics data structure
 */
export class PerformanceMetrics {
  constructor(data = {}) {
    this.executionTime = data.executionTime || 0
    this.peakCpuUsage = data.peakCpuUsage || 0
    this.avgCpuUsage = data.avgCpuUsage || 0
    this.peakMemoryUsage = data.peakMemoryUsage || 0
    this.avgMemoryUsage = data.avgMemoryUsage || 0
    this.samples = data.samples || 0
    this.energyKwh = data.energyKwh || 0
    this.co2Grams = data.co2Grams || 0
  }
}

/**
 * Eco score breakdown
 */
export class EcoScore {
  constructor(data = {}) {
    this.overall = data.overall || 0
    this.grade = data.grade || { letter: 'F', color: '#dc2626' }
    this.breakdown = data.breakdown || {
      energy: 0,
      time: 0,
      cpu: 0
    }
  }
}

/**
 * Timeline data point
 */
export class TimelinePoint {
  constructor(timeSeconds, cpu, memoryMB) {
    this.timeSeconds = timeSeconds
    this.cpu = cpu
    this.memoryMB = memoryMB
  }
}

/**
 * Interface for monitoring strategies
 */
export class IMonitoringStrategy {
  async monitor(pid, duration, interval) {
    throw new Error('Monitor method must be implemented')
  }
}

/**
 * Interface for calculation strategies
 */
export class ICalculationStrategy {
  calculate(data) {
    throw new Error('Calculate method must be implemented')
  }
}

/**
 * Interface for dashboard components
 */
export class IDashboardComponent {
  generateHTML(data) {
    throw new Error('GenerateHTML method must be implemented')
  }
  
  generateCSS() {
    throw new Error('GenerateCSS method must be implemented')
  }
}

/**
 * Interface for template engines
 */
export class ITemplateEngine {
  render(template, data) {
    throw new Error('Render method must be implemented')
  }
}

/**
 * Configuration class following Single Responsibility Principle
 */
export class AnalyzerConfig {
  constructor(options = {}) {
    this.emissionFactor = options.emissionFactor || 400 // g CO₂/kWh
    this.cpuPowerCoefficient = options.cpuPowerCoefficient || 0.00008 // kW per 1% CPU
    this.memoryPowerCoefficient = options.memoryPowerCoefficient || 0.0000003 // kW per MB
    this.maxExecutionTime = options.maxExecutionTime || 60000 // 60 seconds
    this.monitoringInterval = options.monitoringInterval || 50 // 50ms
  }

  validate() {
    if (this.emissionFactor <= 0) throw new Error('Emission factor must be positive')
    if (this.maxExecutionTime <= 0) throw new Error('Max execution time must be positive')
    if (this.monitoringInterval <= 0) throw new Error('Monitoring interval must be positive')
    return true
  }
}
