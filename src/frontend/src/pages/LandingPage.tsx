import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  FileText,
  Shield,
  Upload,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: Upload,
    title: "Upload Your Project",
    description:
      "Submit your code files, GitHub link, or ZIP archive with a description of what you built.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI Analysis Engine",
    description:
      "Our AI evaluates functionality, code quality, edge cases, security, and performance depth.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: FileText,
    title: "Structured Report",
    description:
      "Get detailed feedback on strengths, weaknesses, improvement suggestions, and edge cases.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: BarChart3,
    title: "Score Breakdown",
    description:
      "Visual score table across key categories like Functionality, Code Quality, and Security.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
];

const steps = [
  {
    num: "01",
    title: "Submit Your Project",
    desc: "Upload files or share your repository link with project metadata.",
  },
  {
    num: "02",
    title: "AI Analyzes It",
    desc: "Our AI reviews your code against evaluation criteria in real time.",
  },
  {
    num: "03",
    title: "Get Your Report",
    desc: "Receive a structured evaluation report with actionable feedback.",
  },
];

const testimonials = [
  {
    quote:
      "Caught 3 security issues I'd completely missed. The edge case detection is impressive.",
    author: "Arjun S.",
    role: "CS Student, IIT",
  },
  {
    quote:
      "Saved my professor hours. The score breakdown helps students see exactly where to improve.",
    author: "Prof. Chen",
    role: "Software Engineering",
  },
  {
    quote:
      "Submitted my hackathon project at 2am. Had a full evaluation ready before presentation.",
    author: "Maya K.",
    role: "Bootcamp Graduate",
  },
];

export default function LandingPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (identity) {
      void navigate({ to: "/dashboard" });
    } else {
      login();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* ── Hero ──────────────────────────────── */}
      <section className="relative container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered Project Evaluation
            <ChevronRight className="w-3 h-3 opacity-60" />
          </div>

          {/* Logo + Title */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full scale-150" />
              <img
                src="/assets/generated/ape-logo-transparent.dim_200x200.png"
                alt="APE"
                className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
              />
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-3">
            <span className="text-gradient-cyan">APE</span>
          </h1>
          <p className="text-xl md:text-2xl font-display text-muted-foreground mb-2 tracking-wide">
            AI Project Evaluator
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Submit your student project and receive{" "}
            <span className="text-foreground font-medium">
              structured AI feedback
            </span>{" "}
            on functionality, code quality, edge cases, and more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoggingIn}
                data-ocid="landing.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan text-base px-8 font-semibold gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-muted-foreground hover:text-foreground hover:bg-accent text-base px-8"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See How It Works
            </Button>
          </div>

          {/* Trust signal */}
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-chart-2" />
              Free to Use
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-chart-2" />
              Instant Evaluation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-chart-2" />
              Detailed Reports
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            APE covers every dimension of project quality, just like a senior
            engineer reviewing your work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-dark rounded-lg p-5 card-hover group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it Works ──────────────────────── */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From project submission to detailed evaluation in minutes.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Connector line */}
          <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex gap-6 mb-8 last:mb-0 items-start"
            >
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center font-mono text-lg font-bold text-primary">
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-primary/20 md:hidden" />
                )}
              </div>
              <div className="pt-3">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card-dark rounded-lg p-5 border-glow"
            >
              <div className="text-primary/60 text-3xl font-serif mb-3 leading-none">
                "
              </div>
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                {t.quote}
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t.author}
                </p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────── */}
      <section className="container mx-auto px-4 py-16 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-chart-5/10 p-10 text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <Shield className="w-10 h-10 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
            Ready to evaluate your project?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get mentor-quality feedback powered by AI. No waiting, no
            scheduling, no guesswork.
          </p>
          <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoggingIn}
              data-ocid="landing.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan text-base px-10 font-semibold gap-2"
            >
              Start Evaluation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-border py-6 container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/ape-logo-transparent.dim_200x200.png"
            alt="APE"
            className="w-5 h-5 object-contain"
          />
          <span className="text-xs font-mono text-muted-foreground">
            APE — AI Project Evaluator
          </span>
        </div>
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
      </footer>
    </div>
  );
}
