#!/usr/bin/env node

/**
 * Balanced Performance Script
 * Designed to achieve approximately 70 eco score
 * 
 * This script demonstrates moderate resource usage with:
 * - Controlled CPU usage (not too intensive)
 * - Reasonable execution time (not too fast, not too slow)
 * - Balanced memory allocation
 * - Mix of efficient and less efficient operations
 */

console.log('🎯 Starting balanced performance script...')

// Moderate data processing - creates some CPU load but not excessive
function processData() {
  const data = []
  
  // Generate moderate amount of data (balanced for 70 score target)
  for (let i = 0; i < 75000; i++) {
    data.push({
      id: i,
      value: Math.random() * 1000,
      timestamp: Date.now() + i,
      metadata: {
        category: `category_${i % 10}`,
        priority: Math.floor(Math.random() * 5),
        tags: [`tag_${i % 20}`, `tag_${(i + 1) % 20}`]
      }
    })
  }
  
  console.log(`📊 Generated ${data.length} records`)
  return data
}

// Some computational work - balanced complexity
function analyzeData(data) {
  console.log('🔍 Analyzing data...')
  
  const analysis = {
    categories: {},
    priorities: {},
    averages: {},
    trends: []
  }
  
  // Process data with moderate complexity
  data.forEach((item, index) => {
    // Category analysis
    if (!analysis.categories[item.metadata.category]) {
      analysis.categories[item.metadata.category] = { count: 0, total: 0 }
    }
    analysis.categories[item.metadata.category].count++
    analysis.categories[item.metadata.category].total += item.value
    
    // Priority analysis
    const priority = item.metadata.priority
    if (!analysis.priorities[priority]) {
      analysis.priorities[priority] = []
    }
    analysis.priorities[priority].push(item.value)
    
    // Calculate moving average every 1000 items (some CPU work but not excessive)
    if (index % 1000 === 0 && index > 0) {
      const recent = data.slice(Math.max(0, index - 1000), index)
      const avg = recent.reduce((sum, r) => sum + r.value, 0) / recent.length
      analysis.trends.push({ index, average: avg })
    }
  })
  
  // Calculate final statistics
  Object.keys(analysis.categories).forEach(cat => {
    analysis.averages[cat] = analysis.categories[cat].total / analysis.categories[cat].count
  })
  
  console.log(`📈 Found ${Object.keys(analysis.categories).length} categories`)
  console.log(`🎯 Calculated ${analysis.trends.length} trend points`)
  
  return analysis
}

// Simulate some I/O-like operations (CPU-friendly delays)
function simulateProcessing(analysis) {
  console.log('⚙️  Processing results...')
  
  // Some string processing (moderate CPU usage)
  const report = []
  
  Object.entries(analysis.averages).forEach(([category, average]) => {
    const summary = `Category ${category}: Average value ${average.toFixed(2)}, ` +
                   `Count ${analysis.categories[category].count}`
    report.push(summary)
    
    // CPU-intensive string processing
    for (let k = 0; k < 100; k++) {
      const hash = summary.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      // Use the hash to do some work
      Math.sin(hash) + Math.cos(hash)
    }
  })
  
  // Some JSON operations
  const jsonReport = JSON.stringify({
    summary: report,
    trends: analysis.trends,
    timestamp: new Date().toISOString(),
    metadata: {
      totalRecords: Object.values(analysis.categories).reduce((sum, cat) => sum + cat.count, 0),
      processingVersion: '1.0.0'
    }
  }, null, 2)
  
  // Parse it back (additional JSON work)
  const parsed = JSON.parse(jsonReport)
  
  console.log(`📋 Generated report with ${parsed.summary.length} summaries`)
  return parsed
}

// Mathematical operations - balanced workload
function performCalculations() {
  console.log('🧮 Performing calculations...')
  
  const results = []
  
  // More intensive mathematical operations to increase CPU usage
  for (let i = 0; i < 100000; i++) {
    const base = Math.random() * 100
    
    // More complex calculations
    let complexValue = base
    for (let j = 0; j < 10; j++) {
      complexValue = Math.sin(complexValue) * Math.cos(complexValue * j) + Math.sqrt(complexValue + j)
    }
    
    const result = {
      original: base,
      complex: complexValue,
      square: Math.pow(base, 2),
      sqrt: Math.sqrt(base),
      sin: Math.sin(base),
      cos: Math.cos(base),
      log: Math.log(base + 1),
      fibonacci: calculateFibonacci(Math.floor(base) % 20), // Recursive calculation
      prime: isPrime(Math.floor(base))
    }
    
    // Some conditional logic with more processing
    if (result.square > 5000) {
      result.category = 'high'
      result.adjusted = result.square * 0.8 + Math.random() * result.complex
    } else if (result.square > 1000) {
      result.category = 'medium'
      result.adjusted = result.square * 0.9 + Math.sin(result.complex)
    } else {
      result.category = 'low'
      result.adjusted = result.square * 1.1 + Math.cos(result.complex)
    }
    
    results.push(result)
    
    // Add some CPU-intensive work every 1000 iterations
    if (i % 1000 === 0) {
      sortArray(results.slice(-100)) // Sort recent results
    }
  }
  
  console.log(`🔢 Completed ${results.length} calculations`)
  return results
}

// Helper function for Fibonacci calculation (recursive - uses CPU)
function calculateFibonacci(n) {
  if (n <= 1) return n
  if (n > 15) return n // Limit recursion depth
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2)
}

// Helper function to check if number is prime
function isPrime(num) {
  if (num <= 1) return false
  if (num <= 3) return true
  if (num % 2 === 0 || num % 3 === 0) return false
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false
  }
  return true
}

// Helper function to sort array (CPU work)
function sortArray(arr) {
  return arr.sort((a, b) => a.complex - b.complex)
}

// Main execution
async function main() {
  const startTime = Date.now()
  
  try {
    // Step 1: Generate and process data
    const data = processData()
    
    // Step 2: Analyze the data
    const analysis = analyzeData(data)
    
    // Step 3: Generate report
    const report = simulateProcessing(analysis)
    
    // Step 4: Perform some calculations
    const calculations = performCalculations()
    
    // Step 5: Final summary
    const executionTime = Date.now() - startTime
    console.log('\n✅ Script completed successfully!')
    console.log(`⏱️  Total execution time: ${executionTime}ms`)
    console.log(`📊 Processed ${data.length} records`)
    console.log(`🧮 Performed ${calculations.length} calculations`)
    console.log(`📈 Generated ${analysis.trends.length} trend analysis points`)
    
    // Return some results (keeps data in memory briefly)
    return {
      recordsProcessed: data.length,
      categoriesFound: Object.keys(analysis.categories).length,
      calculationsPerformed: calculations.length,
      executionTimeMs: executionTime,
      efficiency: (data.length / executionTime * 1000).toFixed(2) + ' records/sec'
    }
    
  } catch (error) {
    console.error('❌ Error during execution:', error)
    process.exit(1)
  }
}

// Run the script
main().then(result => {
  console.log('\n🎯 Final Results:', result)
}).catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
