import React, { useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { createCustomer } from "../../services/api";
import { validateUserCreation } from "../../utils/validators";
import CreateUserForm from "./CreateUserForm";
import UserTable from "./UserTable";
import { formStyles } from "../../constants/styles";

/**
 * Component for managing users (admin only) with responsive design
 */
export default function UserManagement({ token, users, loading, error, onUserCreated, currentUserId }) {
  const { isMobile } = useResponsive();
  const [newUser, setNewUser] = useState({ username: "", password: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [userError, setUserError] = useState(null);
  const [createdUserCredentials, setCreatedUserCredentials] = useState(null);

  const handleChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
    setUserError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserError(null);
    setCreatedUserCredentials(null);

    const validationError = validateUserCreation(
      newUser.username,
      newUser.password,
      newUser.email
    );

    if (validationError) {
      setUserError(validationError);
      return;
    }

    setCreating(true);
    try {
      const result = await createCustomer(token, newUser);
      setCreatedUserCredentials({
        username: result.user.username,
        password: result.password,
        email: result.user.email
      });
      setNewUser({ username: "", password: "", email: "" });
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      setUserError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{
      ...formStyles.container,
      ...(isMobile && formStyles.containerMobile)
    }}>
      <h3 style={{ 
        marginTop: 0,
        fontSize: isMobile ? "1.2em" : "1.3em"
      }}>User Management</h3>
      
      <CreateUserForm
        newUser={newUser}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={userError || error}
        creating={creating}
        createdUserCredentials={createdUserCredentials}
      />

      <UserTable 
        users={users} 
        loading={loading} 
        onDeleteUser={async (userId) => {
          const { deleteUser } = await import("../../services/api");
          await deleteUser(token, userId);
          if (onUserCreated) {
            onUserCreated();
          }
        }}
        currentUserId={currentUserId}
      />
    </div>
  );
}

