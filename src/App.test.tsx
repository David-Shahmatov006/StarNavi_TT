import React from 'react';
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import axios from "axios";

jest.mock("axios");

describe("App Component", () => {
    test("renders Star Wars Heroes title", async () => {
        await act(async () => {
            render(<App />);
        });
        const titleElement = screen.getByText(/Star Wars Heroes/i);
        expect(titleElement).toBeInTheDocument();
    });

    test("displays loader when data is being fetched", async () => {
        (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
        await act(async () => {
            render(<App />);
        });
    
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    
        await act(async () => {
            (axios.get as jest.Mock).mockResolvedValue({
                data: {
                    results: [],
                    count: 0,
                },
            });
            render(<App />);
        });
    });
    

    test("renders hero list after data is fetched", async () => {
        const heroes = [
            {
                name: "Luke Skywalker",
                url: "https://sw-api.starnavi.io/people/1",
            },
        ];

        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                results: heroes,
                count: 1,
            },
        });

        await act(async () => {
            render(<App />);
        });

        const heroElement = await screen.findByText("Luke Skywalker");
        expect(heroElement).toBeInTheDocument();
    });

    test("pagination works correctly", async () => {
        const heroes = [
            {
                name: "Luke Skywalker",
                url: "https://sw-api.starnavi.io/people/1",
            },
        ];

        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                results: heroes,
                count: 20,
            },
        });

        await act(async () => {
            render(<App />);
        });

        expect(screen.getByText("1")).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText("2"));
        });

        expect(axios.get).toHaveBeenCalledWith(
            "https://sw-api.starnavi.io/people?page=2"
        );
    });
});
