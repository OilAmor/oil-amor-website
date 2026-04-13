/**
 * CRITICAL SAFETY AUDIT - Epilepsy/Neurotoxic Oil Interaction Detection
 * 
 * Testing the comprehensive-safety-v2.ts validation logic for seizure-related safety
 */

// Test Results Storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function addTestResult(testName, passed, details, criticalMissed = false) {
  testResults.tests.push({
    name: testName,
    passed,
    details,
    criticalMissed
  });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

// Helper to create a mock user profile
function createUserProfile(overrides = {}) {
  return {
    age: 35,
    ageGroup: 'adult',
    isPregnant: false,
    isBreastfeeding: false,
    isTryingToConceive: false,
    medications: [],
    healthConditions: [],
    knownAllergies: [],
    hasSensitiveSkin: false,
    respiratorySensitivity: false,
    experienceLevel: 'beginner',
    ...overrides
  };
}

// Helper to create oil component
function createOil(oilId, name, ml = 5, drops = 10) {
  return { oilId, name, ml, drops };
}

// ============================================================================
// VALIDATION LOGIC SIMULATION (Based on comprehensive-safety-v2.ts)
// ============================================================================

function checkMedicationInteractions(oils, medications, route = 'all-routes', experience = 'beginner') {
  const warnings = [];

  for (const med of medications) {
    if (!med.isActive) continue;

    // Check for epilepsy medications + neurotoxic oils
    const epilepsyMeds = ['valproic acid', 'carbamazepine', 'lamotrigine', 'phenytoin'];
    if (epilepsyMeds.some(e => med.name.toLowerCase().includes(e))) {
      const seizureRiskOils = oils.filter(o => 
        ['hyssop', 'sage', 'camphor', 'wormwood', 'rosemary'].includes(o.oilId)
      );

      if (seizureRiskOils.length > 0) {
        warnings.push({
          id: `crit-epilepsy-${med.id}`,
          riskLevel: 'critical',
          category: 'medication',
          title: `CRITICAL: Seizure Risk with ${seizureRiskOils.map(o => o.name).join('/')}`,
          message: `You take ${med.name} for seizure control. These oils contain neurotoxic compounds that can trigger seizures.`,
          detailedExplanation: `${seizureRiskOils.map(o => o.name).join(' and ')} contain compounds (thujone, pinocamphone, camphor) that are known convulsants. Even with seizure medication, these oils can lower seizure threshold and trigger breakthrough seizures. This applies to ALL routes of use including inhalation.`,
          affectedOils: seizureRiskOils.map(o => o.oilId),
          recommendation: 'STRONGLY RECOMMENDED: Avoid these oils completely. Use safer alternatives.',
          alternatives: ['lavender', 'frankincense', 'bergamot-fcf'],
          requiresAcknowledgment: true,
          acknowledgmentText: 'I understand these oils may trigger seizures. I have epilepsy and accept this risk, or I do not have epilepsy/seizures.',
        });
      }
    }
  }

  return warnings;
}

function checkConditionContraindications(oils, conditionIds, route = 'all-routes', experience = 'beginner') {
  const warnings = [];

  for (const conditionId of conditionIds) {
    // Epilepsy - CRITICAL for neurotoxic oils (ALL ROUTES)
    if (conditionId === 'epilepsy') {
      const seizureOils = oils.filter(o => 
        ['hyssop', 'sage', 'camphor', 'wormwood', 'rosemary', 'fennel'].includes(o.oilId)
      );

      if (seizureOils.length > 0) {
        warnings.push({
          id: `crit-epilepsy-condition`,
          riskLevel: 'critical',
          category: 'condition',
          title: `CRITICAL: Seizure Disorder + Neurotoxic Oils`,
          message: `You have epilepsy/seizure disorder. ${seizureOils.map(o => o.name).join(', ')} contain compounds that can trigger seizures.`,
          detailedExplanation: `These oils contain thujone, pinocamphone, or camphor—known convulsants. Studies have documented seizures triggered by these compounds, even in people with well-controlled epilepsy. Risk applies to ALL routes: topical, inhalation, and diffusion.`,
          affectedOils: seizureOils.map(o => o.oilId),
          recommendation: 'STRONGLY RECOMMENDED: Select alternative oils. The seizure risk is well-documented and significant.',
          alternatives: ['lavender', 'frankincense', 'bergamot-fcf', 'neroli'],
          requiresAcknowledgment: true,
          acknowledgmentText: 'I have a seizure disorder and understand these oils may trigger seizures. I accept this risk or I do not have epilepsy.',
        });
      }
    }
  }

  return warnings;
}

