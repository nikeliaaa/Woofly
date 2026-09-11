const API_URL = "https://woofly-backend.onrender.com";
export { API_URL };

// Получить посты (cursor-based pagination)
export async function fetchPosts({ cursor } = {}) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  params.set("limit", "10");
  const res = await fetch(`${API_URL}/api/posts?${params}`);
  if (!res.ok) throw new Error("Не удалось загрузить посты");
  return res.json();
}

// Создать пост
export async function createPost(text, images) {
  const formData = new FormData();
  formData.append("text", text);
  images.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Не удалось создать пост");
  return data;
}

// Удалить пост
export async function deletePost(id) {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Не удалось удалить пост");
  return res.json();
}

// Получить профиль пользователя
export async function getUserProfile(id) {
  const res = await fetch(`${API_URL}/api/users/${id}`);

  if (!res.ok) {
    throw new Error("Пользователь не найден");
  }

  return res.json();
}
