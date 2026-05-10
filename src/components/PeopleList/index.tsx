"use client";
import "../PeopleList/index.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { People } from "@/src/types/people";
import { ClipLoader } from "react-spinners";
import PeopleDetails from "../PeopleDetails";

export default function PeopleList() {

    const [people, setPeople] = useState<People[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        getPeople(currentPage); //pass page number to getPeople function
    }, [currentPage]); //fetch people when currentPage changes

    const getPeople = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios ({
                method: "get",
                url: "https://api.themoviedb.org/3/trending/person/day?language=en-US'",
                params: {
                    api_key: "9ab0c1b5c24de8fee8cff270d3f18e70",
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
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                >
                    
                ← Prev
                </button>

                <span>{currentPage} out of {totalPages}</span>

                <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    >

                    Next →
                </button>
            </div>
        </>
    )
}

