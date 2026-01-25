import React from "react";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";
import Button from "./Button";
import Icon from "./Icon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.xl,
            background: `linear-gradient(135deg, ${colors.brand[50]} 0%, ${colors.gray[50]} 100%)`,
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              padding: spacing["2xl"],
              backgroundColor: colors.background.card,
              borderRadius: borderRadius["2xl"],
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: spacing.xl }}>
              <Icon name="alert-circle" size={64} color={colors.error} strokeWidth="2" />
            </div>
            <h1
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.extrabold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.md,
                fontFamily: typography.fontFamily.display,
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                margin: 0,
                marginBottom: spacing.xl,
                lineHeight: 1.6,
              }}
            >
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            {this.state.error && process.env.NODE_ENV === "development" && (
              <details
                style={{
                  marginBottom: spacing.xl,
                  textAlign: "left",
                  padding: spacing.md,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.xs,
                  fontFamily: "monospace",
                  color: colors.text.primary,
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: typography.fontWeight.bold, marginBottom: spacing.xs }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div
              style={{
                display: "flex",
                gap: spacing.md,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleGoHome}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
