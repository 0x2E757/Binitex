import _ from "lodash";
import moment from "moment";
import Pateo from "pateo";

type State = "none" | "fetching" | "parsing" | "done";

export const state = new Pateo.StaticWrapper<State>("none");

export const stateText = new Pateo.DynamicWrapper(state, state => {
    switch (state) {
        case "none": return "Initializing app";
        case "fetching": return "Downloading data";
        case "parsing": return "Preparing data";
    }
});

type RecordRaw = {
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": string,
    "cases": number,
    "continentExp": string,
    "countriesAndTerritories": string,
    "countryterritoryCode": string,
    "dateRep": string,
    "day": string,
    "deaths": number,
    "geoId": string,
    "month": string,
    "popData2019": number,
    "year": string,
};

export const recordsRaw = new Pateo.StaticWrapper<RecordRaw[]>([]);

export const recordsFormatted = new Pateo.DynamicWrapper(recordsRaw, (recordsRaw) => {
    return _.map(recordsRaw, item => ({
        date: moment(item.dateRep, "DD/MM/YYYY"),
        territory: item.countriesAndTerritories.replace(/_/g, " "),
        code: item.geoId,
        cases: item.cases,
        deaths: item.deaths,
        population: item.popData2019,
    })).filter(item => item.code.length == 2)
});

export const minDate = new Pateo.DynamicWrapper(recordsFormatted, recordsFormatted => {
    return _.minBy(recordsFormatted, "date")!.date;
});

export const maxDate = new Pateo.DynamicWrapper(recordsFormatted, recordsFormatted => {
    return _.maxBy(recordsFormatted, "date")!.date;
});

export const territories = new Pateo.DynamicWrapper(recordsFormatted, recordsFormatted => {
    return _.uniqBy(recordsFormatted, "code").map(item => ({
        territory: item.territory,
        code: item.code,
    }))
});

export const recordsGrouped = new Pateo.DynamicWrapper(recordsFormatted, recordsFormatted => {
    return _.groupBy(recordsFormatted, "code");
})

recordsGrouped.emit()
recordsGrouped.subscribe(() => {})