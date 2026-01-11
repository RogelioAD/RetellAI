import { getUserCalls, listCalls } from "../services/callService.js";

// HTTP handler for getting authenticated user's calls
export async function getMyCalls(req, res) {
  const results = await getUserCalls(req.user.id);
  res.json(results);
}

// HTTP handler for listing all calls (admin) with optional filters
export async function listAllCalls(req, res) {
  const filters = req.body || {};
  const { fetchAll, ...apiFilters } = filters;
  
  const result = await listCalls(apiFilters, fetchAll);
  res.json(result);
}
