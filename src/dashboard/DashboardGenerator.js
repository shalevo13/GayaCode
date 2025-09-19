import fs from 'fs/promises'
import path from 'path'
import { HTMLDocumentTemplate } from './templates/TemplateEngine.js'
import { 
  HeaderComponent, 
  QuickStatsComponent 
} from './components/BasicComponents.js'
import { 
  CarbonFlowComponent, 
  VirtualForestComponent 
} from './components/VisualizationComponents.js'

/**
 * Refactored Dashboard Generator
 * Follows SOLID principles with component-based architecture
 */
export class DashboardGenerator {
  constructor(template = null, components = null) {
    // Dependency injection for template engine (Open/Closed Principle)
    this.template = template || new HTMLDocumentTemplate()
    
    // Default components (can be overridden for extensibility)
    this.components = components || [
      new HeaderComponent(),
      new QuickStatsComponent(),
      new PerformanceChartComponent(),
      new CarbonFlowComponent(),
      new VirtualForestComponent(),
      new PowerRadarComponent(),
      new EquivalencesComponent(),
      new ScalingProjectionsComponent(),
      new BreakdownComponent()
    ]
  }

  /**
   * Generate dashboard from analysis results
   * @param {AnalysisResult} analysisResult - Analysis data
   * @param {string} outputDir - Output directory path
   * @returns {Promise<string>} Path to generated dashboard
   */
  async generateDashboard(analysisResult, outputDir) {
    try {
      // Create output directory
      await fs.mkdir(outputDir, { recursive: true })
      
      // Generate HTML using template and components
      const dashboardHTML = this.template.render(analysisResult, this.components)
      
      // Write dashboard file
      const dashboardPath = path.join(outputDir, 'index.html')
      await fs.writeFile(dashboardPath, dashboardHTML)
      
      // Generate additional assets if needed
      await this.generateAssets(outputDir)
      
      console.log(`📊 Dashboard generated: ${path.resolve(dashboardPath)}`)
      return path.resolve(dashboardPath)
      
    } catch (error) {
      throw new Error(`Failed to generate dashboard: ${error.message}`)
    }
  }

  /**
   * Add a component to the dashboard
   * @param {IDashboardComponent} component - Component to add
   */
  addComponent(component) {
    this.components.push(component)
  }

  /**
   * Remove a component by type
   * @param {Function} componentType - Component constructor/type to remove
   */
  removeComponent(componentType) {
    this.components = this.components.filter(
      component => !(component instanceof componentType)
    )
  }

  /**
   * Generate additional assets (images, icons, etc.)
   * @param {string} outputDir - Output directory
   */
  async generateAssets(outputDir) {
    // Future: Generate favicon, additional CSS files, etc.
    return Promise.resolve()
  }
}

/**
 * Performance Chart Component
 */
class PerformanceChartComponent {
  generateHTML(data) {
    return `
      <section class="charts-section">
        <div class="chart-container">
          <h3>🔥 Performance Timeline</h3>
          <div class="chart-wrapper">
            <canvas id="performanceChart"></canvas>
          </div>
        </div>
      </section>
    `
  }

  generateCSS() {
    return `
      .charts-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .charts-section h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 24px;
        color: #f1f5f9;
      }

      .chart-container {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(10px);
      }

      .chart-wrapper {
        height: 400px;
        position: relative;
      }
    `
  }

  generateJavaScript(data) {
    const { timeline } = data
    
    return `
      // Performance Chart
      const ctx = document.getElementById('performanceChart').getContext('2d');
      
      const chartData = ${JSON.stringify(timeline.map(point => ({
        x: point.timeSeconds,
        cpu: point.cpu,
        memory: point.memoryMB
      })))};

      new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'CPU Usage (%)',
              data: chartData.map(d => ({ x: d.x, y: d.cpu })),
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              yAxisID: 'y'
            },
            {
              label: 'Memory Usage (MB)',
              data: chartData.map(d => ({ x: d.x, y: d.memory })),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  family: 'Inter',
                  size: 12,
                  weight: '500'
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              display: true,
              title: {
                display: true,
                text: 'Time (seconds)',
                font: {
                  family: 'Inter',
                  size: 12,
                  weight: '500'
                }
              },
              grid: {
                color: 'rgba(148, 163, 184, 0.2)'
              },
              ticks: {
                color: '#94a3b8'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'CPU Usage (%)',
                color: '#22c55e'
              },
              grid: {
                color: 'rgba(34, 197, 94, 0.2)'
              },
              ticks: {
                color: '#22c55e'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Memory Usage (MB)',
                color: '#3b82f6'
              },
              grid: {
                drawOnChartArea: false,
                color: 'rgba(59, 130, 246, 0.2)'
              },
              ticks: {
                color: '#3b82f6'
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        }
      });

      // Initialize visualizations after DOM load
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          if (typeof initCarbonFlow === 'function') initCarbonFlow();
          if (typeof initForest === 'function') initForest();
        }, 1000);
      });
    `
  }
}

