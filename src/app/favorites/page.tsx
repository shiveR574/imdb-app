'use client';
import './page.scss';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MovieCard from '@/src/components/MovieCard';
import TVShowCard from '@/src/components/TVShowCard';

interface ListEntry {
    id: string;
    mediaId: string;
    mediaType: 'movie' | 'tv' | 'person';
    status: string;
    rating: number | null;
    note: string | null;
    watchedOn: string | null;
    addedOn: string;
}

interface MediaDetails {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
}

type Tab = 'plan' | 'watched' | 'favorite' | 'dropped';
type Filter = 'all' | 'movie' | 'tv';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MyListPage() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    const [entries, setEntries] = useState<ListEntry[]>([]);
    const [mediaDetails, setMediaDetails] = useState<Record<string, MediaDetails>>({});
    const [activeTab, setActiveTab] = useState<Tab>('plan');
    const [activeFilter, setActiveFilter] = useState<Filter>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (sessionStatus === 'unauthenticated') {
            router.replace('/login');
        }
    }, [sessionStatus, router]);

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            fetchEntries();
        }
    }, [sessionStatus]);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/list');
            const data = await res.json();
            setEntries(data);
            await fetchMediaDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMediaDetails = async (entries: ListEntry[]) => {
        const details: Record<string, MediaDetails> = {};

        await Promise.all(
            entries
                .filter(e => e.mediaType !== 'person')
                .map(async (entry) => {
                    const endpoint = entry.mediaType === 'movie'
                        ? `movie/${entry.mediaId}`
                        : `tv/${entry.mediaId}`;
                    try {
                        const res = await fetch(
                            `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
                        );
                        const data = await res.json();
                        details[entry.mediaId] = data;
                    } catch (err) {
                        console.error(err);
                    }
                })
        );

        setMediaDetails(details);
    };

    const removeEntry = async (entryId: string) => {
        try {
            await fetch(`/api/list/${entryId}`, { method: 'DELETE' });
            setEntries(prev => prev.filter(e => e.id !== entryId));
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (entryId: string, newStatus: string) => {
        try {
            await fetch(`/api/list/${entryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            setEntries(prev =>
                prev.map(e => e.id === entryId ? { ...e, status: newStatus } : e)
            );
        } catch (err) {
            console.error(err);
        }
    };

    const tabEntries = entries.filter(e => {
        const matchesTab = e.status === activeTab;
        const matchesFilter = activeFilter === 'all' || e.mediaType === activeFilter;
        return matchesTab && matchesFilter;
    });

    const countByTab = (tab: Tab) => entries.filter(e => e.status === tab).length;

    const tabs: { key: Tab; label: string }[] = [
        { key: 'plan', label: '📌 Plan to Watch' },
        { key: 'watched', label: '✅ Watched' },
        { key: 'favorite', label: '❤️ Favorite' },
        { key: 'dropped', label: '❌ Dropped' },
    ];

    if (sessionStatus === 'loading' || isLoading) {
        return <p style={{ color: 'white', padding: '2rem' }}>Loading...</p>;
    }

    return (
        <div className="my-list-page">
            <div className="my-list-header">
                <h1>My List</h1>
                <p>{entries.length} total items</p>
            </div>

            <div className="my-list-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                        <span className="tab-count">{countByTab(tab.key)}</span>
                    </button>
                ))}
            </div>

            <div className="my-list-filters">
                {(['all', 'movie', 'tv'] as Filter[]).map(filter => (
                    <button
                        key={filter}
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter === 'all' ? 'All' : filter === 'movie' ? 'Movies' : 'TV Shows'}
                    </button>
                ))}
            </div>

            {tabEntries.length === 0 ? (
                <div className="my-list-empty">
                    <p>Nothing here yet — add something from a movie or TV show page!</p>
                </div>
            ) : (
                <ul className="my-list-grid">
                    {tabEntries.map(entry => {
                        const details = mediaDetails[entry.mediaId];
                        return (
                            <li key={entry.id} className="my-list-item">
                                {entry.mediaType === 'movie' && details && (
                                    <MovieCard movie={details as any} />
                                )}
                                {entry.mediaType === 'tv' && details && (
                                    <TVShowCard tvshow={details as any} />
                                )}
                                <div className="my-list-item-actions">
                                    <select
                                        value={entry.status}
                                        onChange={e => updateStatus(entry.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="plan">📌 Plan to Watch</option>
                                        <option value="watched">✅ Watched</option>
                                        <option value="favorite">❤️ Favorite</option>
                                        <option value="dropped">❌ Dropped</option>
                                    </select>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeEntry(entry.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

