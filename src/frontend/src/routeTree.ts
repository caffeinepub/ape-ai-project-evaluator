import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import SubmitPage from "./pages/SubmitPage";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submit",
  component: SubmitPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$id",
  component: ProjectDetailPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  submitRoute,
  projectDetailRoute,
]);

export type {
  rootRoute,
  indexRoute,
  dashboardRoute,
  submitRoute,
  projectDetailRoute,
};
