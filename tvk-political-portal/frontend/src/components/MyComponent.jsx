import { useEffect, useState } from "react";

export default function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ✅ Correct: Call the internal Vercel API route
    fetch('/api/proxy') 
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Proxy Error:", err));
  }, []);

  if (!data) return <p>Loading...</p>;
  return <div>Data from Azure: {JSON.stringify(data)}</div>;
}