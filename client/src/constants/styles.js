// Shared style constants with responsive support
export const cardStyles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden"
  },
  error: {
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff3cd",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden"
  }
};

export const buttonStyles = {
  primary: {
    padding: "8px 16px",
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: 4,
    backgroundColor: "#fff",
    fontSize: "14px",
    minHeight: "44px", // Touch-friendly minimum height
    touchAction: "manipulation" // Prevent double-tap zoom
  },
  fullWidth: {
    width: "100%",
    padding: 10,
    marginTop: 8,
    cursor: "pointer",
    minHeight: "44px"
  }
};

export const formStyles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9"
  },
  containerMobile: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16
  },
  input: {
    width: "100%",
    padding: 8,
    boxSizing: "border-box",
    fontSize: "16px" // Prevents zoom on iOS
  },
  inputMobile: {
    padding: 12,
    fontSize: "16px",
    minHeight: "44px" // Touch-friendly
  },
  label: {
    display: "block",
    marginBottom: 4,
    fontSize: "14px"
  }
};

export const layoutStyles = {
  dashboard: {
    maxWidth: 900,
    margin: "3rem auto",
    padding: "0 20px"
  },
  dashboardMobile: {
    margin: "1rem auto",
    padding: "0 12px"
  },
  login: {
    maxWidth: 420,
    margin: "6rem auto",
    padding: 24,
    border: "1px solid #ddd",
    borderRadius: 8
  },
  loginMobile: {
    margin: "2rem auto",
    padding: 20,
    maxWidth: "calc(100% - 24px)"
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

