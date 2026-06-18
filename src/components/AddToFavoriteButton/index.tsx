"use client";

import { useState, useEffect } from "react";
import "./index.scss";
import { FavoriteButtonType } from "@/src/types/favorite";
import favorite from "../../assets/favorite.png";
import nonfavorite from "../../assets/nonfavorite.png";
import nonfavorite2 from "../../assets/nonfavorite2.png";
import Image from "next/image";

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
    <Image
      src={isFavorited ? favorite : nonfavorite2 }
      alt={isFavorited ? "Favorited" : "Not favorited"}
      width={38}
      height={38}
      style={isFavorited ? {filter: "none"} : { filter: "invert(1)"}}
      // style={isFavorited ? { filter: "none" } : { filter: "invert(1) drop-shadow(0 0 1px white)" }}
    />
    </button>
  );
}