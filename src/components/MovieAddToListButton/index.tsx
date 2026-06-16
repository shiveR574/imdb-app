"use client";

import { useState, useEffect } from "react";
import "./index.scss";
import {MovieWatchListType} from "@/src/types/watchlistmovie";


type WatchStatus = "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "DROPPED";

export default function MovieWatchListButton({ movieId, movieName }: MovieWatchListType) {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<WatchStatus | "ADD">("ADD");

  // 1. Pre-load the movie's status from the database on page load
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const response = await fetch(`/api/movielist?movieId=${movieId}`);
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
  }, [movieId]);

  const handleStatusChange = async (newStatus: WatchStatus) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/movielist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: String(movieId),
          movieName: movieName,
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
        
        // Brief visual confirmation effect
        setTimeout(() => {
          setIsSaving(false);
        }, 800);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setIsSaving(false);
    }
  };

  return (
    <div className="watchlist-selector-container">
      <select
        value={currentStatus}
        disabled={isSaving}
        onChange={(e) => handleStatusChange(e.target.value as WatchStatus)}
        className={`watchlist-select ${currentStatus.toLowerCase()}`}
      >
        <option value="ADD" disabled hidden>
          + Add to List
        </option>
        <option value="PLAN_TO_WATCH">📋 Plan to Watch</option>
        <option value="WATCHING">🍿 Watching</option>
        <option value="COMPLETED">✅ Completed</option>
        <option value="DROPPED">❌ Dropped</option>
      </select>

      {/* 2. Tiny animated toast confirmation message */}
      {isSaving && <span className="save-indicator">WatchList Updated</span>}
    </div>
  );
}