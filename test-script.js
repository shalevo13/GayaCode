// Moderately intensive test script for GayaCode analysis (targeting ~70 // Moderate nested loops
console.log('🔢 Phase 4: Computational loops...')
let computeResult = 0
for (let i = 0; i < 200; i++) {
  for (let j = 0; j < 200; j++) {
    computeResult += Math.sin(i * 0.01) * Math.cos(j * 0.01)
  }
  if (i % 40 === 0) {
    console.log(`  ⚙️  Loop iteration ${i + 1}/200`)
  }
}console.log('⚡ Starting moderate test script...')

// Moderate CPU computational tasks
console.log('🧮 Phase 1: Computational work...')
for (let round = 0; round < 2; round++) {
  console.log(`  🔄 Round ${round + 1}/2`)
  
  // Prime number calculation (moderate intensity)
  const primes = []
  for (let i = 2; i < 7000; i++) {
    let isPrime = true
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) primes.push(i)
  }
  
  // Mathematical operations
  for (let i = 0; i < 200000; i++) {
    Math.sqrt(i) * Math.pow(i, 0.5)
    Math.sin(i / 1000) + Math.cos(i / 1000)
  }
}

// Moderate memory operations
console.log('💾 Phase 2: Memory operations...')
const dataArrays = []
for (let i = 0; i < 3; i++) {
  console.log(`  📊 Creating data structure ${i + 1}/3`)
  
  // Create moderately sized arrays
  const chunk = new Array(60000).fill(0).map((_, idx) => ({
    id: idx,
    value: Math.random() * 1000,
    text: Math.random().toString(36).substring(2, 8),
    computed: Math.random() * Math.PI
  }))
  
  dataArrays.push(chunk)
  
  // Process the data
  chunk.forEach(item => {
    item.processed = item.value * 2 + Math.sin(item.computed)
  })
}

// Simulated data processing
console.log('� Phase 3: Data processing...')
for (let i = 0; i < 50; i++) {
  // Generate and process data
  const dataset = new Array(5000).fill(0).map(() => ({
    timestamp: Date.now(),
    value: Math.random(),
    category: Math.floor(Math.random() * 10)
  }))
  
  // Sort and filter operations
  const sorted = dataset.sort((a, b) => a.value - b.value)
  const filtered = sorted.filter(item => item.value > 0.5)
  const grouped = filtered.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})
  
  if (i % 10 === 0) {
    console.log(`  � Processed dataset ${i + 1}/50`)
  }
}

// Moderate nested loops
console.log('� Phase 4: Computational loops...')
let result = 0
for (let i = 0; i < 300; i++) {
  for (let j = 0; j < 300; j++) {
    result += Math.sin(i * 0.01) * Math.cos(j * 0.01)
  }
  if (i % 50 === 0) {
    console.log(`  ⚙️  Loop iteration ${i + 1}/300`)
  }
}

// Brief intensive work
console.log('⚡ Phase 5: Final processing...')
await new Promise(resolve => {
  let counter = 0
  const interval = setInterval(() => {
    // Some continuous work
    for (let i = 0; i < 50000; i++) {
      Math.random() * Math.sin(counter * 0.1)
    }
    
    counter++
    if (counter % 3 === 0) {
      console.log(`  ⚡ Processing cycle ${counter}/10`)
    }
    
    if (counter >= 10) {
      clearInterval(interval)
      resolve()
    }
  }, 100)
})

console.log(`🎯 Final result: ${computeResult.toFixed(4)}`)
console.log(`📊 Data structures created: ${dataArrays.length}`)
console.log('✅ Moderate test script completed!')
