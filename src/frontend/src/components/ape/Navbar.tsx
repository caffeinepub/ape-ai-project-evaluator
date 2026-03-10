import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Cpu, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function Navbar() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="landing.link"
          className="flex items-center gap-2 group"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors" />
            <img
              src="/assets/generated/ape-logo-transparent.dim_200x200.png"
              alt="APE"
              className="w-7 h-7 object-contain relative z-10"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold font-display tracking-widest text-primary">
              APE
            </span>
            <span className="text-[9px] text-muted-foreground tracking-wider uppercase hidden sm:block">
              AI Project Evaluator
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                data-ocid="landing.link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "text-primary bg-primary/10" }}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                to="/submit"
                data-ocid="landing.link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "text-primary bg-primary/10" }}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Submit
              </Link>
            </>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border">
                <Cpu className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground font-mono">
                  {shortPrincipal}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan-sm font-medium"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
