import React, { useState } from 'react';
import {
  X,
  Download,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Sparkles,
  Bell,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface WeeklyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  storeId?: string;
}

export const WeeklyDigestModal: React.FC<WeeklyDigestModalProps> = ({
  isOpen,
  onClose,
  storeName = 'National Fleet (All Stores)',
  storeId = 'ALL',
}) => {
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDay, setScheduleDay] = useState('Monday');
  const [scheduleTime, setScheduleTime] = useState('08:00 AM');
  const [notificationSaved, setNotificationSaved] = useState(false);

  if (!isOpen) return null;

  // Digest Performance Summary Metrics
  const digestMetrics = {
    slaCompliance: 91.8,
    slaTarget: 90.0,
    totalOrdersHandled: 14820,
    avgFulfillmentSec: 432,
    p90FulfillmentSec: 574,
    breachedCount: 1215,
    topBottleneckStage: 'Packing Queue (Avg 88s vs 45s target)',
    criticalAisleCongestion: 'Aisle 3 & 4 (Dairy & Fresh)',
  };

  const stageBreakdown = [
    { stage: 'Order Placement & Picker Assign', avgSec: 22, p90Sec: 35, targetSec: 30, status: 'Healthy' },
    { stage: 'SKU Picking & Basket Scan', avgSec: 154, p90Sec: 198, targetSec: 180, status: 'Healthy' },
    { stage: 'Packing & Bag Sealing', avgSec: 88, p90Sec: 132, targetSec: 60, status: 'Bottleneck' },
    { stage: 'Rider Handover & Dispatch', avgSec: 42, p90Sec: 68, targetSec: 60, status: 'Healthy' },
    { stage: 'Last-Mile Delivery Transit', avgSec: 126, p90Sec: 185, targetSec: 270, status: 'Optimal' },
  ];

  const topBreachCauses = [
    { cause: 'Packing Station Queue Backlog', percent: 38, count: 462, impact: '+84s delay per order' },
    { cause: 'Rider Handover Wait at Dock', percent: 26, count: 316, impact: '+62s delay per order' },
    { cause: 'Aisle Distance & Heavy SKU Walk', percent: 21, count: 255, impact: '+48s delay per order' },
    { cause: 'Stockout SKU Substitution', percent: 15, count: 182, impact: '+110s delay per order' },
  ];

  const actionRecommendations = [
    {
      title: 'Deploy Secondary Packing Table during 18:00-21:00 Peak',
      description: 'Packing stage is currently consuming 20% of fulfillment budget. An extra packer cuts P90 queue by 45s.',
      impact: 'Projected +2.4% SLA Compliance uplift',
      tag: 'High Impact',
    },
    {
      title: 'Relocate Fast-Moving Dairy & Beverages Closer to Dispatch',
      description: 'SKUs in Aisle 4 account for 34% of pick trip distance. Grouping top 20 items saves 28s per basket.',
      impact: 'Saves ~4.2 mins picker transit per hour',
      tag: 'Ops Layout',
    },
    {
      title: 'Advance Rider Pre-Dispatch Broadcast by 60 Seconds',
      description: 'Riders arrive 45s after bagging completes, leaving orders staged on dock. Pre-dispatch removes waiting.',
      impact: 'Reduces dock dwell time to <20s',
      tag: 'Rider SLA',
    },
  ];

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const generatedDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Header Banner
    doc.setFillColor(248, 203, 70); // Blinkit Yellow #F8CB46
    doc.rect(0, 0, 210, 26, 'F');

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('BLINKIT DARK STORE OPS — WEEKLY SLA DIGEST', 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Scope: ${storeName} | Period: Past 7 Operating Days | Generated: ${generatedDate}`, 14, 22);

    // KPI Summary Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Executive SLA Health Scorecard', 14, 36);

    const kpiHeaders = [['Metric', 'Observed Value', 'SLA Target', 'Status']];
    const kpiRows = [
      ['10-Minute SLA Compliance', `${digestMetrics.slaCompliance}%`, '≥ 90.0%', 'TARGET ACHIEVED (PASS)'],
      ['Total Orders Evaluated', `${digestMetrics.totalOrdersHandled.toLocaleString()}`, '—', 'Fleet Volume'],
      ['Avg Total Fulfillment Time', `${digestMetrics.avgFulfillmentSec} sec (7.2m)`, '≤ 600 sec (10m)', 'NOMINAL'],
      ['P90 Total Fulfillment Time', `${digestMetrics.p90FulfillmentSec} sec (9.5m)`, '≤ 600 sec (10m)', 'IN COMPLIANCE'],
      ['Total SLA Breaches', `${digestMetrics.breachedCount} orders`, '< 10% volume', '8.2% Breach Rate'],
    ];

    autoTable(doc, {
      startY: 40,
      head: kpiHeaders,
      body: kpiRows,
      theme: 'grid',
      headStyles: { fillColor: [248, 203, 70], textColor: [20, 20, 20], fontStyle: 'bold' },
      styles: { fontSize: 8.5 },
    });

    // Stage Funnel Section
    const nextY1 = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Fulfillment Funnel Stage Breakdown', 14, nextY1);

    const stageHeaders = [['Pipeline Stage', 'Avg Duration', 'P90 Duration', 'Budget Target', 'Health Evaluation']];
    const stageRows = stageBreakdown.map((s) => [
      s.stage,
      `${s.avgSec}s`,
      `${s.p90Sec}s`,
      `≤ ${s.targetSec}s`,
      s.status.toUpperCase(),
    ]);

    autoTable(doc, {
      startY: nextY1 + 4,
      head: stageHeaders,
      body: stageRows,
      theme: 'striped',
      headStyles: { fillColor: [12, 131, 31], textColor: [255, 255, 255], fontStyle: 'bold' }, // Blinkit Green #0C831F
      styles: { fontSize: 8.5 },
    });

    // Top Breach Causes
    const nextY2 = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Root Causes Behind SLA Breaches', 14, nextY2);

    const causeHeaders = [['Breach Factor', 'Share of Breaches', 'Incident Count', 'Average Stage Impact']];
    const causeRows = topBreachCauses.map((c) => [c.cause, `${c.percent}%`, `${c.count}`, c.impact]);

    autoTable(doc, {
      startY: nextY2 + 4,
      head: causeHeaders,
      body: causeRows,
      theme: 'striped',
      headStyles: { fillColor: [248, 203, 70], textColor: [20, 20, 20], fontStyle: 'bold' },
      styles: { fontSize: 8.5 },
    });

    // Recommendations Section
    const nextY3 = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Recommended Ops Actions for Next Week', 14, nextY3);

    const recHeaders = [['Priority Recommendation', 'Root Issue Addressed', 'Projected Impact']];
    const recRows = actionRecommendations.map((r) => [r.title, r.description, r.impact]);

    autoTable(doc, {
      startY: nextY3 + 4,
      head: recHeaders,
      body: recRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8 },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Blinkit Dark Store Fulfillment Analyzer — Confidential Operations Telemetry. Proprietary and confidential.',
      14,
      Math.min(finalY, 285)
    );

    doc.save(`Blinkit_Weekly_SLA_Digest_${storeId}_${generatedDate.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSaveSchedule = () => {
    setNotificationSaved(true);
    setTimeout(() => {
      setNotificationSaved(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-xs text-gray-950">
                b
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full border border-yellow-300">
                Weekly Ops Performance Digest
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              7-Day Dark Store SLA Fulfillment Report
            </h2>
            <p className="text-xs text-gray-500">
              Scope: <span className="font-bold text-gray-800">{storeName}</span> • Evaluated across{' '}
              <span className="font-semibold text-gray-800">14,820 live customer deliveries</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Cards Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">10-Min SLA Rate</div>
            <div className="text-2xl font-black text-emerald-950 mt-1">{digestMetrics.slaCompliance}%</div>
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Above 90% SLA Target</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Avg Delivery Time</div>
            <div className="text-2xl font-black text-amber-950 mt-1">7m 12s</div>
            <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>432s avg duration</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">P90 Fulfillment</div>
            <div className="text-2xl font-black text-blue-950 mt-1">9m 34s</div>
            <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>574s (Under 10m target)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">SLA Breaches</div>
            <div className="text-2xl font-black text-rose-950 mt-1">8.2%</div>
            <div className="text-[11px] font-semibold text-rose-700 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>1,215 breached orders</span>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Funnel Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>Stage Duration vs Budget Budgeting</span>
            </h3>
            <span className="text-[11px] text-gray-400">Target budget: 600s</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {stageBreakdown.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border ${
                  item.status === 'Bottleneck'
                    ? 'bg-rose-50/70 border-rose-200 ring-1 ring-rose-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-gray-500">
                    Step {idx + 1}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.status === 'Bottleneck'
                        ? 'bg-rose-200 text-rose-900'
                        : item.status === 'Optimal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-gray-900 truncate" title={item.stage}>
                  {item.stage.split(' ')[0]}
                </div>
                <div className="text-base font-black text-gray-950 mt-1">
                  {item.avgSec}s <span className="text-[10px] font-normal text-gray-500">avg</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">P90: {item.p90Sec}s • Cap: {item.targetSec}s</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Delay Root Causes & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Breach Drivers */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Primary Breach Causes</span>
            </h4>
            <div className="space-y-2">
              {topBreachCauses.map((cause, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">{cause.cause}</span>
                    <span className="font-extrabold text-rose-600">{cause.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${cause.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{cause.count} orders impacted</span>
                    <span className="font-medium text-gray-600">{cause.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-4 rounded-2xl border border-yellow-200 bg-yellow-50/30 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
              <span>Next Week Algorithmic Recommendations</span>
            </h4>
            <div className="space-y-2">
              {actionRecommendations.map((rec, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-yellow-100 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{rec.title}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-900">
                      {rec.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{rec.description}</p>
                  <div className="text-[10px] font-bold text-blinkit-green flex items-center gap-1 pt-0.5">
                    <ArrowRight className="w-3 h-3" />
                    <span>{rec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Weekly Delivery Box */}
        <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blinkit-green" />
              <span className="text-xs font-bold text-gray-900">Automated Weekly Dispatch</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Receive this comprehensive SLA report automatically in your inbox every week.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              aria-label="Select digest delivery day"
              value={scheduleDay}
              onChange={(e) => setScheduleDay(e.target.value)}
              className="text-xs font-semibold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 focus:outline-hidden"
            >
              <option value="Monday">Every Monday</option>
              <option value="Friday">Every Friday</option>
              <option value="Sunday">Every Sunday</option>
            </select>
            <select
              aria-label="Select digest delivery time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="text-xs font-semibold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 focus:outline-hidden"
            >
              <option value="08:00 AM">08:00 AM IST</option>
              <option value="09:00 AM">09:00 AM IST</option>
              <option value="06:00 PM">06:00 PM IST</option>
            </select>
            <button
              onClick={handleSaveSchedule}
              className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span>{notificationSaved ? 'Saved!' : 'Save Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-xs font-semibold rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close Digest
          </button>

          <button
            onClick={handleExportPdf}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Multi-Page PDF Digest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
