import { IDashboardComponent } from '../../core/interfaces/Types.js'
import { formatEnergy, formatCO2 } from '../../utils/Formatters.js'

/**
 * Header component for the dashboard
 * Follows Single Responsibility Principle
 */
export class HeaderComponent extends IDashboardComponent {
  generateHTML(data) {
    const { scriptName, timestamp, ecoScore } = data
    
    return `
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <div class="logo-icon">🌱</div>
            <div class="logo-text">
              <h1>GayaCode Analysis</h1>
              <p>Environmental Impact Report</p>
            </div>
          </div>
          <div class="header-meta">
            <div class="script-info">
              <h2>${scriptName}</h2>
              <p>Analyzed on ${new Date(timestamp).toLocaleString()}</p>
            </div>
            <div class="eco-score-badge">
              <div class="score-circle" style="background: conic-gradient(${ecoScore.grade.color} ${ecoScore.overall}%, #e5e7eb ${ecoScore.overall}%);">
                <div class="score-inner">
                  <span class="score-value">${ecoScore.overall.toFixed(0)}</span>
                  <span class="score-grade">${ecoScore.grade.letter}</span>
                </div>
              </div>
              <p>Eco Score</p>
            </div>
          </div>
        </div>
      </header>
    `
  }

  generateCSS() {
    return `
      .header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        color: #f1f5f9;
        padding: 40px;
        border-bottom: 1px solid rgba(34, 197, 94, 0.3);
        position: relative;
      }

      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        pointer-events: none;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 30px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .logo-icon {
        font-size: 3rem;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .logo-text h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .logo-text p {
        font-size: 1.1rem;
        opacity: 0.9;
        font-weight: 300;
      }

      .header-meta {
        display: flex;
        align-items: center;
        gap: 30px;
      }

      .script-info {
        text-align: right;
      }

      .script-info h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .script-info p {
        opacity: 0.8;
        font-size: 0.9rem;
      }

      .eco-score-badge {
        text-align: center;
      }

      .score-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        padding: 8px;
        margin-bottom: 8px;
      }

      .score-inner {
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #333;
      }

      .score-value {
        font-size: 1.2rem;
        font-weight: 700;
        line-height: 1;
      }

      .score-grade {
        font-size: 0.8rem;
        font-weight: 500;
        opacity: 0.7;
      }
    `
  }
}

/**
 * Quick stats component
 */
export class QuickStatsComponent extends IDashboardComponent {
  generateHTML(data) {
    const { metrics, analysis } = data
    
    return `
      <section class="quick-stats">
        <div class="stat-card energy">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <h3>Energy Consumed</h3>
            <p class="stat-value">${formatEnergy(metrics.energyKwh)}</p>
            <p class="stat-change">Peak: ${metrics.peakCpuUsage.toFixed(1)}% CPU</p>
          </div>
        </div>
        <div class="stat-card co2">
          <div class="stat-icon">🌍</div>
          <div class="stat-content">
            <h3>CO₂ Emissions</h3>
            <p class="stat-value">${formatCO2(metrics.co2Grams)}</p>
            <p class="stat-change">Factor: ${analysis.emissionFactor}g/kWh</p>
          </div>
        </div>
        <div class="stat-card time">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <h3>Execution Time</h3>
            <p class="stat-value">${metrics.executionTime.toFixed(0)}ms</p>
            <p class="stat-change">${metrics.samples} samples</p>
          </div>
        </div>
        <div class="stat-card memory">
          <div class="stat-icon">💾</div>
          <div class="stat-content">
            <h3>Peak Memory</h3>
            <p class="stat-value">${metrics.peakMemoryUsage.toFixed(1)}MB</p>
            <p class="stat-change">Avg: ${metrics.avgMemoryUsage.toFixed(1)}MB</p>
          </div>
        </div>
      </section>
    `
  }

  generateCSS() {
    return `
      .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        padding: 40px;
        background: rgba(15, 23, 42, 0.5);
      }

      .stat-card {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #22c55e, #16a34a);
      }

      .stat-card.co2::before {
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      }

      .stat-card.time::before {
        background: linear-gradient(90deg, #f59e0b, #d97706);
      }

      .stat-card.memory::before {
        background: linear-gradient(90deg, #8b5cf6, #7c3aed);
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        border-color: rgba(34, 197, 94, 0.5);
      }

      .stat-card .stat-icon {
        font-size: 2rem;
        margin-bottom: 12px;
      }

      .stat-content h3 {
        font-size: 0.9rem;
        font-weight: 500;
        color: #94a3b8;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 4px;
      }

      .stat-change {
        font-size: 0.85rem;
        color: #cbd5e1;
      }
    `
  }
}