// Additional component classes would be defined here...
// For brevity, I'm including them as minimal implementations

class PowerRadarComponent {
  generateHTML(data) {
    const { ecoScore, metrics } = data
    const peakPower = ((metrics.peakCpuUsage * 0.015) + (metrics.peakMemoryUsage * 0.000003)).toFixed(3)
    
    return `
      <section class="radar-section">
        <h3>⚡ Power Consumption Radar</h3>
        <div class="radar-container">
          <canvas id="powerRadarChart"></canvas>
          <div class="radar-insights">
            <div class="insight-card">
              <div class="insight-icon">🎯</div>
              <div class="insight-content">
                <h4>Efficiency Score</h4>
                <p class="insight-value">${ecoScore.overall.toFixed(0)}/100</p>
                <p class="insight-description">Overall performance rating</p>
              </div>
            </div>
            <div class="insight-card">
              <div class="insight-icon">⚡</div>
              <div class="insight-content">
                <h4>Peak Power</h4>
                <p class="insight-value">${peakPower}W</p>
                <p class="insight-description">Maximum power draw</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  generateCSS() {
    return `
      .radar-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .radar-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        align-items: start;
      }

      .radar-insights {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .insight-card {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        transition: all 0.3s ease;
      }
    `
  }

  generateJavaScript(data) {
    const { ecoScore, metrics } = data
    
    return `
      // Power Radar Chart
      const radarCtx = document.getElementById('powerRadarChart').getContext('2d');
      
      new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['CPU Efficiency', 'Memory Usage', 'Execution Speed', 'Energy Consumption', 'Carbon Impact', 'Resource Optimization'],
          datasets: [{
            label: 'Current Performance',
            data: [
              ${ecoScore.breakdown.cpu || 75},
              ${100 - (metrics.peakMemoryUsage / 1000) * 100},
              ${ecoScore.breakdown.time || 80},
              ${100 - (metrics.energyKwh * 1000)},
              ${100 - (metrics.co2Grams / 100)},
              ${ecoScore.overall || 78}
            ],
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            pointBackgroundColor: '#3b82f6'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });
    `
  }
}

class EquivalencesComponent {
  generateHTML(data) {
    const { equivalences } = data
    
    return `
      <section class="equivalences-section">
        <h3>🌍 Real-World Impact</h3>
        <div class="equivalences-grid">
          <div class="equivalence-category">
            <h4>⚡ Energy Equivalents</h4>
            <div class="equivalence-items">
              ${this.generateEquivalenceItems(equivalences.energy)}
            </div>
          </div>
          <div class="equivalence-category">
            <h4>🌱 Carbon Equivalents</h4>
            <div class="equivalence-items">
              ${this.generateEquivalenceItems(equivalences.co2)}
            </div>
          </div>
        </div>
      </section>
    `
  }

  generateEquivalenceItems(equivalences) {
    return Object.entries(equivalences).map(([key, equiv]) => `
      <div class="equivalence-item">
        <div class="equivalence-icon">${equiv.icon}</div>
        <div class="equivalence-content">
          <div class="equivalence-value">${this.formatNumber(equiv.value)}</div>
          <div class="equivalence-unit">${equiv.unit}</div>
        </div>
      </div>
    `).join('')
  }

  formatNumber(value) {
    if (value < 0.01) return value.toFixed(4)
    if (value < 1) return value.toFixed(2)
    if (value < 100) return value.toFixed(1)
    return Math.round(value).toLocaleString()
  }

  generateCSS() {
    return `
      .equivalences-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .equivalences-section h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 24px;
        color: #f1f5f9;
      }

