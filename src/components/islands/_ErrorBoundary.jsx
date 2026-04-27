// ═══════════════════════════════════════════════════════════════
// _ErrorBoundary — shared fail-safe wrapper for every React island
// Spec: plan/plan.md issue 2.11 (resilience against runtime errors)
//
// Usage (inside each island file):
//   import ErrorBoundary from './_ErrorBoundary.jsx';
//   function MyIslandImpl() { ... }
//   export default function MyIsland() {
//     return <ErrorBoundary fallback={<Fallback />}><MyIslandImpl/></ErrorBoundary>;
//   }
//
// The underscore prefix marks this as an internal helper (not an island).
// ═══════════════════════════════════════════════════════════════
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log to console so devs see it; silent in prod UI.
    if (typeof console !== 'undefined') {
      console.error('[MonBoum island error]', error, info);
    }
    // Optional: forward to GA4 if loaded — we guard because Layout may have
    // skipped GA4 injection when no ID is set.
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'island_error', {
          error_message: error?.message || 'unknown',
          error_name: error?.name || 'Error',
        });
      } catch (_) {
        // swallow — telemetry must never break the fallback
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
