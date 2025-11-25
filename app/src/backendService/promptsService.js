const BASE_URL = "https://ai-email-enhancer.vercel.app";

export const getPrompts = async () => {
  const res = await fetch(`${BASE_URL}/prompts`);
  return await res.json();
};

export const savePrompts = async (data) => {
  const res = await fetch(`${BASE_URL}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const fetchEmails = async () => {
  const res = await fetch(`${BASE_URL}/emails`);
  return await res.json();
}

export const processEmail = async (email) => {
  const res = await fetch(`${BASE_URL}/process-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email)
  });
  return await res.json();
}

export const replyToEmail = async (emailId, replyContent) => {
  const res = await fetch(`${BASE_URL}/generate-reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: emailId, prompt: replyContent })
  });
  return await res.json();

}
