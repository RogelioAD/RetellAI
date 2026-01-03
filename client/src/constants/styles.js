// Modern gradient colors
export const gradients = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  accent: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  card: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)",
  cardHover: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
  button: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  buttonHover: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
};

// Shared style constants with modern design
export const cardStyles = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    marginBottom: 16,
    background: gradients.card,
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  error: {
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 16,
    marginBottom: 16,
    background: "linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(254, 226, 226, 0.9) 100%)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(239, 68, 68, 0.1), 0 2px 8px rgba(239, 68, 68, 0.05)",
    overflow: "hidden",
  }
};

export const buttonStyles = {
  primary: {
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    borderRadius: 10,
    background: gradients.button,
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    minHeight: "44px",
    touchAction: "manipulation",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  fullWidth: {
    width: "100%",
    padding: 12,
    marginTop: 8,
    cursor: "pointer",
    minHeight: "44px"
  }
};

export const formStyles = {
  container: {
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    background: gradients.card,
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
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
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    background: "rgba(255, 255, 255, 0.8)",
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
    color: "#1f2937"
  }
};

export const layoutStyles = {
  dashboard: {
    maxWidth: 1000,
    margin: "3rem auto",
    padding: "0 24px"
  },
  dashboardMobile: {
    margin: "1.5rem auto",
    padding: "0 16px"
  },
  login: {
    maxWidth: 420,
    margin: "6rem auto",
    padding: 32,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    background: gradients.card,
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
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
