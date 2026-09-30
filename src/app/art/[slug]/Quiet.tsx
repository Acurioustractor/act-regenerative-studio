"use client";

import { Component, type ReactNode } from "react";

/**
 * Shows its children, or nothing if they throw. The Empathy Ledger connections panel is a tool for signed-in staff that
 * reads a Supabase session in the browser; if that cannot start (no keys in a preview, a blocked request) the public
 * page under it must stay standing.
 */
export class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
