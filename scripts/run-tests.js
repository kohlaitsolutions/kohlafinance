#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🧪 Kohlawise Test Suite Runner")
console.log("================================\n")

// Test categories
const testCategories = {
  unit: {
    name: "Unit Tests",
    pattern: "__tests__/**/*.test.{ts,tsx}",
    description: "Testing individual components and functions",
  },
  integration: {
    name: "Integration Tests",
    pattern: "__tests__/integration/**/*.test.{ts,tsx}",
    description: "Testing component interactions and flows",
  },
  auth: {
    name: "Authentication Tests",
    pattern: "__tests__/auth/**/*.test.{ts,tsx}",
    description: "Testing login, registration, and security",
  },
  dashboard: {
    name: "Dashboard Tests",
    pattern: "__tests__/dashboard/**/*.test.{ts,tsx}",
    description: "Testing dashboard functionality",
  },
  onboarding: {
    name: "Onboarding Tests",
    pattern: "__tests__/onboarding/**/*.test.{ts,tsx}",
    description: "Testing user onboarding flow",
  },
}

function runCommand(command, description) {
  console.log(`\n📋 ${description}`)
  console.log("─".repeat(50))

  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: "inherit",
      cwd: process.cwd(),
    })
    console.log("✅ Success\n")
    return true
  } catch (error) {
    console.log("❌ Failed\n")
    return false
  }
}

function generateTestReport() {
  console.log("\n📊 Generating Test Report...")

  try {
    execSync("npm run test:coverage -- --silent --json --outputFile=coverage/test-results.json", {
      encoding: "utf8",
      stdio: "pipe",
    })

    const resultsPath = path.join(process.cwd(), "coverage", "test-results.json")
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"))

      console.log("\n📈 Test Coverage Summary:")
      console.log("─".repeat(30))
      console.log(`Lines: ${results.coverageMap?.getCoverageSummary?.()?.lines?.pct || "N/A"}%`)
      console.log(`Functions: ${results.coverageMap?.getCoverageSummary?.()?.functions?.pct || "N/A"}%`)
      console.log(`Branches: ${results.coverageMap?.getCoverageSummary?.()?.branches?.pct || "N/A"}%`)
      console.log(`Statements: ${results.coverageMap?.getCoverageSummary?.()?.statements?.pct || "N/A"}%`)
    }
  } catch (error) {
    console.log("⚠️  Could not generate detailed coverage report")
  }
}

async function main() {
  const args = process.argv.slice(2)
  const category = args[0]

  if (category && testCategories[category]) {
    // Run specific test category
    const testConfig = testCategories[category]
    console.log(`🎯 Running ${testConfig.name}`)
    console.log(`📝 ${testConfig.description}\n`)

    const success = runCommand(`npm test -- --testPathPattern="${testConfig.pattern}"`, `Executing ${testConfig.name}`)

    if (success) {
      console.log(`✅ ${testConfig.name} completed successfully!`)
    } else {
      console.log(`❌ ${testConfig.name} failed!`)
      process.exit(1)
    }
  } else if (category === "all" || !category) {
    // Run all tests
    console.log("🚀 Running Complete Test Suite\n")

    let allPassed = true

    // Run each test category
    for (const [key, config] of Object.entries(testCategories)) {
      console.log(`\n🔍 ${config.name}`)
      console.log(`📝 ${config.description}`)

      const success = runCommand(
        `npm test -- --testPathPattern="${config.pattern}" --passWithNoTests`,
        `Running ${config.name}`,
      )

      if (!success) {
        allPassed = false
      }
    }

    // Generate coverage report
    generateTestReport()

    // Final summary
    console.log("\n" + "=".repeat(50))
    if (allPassed) {
      console.log("🎉 All tests passed! Your application is ready for deployment.")
    } else {
      console.log("❌ Some tests failed. Please review and fix the issues.")
      process.exit(1)
    }
  } else {
    // Show help
    console.log("Usage: npm run test:suite [category]\n")
    console.log("Available categories:")
    for (const [key, config] of Object.entries(testCategories)) {
      console.log(`  ${key.padEnd(12)} - ${config.description}`)
    }
    console.log("  all          - Run all test categories")
    console.log("\nExamples:")
    console.log("  npm run test:suite auth")
    console.log("  npm run test:suite all")
    console.log("  npm run test:suite")
  }
}

main().catch(console.error)
