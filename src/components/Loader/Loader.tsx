import React from "react";
import './Loader.sass';
import yoda from "../../images/yoda.png";

const Loader: React.FC = () => {
    return (
        <div data-testid="loader">
            <img src={yoda} className="loader"></img>;
        </div>
    );
};

export default Loader;
