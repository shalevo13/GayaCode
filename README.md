# 🌱 GayaCode - Environmental Impact Analysis CLI

GayaCode is a powerful CLI tool that analyzes the environmental impact of your Node.js scripts. It monitors CPU usage, memory consumption, and execution time, then converts these metrics into meaningful environmental data and generates a stunning interactive dashboard.

## ✨ Features

- **🔍 Comprehensive Analysis**: Monitors CPU usage, memory consumption, and execution time with high precision
- **⚡ Energy Calculation**: Converts resource usage to kilowatt-hours and CO₂ emissions
- **🎨 Stunning Dashboard**: Generates beautiful, interactive HTML reports with animated charts
- **📈 Scaling Projections**: Shows environmental impact of running your code 1K, 10K, 100K, and 1M times
- **🌍 Real-World Equivalences**: Translates impact into relatable terms (smartphone charges, car distance, tree absorption time)
- **🏆 Eco Scoring**: Grades your code's environmental efficiency from A+ to F
- **🚀 Zero Setup**: No servers, no configuration - just run and analyze
- **🌐 Auto Browser**: Automatically opens the beautiful dashboard in your browser

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm

### Installation & Usage

1. **Clone and install**:
   ```bash
   git clone https://github.com/shalevo13/GayaCode.git
   cd GayaCode
   npm install
   ```

2. **Analyze any Node.js script**:
   ```bash
   node src/cli/index.js your-script.js
   ```

3. **Or install globally** (optional):
   ```bash
   npm link  # (may require sudo)
   gayacode your-script.js
   ```

4. **Enjoy the magic**:
   - ⚡ Watch the real-time analysis
   - 🎨 Beautiful dashboard opens automatically
   - 📊 Explore interactive charts and metrics
   - 🌍 Understand your code's environmental impact

### CLI Options

```bash
gayacode <script> [options]

Options:
  -o, --output <path>           Output directory for dashboard (default: ./gayacode-report)
  --no-open                     Skip opening the dashboard in browser
  --emission-factor <factor>    CO₂ emission factor in g/kWh (default: 400)
  --timeout <ms>                Maximum execution time in ms (default: 60000)
  -h, --help                    Display help for command
```

### Examples

```bash
# Basic analysis
gayacode my-script.js

# Custom output directory
gayacode my-script.js -o ./analysis-results

# Use regional emission factor (Nordic countries ~50 g/kWh)
gayacode my-script.js --emission-factor 50

# Don't open browser automatically
gayacode my-script.js --no-open
```

## 📊 Usage

1. **Start Analysis**: Upload or specify a Node.js script path
2. **View Results**: The dashboard automatically opens showing:
   - Energy consumption and CO₂ emissions
   - Real-time performance graphs
   - Scaling projections for production estimates
   - Environmental equivalences for context
   - Eco-score rating
3. **Export Results**: Save analysis as PNG or JSON for sharing
4. **Compare Runs**: Track optimization improvements over time

## 🏗️ Project Structure

```
src/
├── analyzer/           # Backend analysis engine
│   ├── EnvironmentalAnalyzer.js
│   └── server.js
├── components/         # React components
│   ├── dashboard/      # Dashboard components
│   ├── charts/         # Visualization components
│   └── comparison/     # Comparison tools
├── utils/             # Utility functions
├── monitoring/        # Performance monitoring
└── sandbox/           # Secure execution environment
```

## 🔧 Configuration

### Emission Factors
Customize CO₂ emission factors in the analyzer configuration:

```javascript
const analyzer = new EnvironmentalAnalyzer({
  emissionFactor: 400, // g CO₂/kWh (global average)
  // Regional factors:
  // US: 400, EU: 300, Nordic: 50, Coal-heavy: 800+
})
```

### Resource Limits
Configure execution limits for safety:

```javascript
const analyzer = new EnvironmentalAnalyzer({
  maxExecutionTime: 60000, // 60 seconds
  monitoringInterval: 100,  // 100ms sampling
})
```

## 📈 Understanding the Metrics

### Energy Consumption
- Calculated from CPU and memory usage over time
- Uses industry-standard power coefficients
- Displayed in kilowatt-hours (kWh) or microwatt-hours (µWh)

### CO₂ Emissions
- Derived from energy consumption using emission factors
- Accounts for electricity grid carbon intensity
- Displayed in grams or kilograms of CO₂

### Eco Score
- Composite rating from A+ to F
- Considers energy efficiency and execution speed
- Helps quickly assess environmental performance

### Environmental Equivalences
- **Smartphone charges**: Energy comparison to charging devices
- **Car distance**: CO₂ comparison to vehicle emissions
- **Tree absorption**: Time needed for a tree to absorb the CO₂

## 🧪 Development

### Running Tests
```bash
npm test
```

### Linting and Formatting
```bash
npm run lint
npm run format
```

### Building for Production
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🌍 Environmental Impact

This tool itself is designed to have minimal environmental impact:
- Local execution (no cloud resources)
- Efficient monitoring algorithms
- Optimized frontend bundle size
- Sustainable development practices

---

**Made with 🌱 for sustainable software development**
