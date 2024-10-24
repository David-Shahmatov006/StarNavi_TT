import React, { useState, useEffect } from "react";
import "./HeroDetails.sass";
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    MiniMap,
    Background,
} from "@xyflow/react";
import axios from "axios";
import Loader from "../Loader/Loader";

interface HeroDetailsProps {
    heroUrl: string;
}

const HeroDetails: React.FC<HeroDetailsProps> = ({ heroUrl }) => {
    const [nodes, setNodes] = useState<Node[]>([]); // State to store graph nodes
    const [edges, setEdges] = useState<Edge[]>([]); // State to store graph edges
    const [isLoaded, setIsLoaded] = useState<boolean>(false); // Loading state indicator
    const [error, setError] = useState<string>(""); // State to store error messages

    useEffect(() => {
        // Fetch hero details when the component mounts or when heroUrl changes
        const fetchHeroDetails = async () => {
            setIsLoaded(false); // Set loading state to false while fetching data
            try {
                if (!heroUrl) throw new Error("Hero URL is not provided"); // Throw an error if no hero URL is provided

                const response = await axios.get(heroUrl); // Fetch hero details from the API
                const hero = response.data; // Extract hero data

                // Create the hero node for the graph
                const heroNode: Node = {
                    id: "hero",
                    data: { label: hero.name },
                    position: { x: 0, y: 250 },
                    style: { backgroundColor: "#ffcc00" }, // Custom style for the hero node
                };

                const filmNodes: Node[] = []; // Array to hold film nodes
                const filmEdges: Edge[] = []; // Array to hold edges between hero and films
                const starshipNodes: Node[] = []; // Array to hold starship nodes
                const starshipEdges: Edge[] = []; // Array to hold edges between films and starships

                if (hero.films) {
                    // If hero has films, fetch film details and create nodes
                    await Promise.all(
                        hero.films.map(async (filmId: number) => {
                            try {
                                const filmUrl = `https://sw-api.starnavi.io/films/${filmId}/`; // Construct film API URL
                                const filmResponse = await axios.get(filmUrl); // Fetch film details

                                // Create a node for each film
                                const filmNode: Node = {
                                    id: `film-${filmId}`,
                                    data: { label: filmResponse.data.title }, // Set the film title as the label
                                    position: {
                                        x: 250 + 150, // Position each film node in the graph
                                        y: filmNodes.length * 100,
                                    },
                                    style: { backgroundColor: "#66ccff" }, // Custom style for film nodes
                                };
                                filmNodes.push(filmNode); // Add film node to the list

                                // Create an edge between the hero and the film
                                filmEdges.push({
                                    id: `edge-hero-film-${filmId}`,
                                    source: "hero", // Start from hero node
                                    target: filmNode.id, // Target the film node
                                    style: {
                                        stroke: "#ff0000", // Red color for the edge
                                        strokeWidth: 2, // Set stroke width
                                    },
                                });

                                // If the film has starships, fetch and create starship nodes
                                if (filmResponse.data.starships) {
                                    await Promise.all(
                                        filmResponse.data.starships.map(
                                            async (starshipId: number) => {
                                                try {
                                                    const starshipUrl = `https://sw-api.starnavi.io/starships/${starshipId}/`; // Construct starship API URL
                                                    const starshipResponse =
                                                        await axios.get(
                                                            starshipUrl
                                                        ); // Fetch starship details

                                                    // Create a node for each starship
                                                    const starshipNode: Node = {
                                                        id: `starship-${
                                                            starshipResponse
                                                                .data.id ||
                                                            starshipResponse
                                                                .data.name
                                                        }`,
                                                        data: {
                                                            label: starshipResponse
                                                                .data.name, // Set the starship name as the label
                                                        },
                                                        position: {
                                                            x: 550 + 150, // Position the starship node
                                                            y:
                                                                starshipNodes.length *
                                                                100,
                                                        },
                                                        style: {
                                                            backgroundColor:
                                                                "#ff6666", // Custom style for starship nodes
                                                        },
                                                    };
                                                    starshipNodes.push(
                                                        starshipNode
                                                    ); // Add starship node to the list

                                                    // Create an edge between the film and the starship
                                                    starshipEdges.push({
                                                        id: `edge-film-starship-${
                                                            starshipResponse
                                                                .data.id ||
                                                            starshipResponse
                                                                .data.name
                                                        }`,
                                                        source: filmNode.id, // Start from the film node
                                                        target: starshipNode.id, // Target the starship node
                                                        style: {
                                                            stroke: "#305600", // Green color for the edge
                                                            strokeWidth: 2,
                                                        },
                                                    });
                                                } catch (error) {
                                                    console.error(
                                                        "Starship fetch error:",
                                                        error
                                                    ); // Log error if starship fetch fails
                                                }
                                            }
                                        )
                                    );
                                }
                            } catch (error) {
                                console.error("Film fetch error:", error); // Log error if film fetch fails
                            }
                        })
                    );
                }

                // Set the graph nodes and edges to the state
                setNodes([heroNode, ...filmNodes, ...starshipNodes]);
                setEdges([...filmEdges, ...starshipEdges]);
                setIsLoaded(true); // Set loading state to true once data is loaded
            } catch (error) {
                console.error("Hero details fetch error:", error); // Log error if hero fetch fails
                setError("Hero details fetch error"); // Set error message in state
                setIsLoaded(true); // Stop loading even if there's an error
            }
        };

        fetchHeroDetails(); // Call the fetch function
    }, [heroUrl]); // Dependency array includes heroUrl so data refetches when heroUrl changes

    // Function to handle node drag stop, updates node positions in state
    const onNodeDragStop = (event: any, node: Node) => {
        setNodes(
            (prevNodes) => prevNodes.map((n) => (n.id === node.id ? node : n)) // Update node position based on its ID
        );
    };

    return (
        <div className="hero-details">
            {error && <div data-testid="error-message">{error}</div>}{" "}
            {/* Display error message if there is one */}
            {!isLoaded ? (
                <Loader /> // Show loader if data is still loading
            ) : (
                <ReactFlow
                    nodes={nodes} // Pass nodes to ReactFlow
                    edges={edges} // Pass edges to ReactFlow
                    onNodeDragStop={onNodeDragStop} // Handle node drag event
                    nodesConnectable={true} // Allow nodes to be connectable
                    colorMode="dark" // Set color mode to dark
                >
                    <Controls /> {/* Controls for zoom and panning */}
                    <MiniMap /> {/* Mini map for easier navigation */}
                    <Background gap={12} size={1} />{" "}
                    {/* Set background grid with custom gap and size */}
                </ReactFlow>
            )}
        </div>
    );
};

export default HeroDetails;
