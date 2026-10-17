"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

export interface ErrorBoundaryFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional custom fallback UI. Can be a ReactNode or a render function.
   */
  fallback?:
    | ReactNode
    | ((props: ErrorBoundaryFallbackProps) => ReactNode);
  /**
   * Optional callback invoked whenever an error is caught.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Optional callback invoked when the boundary is reset.
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: (Error & { digest?: string }) | null;
}

/**
 * Standard React Error Boundary component as referenced in the Next.js and React documentation.
 * Catches JavaScript errors anywhere in their child component tree, logs those errors,
 * and displays a fallback UI instead of crashing the whole component tree.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service or console
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({
          error: this.state.error,
          reset: this.reset,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default clean fallback UI matching Next.js styling
      return (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-destructive/10 text-destructive flex items-center justify-center text-xl">
            ⚠️
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Let&apos;s Get You Back on Track!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {this.state.error.message || "An unexpected hiccup occurred in this section."}
            </p>
          </div>
          {this.state.error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded inline-block">
              Digest: {this.state.error.digest}
            </p>
          )}
          <div>
            <button
              type="button"
              onClick={this.reset}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
