"use client";
import "../PeopleList/index.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { People } from "@/src/types/people";
import { ClipLoader } from "react-spinners";
import PeopleDetails from "../PeopleDetails";
import {useSearchParams, useRouter} from "next/navigation";


export default function PeopleList() {

    const [people, setPeople] = useState<People[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0);

    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1; // reading the page from URL

    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    useEffect(() => {
        getPeople(currentPage); //pass page number to getPeople function
    }, [currentPage]); //fetch people when currentPage changes

    const getPeople = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios ({
                method: "get",
                url: "https://api.themoviedb.org/3/person/popular",
                params: {
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                    page, //pass page number as a parameter
                }
            });
            setPeople(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching people:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePageChange = (page: number) => {
        router.push(`/people?page=${page}`); //saving page here in URL
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <ClipLoader color="#6046ff" size={150} />
            </div>
        )
    }

    return (
        <>
            <ul className="people-list">
                {people.map((people) =>
                    <PeopleDetails
                        key={people.id}
                        people={people}
                    />
                )}
            </ul>

            <div className="pagination">
                <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                >
                    
                ← Prev
                </button>

                <span>{currentPage} out of {totalPages}</span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    >

                    Next →
                </button>
            </div>
        </>
    )
}

