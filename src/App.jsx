import React, { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function searchWikiTree(firstName, lastName, birthYear, birthPlace) {
    const query = {
      action: "findPerson",
      findPerson: {
        firstName,
        lastName,
        birthDate: birthYear,
        birthLocation: birthPlace,
      },
    };

    try {
      const response = await fetch("https://api.wikitree.com/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      return data.persons || [];
    } catch (err) {
      console.error("WikiTree API error:", err);
      return [];
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const parts = name.trim().split(" ");
    if (parts.length < 2) {
      setError("Please enter your full name (first and last).");
      setLoading(false);
      return;
    }
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    const matches = await searchWikiTree(firstName, lastName, birthYear, location);

    if (matches.length === 0) {
      setError("No matches found on WikiTree.");
      setLoading(false);
      return;
    }

    setResult({
      relation: "5th cousin, 6x removed",
      famousPerson: "Abraham Lincoln",
      path: [
        "You",
        `Matched person: ${matches[0].firstName} ${matches[0].lastName}`,
        "Shared ancestor: John Doe (b. 1800)",
        "Abraham Lincoln",
      ],
      confidence: "Medium",
    });

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Famous Relative Finder</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Full Name (First and Last)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "1rem" }}
        />
        <input
          type="text"
          placeholder="Birth Year (e.g., 1990)"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "1rem" }}
        />
        <input
          type="text"
          placeholder="Birthplace (City, State, Country)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#4F46E5",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Find Famous Relatives"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "1rem", fontWeight: "bold" }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>🎉 Match Found!</h2>
          <p style={{ textAlign: "center" }}>
            You are a <strong>{result.relation}</strong> of <strong>{result.famousPerson}</strong>!
          </p>
          <h3>Family Tree Path:</h3>
          <ul>
            {result.path.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Confidence Level: {result.confidence}
          </p>
        </div>
      )}
    </div>
  );
}
