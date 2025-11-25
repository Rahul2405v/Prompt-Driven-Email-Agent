const BASE_URL =  "http://127.0.0.1:8000";

export const replyToEmail = async (prompt_q, k_n) => {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt_q, k: k_n })
  });
  return await res.json();
}