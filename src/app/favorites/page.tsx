import "../favorites/page.scss";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Favorites = async () => {

    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    }

    return (
        <h1>
            Favorites
        </h1>
    )
}

export default Favorites;

