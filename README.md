# 🌱 GayaCode

> Analyze the environmental impact of your Node.js code with beautiful dashboards and actionable insights

[![npm version](https://badge.fury.io/js/gayacode.svg)](https://www.npmjs.com/package/gayacode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

GayaCode is a powerful CLI tool that measures and visualizes the environmental impact of your Node.js applications. Get detailed insights into energy consumption, CO₂ emissions, and receive actionable recommendations to make your code more sustainable.

## ✨ Features

- 🔋 **Energy Consumption Analysis** - Track real-time energy usage
- 🌍 **CO₂ Emission Calculations** - See your carbon footprint
- 📊 **Beautiful Interactive Dashboards** - Stunning visualizations with animations
- 🌊 **Live Carbon Flow Visualization** - Real-time particle effects
- � **Virtual Forest Impact** - See how many trees you'd need
- ⚡ **Power Consumption Radar** - Multi-dimensional performance analysis
- 🎯 **Eco Score Rating** - Get graded on environmental impact (A+ to F)
- 📈 **Scaling Projections** - See impact at different scales
- 🌍 **Real-World Equivalents** - Compare to everyday activities
- 🏗️ **SOLID Architecture** - Clean, modular, and extensible code

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g gayacode
```

### Local Installation

```bash
npm install gayacode
npx gayacode <script>
```

## 📖 Usage

### Basic Usage

```bash
# Analyze a script and open dashboard
gayacode your-script.js

# Analyze without opening browser
gayacode your-script.js --no-open

# Custom output directory
gayacode your-script.js -o ./my-reports

# Custom emission factor
gayacode your-script.js --emission-factor 500
```

### Advanced Options

```bash
gayacode --help
```

```
Usage: gayacode [options] <script>

🌱 Analyze the environmental impact of your Node.js code

Arguments:
  script                      Path to the Node.js script to analyze

Options:
  -V, --version               output the version number
  -o, --output <path>         Output directory for the dashboard (default: "./gayacode-report")
  --no-open                   Skip opening the dashboard in browser
  --emission-factor <factor>  CO₂ emission factor (g/kWh) (default: "400")
  --timeout <ms>              Maximum execution time (ms) (default: "60000")
  -h, --help                  display help for command
```

## 📊 Dashboard Features

### Performance Timeline
- Real-time CPU and memory usage graphs
- Interactive Chart.js visualizations
- Detailed execution metrics

### Carbon Flow Visualization
- Animated particle system
- Real-time CO₂ flow representation
- Dynamic color coding based on emission rates

### Virtual Forest Impact
- Growing tree animations
- Calculate trees needed to offset emissions
- Beautiful forest visualization with seasonal effects

### Power Consumption Radar
- Multi-dimensional performance analysis
- CPU efficiency, memory usage, execution speed
- Interactive radar charts

### Real-World Impact
- Energy equivalents (smartphone charges, LED hours, etc.)
- Carbon equivalents (tree years, car km, flight km)
- Scaling projections (1K, 1M, 1B executions)

## 🏗️ Architecture

GayaCode follows SOLID principles with a clean, modular architecture:

```
src/
├── core/interfaces/         # Core interfaces and types
├── monitoring/             # Process monitoring strategies
├── calculations/           # Environmental calculation strategies
├── utils/                 # Utility functions and formatters
├── dashboard/
│   ├── components/        # Modular dashboard components
│   ├── templates/         # HTML template engine
│   └── DashboardGenerator.js
├── analyzer/              # Main environmental analyzer
└── cli/                   # Command-line interface
```

### Key Components

- **Strategy Pattern**: Pluggable monitoring and calculation strategies
- **Component-Based**: Modular dashboard components
- **Dependency Injection**: Clean separation of concerns
- **Template Engine**: Flexible HTML generation
- **Interface Segregation**: Well-defined contracts

## 🎯 Eco Score Rating

GayaCode provides a comprehensive eco score (0-100) with letter grades:

- **A+ (90-100)**: Excellent - Minimal environmental impact
- **A (80-89)**: Very Good - Low environmental impact
- **B (70-79)**: Good - Moderate environmental impact
- **C (60-69)**: Fair - Room for improvement
- **D (50-59)**: Poor - Significant environmental impact
- **F (0-49)**: Very Poor - High environmental impact

## 🌍 Environmental Metrics

### Energy Consumption
- Real-time power usage calculation
- CPU and memory power coefficients
- High-precision timing measurements

### CO₂ Emissions
- Configurable emission factors
- Grid-based carbon intensity
- Regional emission calculations

### Real-World Equivalents
- Smartphone battery charges
- LED light hours
- Laptop usage time
- Tree absorption years
- Car driving distance
- Flight emissions

## 📈 Example Output

```bash
🌱 GayaCode - Environmental Impact Analyzer v2.0

✅ Analysis complete

📊 Quick Results:
   ⚡ Energy: 0.59 µWh
   🌍 CO₂: 0.0002 g
   ⏱️  Time: 1242 ms
   🖥️  Peak CPU: 160.0%
   💾 Peak Memory: 156.7 MB
   🎯 Eco Score: 61/100 (B)

📁 Report saved to: ./gayacode-report/index.html
```

## �️ Programmatic Usage

You can also use GayaCode programmatically in your Node.js applications:

```javascript
import { EnvironmentalAnalyzer } from 'gayacode'

const analyzer = new EnvironmentalAnalyzer({
  emissionFactor: 400,
  maxExecutionTime: 60000
})

const result = await analyzer.analyzeScript('./my-script.js')
console.log(`Eco Score: ${result.ecoScore.overall}/100`)
console.log(`CO₂ Emissions: ${result.metrics.co2Grams}g`)
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/shalevo13/GayaCode.git
cd GayaCode
npm install
npm run dev test-script.js
```

## � License

MIT © [GayaCode Contributors](https://github.com/shalevo13/GayaCode)

## � Acknowledgments

- Built with ❤️ for a more sustainable future
- Inspired by the need for environmentally conscious software development
- Uses [pidusage](https://www.npmjs.com/package/pidusage) for process monitoring
- Visualizations powered by [Chart.js](https://www.chartjs.org/)

---

**Made with 🌱 by developers who care about the planet**
- Local execution (no cloud resources)
- Efficient monitoring algorithms
- Optimized frontend bundle size
- Sustainable development practices

---

**Made with 🌱 for sustainable software development**