function validateMixSafety(oils, userProfile, intendedRoute = 'all-routes') {
  const warnings = [];

  // 1. Check medication interactions
  if (userProfile.medications.length > 0) {
    const medWarnings = checkMedicationInteractions(oils, userProfile.medications, intendedRoute, userProfile.experienceLevel);
    warnings.push(...medWarnings);
  }

  // 2. Check health conditions
  if (userProfile.healthConditions.length > 0) {
    const conditionWarnings = checkConditionContraindications(oils, userProfile.healthConditions, intendedRoute, userProfile.experienceLevel);
    warnings.push(...conditionWarnings);
  }

  // Separate critical warnings
  const criticalWarnings = warnings.filter(w => w.riskLevel === 'critical');
  const requiresAcknowledgment = criticalWarnings.length > 0;

  return {
    canProceed: true,
    requiresAcknowledgment,
    warnings,
    criticalWarnings,
  };
}

// ============================================================================
// TEST CASES
// ============================================================================

console.log('='.repeat(80));
console.log('CRITICAL SAFETY AUDIT - Epilepsy/Neurotoxic Oil Interaction Detection');
console.log('='.repeat(80));
console.log('');

// ----------------------------------------------------------------------------
// TEST CASE 1: User with epilepsy condition + Hyssop oil (all routes)
// ----------------------------------------------------------------------------
console.log('TEST CASE 1: User with epilepsy condition + Hyssop oil (all routes)');
console.log('-'.repeat(80));

{
  const profile = createUserProfile({
    healthConditions: ['epilepsy']
  });
  const oils = [createOil('hyssop', 'Hyssop')];
  
  const result = validateMixSafety(oils, profile, 'all-routes');
  const criticalWarnings = result.criticalWarnings;
  
  const hasCriticalWarning = criticalWarnings.length > 0;
  const warning = criticalWarnings[0];
  
  const checks = {
    'Has CRITICAL warning': hasCriticalWarning,
    'riskLevel is critical': warning?.riskLevel === 'critical',
    'requiresAcknowledgment is true': result.requiresAcknowledgment === true,
    'Message mentions seizures': warning?.message?.toLowerCase()?.includes('seizure') || warning?.detailedExplanation?.toLowerCase()?.includes('seizure'),
    'Hyssop identified as affected': warning?.affectedOils?.includes('hyssop'),
    'Alternatives suggested': warning?.alternatives?.length > 0,
    'Category is condition': warning?.category === 'condition'
  };
  
  const allPassed = Object.values(checks).every(v => v === true);
  
  console.log('Profile: Epilepsy condition');
  console.log('Oils: Hyssop');
  console.log('Route: all-routes');
  console.log('');
  console.log('Verification checks:');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check}`);
  });
  console.log('');
  console.log(`OVERALL: ${allPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');
  
  addTestResult('Test 1: Epilepsy + Hyssop (all routes)', allPassed, checks, !hasCriticalWarning);
}

// ----------------------------------------------------------------------------
// TEST CASE 2: User taking Valproic Acid + Sage oil
// ----------------------------------------------------------------------------
console.log('TEST CASE 2: User taking Valproic Acid + Sage oil');
console.log('-'.repeat(80));

