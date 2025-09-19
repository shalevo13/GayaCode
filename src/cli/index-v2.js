#!/usr/bin/env node

// Updated CLI using new SOLID architecture
import { EnvironmentalAnalyzer } from '../analyzer/EnvironmentalAnalyzer.js'
import { DashboardGenerator } from '../dashboard/DashboardGenerator.js'
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import open from 'open'
import path from 'path'

// CLI Configuration
program
  .name('gayacode')
  .description('🌱 Analyze the environmental impact of your Node.js code')
  .version('2.0.0')
  .argument('<script>', 'Path to the Node.js script to analyze')
  .option('-o, --output <path>', 'Output directory for the dashboard', './gayacode-report')
  .option('--no-open', 'Skip opening the dashboard in browser')
  .option('--emission-factor <factor>', 'CO₂ emission factor (g/kWh)', '400')
  .option('--timeout <ms>', 'Maximum execution time (ms)', '60000')
  .action(async (scriptPath, options) => {
    const spinner = ora()
    
    try {
      // Welcome message
      console.log(chalk.green.bold('\n🌱 GayaCode - Environmental Impact Analyzer v2.0\n'))
      
      // Validate script path
      const resolvedScriptPath = path.resolve(scriptPath)
      spinner.start(chalk.blue('🔍 Validating script...'))
      
      // Initialize analyzer with new architecture
      const analyzer = new EnvironmentalAnalyzer({
        emissionFactor: parseFloat(options.emissionFactor),
        maxExecutionTime: parseInt(options.timeout)
      })
      
      spinner.succeed(chalk.green('✅ Script validation complete'))
      
      // Run analysis
      spinner.start(chalk.blue('⚡ Analyzing environmental impact...'))
      const analysisResult = await analyzer.analyzeScript(resolvedScriptPath)
      
      if (!analysisResult.success) {
        spinner.fail(chalk.red('❌ Analysis failed'))
        console.error(chalk.red(`Error: ${analysisResult.error}`))
        process.exit(1)
      }
      
      spinner.succeed(chalk.green('✅ Analysis complete'))
      
      // Display quick results
      const { metrics } = analysisResult
      console.log(chalk.cyan('\n📊 Quick Results:'))
      console.log(`   ⚡ Energy: ${chalk.yellow((metrics.energyKwh * 1000000).toFixed(2))} µWh`)
      console.log(`   🌍 CO₂: ${chalk.yellow(metrics.co2Grams.toFixed(4))} g`)
      console.log(`   ⏱️  Time: ${chalk.yellow(metrics.executionTime.toFixed(0))} ms`)
      console.log(`   🖥️  Peak CPU: ${chalk.yellow(metrics.peakCpuUsage.toFixed(1))}%`)
      console.log(`   💾 Peak Memory: ${chalk.yellow((metrics.peakMemoryUsage).toFixed(1))} MB`)
      console.log(`   🎯 Eco Score: ${chalk.yellow(analysisResult.ecoScore.overall.toFixed(0))}/100 (${analysisResult.ecoScore.grade.letter})`)
      
      // Generate dashboard with new component-based generator
      spinner.start(chalk.blue('🎨 Generating beautiful dashboard...'))
      const dashboardGenerator = new DashboardGenerator()
      const dashboardPath = await dashboardGenerator.generateDashboard(analysisResult, options.output)
      
      spinner.succeed(chalk.green('✅ Dashboard generated'))
      console.log(chalk.cyan(`📁 Report saved to: ${chalk.underline(dashboardPath)}`))
      
      // Open in browser
      if (options.open) {
        spinner.start(chalk.blue('🌐 Opening dashboard in browser...'))
        await open(dashboardPath)
        spinner.succeed(chalk.green('✅ Dashboard opened in browser'))
      }
      
      console.log(chalk.green.bold('\n🎉 Analysis complete! Enjoy your environmental insights!\n'))
      
    } catch (error) {
      spinner.fail(chalk.red('❌ Unexpected error'))
      console.error(chalk.red(`Error: ${error.message}`))
      if (process.argv.includes('--debug')) {
        console.error(error.stack)
      }
      process.exit(1)
    }
  })

// Parse CLI arguments
program.parse()