      .equivalences-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
      }

      .equivalence-category {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(10px);
      }

      .equivalence-category h4 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: #f1f5f9;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .equivalence-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .equivalence-item {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.3s ease;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .equivalence-item:hover {
        transform: translateY(-2px);
        background: rgba(15, 23, 42, 0.8);
        border-color: rgba(34, 197, 94, 0.5);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }

      .equivalence-icon {
        font-size: 1.5rem;
        width: 40px;
        text-align: center;
      }

      .equivalence-content {
        flex: 1;
      }

      .equivalence-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 2px;
      }

      .equivalence-unit {
        font-size: 0.9rem;
        color: #94a3b8;
      }
    `
  }
}

class ScalingProjectionsComponent {
  generateHTML(data) {
    const { scalingProjections } = data
    
    return `
      <section class="scaling-section">
        <h3>📈 Scaling Impact</h3>
        <div class="scaling-grid">
          ${scalingProjections.map(proj => `
            <div class="scaling-card">
              <div class="scaling-header">
                <span class="scaling-icon">${proj.icon}</span>
                <h4>${proj.label}</h4>
              </div>
              <div class="scaling-metrics">
                <div class="scaling-metric">
                  <span class="metric-label">Energy</span>
                  <span class="metric-value">${this.formatEnergy(proj.energyKwh)}</span>
                </div>
                <div class="scaling-metric">
                  <span class="metric-label">CO₂</span>
                  <span class="metric-value">${this.formatCO2(proj.co2Grams)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `
  }

  formatEnergy(kwh) {
    if (kwh < 0.001) return `${(kwh * 1000000).toFixed(2)} µWh`
    if (kwh < 1) return `${(kwh * 1000).toFixed(2)} mWh`
    return `${kwh.toFixed(2)} kWh`
  }

  formatCO2(grams) {
    if (grams < 1000) return `${grams.toFixed(3)} g`
    return `${(grams / 1000).toFixed(2)} kg`
  }

  generateCSS() {
    return `
      .scaling-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .scaling-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }

      .scaling-card {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
    `
  }
}

class BreakdownComponent {
  generateHTML(data) {
    const { ecoScore, analysis } = data
    
    return `
      <section class="breakdown-section">
        <div class="breakdown-grid">
          <div class="breakdown-card">
            <h3>🎯 Eco Score Breakdown</h3>
            <div class="score-breakdown">
              <div class="score-item">
                <span>Energy Efficiency</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${ecoScore.breakdown.energy}%"></div>
                </div>
                <span>${ecoScore.breakdown.energy.toFixed(0)}</span>
              </div>
              <div class="score-item">
                <span>Execution Speed</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${ecoScore.breakdown.time}%"></div>
                </div>
                <span>${ecoScore.breakdown.time.toFixed(0)}</span>
              </div>
              <div class="score-item">
                <span>CPU Efficiency</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${ecoScore.breakdown.cpu}%"></div>
                </div>
                <span>${ecoScore.breakdown.cpu.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div class="breakdown-card">
            <h3>📊 Analysis Details</h3>
            <div class="details-list">
              <div class="detail-item">
                <span>Emission Factor</span>
                <span>${analysis.emissionFactor} g/kWh</span>
              </div>
              <div class="detail-item">
                <span>Monitoring Interval</span>
                <span>${analysis.monitoringInterval}ms</span>
              </div>
              <div class="detail-item">
                <span>Analysis Time</span>
                <span>${analysis.analysisTime.toFixed(0)}ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  generateCSS() {
    return `
      .breakdown-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .breakdown-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
      }

      .breakdown-card {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(10px);
      }

      .score-breakdown {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .score-item {
        display: grid;
        grid-template-columns: 1fr 2fr auto;
        align-items: center;
        gap: 12px;
      }

      .score-bar {
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
      }

      .score-fill {
        height: 100%;
        background: linear-gradient(90deg, #22c55e, #16a34a);
        border-radius: 4px;
        transition: width 1s ease;
      }
    `
  }
}
