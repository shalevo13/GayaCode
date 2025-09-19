import { IDashboardComponent } from '../../core/interfaces/Types.js'
import { formatCO2 } from '../../utils/Formatters.js'

/**
 * Carbon Flow Visualization Component
 * Follows Single Responsibility Principle - only handles carbon flow visualization
 */
export class CarbonFlowComponent extends IDashboardComponent {
  generateHTML(data) {
    const { metrics } = data
    const currentRate = metrics.co2Grams / (metrics.executionTime / 1000)
    
    return `
      <section class="carbon-flow-section">
        <h3>🌊 Live Carbon Flow Visualization</h3>
        <div class="carbon-flow-container">
          <canvas id="carbonFlowCanvas"></canvas>
          <div class="flow-legend">
            <div class="flow-info">
              <div class="flow-metric">
                <span class="flow-label">Current Rate</span>
                <span class="flow-value" id="currentFlowRate">${formatCO2(currentRate)}/s</span>
              </div>
              <div class="flow-metric">
                <span class="flow-label">Total Emitted</span>
                <span class="flow-value" id="totalEmitted">${formatCO2(metrics.co2Grams)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  generateCSS() {
    return `
      .carbon-flow-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .carbon-flow-section h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 24px;
        color: #f1f5f9;
      }

      .carbon-flow-container {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
      }

      #carbonFlowCanvas {
        width: 100%;
        height: 300px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
      }

      .flow-legend {
        position: absolute;
        top: 24px;
        right: 24px;
        background: rgba(15, 23, 42, 0.9);
        border-radius: 12px;
        padding: 16px;
        border: 1px solid rgba(34, 197, 94, 0.3);
        backdrop-filter: blur(10px);
      }

      .flow-info {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .flow-metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .flow-label {
        font-size: 0.8rem;
        color: #94a3b8;
        margin-bottom: 4px;
      }

      .flow-value {
        font-size: 1rem;
        font-weight: 600;
        color: #22c55e;
      }
    `
  }

  generateJavaScript(data) {
    const { metrics } = data
    const flowRate = metrics.co2Grams / (metrics.executionTime / 1000)
    
    return `
      // Carbon Flow Visualization
      const carbonCanvas = document.getElementById('carbonFlowCanvas');
      const carbonCtx = carbonCanvas.getContext('2d');
      
      function initCarbonFlow() {
        carbonCanvas.width = carbonCanvas.offsetWidth;
        carbonCanvas.height = carbonCanvas.offsetHeight;
        
        const particles = [];
        const flowRate = ${flowRate};
        
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * carbonCanvas.width,
            y: Math.random() * carbonCanvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.7 + 0.3,
            hue: 120 - (flowRate * 10) // Green to red based on flow rate
          });
        }
        
        function animateCarbonFlow() {
          carbonCtx.fillStyle = 'rgba(15, 23, 42, 0.1)';
          carbonCtx.fillRect(0, 0, carbonCanvas.width, carbonCanvas.height);
          
          particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0) particle.x = carbonCanvas.width;
            if (particle.x > carbonCanvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = carbonCanvas.height;
            if (particle.y > carbonCanvas.height) particle.y = 0;
            
            carbonCtx.beginPath();
            carbonCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            carbonCtx.fillStyle = \`hsla(\${particle.hue}, 70%, 60%, \${particle.opacity})\`;
            carbonCtx.fill();
          });
          
          requestAnimationFrame(animateCarbonFlow);
        }
        
        animateCarbonFlow();
      }
    `
  }
}

/**
 * Virtual Forest Impact Component
 */
