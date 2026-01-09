/**
 * Extracts agent name from Retell call data using multiple possible field names.
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

