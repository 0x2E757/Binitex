import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "./Table";
import Plot from "./Plot";

enum TabName {
    table = "Table",
    plot = "Plot",
}

export default class Body extends React.PureComponent {

    state = {
        activeTabName: TabName.table,
    };

    onTabChange = (event: React.SyntheticEvent, value: TabName) => {
        this.setState({ activeTabName: value });
    }

    render = () => {
        const { activeTabName } = this.state;
        return (
            <div className="pt-3">
                <Tabs value={activeTabName} onChange={this.onTabChange} className="content-table-header">
                    <Tab label="Table" value={TabName.table} />
                    <Tab label="Plot" value={TabName.plot} />
                </Tabs>
                <div className={activeTabName === TabName.table ? "" : "hidden-tab"}>
                    <Table />
                </div>
                <div className={activeTabName === TabName.plot ? "" : "hidden-tab"}>
                    <Plot />
                </div>
            </div>
        );
    }

}