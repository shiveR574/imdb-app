'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Props {
    mediaId: string | number;
    mediaType: 'movie' | 'tv' | 'person';
}

type Status = 'plan' | 'watched' | 'favorite' | 'dropped' | null;

export default function AddToListButton({ mediaId, mediaType }: Props) {
    const { data: session } = useSession();
    const [status, setStatus] = useState<Status>(null);
    const [entryId, setEntryId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // check if this item is already in the list when component mounts
    useEffect(() => {
        if (!session) return;
        checkIfInList();
    }, [session, mediaId]);

    const checkIfInList = async () => {
        try {
            const res = await fetch(`/api/list`);
            const data = await res.json();
            const found = data.find(
                (entry: any) => entry.mediaId === String(mediaId)
            );
            if (found) {
                setStatus(found.status);
                setEntryId(found.id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addToList = async (selectedStatus: string) => {
        if (!session) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaId: String(mediaId),
                    mediaType,
                    status: selectedStatus,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus(selectedStatus as Status);
                setEntryId(data.id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setShowMenu(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!entryId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/list/${entryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setStatus(newStatus as Status);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setShowMenu(false);
        }
    };

    const removeFromList = async () => {
        if (!entryId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/list/${entryId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setStatus(null);
                setEntryId(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setShowMenu(false);
        }
    };

    const handleAction = (selectedStatus: string) => {
        if (status === null) {
            addToList(selectedStatus);
        } else {
            updateStatus(selectedStatus);
        }
    };

    // don't show button if not logged in
    if (!session) return null;

    const statusLabels: Record<string, string> = {
        plan: '📌 Plan to Watch',
        watched: '✅ Watched',
        favorite: '❤️ Favorite',
        dropped: '❌ Dropped',
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isLoading}
                style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: status ? '#e0a800' : '#f5c518',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    color: '#000',
                }}
            >
                {isLoading
                    ? 'Loading...'
                    : status
                    ? statusLabels[status]
                    : '+ Add to List'}
            </button>

            {showMenu && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    zIndex: 100,
                    minWidth: '160px',
                    marginTop: '4px',
                }}>
                    {Object.entries(statusLabels).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => handleAction(key)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: status === key ? '#333' : 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                    {status && (
                        <button
                            onClick={removeFromList}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderTop: '1px solid #333',
                                color: '#ff4444',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            🗑️ Remove
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}