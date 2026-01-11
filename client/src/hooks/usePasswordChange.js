import { useState } from "react";
import { changePassword } from "../services/api";
import { validatePasswordChange } from "../utils/validators";

// Manages password change form state, validation, and submission
export function usePasswordChange(token) {
  const [showForm, setShowForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [changing, setChanging] = useState(false);

  // Updates password field value and clears errors
  const handleChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Handles form submission with validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validatePasswordChange(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setChanging(true);
    try {
      await changePassword(token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => {
        setShowForm(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setChanging(false);
    }
  };

  // Cancels password change form and resets state
  const handleCancel = () => {
    setShowForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setError(null);
    setSuccess(null);
  };

  return {
    showForm,
    setShowForm,
    passwordData,
    handleChange,
    handleSubmit,
    handleCancel,
    error,
    success,
    changing
  };
}
