import _ from "lodash";
import React from "react";
import Pateo from "pateo";
import Chart, { ChartItem } from "chart.js/auto";
import CountrySelect from "./CountrySelect";
import { FormElement, FormGroup } from "..";
import w from "../../wrappers";
import moment from "moment";

const countryFilter = new Pateo.StaticWrapper("");

const data = new Pateo.DynamicWrapper(
    w.data.recordsFormatted,
    w.data.recordsGrouped,
    w.filters.startDate,
    w.filters.endDate,
    countryFilter,
    (recordsFormatted, recordsGrouped, startDate, endDate, countryFilter) => {
        if (countryFilter === "") {
            const recordsGroupedByDate = _.groupBy(recordsFormatted, x => x.date.toISOString());
            const recordsFiltered = _.filter(recordsGroupedByDate, (a, b) => startDate!.diff(b) <= 0 && endDate!.diff(b) >= 0);
            const recordsSorted = _.sortBy(recordsFiltered, (record) => record[0].date.unix());
            return _.map(recordsSorted, itemGroup => {
                const result = { cases: 0, deaths: 0, date: itemGroup[0].date };
                for (const item of itemGroup) {
                    result.cases += item.cases;
                    result.deaths += item.deaths;
                }
                return result;
            });
        } else {
            const recordsFiltered = _.filter(recordsGrouped[countryFilter], item => item.date.diff(startDate) >= 0 && item.date.diff(endDate) <= 0)
            const recordsSorted = _.sortBy(recordsFiltered, record => record.date.unix());
            return recordsSorted;
        }
    }
);

@Pateo.subscribe(w.settings.tableKind, countryFilter, data)
export default class Plot extends React.PureComponent {

    chart: Chart | null = null;

    getChartData = () => {
        return {
            labels: _.map(data.emit(), item => item.date.format("DD MMM YYYY")),
            datasets: [{
                label: "Cases",
                data: _.map(data.emit(), item => item.cases),
                borderColor: "#FFB23E",
                backgroundColor: "#F9D49B",
                tension: 0.2,
                radius: 0,
                borderWidth: 1,
            }, {
                label: "Deaths",
                data: _.map(data.emit(), item => item.deaths),
                borderColor: "#FF4444",
                backgroundColor: "#F99C9E",
                tension: 0.2,
                radius: 0,
                borderWidth: 1,
            }],
        };
    }

    getChartConfig = () => {
        return {
            type: "line",
            data: this.getChartData(),
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 13,
                            maxRotation: 90,
                            minRotation: 90
                        },
                    },
                },
            },
        };
    }

    renderChart = () => {
        this.chart?.destroy();
        this.chart = new Chart(document.getElementById("plot-canvas") as ChartItem, this.getChartConfig() as any);
    }

    componentDidMount = () => {
        this.renderChart();
    }

    componentDidUpdate = () => {
        this.renderChart();
    }

    componentWillUnmount = () => {
        this.chart!.destroy();
    }

    render = () => {
        return (
            <div className="content-table-container p-3">
                <FormGroup>
                    <FormElement>
                        <CountrySelect
                            label="Country"
                            sx={{ width: 250 }}
                            onChange={value => countryFilter.set(value)}
                            value={countryFilter.emit()}
                        />
                    </FormElement>
                </FormGroup>
                <div style={{ height: "611px" }}>
                    <canvas id="plot-canvas" />
                </div>
            </div>
        );
    }

}