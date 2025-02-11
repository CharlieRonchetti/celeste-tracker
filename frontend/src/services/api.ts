const API_URL = import.meta.env.VITE_API_URL; // Uses env variable

// Fetch all runs
export async function getRuns() {
  const response = await fetch(`${API_URL}/runs`);
  if (!response.ok) throw new Error("Failed to fetch runs");
  return response.json();
}

// Submit a new run
export async function submitRun(runData: { user_id: number; category: string; time: string }) {
  const response = await fetch(`${API_URL}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(runData),
  });
  if (!response.ok) throw new Error("Failed to submit run");
  return response.json();
}