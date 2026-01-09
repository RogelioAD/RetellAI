import { getUserCalls, listCalls } from "../services/callService.js";

/**
 * Returns all calls for the authenticated user.
 */
export async function getMyCalls(req, res) {
  const results = await getUserCalls(req.user.id);
  res.json(results);
}

/**
 * Proxies to Retell AI's list-calls endpoint with pagination support.
 * NOTE: Used by analytics/display. Requires fetchAll=true in request body to return complete dataset beyond 100-call limit.
 */
export async function listAllCalls(req, res) {
  const filters = req.body || {};
  const { fetchAll, ...apiFilters } = filters;
  
  const result = await listCalls(apiFilters, fetchAll);
  res.json(result);
}

