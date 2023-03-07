import React from "react";
import Pateo from "pateo";
import w from "../wrappers";

@Pateo.subscribe(w.greetingVisible, w.greetingText)
export class Content extends React.PureComponent {

    render = () => {
        return (
            <div>
                {w.greetingVisible.emit() && w.greetingText.emit()}
            </div>
        );
    }

}