export function decideCargoGate(pendingFindings) {
  const findings = Array.isArray(pendingFindings) ? pendingFindings : [];

  if (findings.length === 0) {
    return {
      stage: 'compliance_ok',
      riskScore: 8,
      findings: [],
      steps: {
        ocr: 'done',
        crosscheck: 'done',
        decision: 'done',
        flag: 'skipped',
        handoff: 'skipped'
      },
      timelineLabel: 'Cleared. No issues'
    };
  }

  return {
    stage: 'flagged',
    findings,
    steps: {
      ocr: 'done',
      crosscheck: 'done',
      decision: 'done',
      flag: 'running'
    },
    timelineLabel: `${findings.length} issues found`
  };
}
