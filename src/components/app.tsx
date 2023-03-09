import React from "react";
import Pateo from "pateo";
import w from "../wrappers";
import Header from "./Header";
import Body from "./Body";

@Pateo.subscribe(w.data.state, w.data.stateText)
export default class App extends React.PureComponent {

    componentDidMount = () => {
        if (w.data.state.eq("none")) {
            w.data.state.set("fetching");
            new Pateo.PromiseExt(fetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"))
                .then(response => {
                    w.data.state.set("parsing");
                    return response.json();
                })
                .then(data => w.data.recordsRaw.set(data.records))
                .then(w.data.state.setter("done"))
        }
    }

    render = () => {
        if (w.data.state.eq("done")) {
            return (
                <>
                    <div className="main-container p-3 m-3">
                        <Header />
                        <Body />
                    </div>
                    <div className="text-center mb-3" style={{ marginTop: "-0.75rem" }}>
                        <a href="https://github.com/0x2E757/Binitex" className="source-link">
                            <img src="./img/github-mark.png" alt="GitHub" />
                            Source code on GitHub
                        </a>
                    </div>
                </>
            );
        } else {
            return (
                <div className="main-container p-5 m-3 mt-5 d-flex align-items-center">
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true" />
                    <h3 className="my-auto ps-3">{w.data.stateText.emit()}</h3>
                </div>
            );
        }
    }

}