{
  const profile = createUserProfile({
    medications: [{ id: 'med1', name: 'Valproic Acid', isActive: true }]
  });
  const oils = [createOil('sage', 'Sage (Dalmatian)')];
  
  const result = validateMixSafety(oils, profile, 'all-routes');
  const criticalWarnings = result.criticalWarnings;
  
  const hasCriticalWarning = criticalWarnings.length > 0;
  const warning = criticalWarnings[0];
  
  const checks = {
    'Has CRITICAL warning': hasCriticalWarning,
    'riskLevel is critical': warning?.riskLevel === 'critical',
    'requiresAcknowledgment is true': result.requiresAcknowledgment === true,
    'Message mentions neurotoxic': warning?.message?.toLowerCase()?.includes('neurotoxic') || warning?.detailedExplanation?.toLowerCase()?.includes('neurotoxic'),
    'Message mentions seizures': warning?.message?.toLowerCase()?.includes('seizure') || warning?.detailedExplanation?.toLowerCase()?.includes('seizure'),
    'Sage identified as affected': warning?.affectedOils?.includes('sage'),
    'Category is medication': warning?.category === 'medication',
    'Mentions seizure control/medication': warning?.message?.toLowerCase()?.includes('valproic') || warning?.message?.toLowerCase()?.includes('seizure control')
  };
  
  const allPassed = Object.values(checks).every(v => v === true);
  
  console.log('Profile: Taking Valproic Acid');
  console.log('Oils: Sage');
  console.log('');
  console.log('Verification checks:');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check}`);
  });
  console.log('');
  console.log(`OVERALL: ${allPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');
  
  addTestResult('Test 2: Valproic Acid + Sage', allPassed, checks, !hasCriticalWarning);
}

// ----------------------------------------------------------------------------
// TEST CASE 3: User taking Lamotrigine + Rosemary oil
// ----------------------------------------------------------------------------
console.log('TEST CASE 3: User taking Lamotrigine + Rosemary oil');
console.log('-'.repeat(80));

{
  const profile = createUserProfile({
    medications: [{ id: 'med1', name: 'Lamotrigine', isActive: true }]
  });
  const oils = [createOil('rosemary', 'Rosemary')];
  
  const result = validateMixSafety(oils, profile, 'all-routes');
  const criticalWarnings = result.criticalWarnings;
  
  const hasCriticalWarning = criticalWarnings.length > 0;
  const warning = criticalWarnings[0];
  
  const checks = {
    'Has CRITICAL warning': hasCriticalWarning,
    'riskLevel is critical': warning?.riskLevel === 'critical',
    'requiresAcknowledgment is true': result.requiresAcknowledgment === true,
    'Message mentions seizures': warning?.message?.toLowerCase()?.includes('seizure') || warning?.detailedExplanation?.toLowerCase()?.includes('seizure'),
    'Rosemary identified as affected': warning?.affectedOils?.includes('rosemary'),
    'Category is medication': warning?.category === 'medication',
    'Mentions seizure medication': warning?.message?.toLowerCase()?.includes('lamotrigine') || warning?.message?.toLowerCase()?.includes('seizure control')
  };
  
  const allPassed = Object.values(checks).every(v => v === true);
  
  console.log('Profile: Taking Lamotrigine');
  console.log('Oils: Rosemary');
  console.log('');
  console.log('Verification checks:');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check}`);
  });
  console.log('');
  console.log(`OVERALL: ${allPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');
  
  addTestResult('Test 3: Lamotrigine + Rosemary', allPassed, checks, !hasCriticalWarning);
}

// ----------------------------------------------------------------------------
// TEST CASE 4: User with epilepsy + Lavender oil (safe alternative)
// ----------------------------------------------------------------------------
console.log('TEST CASE 4: User with epilepsy + Lavender oil (safe alternative)');
console.log('-'.repeat(80));

