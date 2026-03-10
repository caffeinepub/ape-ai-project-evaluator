import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Folders,
  Loader2,
  PlusCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "../backend.d";
import { Variant_evaluated_pending_evaluating_failed } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyProjects } from "../hooks/useQueries";

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === Variant_evaluated_pending_evaluating_failed.evaluated) {
    return (
      <span className="status-badge-evaluated inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3" />
        Evaluated
      </span>
    );
  }
  if (status === Variant_evaluated_pending_evaluating_failed.evaluating) {
    return (
      <span className="status-badge-evaluating inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium animate-pulse-glow">
        <Loader2 className="w-3 h-3 animate-spin" />
        Evaluating
      </span>
    );
  }
  if (status === Variant_evaluated_pending_evaluating_failed.pending) {
    return (
      <span className="status-badge-pending inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  }
  return (
    <span className="status-badge-failed inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
      <XCircle className="w-3 h-3" />
      Failed
    </span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const navigate = useNavigate();
  const date = new Date(Number(project.createdAt / 1_000_000n));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      data-ocid={`dashboard.item.${index + 1}`}
      onClick={() =>
        void navigate({
          to: "/project/$id",
          params: { id: project.id.toString() },
        })
      }
      className="card-dark rounded-lg p-4 card-hover cursor-pointer group flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
          <span>View report</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* Tech stack pill */}
      {project.techStack && (
        <div className="flex flex-wrap gap-1">
          {project.techStack
            .split(",")
            .slice(0, 3)
            .map((tech) => (
              <span
                key={tech.trim()}
                className="px-1.5 py-0.5 bg-accent rounded text-[10px] text-accent-foreground font-mono"
              >
                {tech.trim()}
              </span>
            ))}
          {project.techStack.split(",").length > 3 && (
            <span className="px-1.5 py-0.5 bg-accent rounded text-[10px] text-muted-foreground font-mono">
              +{project.techStack.split(",").length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="card-dark rounded-lg p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-40 bg-muted/50" />
        <Skeleton className="h-4 w-20 rounded-full bg-muted/50" />
      </div>
      <Skeleton className="h-3 w-full bg-muted/50" />
      <Skeleton className="h-3 w-3/4 bg-muted/50" />
      <div className="flex gap-1">
        <Skeleton className="h-4 w-12 rounded bg-muted/50" />
        <Skeleton className="h-4 w-16 rounded bg-muted/50" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: projects, isLoading, error, refetch } = useMyProjects();

  // Not logged in
  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm mx-auto"
        >
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4 opacity-70" />
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Sign in to view your project dashboard.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold font-display">My Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {projects
              ? `${projects.length} project${projects.length !== 1 ? "s" : ""} submitted`
              : "Loading projects..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="border-border text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          <Link to="/submit">
            <Button
              size="sm"
              data-ocid="dashboard.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Submit New Project
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div
          data-ocid="dashboard.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div
          data-ocid="dashboard.error_state"
          className="text-center py-16 card-dark rounded-lg"
        >
          <XCircle className="w-10 h-10 text-destructive mx-auto mb-3 opacity-70" />
          <h3 className="font-semibold mb-1">Failed to load projects</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try Again
          </Button>
        </div>
      ) : !projects || projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="dashboard.empty_state"
          className="text-center py-20 card-dark rounded-xl border-dashed border-2 border-border"
        >
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-5">
            <Folders className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Submit your first project and get an AI-powered evaluation in
            minutes.
          </p>
          <Link to="/submit">
            <Button
              data-ocid="dashboard.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Your First Project
            </Button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects
              .slice()
              .sort((a, b) => Number(b.createdAt - a.createdAt))
              .map((project, i) => (
                <ProjectCard
                  key={project.id.toString()}
                  project={project}
                  index={i}
                />
              ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
