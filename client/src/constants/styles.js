// Clean, modern flat design with glass effect
export const gradients = {
  primary: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  accent: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
  card: "rgba(255, 255, 255, 0.06)",
  cardHover: "rgba(255, 255, 255, 0.08)",
  button: "rgba(255, 255, 255, 0.08)",
  buttonHover: "rgba(255, 255, 255, 0.12)",
  textGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  background: "#1a1b3a",
};

// Shared style constants with clean glass design
export const cardStyles = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 16,
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  error: {
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    marginBottom: 16,
    background: "rgba(239, 68, 68, 0.1)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.15)",
    overflow: "hidden",
  }
};

export const buttonStyles = {
  primary: {
    padding: "12px 20px",
    cursor: "pointer",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 400,
    minHeight: "44px",
    touchAction: "manipulation",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
  }
};

export const formStyles = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  containerMobile: {
    padding: 20,
    marginTop: 16,
    marginBottom: 16
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    boxSizing: "border-box",
    fontSize: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    color: "#ffffff",
    transition: "all 0.2s ease",
  },
  inputMobile: {
    padding: 14,
    fontSize: "16px",
    minHeight: "44px"
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: "14px",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.9)"
  }
};

export const layoutStyles = {
  login: {
    maxWidth: 420,
    margin: "6rem auto",
    padding: 32,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  },
  loginMobile: {
    margin: "2rem auto",
    padding: 24,
    maxWidth: "calc(100% - 32px)"
  }
};

// Responsive grid styles
export const gridStyles = {
  createUserForm: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    gap: "12px",
    marginBottom: 12
  },
  createUserFormMobile: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: 12
  }
};
