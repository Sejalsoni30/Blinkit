export interface WhatIfParams {
  storeId?: string;
  pickerCountChange: number; // e.g. +2 or -2
  avgPickSpeedImprovementPercent: number; // e.g. 10 (10% faster pick)
  riderHandoverReductionSeconds: number; // e.g. 15 (15 seconds faster)
  orderVolumeSurgePercent: number; // e.g. 20 (20% surge)
}

export class WhatIfService {
  simulate(currentMetrics: { slaComplianceRate: number; avgTotalSeconds: number; totalOrders: number }, params: WhatIfParams) {
    const baseSla = currentMetrics.slaComplianceRate || 89.5;
    const baseDuration = currentMetrics.avgTotalSeconds || 460;

    // Mathematical modeling of queuing theory in dark stores
    // 1 picker roughly provides ~10-12 orders/hr capacity.
    // Adding 1 picker reduces queue wait by ~15-20 seconds in peak hours.
    const pickerImpactSeconds = params.pickerCountChange * -16;
    const speedImpactSeconds = (baseDuration * 0.35) * (params.avgPickSpeedImprovementPercent / 100) * -1;
    const handoverImpactSeconds = params.riderHandoverReductionSeconds * -1;
    const volumeImpactSeconds = (params.orderVolumeSurgePercent / 100) * 45;

    const netSecondsChange = pickerImpactSeconds + speedImpactSeconds + handoverImpactSeconds + volumeImpactSeconds;
    const projectedAvgSeconds = Math.max(300, Math.round(baseDuration + netSecondsChange));

    // SLA compliance sensitivity curve:
    // If delivery is ~460s, moving 10s changes SLA breach probability by ~0.8%
    const slaDelta = Number(((baseDuration - projectedAvgSeconds) * 0.08).toFixed(1));
    const projectedSla = Math.min(99.5, Math.max(65.0, Number((baseSla + slaDelta).toFixed(1))));

    return {
      baseline: {
        slaComplianceRate: baseSla,
        avgTotalSeconds: baseDuration,
      },
      projected: {
        slaComplianceRate: projectedSla,
        avgTotalSeconds: projectedAvgSeconds,
        slaDeltaPercent: Number((projectedSla - baseSla).toFixed(1)),
        secondsSavedPerOrder: Math.round(baseDuration - projectedAvgSeconds),
      },
      analysis: {
        pickerImpact: `${params.pickerCountChange >= 0 ? '+' : ''}${params.pickerCountChange} pickers alters throughput by ${Math.abs(pickerImpactSeconds)}s`,
        volumeImpact: `${params.orderVolumeSurgePercent}% surge adds ${Math.round(volumeImpactSeconds)}s congestion`,
        verdict: projectedSla >= 92 ? 'OPTIMAL (Achieves >92% target)' : 'AT RISK (Requires further staff augmentation)',
      },
    };
  }
}

export const whatIfService = new WhatIfService();
