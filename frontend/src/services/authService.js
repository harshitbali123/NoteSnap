// simple mock; replace with axios.post(...) to your real backend
export async function signup({ name, email, password }) {
  // simulate API delay
  await new Promise(res => setTimeout(res, 500));
  // pretend success: return user object
  return { id: Date.now(), name, email };
}

export async function login({ email, password }) {
  await new Promise(res => setTimeout(res, 500));
  // basic fake check (replace with server auth)
  if (!email || !password) throw new Error("Invalid credentials");
  return { id: 1, email };
}
