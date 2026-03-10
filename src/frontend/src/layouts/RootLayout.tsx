import { Outlet } from "@tanstack/react-router";
import Navbar from "../components/ape/Navbar";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
