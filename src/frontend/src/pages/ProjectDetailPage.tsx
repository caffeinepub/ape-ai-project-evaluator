import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  CheckCircle,
  Clock,
  Code2,
  FileText,
  Lightbulb,
  Loader2,
  RefreshCw,
  RotateCcw,
  Star,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CategoryScore, Evaluation } from "../backend.d";
import { Variant_evaluated_pending_evaluating_failed } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useEvaluation,
  useProject,
  useTriggerEvaluation,
} from "../hooks/useQueries";

// ── Section components ─────────────────────────────────────────────────────

function SectionTitle({
  icon: Icon,
  title,
  color = "text-primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-4 h-4 ${color}`} />
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}

function BulletList({
  items,
  icon: Icon,
  iconColor,
}: {
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">None identified.</p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2.5 text-sm leading-relaxed"
        >
          <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
          <span className="text-foreground/85">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function getScoreColor(score: number, max: number): string {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.7) return "oklch(0.62 0.18 145)";
  if (pct >= 0.45) return "oklch(0.76 0.18 85)";
  return "oklch(0.62 0.22 20)";
}

function getScoreBarColor(score: number, max: number): string {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.7) return "bg-score-high";
  if (pct >= 0.45) return "bg-score-mid";
  return "bg-score-low";
}

function ScoreTableRow({
  cs,
  index,
}: {
  cs: CategoryScore;
  index: number;
}) {
  const score = Number(cs.score);
  const max = Number(cs.maxScore);
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  const barColor = getScoreBarColor(score, max);
  const scoreColor = getScoreColor(score, max);

  return (
    <TableRow
      data-ocid={`report.row.${index + 1}`}
      className="border-border/50 hover:bg-accent/30 transition-colors"
    >
      <TableCell className="font-medium text-foreground py-3">
        {cs.category}
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-muted/50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`h-full rounded-full ${barColor}`}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">
            {pct}%
          </span>
        </div>
      </TableCell>
      <TableCell
        className="text-right font-mono text-sm font-semibold py-3"
        style={{ color: scoreColor }}
      >
        {score}/{max}
      </TableCell>
    </TableRow>
  );
}

