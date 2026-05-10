import { People } from "@/src/types/people";
import "../PeopleDetails/index.scss";
import { useState } from "react";

export interface Props {
    people : People
}


export default function PeopleDetails(props: Props) {

    const people = props.people;
    const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original/${people.profile_path}`); 
    
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
                <p className="people-department">
                    {people.known_for_department}
                </p>
            </div>
        </li>
    )
}