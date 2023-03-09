import _ from "lodash";
import React from "react";
import Pateo from "pateo";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CountrySelect from "./CountrySelect";
import FieldSelect from "./FieldSelect";
import { FormGroup, FormElement } from "../";
import w from "../../wrappers";

enum TableKind {
    standart = "Standart",
    extended = "Extended",
}

const columnsStandart: GridColDef[] = [
    { field: "country", headerName: "Country", flex: 100, type: "string", },
    { field: "cases", headerName: "Cases", flex: 100, type: "number", },
    { field: "deaths", headerName: "Deaths", flex: 80, type: "number", },
    { field: "totalCases", headerName: "Total cases", flex: 100, type: "number", },
    { field: "totalDeaths", headerName: "Total deaths", flex: 100, type: "number", },
    { field: "casesPer1000", headerName: "Cases / 1000", flex: 110, type: "number", },
    { field: "deathsPer1000", headerName: "Deaths / 1000", flex: 110, type: "number", },
];

const columnsExtended: GridColDef[] = [
    { field: "country", headerName: "Country", flex: 100, type: "string", },
    { field: "cases", headerName: "Cases", flex: 100, type: "number", },
    { field: "deaths", headerName: "Deaths", flex: 80, type: "number", },
    { field: "totalCases", headerName: "Total cases", flex: 100, type: "number", },
    { field: "totalDeaths", headerName: "Total deaths", flex: 100, type: "number", },
    { field: "casesPer1000", headerName: "Cases / 1000", flex: 110, type: "number", },
    { field: "deathsPer1000", headerName: "Deaths / 1000", flex: 110, type: "number", },
    { field: "avgCasesPerDay", headerName: "Avg cases / day", flex: 120, type: "number", },
    { field: "avgDeathsPerDay", headerName: "Avg deaths / day", flex: 120, type: "number", },
    { field: "maxCasesPerDay", headerName: "Max cases / day", flex: 120, type: "number", },
    { field: "maxDeathsPerDay", headerName: "Max deaths / day", flex: 120, type: "number", },
];

const columns = {
    [TableKind.standart]: columnsStandart,
    [TableKind.extended]: columnsExtended,
};

const rowTemplate = {
    cases: 0,
    deaths: 0,
    totalCases: 0,
    totalDeaths: 0,
    casesPer1000: 0,
    deathsPer1000: 0,
    avgCasesPerDay: 0,
    avgDeathsPerDay: 0,
    maxCasesPerDay: 0,
    maxDeathsPerDay: 0,
    initialized: false,
};

const filters = {
    country: new Pateo.StaticWrapper(""),
    fieldName: new Pateo.StaticWrapper(""),
    fieldMin: new Pateo.StaticWrapper(""),
    fieldMax: new Pateo.StaticWrapper(""),
};

const rows = new Pateo.DynamicWrapper(
    w.data.recordsGrouped,
    w.filters.startDate,
    w.filters.endDate,
    filters.country,
    filters.fieldName,
    filters.fieldMin,
    filters.fieldMax,
    (recordsGrouped, startDate, endDate, country, fieldName, fieldMin, fieldMax) => {

        if (startDate === null || endDate === null)
            return [];

        const days = endDate.diff(startDate, "days");
        let index = 0;
        let result = _.map(recordsGrouped, (items) => {
            const result = { ...rowTemplate, id: index, country: items[0].territory };
            for (const item of items) {
                if (item.date.diff(startDate) >= 0 && item.date.diff(endDate) <= 0) {
                    result.cases += item.cases;
                    result.deaths += item.deaths;
                    result.maxCasesPerDay = Math.max(item.cases, result.maxCasesPerDay);
                    result.maxDeathsPerDay = Math.max(item.deaths, result.maxDeathsPerDay);
                    result.initialized = true;
                }
                result.totalCases += item.cases;
                result.totalDeaths += item.deaths;
            }
            result.casesPer1000 = items[0].population > 0 ? result.cases / items[0].population * 1000 : 0;
            result.deathsPer1000 = items[0].population > 0 ? result.deaths / items[0].population * 1000 : 0;
            result.avgCasesPerDay = result.cases / days;
            result.avgDeathsPerDay = result.deaths / days;
            index += 1;
            return result;
        });
        result = _.filter(result, item => item.initialized);

        if (country !== "") {
            result = _.filter(result, item => item.country === country);
        }

        if (fieldName !== "") {

            if (fieldMin !== "") {
                result = _.filter(result, item => (item as any)[fieldName] >= Number(fieldMin));
            }

            if (fieldMax !== "") {
                result = _.filter(result, item => (item as any)[fieldName] <= Number(fieldMax));
            }

        }

        return result;

    }
);

