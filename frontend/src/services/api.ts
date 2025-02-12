import { supabase } from "../services/supabase.ts"; 


const API_URL = import.meta.env.VITE_API_URL; // Uses env variable

// Fetch all runs
export async function getRuns() {
  const token = (await supabase.auth.getSession()).data.session?.access_token;

  const response = await fetch(`${API_URL}/api/runs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Unauthorized: Please log in.");
      return;
    } else {
      console.error(`Error ${response.status}: Failed to fetch runs`);
      return;
    }
  } 
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