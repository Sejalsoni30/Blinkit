import { describe, it, expect } from 'vitest';
import { whatIfService } from '../services/whatif.service.js';

describe('WhatIfService - Fulfillment Simulation Engine', () => {
  const currentMetrics = {
    slaComplianceRate: 88.5,
    avgTotalSeconds: 470,
    totalOrders: 1000,
  };

  it('should project SLA improvement when adding pickers', () => {
    const result = whatIfService.simulate(currentMetrics, {
      pickerCountChange: 3,
      avgPickSpeedImprovementPercent: 0,
      riderHandoverReductionSeconds: 0,
      orderVolumeSurgePercent: 0,
    });

    expect(result.projected.slaComplianceRate).toBeGreaterThan(currentMetrics.slaComplianceRate);
    expect(result.projected.avgTotalSeconds).toBeLessThan(currentMetrics.avgTotalSeconds);
    expect(result.projected.secondsSavedPerOrder).toBeGreaterThan(0);
  });

  it('should project SLA drop under order volume surge without staffing changes', () => {
    const result = whatIfService.simulate(currentMetrics, {
      pickerCountChange: 0,
      avgPickSpeedImprovementPercent: 0,
      riderHandoverReductionSeconds: 0,
      orderVolumeSurgePercent: 30, // 30% surge
    });

    expect(result.projected.slaComplianceRate).toBeLessThan(currentMetrics.slaComplianceRate);
    expect(result.projected.avgTotalSeconds).toBeGreaterThan(currentMetrics.avgTotalSeconds);
  });

  it('should accurately calculate combined speed boost and handover reduction', () => {
    const result = whatIfService.simulate(currentMetrics, {
      pickerCountChange: 0,
      avgPickSpeedImprovementPercent: 15,
      riderHandoverReductionSeconds: 20,
      orderVolumeSurgePercent: 0,
    });

    expect(result.projected.slaDeltaPercent).toBeGreaterThan(0);
    expect(result.baseline.slaComplianceRate).toBe(88.5);
  });
});
