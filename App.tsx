import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SecretProvider } from "./contexts/SecretContext";
import Home from "./pages/Home";
import { SecretPanel } from "./components/SecretPanel";
import { SecretLoginModal } from "./components/SecretLoginModal";
import { useState } from "react";

function Router() {
  const [showSecretLogin, setShowSecretLogin] = useState(false);

  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Switch>
        <Route path={"\\"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <SecretPanel />
      <SecretLoginModal isOpen={showSecretLogin} onClose={() => setShowSecretLogin(false)} />
      {/* Hidden button to trigger secret login - positioned off-screen */}
      <button
        onClick={() => setShowSecretLogin(true)}
        className="fixed -left-full -top-full w-0 h-0 opacity-0"
        aria-label="secret"
      />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <SecretProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SecretProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