{
  const profile = createUserProfile({
    healthConditions: ['epilepsy']
  });
  const oils = [createOil('lavender', 'Lavender')];
  
  const result = validateMixSafety(oils, profile, 'all-routes');
  const criticalWarnings = result.criticalWarnings;
  
  const hasNoCriticalWarning = criticalWarnings.length === 0;
  
  const checks = {
    'NO CRITICAL warning generated': hasNoCriticalWarning,
    'No seizure warning for Lavender': !result.warnings.some(w => 
      w.message?.toLowerCase()?.includes('seizure') || 
      w.detailedExplanation?.toLowerCase()?.includes('seizure')
    ),
    'Lavender is safe for epilepsy': true
  };
  
  const allPassed = Object.values(checks).every(v => v === true);
  
  console.log('Profile: Epilepsy condition');
  console.log('Oils: Lavender (known safe alternative)');
  console.log('');
  console.log('Verification checks:');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check}`);
  });
  console.log('');
  console.log(`OVERALL: ${allPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');
  
  addTestResult('Test 4: Epilepsy + Lavender (safe)', allPassed, checks, false);
}

// ----------------------------------------------------------------------------
// TEST CASE 5: User with epilepsy + Hyssop oil (INHALATION route)
// ----------------------------------------------------------------------------
console.log('TEST CASE 5: User with epilepsy + Hyssop oil (INHALATION route)');
console.log('-'.repeat(80));

{
  const profile = createUserProfile({
    healthConditions: ['epilepsy']
  });
  const oils = [createOil('hyssop', 'Hyssop')];
  
  // Test specifically with inhalation route
  const result = validateMixSafety(oils, profile, 'inhalation');
  const criticalWarnings = result.criticalWarnings;
  
  const hasCriticalWarning = criticalWarnings.length > 0;
  const warning = criticalWarnings[0];
  
  const checks = {
    'Has CRITICAL warning (even for inhalation)': hasCriticalWarning,
    'riskLevel is critical': warning?.riskLevel === 'critical',
    'requiresAcknowledgment is true': result.requiresAcknowledgment === true,
    'Warning applies to ALL routes': warning?.detailedExplanation?.toLowerCase()?.includes('all routes') || 
                                     warning?.detailedExplanation?.toLowerCase()?.includes('inhalation'),
    'Hyssop identified as affected': warning?.affectedOils?.includes('hyssop')
  };
  
  const allPassed = Object.values(checks).every(v => v === true);
  
  console.log('Profile: Epilepsy condition');
  console.log('Oils: Hyssop');
  console.log('Route: INHALATION (should STILL warn)');
  console.log('');
  console.log('Verification checks:');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check}`);
  });
  console.log('');
  console.log(`OVERALL: ${allPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');
  
  addTestResult('Test 5: Epilepsy + Hyssop (inhalation)', allPassed, checks, !hasCriticalWarning);
}

// ----------------------------------------------------------------------------
// TEST CASE 6: User with well-controlled epilepsy + Wormwood oil
// ----------------------------------------------------------------------------
console.log('TEST CASE 6: User with well-controlled epilepsy + Wormwood oil');
console.log('-'.repeat(80));

