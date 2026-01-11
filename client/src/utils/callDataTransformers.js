// Extracts agent name from call object using multiple possible field names, with fallback to "Unknown Agent"
export function extractAgentName(call, mapping = {}) {
  return (
    call?.agent_name ||
    call?.agent?.name ||
    call?.agent_id ||
    call?.agent_name_id ||
    mapping?.metadata?.agent_name ||
    call?.metadata?.agent_name ||
    "Unknown Agent"
  );
}

// Extracts call ID from call object or mapping with fallback to index-based ID
export function extractCallId(call, mapping = {}, index = null) {
  return (
    mapping?.retellCallId ||
    call?.call_id ||
    call?.id ||
    call?.callId ||
    (index !== null ? `call-${index}` : null)
  );
}

// Extracts creation timestamp from call object, preferring call's date fields over mapping.createdAt (which is DB record date)
export function extractCreatedAt(call, mapping = {}) {
  return (
    call?.created_at ||
    call?.createdAt ||
    call?.start_timestamp ||
    mapping?.createdAt ||
    new Date().toISOString()
  );
}

// Extracts phone number from call object checking multiple possible field names
export function extractPhoneNumber(call) {
  if (!call) return null;
  
  const phoneNumber = 
    call.from_number ||
    call.fromNumber ||
    call.from ||
    call.caller_id ||
    call.callerId ||
    call.caller_id_number ||
    call.callerIdNumber ||
    call.phone_number ||
    call.phoneNumber ||
    call.phone ||
    call.customer_number ||
    call.customerNumber ||
    call.customer_phone_number ||
    call.customerPhoneNumber ||
    call.to_number ||
    call.toNumber ||
    call.to ||
    call.metadata?.phone_number ||
    call.metadata?.phoneNumber ||
    call.metadata?.from_number ||
    call.metadata?.fromNumber ||
    call.metadata?.caller_id ||
    call.metadata?.callerId ||
    call.metadata?.customer_number ||
    call.metadata?.customerNumber ||
    null;
  
  return phoneNumber;
}

// Extracts call duration in seconds, calculating from timestamps if duration not found directly
export function extractCallDuration(call) {
  if (!call) return null;
  
  let duration = 
    call.duration ||
    call.call_duration ||
    call.callDuration ||
    call.duration_seconds ||
    call.durationSeconds ||
    call.total_duration ||
    call.totalDuration ||
    call.metadata?.duration ||
    call.metadata?.call_duration ||
    null;
  
  if (duration === null || duration === undefined) {
    const startTime = 
      call.start_timestamp ||
      call.startTimestamp ||
      call.start_time ||
      call.startTime ||
      call.created_at ||
      call.createdAt ||
      null;
    
    const endTime = 
      call.end_timestamp ||
      call.endTimestamp ||
      call.end_time ||
      call.endTime ||
      call.ended_at ||
      call.endedAt ||
      null;
    
    if (startTime && endTime) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      if (!isNaN(start) && !isNaN(end) && end > start) {
        duration = Math.floor((end - start) / 1000);
      }
    }
  }
  
  if (duration === null || duration === undefined) {
    return null;
  }
  
  if (duration > 10000) {
    return Math.floor(duration / 1000);
  }
  
  return Math.floor(duration);
}

// Formats duration in seconds to human-readable format (MM:SS or HH:MM:SS)
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return "0:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Extracts recording URL from call object checking multiple possible field names
export function extractRecordingUrl(call) {
  return (
    call?.recording_url ||
    call?.recordingUrl ||
    call?.recording ||
    call?.recording_urls?.mp3 ||
    call?.recording_urls?.wav ||
    call?.metadata?.recording_url ||
    call?.metadata?.recordingUrl ||
    null
  );
}

// Extracts transcript and utterances data from call object
export function extractTranscriptData(call) {
  return {
    transcript: call?.transcript || call?.transcripts || call?.conversation || null,
    utterances: call?.utterances || call?.messages || call?.transcript_items || null
  };
}

// Transforms admin call data to unified format preserving metadata from response
export function transformAdminCallData(data, metadata = {}) {
  let callsArray = [];
  
  if (Array.isArray(data)) {
    callsArray = data;
  } else if (data.calls && Array.isArray(data.calls)) {
    callsArray = data.calls;
    if (data.total_count !== undefined) metadata.total_count = data.total_count;
    if (data.fetched_count !== undefined) metadata.fetched_count = data.fetched_count;
  } else if (data.data && Array.isArray(data.data)) {
    callsArray = data.data;
    if (data.total_count !== undefined) metadata.total_count = data.total_count;
    if (data.fetched_count !== undefined) metadata.fetched_count = data.fetched_count;
  } else {
    callsArray = Object.values(data).find(val => Array.isArray(val)) || [];
  }
  
  const transformed = callsArray.map(call => ({
    mapping: {
      id: call.call_id || call.id || call.callId,
      retellCallId: call.call_id || call.id || call.callId,
      createdAt: call.created_at || call.createdAt || call.start_timestamp || new Date().toISOString(),
      metadata: call.metadata || {}
    },
    call
  }));
  
  if (metadata.total_count !== undefined || metadata.fetched_count !== undefined) {
    transformed._metadata = metadata;
  }
  
  return transformed;
}

// Groups calls by agent name and sorts groups by last updated timestamp
export function groupCallsByAgent(items) {
  const groups = {};
  
  items.forEach((item) => {
    const mapping = item.mapping || {};
    const call = item.call || item;
    const agentName = extractAgentName(call, mapping);
    const createdAt = extractCreatedAt(call, mapping);
    const timestamp = new Date(createdAt).getTime();

    if (!groups[agentName]) {
      groups[agentName] = {
        agentName,
        calls: [],
        lastUpdated: timestamp
      };
    }
    
    groups[agentName].calls.push(item);
    if (timestamp > groups[agentName].lastUpdated) {
      groups[agentName].lastUpdated = timestamp;
    }
  });

  return Object.values(groups).sort((a, b) => b.lastUpdated - a.lastUpdated);
}
