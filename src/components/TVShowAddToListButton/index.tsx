"use client";

import { useState, useEffect } from "react";
import "./index.scss";
import { TVShowWatchListType } from "@/src/types/watchlisttvshow";

type TVShowWatchStatus = "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "DROPPED" | "ON_HOLD";

export default function TVShowWatchListButton({ tvshowId, tvshowName }: TVShowWatchListType) {
  const [isSaving, setIsSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TVShowWatchStatus | "ADD">("ADD");

  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const response = await fetch(`/api/tvlist?tvshowId=${tvshowId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setCurrentStatus(data.status);
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial watchlist status:", err);
      }
    };

    fetchCurrentStatus();
  }, [tvshowId]);

  const handleStatusChange = async (newStatus: TVShowWatchStatus) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/tvlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvshowId: String(tvshowId),
          tvshowName,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update watchlist");
      }

      const data = await response.json();
      if (data.success) {
        setCurrentStatus(newStatus);
        const timer = setTimeout(() => setIsSaving(false), 800);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Error: ${message}`);
      setIsSaving(false);
    }
  };

  return (
    <div className="watchlist-selector-container">
      <select
        value={currentStatus}
        disabled={isSaving}
        onChange={(e) => handleStatusChange(e.target.value as TVShowWatchStatus)}
        className={`watchlist-select ${currentStatus.toLowerCase()}`}
      >
        <option value="ADD" disabled hidden>+ Add to List</option>
        <option value="PLAN_TO_WATCH">📋 Plan to Watch</option>
        <option value="WATCHING">🍿 Watching</option>
        <option value="COMPLETED">✅ Completed</option>
        <option value="DROPPED">❌ Dropped</option>
        <option value="ON_HOLD">⏸️ On Hold</option>
      </select>

      {isSaving && <span className="save-indicator">Watchlist Updated</span>}
    </div>
  );
}