import axios from "axios";

const BASE_URL = "https://api.github.com";

export async function fetchUserData(username) {
  const response = await axios.get(`${BASE_URL}/users/q=${username}`);
  return response.data;
}

export async function fetchAdvancedUsers({ username, location, minRepos }) {
  let queryParts = [];

  if (username) queryParts.push(username);
  if (location) queryParts.push(`location:${location}`);
  if (minRepos) queryParts.push(`repos:>=${minRepos}`);

  const query = queryParts.join(" ").trim();

  const response = await axios.get(`${BASE_URL}/search/users`, {
    params: { q: query },
    headers: {
      Authorization: import.meta.env.VITE_APP_GITHUB_API_KEY
        ? `token ${import.meta.env.VITE_APP_GITHUB_API_KEY}`
        : undefined,
    },
  });

  return response.data.items;
}