function EvaluationReport({ evaluation }: { evaluation: Evaluation }) {
  const totalScore = Number(evaluation.totalScore);
  const maxScore = Number(evaluation.maxTotalScore);
  const scorePercent =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const overallBarColor = getScoreBarColor(totalScore, maxScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-ocid="report.success_state"
      className="space-y-6"
    >
      {/* Total Score Hero */}
      <div className="card-dark rounded-xl p-6 border-glow text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
          Overall Score
        </p>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-6xl font-bold font-display text-gradient-cyan mb-1"
        >
          {totalScore}
          <span className="text-2xl text-muted-foreground font-normal">
            /{maxScore}
          </span>
        </motion.div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-32 bg-muted/50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`h-full rounded-full ${overallBarColor}`}
            />
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            {scorePercent}%
          </span>
        </div>
        <div className="flex items-center justify-center gap-1 text-sm">
          {scorePercent >= 70 ? (
            <>
              <Star className="w-4 h-4 text-chart-3" />
              <span className="text-chart-3 font-medium">Great Work!</span>
            </>
          ) : scorePercent >= 50 ? (
            <>
              <TrendingUp className="w-4 h-4 text-chart-3" />
              <span className="text-warning font-medium">Good Progress</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-destructive font-medium">
                Needs Improvement
              </span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="card-dark rounded-lg p-5">
        <SectionTitle icon={FileText} title="Project Summary" />
        <p className="text-sm leading-relaxed text-foreground/85">
          {evaluation.summary}
        </p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-dark rounded-lg p-5">
          <SectionTitle
            icon={CheckCircle}
            title="Strengths"
            color="text-chart-2"
          />
          <BulletList
            items={evaluation.strengths}
            icon={CheckCircle}
            iconColor="text-chart-2"
          />
        </div>
        <div className="card-dark rounded-lg p-5">
          <SectionTitle
            icon={XCircle}
            title="Weaknesses"
            color="text-destructive"
          />
          <BulletList
            items={evaluation.weaknesses}
            icon={XCircle}
            iconColor="text-destructive"
          />
        </div>
      </div>

      {/* Edge Cases */}
      <div className="card-dark rounded-lg p-5">
        <SectionTitle
          icon={AlertTriangle}
          title="Edge Cases"
          color="text-warning"
        />
        <BulletList
          items={evaluation.edgeCases}
          icon={AlertTriangle}
          iconColor="text-warning"
        />
      </div>

      {/* Efficiency & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-dark rounded-lg p-5">
          <SectionTitle
            icon={Zap}
            title="Efficiency Suggestions"
            color="text-primary"
          />
          <BulletList
            items={evaluation.efficiencySuggestions}
            icon={Zap}
            iconColor="text-primary"
          />
        </div>
        <div className="card-dark rounded-lg p-5">
          <SectionTitle
            icon={Lightbulb}
            title="Improvement Suggestions"
            color="text-chart-5"
          />
          <BulletList
            items={evaluation.improvementSuggestions}
            icon={Lightbulb}
            iconColor="text-chart-5"
          />
        </div>
      </div>

      {/* Score Table */}
      <div className="card-dark rounded-lg overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <SectionTitle icon={BarChartIcon} title="Category Scores" />
        </div>
        <Table data-ocid="report.table">
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs uppercase">
                Category
              </TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase">
                Progress
              </TableHead>
              <TableHead className="text-right text-muted-foreground text-xs uppercase">
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluation.scores.map((cs, i) => (
              <ScoreTableRow key={cs.category} cs={cs} index={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

// Simple bar chart icon inline
function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Category Scores"
      role="img"
    >
      <title>Category Scores</title>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function AnalyzingState({ projectTitle }: { projectTitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-ocid="report.loading_state"
      className="card-dark rounded-xl p-10 text-center"
    >
      {/* Animated brain */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-30" />
        <div className="absolute inset-2 bg-primary/15 rounded-full animate-pulse" />
        <div className="relative w-full h-full rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
          <Brain className="w-8 h-8 text-primary animate-float" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">
        AI is analyzing your project...
      </h3>
      <p className="text-sm text-muted-foreground mb-1">
        <span className="text-foreground font-medium">{projectTitle}</span>
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        This usually takes 20–40 seconds. The page auto-refreshes every 5
        seconds.
      </p>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          "Parsing code",
          "Analyzing logic",
          "Scoring quality",
          "Generating report",
        ].map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-[9px] text-muted-foreground hidden sm:block">
              {step}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams({ from: "/project/$id" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const projectId = (() => {
    try {
      return BigInt(id);
    } catch {
      return undefined;
    }
  })();

  const {
    data: project,
    isLoading: projectLoading,
    refetch: refetchProject,
  } = useProject(projectId);
  const {
    data: evaluation,
    isLoading: evalLoading,
    refetch: refetchEval,
  } = useEvaluation(
    project?.status === Variant_evaluated_pending_evaluating_failed.evaluated
      ? projectId
      : undefined,
  );
  const triggerEval = useTriggerEvaluation();

  const handleRefresh = () => {
    void refetchProject();
    void refetchEval();
  };

  const handleRetry = async () => {
    if (!projectId) return;
    await triggerEval.mutateAsync(projectId);
    void refetchProject();
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4 opacity-70" />
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-sm text-muted-foreground">
          Please sign in to view this project.
        </p>
      </div>
    );
  }

  if (projectLoading || !project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-4 w-32 bg-muted/50 mb-6" />
        <Skeleton className="h-8 w-64 bg-muted/50 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full bg-muted/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const status = project.status;
  const createdDate = new Date(Number(project.createdAt / 1_000_000n));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <button
          type="button"
          onClick={() => void navigate({ to: "/dashboard" })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
      </motion.div>

      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark rounded-xl p-6 mb-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold font-display mb-1 truncate">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {createdDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {project.techStack && (
                <span className="flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  {project.techStack}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status ===
              Variant_evaluated_pending_evaluating_failed.evaluated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-mono">
              Description
            </p>
            <p className="text-foreground/80 leading-relaxed">
              {project.description}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-mono">
              Purpose
            </p>
            <p className="text-foreground/80 leading-relaxed">
              {project.purpose}
            </p>
          </div>
          {project.expectedOutput && (
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-mono flex items-center gap-1">
                <Target className="w-3 h-3" />
                Expected Output
              </p>
              <p className="text-foreground/80 leading-relaxed">
                {project.expectedOutput}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Status-based content */}
      <AnimatePresence mode="wait">
        {(status === Variant_evaluated_pending_evaluating_failed.pending ||
          status ===
            Variant_evaluated_pending_evaluating_failed.evaluating) && (
          <motion.div key="analyzing">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground font-mono">
                Evaluation Status
              </h2>
              <Button
                variant="outline"
                size="sm"
                data-ocid="report.primary_button"
                onClick={handleRefresh}
                className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>
            <AnalyzingState projectTitle={project.title} />
          </motion.div>
        )}

        {status === Variant_evaluated_pending_evaluating_failed.failed && (
          <motion.div
            key="failed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="report.error_state"
            className="card-dark rounded-xl p-10 text-center"
          >
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-70" />
            <h3 className="text-lg font-semibold mb-2">Evaluation Failed</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Something went wrong during AI analysis. This sometimes happens
              due to service timeouts. You can retry the evaluation.
            </p>
            <Button
              data-ocid="report.primary_button"
              onClick={() => void handleRetry()}
              disabled={triggerEval.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              {triggerEval.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Retry Evaluation
                </>
              )}
            </Button>
          </motion.div>
        )}

        {status === Variant_evaluated_pending_evaluating_failed.evaluated && (
          <motion.div key="evaluated">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Evaluation Report
              </h2>
            </div>
            {evalLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-32 w-full bg-muted/50 rounded-lg"
                  />
                ))}
              </div>
            ) : evaluation ? (
              <EvaluationReport evaluation={evaluation} />
            ) : (
              <div className="text-center py-12 card-dark rounded-lg">
                <p className="text-muted-foreground">
                  Evaluation report not found.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void refetchEval()}
                  className="mt-4"
                >
                  Reload
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
