import React from "react";
import Pateo from "pateo";
import w from "../wrappers";

@Pateo.subscribe(w.language, w.greetingButtonTexts, w.greetingVisible)
export class Buttons extends React.PureComponent {

    render = () => {
        return (
            <div className="mb-3">
                <button type="button" className={"btn btn-secondary"} disabled={w.language.eq("en")} onClick={w.language.setter("en")}>
                    English
                </button>
                <button type="button" className={"btn btn-secondary"} disabled={w.language.eq("ru")} onClick={w.language.setter("ru")}>
                    Русский
                </button>
                <button type="button" className="btn btn-primary" onClick={w.greetingVisible.toggle}>
                    {w.greetingVisible.emit() ? w.greetingButtonTexts.emit().hide : w.greetingButtonTexts.emit().show}
                </button>
            </div>
        );
    }

}