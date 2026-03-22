"use client";

import {
  Activity,
  AlertTriangle,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Cpu,
  HeartHandshake,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/hr-analytics/Progress";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { BarChart } from "@/components/hr-analytics/charts/BarChart";
import { DonutChart } from "@/components/hr-analytics/charts/DonutChart";
import { HeatMap } from "@/components/hr-analytics/charts/HeatMap";
import { RadarChart } from "@/components/hr-analytics/charts/RadarChart";
import { ScoreGauge } from "@/components/hr-analytics/charts/ScoreGauge";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  HrEvaluationReport,
  Turing10Result,
  Turing30Result,
} from "@/data/hr-analytics";

function titleize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function scoreClass(score: number) {
  if (score >= 85) return "text-[#0A2465]";
  if (score >= 75) return "text-[#5B6B95]";
  if (score >= 60) return "text-[#7B8DB8]";
  return "text-[#7B8DB8]";
}

function scoreBar(score: number) {
  if (score >= 85) return "bg-[#0A2465]";
  if (score >= 75) return "bg-[#5B6B95]";
  if (score >= 60) return "bg-[#7B8DB8]";
  return "bg-[#7B8DB8]";
}

function scoreChip(score: number): "sky" | "amber" | "rose" | "default" {
  if (score >= 85) return "sky";
  if (score >= 60) return "amber";
  if (score < 60) return "rose";
  return "default";
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  tone = "sky",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  tone?: "sky" | "amber" | "rose";
}) {
  const toneStyles =
    tone === "amber"
      ? "bg-[rgba(123,141,184,0.12)]"
      : tone === "rose"
        ? "bg-[rgba(91,107,149,0.10)]"
        : "bg-[rgba(10,36,101,0.06)]";

  return (
    <Card className="border-transparent">
      <CardBody className="py-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-[14px] p-2.5 ${toneStyles}`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {title}
            </p>
            <p className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[#000000]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

function LiveTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-[12px] border border-[rgba(10,36,101,0.12)] bg-white px-3 py-2 shadow-[0_12px_26px_rgba(10,36,101,0.12)]">
      <div className="text-[11px] font-medium text-[var(--muted)]">{label}</div>
      <div className="mt-1 space-y-1">
        {payload.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
            <span className="flex items-center gap-2 text-[#000000]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color || "#0A2465" }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-[#000000]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveAreaPanel({
  data,
}: {
  data: Array<{ time: string; screening: number; review: number; queue: number }>;
}) {
  return (
    <div className="h-[320px]">
      <ClientOnly fallback={<div className="h-full w-full" />}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="screeningFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A2465" stopOpacity={0.38} />
                <stop offset="100%" stopColor="#0A2465" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="reviewFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B6B95" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#5B6B95" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="queueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7B8DB8" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#7B8DB8" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(10,36,101,0.08)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "rgba(10,36,101,0.55)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(10,36,101,0.45)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<LiveTooltip />} />
            <Area type="monotone" dataKey="queue" stackId="1" stroke="#7B8DB8" fill="url(#queueFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="review" stackId="1" stroke="#5B6B95" fill="url(#reviewFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="screening" stackId="1" stroke="#0A2465" fill="url(#screeningFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  );
}

function LiveLinePanel({
  data,
  label,
  color,
  unit,
}: {
  data: Array<{ time: string; value: number }>;
  label: string;
  color: string;
  unit: string;
}) {
  return (
    <div className="h-[140px]">
      <ClientOnly fallback={<div className="h-full w-full" />}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="rgba(10,36,101,0.08)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "rgba(10,36,101,0.55)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(10,36,101,0.45)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<LiveTooltip />} />
            <Line type="monotone" dataKey="value" name={label} stroke={color} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ClientOnly>
      <div className="-mt-2 flex items-center justify-between text-[11px]">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-semibold text-[#000000]">
          {data[data.length - 1]?.value}
          {unit}
        </span>
      </div>
    </div>
  );
}

export function Turing10Panel({ data }: { data: Turing10Result }) {
  const radarData = Object.entries(data.ai_profile).map(([key, value]) => ({
    subject: titleize(key),
    value,
    fullMark: 100,
  }));

  const pipelineChartData = data.pipeline_results.map((pipeline) => ({
    name: pipeline.benchmark_name,
    value: pipeline.score,
    color:
      pipeline.score >= 85
        ? "#0A2465"
        : pipeline.score >= 70
          ? "#5B6B95"
          : "#7B8DB8",
  }));

  const heatmapColumns = ["Score", "Weight", "Time"];
  const heatmapData = data.pipeline_results.map((pipeline) => ({
    label: pipeline.benchmark_name,
    values: [
      Math.round(pipeline.score),
      Math.round(pipeline.tier_weight * 100),
      Math.round(pipeline.execution_time_ms / 100) / 10,
    ],
  }));

  const tierBreakdown = Object.entries(data.tier_breakdown).map(([name, value]) => ({
    name,
    score: value.score,
    passed: value.passed,
    benchmarks: value.benchmarks,
    passedBenchmarks: value.passed_benchmarks,
  }));

  const topPipeline = data.pipeline_results.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  const profileAverage =
    radarData.reduce((sum, item) => sum + item.value, 0) / radarData.length;

  const tierDonutData = tierBreakdown.map((tier) => ({
    name: tier.name,
    value: tier.score,
    fill: tier.passed ? "#0A2465" : "#7B8DB8",
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="종합 점수"
          value={data.turing_score.toFixed(1)}
          subtitle={`등급 ${data.grade}`}
          icon={<Brain className="h-5 w-5 text-[#0A2465]" />}
        />
        <KpiCard
          title="최고 벤치마크"
          value={topPipeline.score.toFixed(1)}
          subtitle={topPipeline.benchmark_name}
          icon={<TrendingUp className="h-5 w-5 text-[#5B6B95]" />}
        />
        <KpiCard
          title="프로파일 평균"
          value={profileAverage.toFixed(1)}
          subtitle="5개 역량 축 평균"
          icon={<Cpu className="h-5 w-5 text-[#7B8DB8]" />}
          tone="amber"
        />
        <KpiCard
          title="Tier 통과율"
          value={`${tierBreakdown.filter((tier) => tier.passed).length}/${tierBreakdown.length}`}
          subtitle="통과한 평가 단계 수"
          icon={<ShieldCheck className="h-5 w-5 text-[#7B8DB8]" />}
          tone="rose"
        />
      </div>

      <SectionGrid>
        <Card>
          <CardHeader
            title="Turing 1.0 점수"
            sub="핵심 역량과 벤치마크 수행 결과"
          />
          <CardBody className="flex items-center justify-center pt-0">
            <div className="flex flex-col items-center gap-3">
              <ScoreGauge score={data.turing_score} label="Turing 1.0" />
              <Badge variant="sky" className="px-3 py-1.5 text-xs">
                {data.grade} 등급 / mock 결과
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Capability Profile"
            sub="역량 분포를 한눈에 보는 레이더 차트"
          />
          <CardBody className="pt-0">
            <RadarChart data={radarData} />
          </CardBody>
        </Card>
      </SectionGrid>

      <SectionGrid>
        <Card>
          <CardHeader
            title="파이프라인 매트릭스"
            sub="점수, 가중치, 처리 시간 요약"
          />
          <CardBody className="pt-0">
            <HeatMap data={heatmapData} columns={heatmapColumns} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="벤치마크 점수"
            sub="스크리닝 기능별 성능 비교"
          />
          <CardBody className="pt-0">
            <BarChart data={pipelineChartData} />
          </CardBody>
        </Card>
      </SectionGrid>

      <Card>
        <CardHeader
          title="Tier 세부 결과"
          sub="Turing 1.0 단계별 통과 여부와 점수"
        />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Tier
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Score
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Benchmarks
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {tierBreakdown.map((tier) => (
                  <tr key={tier.name} className="border-b border-[rgba(10,36,101,0.06)]">
                    <td className="px-3 py-3 font-medium text-[#000000]">{tier.name}</td>
                    <td className={`px-3 py-3 text-center font-semibold ${scoreClass(tier.score)}`}>
                      {tier.score.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-center text-[var(--muted)]">
                      {tier.passedBenchmarks}/{tier.benchmarks}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={tier.passed ? "sky" : "rose"}>
                        {tier.passed ? "통과" : "보완 필요"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Progress
                        value={tier.score}
                        barClassName={tier.passed ? "bg-[#0A2465]" : "bg-[#7B8DB8]"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px_1fr]">
        <Card>
          <CardHeader title="강점" sub="현재 잘 수행하는 영역" />
          <CardBody className="pt-0">
            <ul className="space-y-3">
              {data.strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0A2465]" />
                  <span className="text-sm leading-6 text-[#000000]">{strength}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Tier 분포" sub="단계별 점수 비중" />
          <CardBody className="pt-0">
            <DonutChart
              data={tierDonutData}
              tooltipLabel="points"
              centerLabel="Overall"
              centerValue={data.turing_score.toFixed(1)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="보완 포인트" sub="파일럿 운영 전 점검이 필요한 영역" />
          <CardBody className="pt-0">
            <ul className="space-y-3">
              {data.weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#5B6B95]" />
                  <span className="text-sm leading-6 text-[#000000]">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function Turing30Panel({ data }: { data: Turing30Result }) {
  const dimensions = [
    { key: "task_accuracy", label: "Task accuracy", icon: Brain },
    { key: "efficiency", label: "Efficiency", icon: Zap },
    { key: "adaptability", label: "Adaptability", icon: Workflow },
    { key: "communication", label: "Communication", icon: Sparkles },
    { key: "collaboration", label: "Collaboration", icon: Users },
    { key: "autonomy", label: "Autonomy", icon: Cpu },
    { key: "safety", label: "Safety", icon: Shield },
  ] as const;

  const radarData = dimensions.map((dimension) => ({
    subject: dimension.label,
    value: data.anthropomorphic[dimension.key],
    fullMark: 100,
  }));

  const heatmapColumns = ["Acc", "Eff", "Adapt", "Comm", "Collab", "Auto", "Safe"];
  const dimensionValues = dimensions.map(
    (dimension) => data.anthropomorphic[dimension.key]
  );
  const heatmapData = data.scenario_results.map((scenario) => ({
    label: scenario.name,
    values: dimensionValues.map((value) =>
      Math.round((scenario.score * value) / 100)
    ),
  }));

  const metaData = Object.entries(data.meta_cognition).map(([key, value]) => ({
    subject: titleize(key),
    value: Math.round(value * 100),
    fullMark: 100,
  }));

  const faultEntries = Object.entries(data.fault_tolerance).map(([key, value]) => ({
    name: titleize(key),
    tolerance: Math.round(value.tolerance * 100),
  }));

  const donutData = dimensions.map((dimension, index) => ({
    name: dimension.label,
    value: data.anthropomorphic[dimension.key],
    fill: ["#0A2465", "#5B6B95", "#7B8DB8", "#C6CEDF", "#5B6B95", "#FAFAFA", "#7B8DB8"][index],
  }));

  const scenarioBarData = data.scenario_results.map((scenario) => ({
    name: scenario.name,
    value: scenario.score,
    color:
      scenario.score >= 80 ? "#0A2465" : scenario.score >= 70 ? "#5B6B95" : "#7B8DB8",
  }));

  const collaborationIndex =
    (data.anthropomorphic.collaboration + data.anthropomorphic.communication) / 2;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="업무 시나리오 점수"
          value={data.anthropomorphic.overall_score.toFixed(1)}
          subtitle="업무형 상호작용 종합 결과"
          icon={<HeartHandshake className="h-5 w-5 text-[#0A2465]" />}
        />
        <KpiCard
          title="안전성"
          value={data.anthropomorphic.safety.toFixed(1)}
          subtitle="편향 및 정책 제어 수준"
          icon={<Shield className="h-5 w-5 text-[#5B6B95]" />}
        />
        <KpiCard
          title="협업 지수"
          value={collaborationIndex.toFixed(1)}
          subtitle="커뮤니케이션 + 협업 평균"
          icon={<Users className="h-5 w-5 text-[#7B8DB8]" />}
          tone="amber"
        />
        <KpiCard
          title="시나리오"
          value={`${data.scenario_results.filter((scenario) => scenario.score >= 70).length}/${data.scenario_results.length}`}
          subtitle="기준 점수 이상 시나리오 수"
          icon={<Activity className="h-5 w-5 text-[#7B8DB8]" />}
          tone="rose"
        />
      </div>

      <SectionGrid>
        <Card>
          <CardHeader title="7차원 프로파일" sub="업무형 상호작용 역량 분포" />
          <CardBody className="pt-0">
            <RadarChart data={radarData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="시나리오 매트릭스"
            sub="업무 상황별 역량 반응 분포"
          />
          <CardBody className="pt-0">
            <HeatMap data={heatmapData} columns={heatmapColumns} />
          </CardBody>
        </Card>
      </SectionGrid>

      <Card>
        <CardHeader
          title="차원별 세부 점수"
          sub="Turing 3.0 핵심 역량 세부 결과"
        />
        <CardBody className="space-y-3 pt-0">
          {dimensions.map((dimension) => {
            const value = data.anthropomorphic[dimension.key];
            const Icon = dimension.icon;

            return (
              <div key={dimension.key} className="flex items-center gap-3">
                <div className="rounded-[12px] bg-[rgba(10,36,101,0.06)] p-2">
                  <Icon className="h-4 w-4 text-[#0A2465]" />
                </div>
                <div className="w-28 text-sm font-medium text-[#000000]">
                  {dimension.label}
                </div>
                <Progress value={value} barClassName={scoreBar(value)} className="flex-1" />
                <div className={`w-12 text-right text-sm font-semibold ${scoreClass(value)}`}>
                  {value.toFixed(1)}
                </div>
                <Badge variant={scoreChip(value)}>{value >= 70 ? "안정" : "검토"}</Badge>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="시나리오 결과"
          sub="채용 업무 시뮬레이션 평가 결과"
        />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Scenario
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Type
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Difficulty
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Score
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.scenario_results.map((scenario) => (
                  <tr
                    key={scenario.name}
                    className="border-b border-[rgba(10,36,101,0.06)] align-top"
                  >
                    <td className="px-3 py-3 font-medium text-[#000000]">{scenario.name}</td>
                    <td className="px-3 py-3">
                      <Badge variant="sky">{titleize(scenario.type)}</Badge>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={scenario.difficulty >= 7 ? "rose" : "amber"}>
                        {scenario.difficulty}
                      </Badge>
                    </td>
                    <td className={`px-3 py-3 text-center font-semibold ${scoreClass(scenario.score)}`}>
                      {scenario.score.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {scenario.score >= 80 ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-[#0A2465]" />
                      ) : scenario.score >= 70 ? (
                        <AlertTriangle className="mx-auto h-4 w-4 text-[#7B8DB8]" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 text-[#5B6B95]" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs leading-5 text-[var(--muted)]">
                      {scenario.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <SectionGrid>
        <Card>
          <CardHeader title="Meta-cognition" sub="불확실성을 어떻게 인지하는지" />
          <CardBody className="pt-0">
            <RadarChart data={metaData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Fault tolerance" sub="불완전한 맥락에서의 회복력" />
          <CardBody className="grid gap-3 pt-0 sm:grid-cols-2">
            {faultEntries.map((fault) => (
              <div
                key={fault.name}
                className="rounded-[16px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  {fault.name}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${scoreClass(fault.tolerance)}`}>
                  {fault.tolerance}%
                </p>
                <Progress
                  value={fault.tolerance}
                  className="mt-3"
                  barClassName={scoreBar(fault.tolerance)}
                />
              </div>
            ))}
          </CardBody>
        </Card>
      </SectionGrid>

      <SectionGrid>
        <Card>
          <CardHeader title="차원별 분포" sub="업무 역량별 상대 비중" />
          <CardBody className="pt-0">
            <DonutChart
              data={donutData}
              tooltipLabel="points"
              centerLabel="Overall"
              centerValue={data.anthropomorphic.overall_score.toFixed(1)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="시나리오 점수 분포" sub="업무 장면별 빠른 비교" />
          <CardBody className="pt-0">
            <BarChart data={scenarioBarData} />
          </CardBody>
        </Card>
      </SectionGrid>
    </div>
  );
}

export function Turing50Panel({ report }: { report: HrEvaluationReport }) {
  const { turing10, turing30, turing50 } = report;
  const riskValues = Object.values(turing50.risk_breakdown);
  const avgRisk = riskValues.reduce((sum, value) => sum + value, 0) / riskValues.length;
  const monthlyApplications = 1280;
  const baselineMinutesPerApplication = 18;
  const currentMinutesPerApplication = 7;
  const recruiterHourlyCost = 42000;
  const productivityGainRate =
    ((baselineMinutesPerApplication - currentMinutesPerApplication) / baselineMinutesPerApplication) * 100;
  const automationRate = 64;
  const copilotProductivity = 2.1;
  const recruiterHoursSaved =
    ((baselineMinutesPerApplication - currentMinutesPerApplication) * monthlyApplications) / 60;
  const monthlyCostSavings = recruiterHoursSaved * recruiterHourlyCost;
  const tokenCostPerApplication = 118;
  const monthlyTokenCost = tokenCostPerApplication * monthlyApplications;
  const costEfficiency = ((monthlyCostSavings - monthlyTokenCost) / monthlyCostSavings) * 100;
  const humanReviewRate = 100 - automationRate;
  const governanceCoverage = Math.round(
    (turing30.anthropomorphic.safety + (100 - avgRisk) + turing10.turing_score) / 3
  );
  const fairnessStability = 91;
  const screeningCycleReduction = 43;

  const metricBarData = [
    { name: "생산성 향상", value: Math.round(productivityGainRate), color: "#0A2465" },
    { name: "자동화율", value: automationRate, color: "#5B6B95" },
    { name: "거버넌스", value: governanceCoverage, color: "#7B8DB8" },
    { name: "공정성", value: fairnessStability, color: "#5B6B95" },
    { name: "안전성", value: Math.round(turing30.anthropomorphic.safety), color: "#0A2465" },
  ];

  const oversightData = [
    {
      label: "자동 스크리닝",
      values: [automationRate, 8, tokenCostPerApplication],
    },
    {
      label: "사람 재검토",
      values: [humanReviewRate, 22, 0],
    },
    {
      label: "거버넌스 점검",
      values: [governanceCoverage, 4, 0],
    },
    {
      label: "예외 에스컬레이션",
      values: [12, 14, 36],
    },
  ];

  const productivityMixData = [
    { name: "자동 평가", value: automationRate, fill: "#0A2465" },
    { name: "사람 검토", value: humanReviewRate, fill: "#C6CEDF" },
  ];

  const costMixData = [
    { name: "절감 인건비", value: Math.round(monthlyCostSavings / 1000000), fill: "#0A2465" },
    { name: "토큰 비용", value: Math.max(1, Math.round(monthlyTokenCost / 1000000)), fill: "#7B8DB8" },
  ];

  const governanceMixData = [
    { name: "거버넌스 커버", value: governanceCoverage, fill: "#5B6B95" },
    { name: "잔여 리스크", value: 100 - governanceCoverage, fill: "#E6ECF8" },
  ];

  const safetyMixData = [
    { name: "안전 기준 충족", value: Math.round(turing30.anthropomorphic.safety), fill: "#0A2465" },
    { name: "보완 필요", value: 100 - Math.round(turing30.anthropomorphic.safety), fill: "#E6ECF8" },
  ];

  const workforceMixData = [
    { name: "절감 시간", value: Math.round(recruiterHoursSaved), fill: "#0A2465" },
    { name: "남은 수동 시간", value: Math.round((currentMinutesPerApplication * monthlyApplications) / 60), fill: "#C6CEDF" },
  ];

  const governanceRadarData = [
    { subject: "Productivity", value: Math.round(productivityGainRate), fullMark: 100 },
    { subject: "Cost", value: Math.round(costEfficiency), fullMark: 100 },
    { subject: "Safety", value: Math.round(turing30.anthropomorphic.safety), fullMark: 100 },
    { subject: "Governance", value: governanceCoverage, fullMark: 100 },
    { subject: "Fairness", value: fairnessStability, fullMark: 100 },
    { subject: "Automation", value: automationRate, fullMark: 100 },
  ];

  const statTiles = [
    { label: "Monthly Apps", value: monthlyApplications.toLocaleString(), tone: "text-[#0A2465]" },
    { label: "Saved Hours", value: `${Math.round(recruiterHoursSaved)}h`, tone: "text-[#5B6B95]" },
    { label: "Cost Saved", value: `₩${Math.round(monthlyCostSavings / 1000000)}M`, tone: "text-[#0A2465]" },
    { label: "Token Cost", value: `₩${tokenCostPerApplication}`, tone: "text-[#7B8DB8]" },
    { label: "Review Rate", value: `${humanReviewRate}%`, tone: "text-[#5B6B95]" },
    { label: "ROI", value: `${turing50.risk_adjusted_roi.toFixed(1)}x`, tone: "text-[#0A2465]" },
  ];

  const weeklyTrendData = [
    { name: "Mon", value: 58, color: "#C6CEDF" },
    { name: "Tue", value: 64, color: "#7B8DB8" },
    { name: "Wed", value: 69, color: "#5B6B95" },
    { name: "Thu", value: 73, color: "#0A2465" },
    { name: "Fri", value: 67, color: "#5B6B95" },
    { name: "Sat", value: 52, color: "#C6CEDF" },
    { name: "Sun", value: 49, color: "#C6CEDF" },
  ];

  const liveFlowData = [
    { time: "09:00", screening: 24, review: 16, queue: 9 },
    { time: "09:05", screening: 27, review: 18, queue: 10 },
    { time: "09:10", screening: 31, review: 20, queue: 12 },
    { time: "09:15", screening: 37, review: 22, queue: 14 },
    { time: "09:20", screening: 120, review: 41, queue: 29 },
    { time: "09:25", screening: 130, review: 49, queue: 34 },
    { time: "09:30", screening: 140, review: 55, queue: 38 },
  ];

  const latencyTrendData = [
    { time: "09:00", value: 148 },
    { time: "09:05", value: 236 },
    { time: "09:10", value: 164 },
    { time: "09:15", value: 282 },
    { time: "09:20", value: 156 },
    { time: "09:25", value: 248 },
    { time: "09:30", value: 172 },
  ];

  const tokenTrendData = [
    { time: "09:00", value: 96 },
    { time: "09:05", value: 144 },
    { time: "09:10", value: 108 },
    { time: "09:15", value: 158 },
    { time: "09:20", value: 102 },
    { time: "09:25", value: 149 },
    { time: "09:30", value: 118 },
  ];

  const pipelineTable = [
    { stage: "자동 스크리닝", volume: "64%", sla: "8분", owner: "AI", state: "안정" },
    { stage: "사람 재검토", volume: "36%", sla: "22분", owner: "HR", state: "관리" },
    { stage: "예외 에스컬레이션", volume: "12%", sla: "14분", owner: "Lead", state: "주의" },
    { stage: "거버넌스 점검", volume: "4%", sla: "주간", owner: "Ops", state: "안정" },
  ];

  const benchmarkSummary = [
    { name: "Productivity", current: `${Math.round(productivityGainRate)}%`, target: "55%+", gap: "+6%" },
    { name: "Automation", current: `${automationRate}%`, target: "60%+", gap: "+4%" },
    { name: "Governance", current: `${governanceCoverage}%`, target: "80%+", gap: `+${governanceCoverage - 80}%` },
    { name: "Fairness", current: `${fairnessStability}%`, target: "90%+", gap: "+1%" },
  ];

  const scorecard = [
    {
      metric: "월 절감 인건비",
      value: `₩${Math.round(monthlyCostSavings).toLocaleString()}`,
      benchmark: "₩4천만원+",
      status: monthlyCostSavings >= 40000000,
    },
    {
      metric: "Automation Rate",
      value: `${automationRate}%`,
      benchmark: "60%+",
      status: automationRate >= 60,
    },
    {
      metric: "Human Review Rate",
      value: `${humanReviewRate}%`,
      benchmark: "40% 이하",
      status: humanReviewRate <= 40,
    },
    {
      metric: "Governance Coverage",
      value: `${governanceCoverage}%`,
      benchmark: "80%+",
      status: governanceCoverage >= 80,
    },
    {
      metric: "Fairness Stability",
      value: `${fairnessStability}%`,
      benchmark: "90%+",
      status: fairnessStability >= 90,
    },
    {
      metric: "Token Cost",
      value: `₩${tokenCostPerApplication.toLocaleString()}/건`,
      benchmark: "₩150 이하",
      status: tokenCostPerApplication <= 150,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-[18px] border border-[rgba(10,36,101,0.10)] bg-[linear-gradient(135deg,rgba(10,36,101,0.04),rgba(10,36,101,0.01))] px-4 py-3 shadow-[0_12px_30px_rgba(10,36,101,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0A2465] px-3 py-1 text-[11px] font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7CFFB2]" />
              LIVE
            </span>
            <div className="text-[13px] font-semibold text-[#000000]">
              실시간 운영 현황판
            </div>
            <div className="text-[11px] text-[#7B8DB8]">
              마지막 갱신 09:30 KST · 30초 단위 모니터링
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="sky">정상 운영</Badge>
            <Badge variant="muted">Screening Queue 128</Badge>
            <Badge variant="amber">Review Pending 21</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader title="실시간 운영 흐름" sub="자동 평가, 사람 검토, 대기열이 함께 움직이는 흐름" />
          <CardBody className="pt-0">
            <LiveAreaPanel data={liveFlowData} />
          </CardBody>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader title="응답 시간 추이" sub="최근 30분" />
            <CardBody className="pt-0">
              <LiveLinePanel data={latencyTrendData} label="Latency" color="#0A2465" unit="ms" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="토큰 비용 추이" sub="건당 추정 비용" />
            <CardBody className="pt-0">
              <LiveLinePanel data={tokenTrendData} label="Token cost" color="#5B6B95" unit="" />
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">

      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader title="운영 상태 개요" sub="텍스트보다 차트로 먼저 읽는 요약" />
          <CardBody className="grid gap-3 pt-0 md:grid-cols-3">
            <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4">
              <DonutChart
                data={productivityMixData}
                tooltipLabel="%"
                centerLabel="Automation"
                centerValue={`${automationRate}%`}
                size="sm"
              />
            </div>
            <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4">
              <DonutChart
                data={governanceMixData}
                tooltipLabel="%"
                centerLabel="Governance"
                centerValue={`${governanceCoverage}%`}
                size="sm"
              />
            </div>
            <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4">
              <DonutChart
                data={safetyMixData}
                tooltipLabel="%"
                centerLabel="Safety"
                centerValue={`${Math.round(turing30.anthropomorphic.safety)}%`}
                size="sm"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="운영 헬스" sub="핵심 상태를 게이지로 빠르게 확인" />
          <CardBody className="flex items-center justify-center pt-0">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex justify-center">
                <ScoreGauge score={Math.round(productivityGainRate)} size={160} label="Productivity" />
              </div>
              <div className="flex justify-center">
                <ScoreGauge score={Math.round(costEfficiency)} size={160} label="Cost" />
              </div>
              <div className="flex justify-center">
                <ScoreGauge score={governanceCoverage} size={160} label="Governance" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader title="실시간 운영 통계표" sub="표는 보조로 두고 핵심 상태만 짧게 봅니다." />
          <CardBody className="pt-0">
            <div className="overflow-auto rounded-[14px] border border-[var(--border)]">
              <table className="w-full min-w-[720px] text-[11px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[rgba(10,36,101,0.02)] text-left">
                    <th className="px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Metric</th>
                    <th className="px-2 py-1.5 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Now</th>
                    <th className="px-2 py-1.5 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Avg</th>
                    <th className="px-2 py-1.5 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Productivity", `${Math.round(productivityGainRate)}%`, "57%", "안정"],
                    ["Automation", `${automationRate}%`, "61%", "안정"],
                    ["Review", `${humanReviewRate}%`, "38%", "관리"],
                    ["Token Cost", `₩${tokenCostPerApplication}`, "₩121", "안정"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-[rgba(10,36,101,0.06)]">
                      <td className="px-2 py-2 font-medium text-[#000000]">{row[0]}</td>
                      <td className="px-2 py-2 text-center font-semibold text-[#000000]">{row[1]}</td>
                      <td className="px-2 py-2 text-center text-[#5B6B95]">{row[2]}</td>
                      <td className="px-2 py-2 text-center">
                        <Badge variant={row[3] === "안정" ? "sky" : "amber"} className="px-2 py-0.5 text-[10px]">
                          {row[3]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="라이브 스냅샷" sub="지금 가장 중요한 상태만 빠르게 확인" />
          <CardBody className="grid gap-3 pt-0 sm:grid-cols-2">
            <div className="rounded-[16px] bg-[rgba(10,36,101,0.03)] p-4">
              <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Queue</div>
              <div className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[#000000]">128</div>
              <div className="mt-1 text-[11px] text-[#5B6B95]">평가 대기 건수</div>
            </div>
            <div className="rounded-[16px] bg-[rgba(10,36,101,0.03)] p-4">
              <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Pending Review</div>
              <div className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[#000000]">21</div>
              <div className="mt-1 text-[11px] text-[#5B6B95]">사람 검토 대기</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="핵심 운영 지표 비교" sub="현업 의사결정에 필요한 지표만 압축했습니다." />
          <CardBody className="pt-0">
            <BarChart data={metricBarData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="비용 구조" sub="절감 인건비와 토큰 비용의 상대 크기" />
          <CardBody className="pt-0">
            <DonutChart
              data={costMixData}
              tooltipLabel="M KRW"
              centerLabel="ROI"
              centerValue={`${turing50.risk_adjusted_roi.toFixed(1)}x`}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="업무 투입 구조" sub="절감된 시간과 남은 수동 시간" />
          <CardBody className="pt-0">
            <DonutChart
              data={workforceMixData}
              tooltipLabel="hrs"
              centerLabel="Saved hours"
              centerValue={`${Math.round(recruiterHoursSaved)}h`}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="주간 처리 추이" sub="자동 평가 처리량의 최근 7일 흐름" />
          <CardBody className="pt-0">
            <BarChart data={weeklyTrendData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="실시간 운영 파이프라인 표" sub="단계별 물량, SLA, 운영 주체를 실시간으로 추적합니다." />
          <CardBody className="pt-0">
            <div className="overflow-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Stage</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Volume</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">SLA</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Owner</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">State</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineTable.map((row) => (
                    <tr key={row.stage} className="border-b border-[rgba(10,36,101,0.06)]">
                      <td className="px-3 py-3 font-medium text-[#000000]">{row.stage}</td>
                      <td className="px-3 py-3 text-center text-[#000000]">{row.volume}</td>
                      <td className="px-3 py-3 text-center text-[#000000]">{row.sla}</td>
                      <td className="px-3 py-3 text-center text-[#5B6B95]">{row.owner}</td>
                      <td className="px-3 py-3 text-center">
                        <Badge variant={row.state === "안정" ? "sky" : row.state === "관리" ? "amber" : "rose"}>
                          {row.state}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      <SectionGrid>
        <Card>
          <CardHeader title="운영 단계별 관여도" sub="자동 처리, 사람 검토, 예외 대응 흐름" />
          <CardBody className="pt-0">
            <HeatMap
              data={oversightData}
              columns={["Coverage", "Time", "Cost"]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="운영 균형도" sub="생산성, 비용, 안전, 거버넌스의 균형" />
          <CardBody className="pt-0">
            <RadarChart data={governanceRadarData} />
          </CardBody>
        </Card>
      </SectionGrid>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader title="목표 대비 통계 요약표" sub="현재 수치와 목표값 차이를 빠르게 확인합니다." />
          <CardBody className="pt-0">
            <div className="overflow-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Metric</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Current</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Target</th>
                    <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkSummary.map((row) => (
                    <tr key={row.name} className="border-b border-[rgba(10,36,101,0.06)]">
                      <td className="px-3 py-3 font-medium text-[#000000]">{row.name}</td>
                      <td className="px-3 py-3 text-center text-[#000000]">{row.current}</td>
                      <td className="px-3 py-3 text-center text-[#5B6B95]">{row.target}</td>
                      <td className="px-3 py-3 text-center font-semibold text-[#0A2465]">{row.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="핵심 시그널" sub="짧은 해석만 남기고 시각화를 보조합니다." />
          <CardBody className="grid gap-3 pt-0 md:grid-cols-3">
            <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#000000]">
                <Zap className="h-4 w-4 text-[#0A2465]" />
                Productivity Gain Rate
              </div>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                기존 대비 검토 시간이 크게 줄어 채용팀이 면접 운영과 고위험 검토에 더 집중할 수 있습니다.
              </p>
            </div>
            <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#000000]">
                <Workflow className="h-4 w-4 text-[#5B6B95]" />
                Automation Rate
              </div>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                자동화율이 높아도 사람 검토율이 과도하게 떨어지지 않도록 균형 관리가 중요합니다.
              </p>
            </div>
            <div className="rounded-[18px] border border-[var(--border)] bg-[rgba(10,36,101,0.02)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#000000]">
                <Shield className="h-4 w-4 text-[#7B8DB8]" />
                Governance Coverage
              </div>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                운영 안정성과 공정성 확보를 위해 거버넌스 커버리지를 함께 추적해야 합니다.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="운영 기준 점검표" sub="실제 도입 판단에 필요한 최소 기준" />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Metric
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Current
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Benchmark
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {scorecard.map((row) => (
                  <tr key={row.metric} className="border-b border-[rgba(10,36,101,0.06)]">
                    <td className="px-3 py-3 font-medium text-[#000000]">{row.metric}</td>
                    <td className="px-3 py-3 text-center font-semibold text-[#000000]">
                      {row.value}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={row.status ? "sky" : "amber"}>{row.benchmark}</Badge>
                    </td>
                    <td className="px-3 py-3 text-xs leading-5 text-[var(--muted)]">
                      {row.status
                        ? "기준 충족"
                        : "추가 최적화 필요"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
