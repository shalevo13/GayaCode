import { ICalculationStrategy, EcoScore } from '../core/interfaces/Types.js'

/**
 * Energy consumption calculation strategy
 * Implements Single Responsibility Principle - only handles energy calculations
 */
export class EnergyCalculationStrategy extends ICalculationStrategy {
  constructor(config) {
    super()
    this.cpuPowerCoefficient = config.cpuPowerCoefficient
    this.memoryPowerCoefficient = config.memoryPowerCoefficient
  }

  /**
   * Calculate energy consumption from performance metrics
   * @param {Object} data - Performance data with CPU and memory usage
   * @returns {number} Energy consumption in kWh
   */
  calculate(data) {
    const { avgCpuUsage, avgMemoryUsage, executionTime } = data
    const executionTimeHours = executionTime / (1000 * 60 * 60)
    
    const cpuEnergyKwh = (avgCpuUsage * this.cpuPowerCoefficient) * executionTimeHours
    const memoryEnergyKwh = (avgMemoryUsage * this.memoryPowerCoefficient) * executionTimeHours
    
    return cpuEnergyKwh + memoryEnergyKwh
  }
}

/**
 * CO2 emissions calculation strategy
 */
export class CO2CalculationStrategy extends ICalculationStrategy {
  constructor(emissionFactor) {
    super()
    this.emissionFactor = emissionFactor // g CO₂/kWh
  }

  /**
   * Calculate CO2 emissions from energy consumption
   * @param {number} energyKwh - Energy consumption in kWh
   * @returns {number} CO2 emissions in grams
   */
  calculate(energyKwh) {
    return energyKwh * this.emissionFactor
  }
}

/**
 * Eco score calculation strategy
 */
export class EcoScoreCalculationStrategy extends ICalculationStrategy {
  /**
   * Calculate eco score based on performance metrics
   * @param {Object} data - Complete performance and environmental data
   * @returns {EcoScore} Calculated eco score with breakdown
   */
  calculate(data) {
    const { metrics, executionTime } = data
    
    // Calculate individual scores (0-100, higher is better)
    const energyScore = this.calculateEnergyScore(metrics.energyKwh)
    const timeScore = this.calculateTimeScore(executionTime)
    const cpuScore = this.calculateCpuScore(metrics.avgCpuUsage, metrics.peakCpuUsage)
    
    // Overall score (weighted average)
    const overall = (energyScore * 0.4) + (timeScore * 0.3) + (cpuScore * 0.3)
    
    return new EcoScore({
      overall,
      grade: this.getGrade(overall),
      breakdown: {
        energy: energyScore,
        time: timeScore,
        cpu: cpuScore
      }
    })
  }

  calculateEnergyScore(energyKwh) {
    // Score based on energy efficiency (lower energy = higher score)
    if (energyKwh <= 0.00001) return 100
    if (energyKwh <= 0.0001) return 90
    if (energyKwh <= 0.001) return 80
    if (energyKwh <= 0.01) return 60
    if (energyKwh <= 0.1) return 40
    return 20
  }

  calculateTimeScore(executionTime) {
    // Score based on execution efficiency (lower time = higher score)
    if (executionTime <= 100) return 100
    if (executionTime <= 500) return 90
    if (executionTime <= 1000) return 80
    if (executionTime <= 5000) return 60
    if (executionTime <= 10000) return 40
    return 20
  }

  calculateCpuScore(avgCpu, peakCpu) {
    // Score based on CPU efficiency (lower usage = higher score)
    const cpuEfficiency = 100 - ((avgCpu + peakCpu) / 2)
    return Math.max(0, Math.min(100, cpuEfficiency))
  }

  getGrade(score) {
    if (score >= 90) return { letter: 'A+', color: '#22c55e' }
    if (score >= 80) return { letter: 'A', color: '#16a34a' }
    if (score >= 70) return { letter: 'B+', color: '#65a30d' }
    if (score >= 60) return { letter: 'B', color: '#ca8a04' }
    if (score >= 50) return { letter: 'C+', color: '#ea580c' }
    if (score >= 40) return { letter: 'C', color: '#dc2626' }
    return { letter: 'F', color: '#991b1b' }
  }
}

/**
 * Equivalences calculation strategy
 */
export class EquivalencesCalculationStrategy extends ICalculationStrategy {
  /**
   * Calculate real-world equivalences for environmental impact
   * @param {Object} data - Energy and CO2 data
   * @returns {Object} Equivalences for energy and CO2
   */
  calculate(data) {
    const { energyKwh, co2Grams } = data

    return {
      energy: {
        smartphone: {
          icon: '📱',
          value: energyKwh / 0.0000139, // kWh per smartphone charge
          unit: 'smartphone charges'
        },
        lightbulb: {
          icon: '💡',
          value: energyKwh / 0.01, // kWh per hour of LED bulb
          unit: 'hours of LED light'
        },
        laptop: {
          icon: '💻',
          value: energyKwh / 0.05, // kWh per hour of laptop use
          unit: 'hours of laptop use'
        }
      },
      co2: {
        tree: {
          icon: '🌳',
          value: co2Grams / 21900, // grams CO2 absorbed per tree per year
          unit: 'trees needed for 1 year'
        },
        car: {
          icon: '🚗',
          value: co2Grams / 120, // grams CO2 per km driven
          unit: 'km driven by car'
        },
        flight: {
          icon: '✈️',
          value: co2Grams / 90, // grams CO2 per km flown
          unit: 'km flown'
        }
      }
    }
  }
}

/**
 * Scaling projections calculation strategy
 */
export class ScalingCalculationStrategy extends ICalculationStrategy {
  /**
   * Calculate scaling projections for different usage scenarios
   * @param {Object} baseData - Base performance metrics
   * @returns {Array} Scaling scenarios
   */
  calculate(baseData) {
    const { energyKwh, co2Grams } = baseData

    return [
      {
        icon: '🔥',
        label: '1K Executions/Day',
        multiplier: 1000,
        energyKwh: energyKwh * 1000,
        co2Grams: co2Grams * 1000
      },
      {
        icon: '⚡',
        label: '1M Executions/Month',
        multiplier: 1000000,
        energyKwh: energyKwh * 1000000,
        co2Grams: co2Grams * 1000000
      },
      {
        icon: '🌍',
        label: 'Global Scale (1B/Year)',
        multiplier: 1000000000,
        energyKwh: energyKwh * 1000000000,
        co2Grams: co2Grams * 1000000000
      }
    ]
  }
}
