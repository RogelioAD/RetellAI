/**
 * Extract agent name from Retell call data
 * Tries multiple fields and formats to handle different API response structures
 * @param {object} callData - Call data from Retell API
 * @returns {string|null} Agent name or null if not found
 */
export function extractAgentName(callData) {
  if (!callData) {
    return null;
  }

  // Try multiple possible field names and structures
  return (
    callData.agent_name ||
    callData.agent?.name ||
    callData.agent_id ||
    callData.agent_name_id ||
    (callData.agent && typeof callData.agent === 'string' ? callData.agent : null) ||
    (callData.agent_id && typeof callData.agent_id === 'string' ? callData.agent_id : null) ||
    null
  );
}