export class VirtualForestComponent extends IDashboardComponent {
  generateHTML(data) {
    const { metrics } = data
    const treesNeeded = Math.ceil(metrics.co2Grams / 21900)
    const absorptionTime = Math.ceil(metrics.co2Grams / 21900 * 365)
    const forestArea = (metrics.co2Grams / 21900 * 30).toFixed(1)
    
    return `
      <section class="forest-section">
        <h3>🌲 Virtual Forest Impact</h3>
        <div class="forest-container">
          <div class="forest-visualization">
            <canvas id="forestCanvas"></canvas>
          </div>
          <div class="forest-stats">
            <div class="forest-metric">
              <div class="metric-icon">🌱</div>
              <div class="metric-content">
                <span class="metric-title">Trees Needed</span>
                <span class="metric-value">${treesNeeded}</span>
                <span class="metric-subtitle">to offset CO₂</span>
              </div>
            </div>
            <div class="forest-metric">
              <div class="metric-icon">🕐</div>
              <div class="metric-content">
                <span class="metric-title">Absorption Time</span>
                <span class="metric-value">${absorptionTime} days</span>
                <span class="metric-subtitle">for full offset</span>
              </div>
            </div>
            <div class="forest-metric">
              <div class="metric-icon">🏞️</div>
              <div class="metric-content">
                <span class="metric-title">Forest Area</span>
                <span class="metric-value">${forestArea} m²</span>
                <span class="metric-subtitle">equivalent space</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  generateCSS() {
    return `
      .forest-section {
        padding: 40px;
        background: rgba(15, 23, 42, 0.3);
        border-top: 1px solid rgba(148, 163, 184, 0.2);
      }

      .forest-section h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 24px;
        color: #f1f5f9;
      }

      .forest-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        align-items: start;
      }

      .forest-visualization {
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        backdrop-filter: blur(10px);
      }

      #forestCanvas {
        width: 100%;
        height: 320px;
        border-radius: 12px;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #164e63 100%);
      }

      .forest-stats {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .forest-metric {
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

      .forest-metric:hover {
        transform: translateY(-2px);
        border-color: rgba(34, 197, 94, 0.5);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }

      .forest-metric .metric-icon {
        font-size: 2rem;
        width: 50px;
        text-align: center;
      }

      .metric-content {
        flex: 1;
      }

      .metric-title {
        display: block;
        font-size: 0.9rem;
        color: #94a3b8;
        margin-bottom: 4px;
      }

      .metric-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 2px;
      }

      .metric-subtitle {
        display: block;
        font-size: 0.8rem;
        color: #cbd5e1;
      }
    `
  }

  generateJavaScript(data) {
    const { metrics } = data
    const treesNeeded = Math.ceil(metrics.co2Grams / 21900)
    
    return `
      // Virtual Forest Visualization
      const forestCanvas = document.getElementById('forestCanvas');
      const forestCtx = forestCanvas.getContext('2d');
      
      function initForest() {
        forestCanvas.width = forestCanvas.offsetWidth;
        forestCanvas.height = forestCanvas.offsetHeight;
        
        const treesNeeded = Math.ceil(${metrics.co2Grams} / 21900);
        const maxTrees = Math.min(treesNeeded, 20); // Limit for performance
        const trees = [];
        
        for (let i = 0; i < maxTrees; i++) {
          trees.push({
            x: (i + 1) * (forestCanvas.width / (maxTrees + 1)),
            y: forestCanvas.height - 50,
            height: 0,
            maxHeight: Math.random() * 80 + 60,
            growth: Math.random() * 0.5 + 0.3,
            leaves: []
          });
        }
        
        function drawTree(tree) {
          // Trunk
          forestCtx.fillStyle = '#8B4513';
          forestCtx.fillRect(tree.x - 5, tree.y - tree.height, 10, tree.height);
          
          // Leaves
          if (tree.height > tree.maxHeight * 0.3) {
            forestCtx.fillStyle = '#22c55e';
            forestCtx.beginPath();
            forestCtx.arc(tree.x, tree.y - tree.height, tree.height * 0.4, 0, Math.PI * 2);
            forestCtx.fill();
          }
        }
        
        function animateForest() {
          forestCtx.clearRect(0, 0, forestCanvas.width, forestCanvas.height);
          
          // Sky gradient
          const gradient = forestCtx.createLinearGradient(0, 0, 0, forestCanvas.height);
          gradient.addColorStop(0, '#1e293b');
          gradient.addColorStop(1, '#164e63');
          forestCtx.fillStyle = gradient;
          forestCtx.fillRect(0, 0, forestCanvas.width, forestCanvas.height);
          
          // Ground
          forestCtx.fillStyle = '#15803d';
          forestCtx.fillRect(0, forestCanvas.height - 30, forestCanvas.width, 30);
          
          trees.forEach(tree => {
            if (tree.height < tree.maxHeight) {
              tree.height += tree.growth;
            }
            drawTree(tree);
          });
          
          requestAnimationFrame(animateForest);
        }
        
        animateForest();
      }
    `
  }
}
