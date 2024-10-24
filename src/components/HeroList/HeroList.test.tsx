import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import HeroList from "./HeroList";

describe("HeroList Component", () => {
    const heroes = [
        { name: "Luke Skywalker", url: "https://sw-api.starnavi.io/people/1" },
        { name: "Darth Vader", url: "https://sw-api.starnavi.io/people/2" },
    ];

    test("renders hero list", () => {
        const mockSetSelectedHero = jest.fn();

        render(
            <HeroList heroes={heroes} setSelectedHero={mockSetSelectedHero} />
        );

        const luke = screen.getByText("Luke Skywalker");
        const vader = screen.getByText("Darth Vader");

        expect(luke).toBeInTheDocument();
        expect(vader).toBeInTheDocument();
    });

    test("clicking on a hero calls setSelectedHero", () => {
        const mockSetSelectedHero = jest.fn();

        render(
            <HeroList heroes={heroes} setSelectedHero={mockSetSelectedHero} />
        );

        const luke = screen.getByText("Luke Skywalker");
        fireEvent.click(luke);

        expect(mockSetSelectedHero).toHaveBeenCalledWith(
            "https://sw-api.starnavi.io/people/1"
        );
    });
});