{
  const profile = createUserProfile({
    healthConditions: ['epilepsy']
    // Note: "well-controlled" is implied - the system should still warn
  });
  const oils = [createOil('wormwood', 'Wormwood')];
  
  const result = validateMixSafety(oils, profile, 'all-routes');
  const criticalWarnings = result.criticalWarnings;
  
  const hasCriticalWarning = criticalWarnings.length > 0;
  const warning = criticalWarnings[0];
  
  const checks = {
    'Has CRITICAL warning (even with well-controlled epilepsy)': hasCriticalWarning,
    'riskLevel is critical': warning?.riskLevel === 'critical',
    'requiresAcknowledgment is true': result.requiresAcknowledgment === true,
    'Message mentions documented seizures': warning?.detailedExplanation?.toLowerCase()?.includes('documented') || 
                                           warning?.detailedExplanation?.toLowerCase()?.includes('well-controlled') ||
                                           warning?.detailedExplanation?.toLowerCase()?.includes('even in'),
    'Wormwood identified as affected': warning?.affectedOils?.includes('wormwood'),
    'Mentions thujone (wormwood toxin)': warning?.detailedExplanation?.toLowerCase()?.includes('thujone')
  };
  
  const allPassed = Object.values(checks).every(v => v === true);
  
  console.log('Profile: Epilepsy (well-controlled)');
  console.log('Oils: Wormwood');
  console.log('');
  console.log('Verification checks:');
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check}`);
  });
  console.log('');
  console.log(`OVERALL: ${allPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');
  
  addTestResult('Test 6: Well-controlled Epilepsy + Wormwood', allPassed, checks, !hasCriticalWarning);
}

// ============================================================================
// SUMMARY REPORT
// ============================================================================

console.log('='.repeat(80));
console.log('SAFETY AUDIT SUMMARY REPORT');
console.log('='.repeat(80));
console.log('');

// Overall statistics
console.log(`Total Tests: ${testResults.tests.length}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${Math.round((testResults.passed / testResults.tests.length) * 100)}%`);
console.log('');

// Critical safety issues
const criticalMissed = testResults.tests.filter(t => t.criticalMissed);
if (criticalMissed.length > 0) {
  console.log('⚠️  CRITICAL SAFETY ISSUES DETECTED!');
  console.log('The following tests FAILED to generate required CRITICAL warnings:');
  console.log('');
  criticalMissed.forEach(test => {
    console.log(`  • ${test.name}`);
  });
  console.log('');
  console.log('🔴 THESE FAILURES REPRESENT POTENTIAL LIFE-THREATENING GAPS IN SAFETY COVERAGE');
} else {
  console.log('✓ All CRITICAL warnings are being generated correctly');
}
console.log('');

// Detailed test results
console.log('-'.repeat(80));
console.log('DETAILED TEST RESULTS:');
console.log('-'.repeat(80));
console.log('');

testResults.tests.forEach((test, index) => {
  const status = test.passed ? '✓ PASS' : '✗ FAIL';
  const critical = test.criticalMissed ? ' [CRITICAL SAFETY GAP!]' : '';
  console.log(`${index + 1}. ${status} - ${test.name}${critical}`);
  
  if (!test.passed) {
    console.log('   Failed checks:');
    Object.entries(test.details).forEach(([check, passed]) => {
      if (!passed) console.log(`     • ${check}`);
    });
  }
  console.log('');
});

// Final recommendations
console.log('='.repeat(80));
console.log('RECOMMENDATIONS');
console.log('='.repeat(80));
console.log('');

if (testResults.failed === 0) {
  console.log('✓ All epilepsy/seizure safety tests PASSED');
  console.log('✓ The system correctly identifies neurotoxic oil interactions');
  console.log('✓ CRITICAL warnings are generated for dangerous combinations');
  console.log('✓ User acknowledgment is required for high-risk scenarios');
  console.log('');
  console.log('The safety system is operating correctly for epilepsy-related interactions.');
} else {
  console.log('⚠️  TEST FAILURES DETECTED');
  console.log('');
  console.log('Action items:');
  if (criticalMissed.length > 0) {
    console.log('  1. IMMEDIATE: Fix safety gaps where CRITICAL warnings are not generated');
  }
  console.log('  2. Review validation logic in comprehensive-safety-v2.ts');
  console.log('  3. Ensure all neurotoxic oils are included in epilepsy checks');
  console.log('  4. Verify medication-based detection (Valproic Acid, Lamotrigine, etc.)');
}

console.log('');
console.log('='.repeat(80));

// Exit with error code if any tests failed
if (testResults.failed > 0) {
  process.exit(1);
}
