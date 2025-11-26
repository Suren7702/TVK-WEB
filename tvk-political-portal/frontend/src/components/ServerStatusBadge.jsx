import { useEffect, useState } from "react";
import API from "../api.js";

export default function ServerStatusBadge() {
  const [status, setStatus] = useState("checking"); // "checking" | "up" | "down"

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await API.get("/health");
        if (data.status === "ok") {
          setStatus("up");
        } else {
          setStatus("down");
        }
      } catch (err) {
        setStatus("down");
      }
    };

    check();

    // re-check every 10 seconds
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  let label = "சேவையகம் சரிபார்க்கப்படுகிறது…";
  if (status === "up") label = "சேவையகம் இயங்குகிறது";
  if (status === "down") label = "சேவையகம் இணைக்கப்படவில்லை";

  return (
    <div className={`server-badge server-badge-${status}`}>
      <span className="server-dot" />
      <span className="server-text-ta">{label}</span>
    </div>
  );
}
