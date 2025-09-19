#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import open from 'open'
import { EnvironmentalAnalyzer } from '../analyzer/EnvironmentalAnalyzer.js'
import { DashboardGenerator } from '../dashboard/DashboardGenerator.js'
import path from 'path'

/**
 * Command Line Interface for GayaCode
 * Follows Single Responsibility Principle - only handles CLI interactions
 */
class GayaCodeCLI {
  constructor() {
    this.spinner = ora()
    this.setupCommands()
  }

  /**
   * Setup CLI commands and options
   */
  setupCommands() {
    program
      .name('gayacode')
      .description('🌱 Analyze the environmental impact of your Node.js code')
      .version('2.0.0')
      .argument('<script>', 'Path to the Node.js script to analyze')
      .option('-o, --output <path>', 'Output directory for the dashboard', './gayacode-report')
      .option('--no-open', 'Skip opening the dashboard in browser')
      .option('--emission-factor <factor>', 'CO₂ emission factor (g/kWh)', '400')
      .option('--timeout <ms>', 'Maximum execution time (ms)', '60000')
      .option('--interval <ms>', 'Monitoring interval (ms)', '50')
      .option('--format <type>', 'Output format (html, json)', 'html')
      .action(async (scriptPath, options) => {
        await this.analyzeScript(scriptPath, options)
      })

    program
      .command('config')
      .description('Show current configuration')
      .action(() => {
        this.showConfig()
      })

    program
      .command('validate <script>')
      .description('Validate a script without running analysis')
      .action(async (scriptPath) => {
        await this.validateScript(scriptPath)
      })
  }

