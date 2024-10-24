import React, { useState, useEffect } from "react";
import "./App.sass";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import HeroList from "./components/HeroList/HeroList";
import HeroDetails from "./components/HeroDetails/HeroDetails";
import Loader from "./components/Loader/Loader";
import Pagination from "./components/Pagination/Pagination";

interface Hero {
    name: string;
    url: string;
}

const App: React.FC = () => {
    // State to store the list of heroes, selected hero, loading state, current page, and total pages
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [selectedHero, setSelectedHero] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Base API URL for fetching Star Wars characters
    const API_URL = "https://sw-api.starnavi.io/people";

    // Fetch heroes data from the API whenever the page number changes
    useEffect(() => {
        const fetchHeroes = async (page: number) => {
            setIsLoaded(false); // Start with loading state
            try {
                // Fetch the heroes for the current page from the API
                const response = await axios.get(`${API_URL}?page=${page}`);
                if (response && response.data) {
                    const { data } = response;
                    setHeroes(data.results); // Update the heroes list with the data
                    setTotalPages(Math.ceil(data.count / 10)); // Calculate total pages based on count
                    setIsLoaded(true); // Mark as loaded once data is successfully fetched
                }
            } catch (error) {
                console.error(error); // Handle any errors in fetching data
                setIsLoaded(true); // Still mark as loaded even on error
            }
        };

        // Fetch heroes for the current page
        fetchHeroes(page);
    }, [page]); // Re-run when `page` changes

    // Move to the next page if not already on the last page
    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Move to the previous page if not already on the first page
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="star-wars-heroes">
            <h1 className="star-wars-heroes__title">Star Wars Heroes</h1>
            {/* Show a loader while data is being fetched */}
            {!isLoaded ? (
                <Loader />
            ) : (
                <div className="star-wars-heroes__inner">
                    <div className="heroes-list-container">
                        {/* Render the list of heroes */}
                        <HeroList
                            heroes={heroes}
                            setSelectedHero={setSelectedHero}
                        />
                        {/* Pagination controls for switching pages */}
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                        />
                    </div>
                    {/* Show hero details if one is selected, otherwise prompt to choose a hero */}
                    {selectedHero ? (
                        <HeroDetails heroUrl={selectedHero} />
                    ) : (
                        <h1 className="star-wars-heroes__choose-text">
                            Choose a hero
                        </h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
