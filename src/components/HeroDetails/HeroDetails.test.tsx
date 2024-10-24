import React from 'react';
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import HeroDetails from "./HeroDetails";

jest.mock("axios");

describe("HeroDetails Component", () => {
    test("displays loader when fetching hero details", async () => {
        render(<HeroDetails heroUrl="https://sw-api.starnavi.io/people/1" />);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("renders hero details and nodes after fetching", async () => {
        const heroData = {
            name: "Luke Skywalker",
            films: [1, 2],
        };

        (axios.get as jest.Mock).mockResolvedValue({
            data: heroData,
        });

        render(<HeroDetails heroUrl="https://sw-api.starnavi.io/people/1" />);

        const heroNode = await screen.findByText("Luke Skywalker");
        expect(heroNode).toBeInTheDocument();
    });

    test("displays error message when fetching hero details fails", async () => {
        const errorMessage = "Hero details fetch error";
        
        (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

        render(<HeroDetails heroUrl="https://sw-api.starnavi.io/people/1" />);

        const errorNode = await screen.findByText(errorMessage);
        expect(errorNode).toBeInTheDocument();
    });
});
