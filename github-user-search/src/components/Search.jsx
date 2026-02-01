import { useEffect, useState } from "react";
import { searchUsers } from "../services/githubService";
import axios from "axios";

function Search() {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [minRepos, setMinRepos] = useState("");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hasMore, setHasMore] = useState(false);

  const fetchUserExtraData = async (login) => {
    const res = await axios.get(`https://api.github.com/users/${login}`);
    return res.data;
  };

  const handleSearch = async (e, nextPage = 1, append = false) => {
    if (e) e.preventDefault();

    if (!username.trim() && !location.trim() && !minRepos.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await searchUsers({
        username: username.trim(),
        location: location.trim(),
        minRepos: minRepos.trim(),
        page: nextPage,
      });

      const users = data.items || [];

      const detailedUsers = await Promise.all(
        users.map(async (u) => {
          const details = await fetchUserExtraData(u.login);
          return {
            id: u.id,
            login: u.login,
            avatar_url: u.avatar_url,
            html_url: u.html_url,
            location: details.location || "N/A",
            public_repos: details.public_repos ?? 0,
          };
        })
      );

      setResults((prev) => (append ? [...prev, ...detailedUsers] : detailedUsers));
      setHasMore(users.length === 10);
      setPage(nextPage);
    } catch (err) {
      setError("Looks like we cant find the user");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    handleSearch(null, page + 1, true);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form
        onSubmit={(e) => handleSearch(e, 1, false)}
        className="bg-white shadow-md rounded-lg p-4 space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800">Search GitHub Users</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Username (e.g. torvalds)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Location (e.g. Nigeria)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />

          <input
            type="number"
            placeholder="Min repos"
            value={minRepos}
            onChange={(e) => setMinRepos(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-black text-white px-5 py-2 rounded-md hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div className="mt-6">
        {loading && <p className="text-center">Loading...</p>}

        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="grid gap-4 mt-4">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 bg-white shadow-sm border rounded-lg p-4"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-16 h-16 rounded-full"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user.login}</h3>
                    <p className="text-sm text-gray-600">Location: {user.location}</p>
                    <p className="text-sm text-gray-600">
                      Public Repos: {user.public_repos}
                    </p>
                  </div>

                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200"
                  >
                    View Profile
                  </a>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  className="bg-black text-white px-5 py-2 rounded-md hover:opacity-90"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;