  /**
   * Main analysis command
   * @param {string} scriptPath - Path to script to analyze
   * @param {Object} options - CLI options
   */
  async analyzeScript(scriptPath, options) {
    try {
      this.printWelcome()
      
      // Validate and resolve script path
      const resolvedScriptPath = path.resolve(scriptPath)
      this.spinner.start(chalk.blue('🔍 Validating script...'))
      
      // Validate script exists
      const { validateFilePath } = await import('../utils/Formatters.js')
      if (!(await validateFilePath(resolvedScriptPath))) {
        this.spinner.fail(chalk.red('❌ Script not found'))
        console.error(chalk.red(`Error: Cannot find script at ${resolvedScriptPath}`))
        process.exit(1)
      }
      
      this.spinner.succeed(chalk.green('✅ Script validation complete'))
      
      // Initialize analyzer with options
      const analyzer = new EnvironmentalAnalyzer({
        emissionFactor: parseFloat(options.emissionFactor),
        maxExecutionTime: parseInt(options.timeout),
        monitoringInterval: parseInt(options.interval)
      })
      
      // Run analysis
      this.spinner.start(chalk.blue('⚡ Analyzing environmental impact...'))
      const analysisResult = await analyzer.analyzeScript(resolvedScriptPath)
      
      if (!analysisResult.success) {
        this.spinner.fail(chalk.red('❌ Analysis failed'))
        console.error(chalk.red(`Error: ${analysisResult.error}`))
        process.exit(1)
      }
      
      this.spinner.succeed(chalk.green('✅ Analysis completed successfully'))
      
      // Generate output based on format
      if (options.format === 'json') {
        await this.generateJSON(analysisResult, options.output)
      } else {
        await this.generateDashboard(analysisResult, options.output, options.open)
      }
      
      this.printSummary(analysisResult)
      
    } catch (error) {
      this.spinner.fail(chalk.red('❌ Unexpected error'))
      console.error(chalk.red(`Error: ${error.message}`))
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack)
      }
      process.exit(1)
    }
  }

  /**
   * Generate HTML dashboard
   * @param {AnalysisResult} analysisResult - Analysis results
   * @param {string} outputPath - Output directory
   * @param {boolean} shouldOpen - Whether to open in browser
   */
  async generateDashboard(analysisResult, outputPath, shouldOpen) {
    this.spinner.start(chalk.blue('📊 Generating dashboard...'))
    
    const generator = new DashboardGenerator()
    const dashboardPath = await generator.generateDashboard(analysisResult, outputPath)
    
    this.spinner.succeed(chalk.green('✅ Dashboard generated successfully'))
    console.log(chalk.cyan(`📄 Dashboard: ${dashboardPath}`))
    
    if (shouldOpen) {
      this.spinner.start(chalk.blue('🌐 Opening dashboard in browser...'))
      try {
        await open(dashboardPath)
        this.spinner.succeed(chalk.green('✅ Dashboard opened in browser'))
      } catch (error) {
        this.spinner.warn(chalk.yellow('⚠️  Could not open browser automatically'))
        console.log(chalk.cyan(`Please open: ${dashboardPath}`))
      }
    }
  }

  /**
   * Generate JSON output
   * @param {AnalysisResult} analysisResult - Analysis results
   * @param {string} outputPath - Output directory
   */
  async generateJSON(analysisResult, outputPath) {
    this.spinner.start(chalk.blue('📄 Generating JSON report...'))
    
    const fs = await import('fs/promises')
    await fs.mkdir(outputPath, { recursive: true })
    
    const jsonPath = path.join(outputPath, 'analysis-result.json')
    await fs.writeFile(jsonPath, JSON.stringify(analysisResult, null, 2))
    
    this.spinner.succeed(chalk.green('✅ JSON report generated'))
    console.log(chalk.cyan(`📄 Report: ${path.resolve(jsonPath)}`))
  }

  /**
   * Validate script command
   * @param {string} scriptPath - Path to script
   */
  async validateScript(scriptPath) {
    try {
      this.spinner.start(chalk.blue('🔍 Validating script...'))
      
      const resolvedPath = path.resolve(scriptPath)
      const { validateFilePath } = await import('../utils/Formatters.js')
      
      if (await validateFilePath(resolvedPath)) {
        this.spinner.succeed(chalk.green('✅ Script is valid and accessible'))
        console.log(chalk.cyan(`📄 Script: ${resolvedPath}`))
      } else {
        this.spinner.fail(chalk.red('❌ Script not found or not accessible'))
        process.exit(1)
      }
    } catch (error) {
      this.spinner.fail(chalk.red('❌ Validation failed'))
      console.error(chalk.red(`Error: ${error.message}`))
      process.exit(1)
    }
  }

  /**
   * Show current configuration
   */
  showConfig() {
    console.log(chalk.green.bold('\n🌱 GayaCode Configuration\n'))
    console.log(chalk.cyan('Default Settings:'))
    console.log(`  Emission Factor: ${chalk.white('400 g/kWh')}`)
    console.log(`  Timeout: ${chalk.white('60000 ms')}`)
    console.log(`  Monitoring Interval: ${chalk.white('50 ms')}`)
    console.log(`  Output Format: ${chalk.white('html')}`)
  }

  /**
   * Print welcome message
   */
  printWelcome() {
    console.log(chalk.green.bold('\n🌱 GayaCode - Environmental Impact Analyzer v2.0\n'))
  }

  /**
   * Print analysis summary
   * @param {AnalysisResult} result - Analysis results
   */
  printSummary(result) {
    const { formatEnergy, formatCO2 } = require('../utils/Formatters.js')
    
    console.log(chalk.green.bold('\n📊 Analysis Summary\n'))
    console.log(`${chalk.cyan('Script:')} ${result.scriptName}`)
    console.log(`${chalk.cyan('Execution Time:')} ${result.metrics.executionTime.toFixed(0)}ms`)
    console.log(`${chalk.cyan('Energy Consumed:')} ${formatEnergy(result.metrics.energyKwh)}`)
    console.log(`${chalk.cyan('CO₂ Emissions:')} ${formatCO2(result.metrics.co2Grams)}`)
    console.log(`${chalk.cyan('Eco Score:')} ${result.ecoScore.overall.toFixed(0)}/100 (${result.ecoScore.grade.letter})`)
    console.log()
  }

  /**
   * Start the CLI
   */
  start() {
    program.parse()
  }
}

// Create and start CLI
const cli = new GayaCodeCLI()
cli.start()
