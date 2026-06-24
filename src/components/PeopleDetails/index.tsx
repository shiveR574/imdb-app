import { People } from "@/src/types/people";
import "../PeopleDetails/index.scss";
import { useState } from "react";
import Link from "next/link";

export interface Props {
    people : People
}


export default function PeopleDetails(props: Props) {

    const people = props.people;
    const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original/${people.profile_path}`); 

    const knownForTitle = people.known_for?.[0]?.title ?? people.known_for?.[0]?.name;
    
    let label = "";
    let value = "";

    if (knownForTitle) {
        label = "Known for ";
        value = knownForTitle;
    } else if (people.character) {
        label = "Starring as ";
        value = people.character;
    } else if (people.job) {
        label = "";
        value = people.job;
    }
    
    return (
        <li className="people-card">
            <div className="people-pics">               
                <img src={imgSrc} 
                alt={people.name}
                onError = {() => setImgSrc("/fallback.svg")} //set fallback image if original image fails to load
                />
            </div>
            <div className="people-infos">
                <p className="people-name">
                    {people.name}
                </p>
                <div className="hidden-content">
                    <p className="people-department">
                        {people.known_for_department}
                    </p>
                    <p className="people-known-for">
                        <span className="people-known-for">
                            {label}
                        </span>
                            {value}
                    </p>
                    <Link href={`/people/${people.id}`} className="btn-default">
                            See More
                    </Link>
                </div>
            </div>
        </li>
    )
}