@Pateo.subscribe(filters.country, filters.fieldName, filters.fieldMin, filters.fieldMax, rows)
export default class Table extends React.PureComponent {

    state = {
        tableKind: TableKind.standart,
    }

    onTableKindChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        if (_.filter(columns[value as TableKind], { field: filters.fieldName.emit() }).length === 0) {
            filters.fieldName.set("");
            filters.fieldMin.set("");
            filters.fieldMax.set("");
        }
        this.setState({ tableKind: value });
    }

    render = () => {
        return (
            <div className="content-table-container p-3">
                <FormGroup>
                    <FormElement>
                        <CountrySelect
                            label="Country"
                            sx={{ width: 225 }}
                            onChange={value => filters.country.set(value)}
                            value={filters.country.emit()}
                        />
                    </FormElement>
                    <FormElement>
                        <FormGroup>
                            <FormElement>
                                <FieldSelect
                                    label="Filter by field"
                                    sx={{ width: 225 }}
                                    options={_.takeRight(columns[this.state.tableKind], columns[this.state.tableKind].length - 1)}
                                    value={filters.fieldName.emit()}
                                    onChange={event => filters.fieldName.set(event.target.value)}
                                />
                            </FormElement>
                            <FormElement>
                                <FormGroup>
                                    <FormElement>
                                        <TextField
                                            label="Min"
                                            sx={{ width: 125 }}
                                            variant="outlined"
                                            type="number"
                                            value={filters.fieldMin.emit()}
                                            onChange={event => filters.fieldMin.set(event.target.value)}
                                            disabled={filters.fieldName.eq("")}
                                        />
                                    </FormElement>
                                    <FormElement>
                                        <TextField
                                            label="Max"
                                            sx={{ width: 125 }}
                                            variant="outlined"
                                            type="number"
                                            value={filters.fieldMax.emit()}
                                            onChange={event => filters.fieldMax.set(event.target.value)}
                                            disabled={filters.fieldName.eq("")}
                                        />
                                    </FormElement>
                                </FormGroup>
                            </FormElement>
                        </FormGroup>
                    </FormElement>
                    <FormElement>
                        <Button
                            children="Reset"
                            sx={{ backgroundColor: "#4f91d0", height: 39 }}
                            variant="contained"
                            disableElevation
                            onClick={() => {
                                filters.country.set("");
                                filters.fieldName.set("");
                                filters.fieldMin.set("");
                                filters.fieldMax.set("");
                            }}
                        />
                    </FormElement>
                </FormGroup>
                <Box sx={{ backgroundColor: "#fff", width: this.state.tableKind === TableKind.standart ? 900 : 1400, mt: 2 }}>
                    <DataGrid
                        rows={rows.emit()}
                        columns={columns[this.state.tableKind]}
                        rowHeight={45}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack height="100%" alignItems="center" justifyContent="center">
                                    Nothing found
                                </Stack>
                            ),
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        disableColumnMenu
                        autoHeight
                    />
                </Box>
                <FormGroup>
                    <RadioGroup
                        value={this.state.tableKind}
                        onChange={this.onTableKindChange}
                        row
                    >
                        <div style={{ margin: "0 0 -0.5rem 0" }}>
                            <FormElement>
                                <span className="d-inline-block m-2 pe-1">Table type:</span>
                            </FormElement>
                            <FormElement>
                                <FormControlLabel
                                    control={<Radio />}
                                    value={TableKind.standart}
                                    label={TableKind.standart}
                                />
                            </FormElement>
                            <FormElement>
                                <FormControlLabel
                                    control={<Radio />}
                                    value={TableKind.extended}
                                    label={TableKind.extended}
                                />
                            </FormElement>
                        </div>
                    </RadioGroup>
                </FormGroup>
            </div>
        );
    }

}