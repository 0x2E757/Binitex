import React from "react";
import { Buttons } from "./buttons";
import { Content } from "./content";

export class App extends React.Component {

    render = () => {
        return (<>
            <Buttons />
            <Content />
        </>);
    }

}