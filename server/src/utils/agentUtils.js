// Extracts agent name from call data, trying multiple possible field names
// Handles various API response formats where agent info may be in different locations
export function extractAgentName(callData) {
  if (!callData) {
    return null;
  }

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
