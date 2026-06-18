"use client";

import { useState, useEffect } from "react";
import "./index.scss";
import { FavoriteButtonType } from "@/src/types/favorite";

export default function FavoriteButton({ type, entityId, entityName }: FavoriteButtonType) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Pre-load favorite status from the database on mount
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const response = await fetch(
          `/api/favorites?type=${type}&entityId=${entityId}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(!!data.favorited);
        }
      } catch (err) {
        console.error("Failed to fetch initial favorite status:", err);
      }
    };

    fetchCurrentStatus();
  }, [type, entityId]);

  const handleToggle = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          entityId: String(entityId),
          entityName: entityName || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update favorite");
      }

      const data = await response.json();
      if (data.success) {
        setIsFavorited(data.favorited);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isSaving}
      className={`favorite-button ${isFavorited ? "favorited" : ""}`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorited ? "♥" : "♡"}
    </button>
  );
}