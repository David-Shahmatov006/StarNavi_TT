import React from "react";
import './HeroList.sass'

interface HeroListProps {
    heroes: { name: string; url: string }[];
    setSelectedHero: (url: string) => void;
}

const HeroList: React.FC<HeroListProps> = ({
    heroes,
    setSelectedHero,
}) => {
    return (
        <div className="hero-list">
            {heroes.map((hero) => (
                <span className="hero-list__item" key={hero.url} onClick={() => setSelectedHero(hero.url)}>
                    {hero.name}
                </span>
            ))}
        </div>
    );
};

export default HeroList;
