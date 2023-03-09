import React from "react";
import Pateo from "pateo";
import w from "../wrappers";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormGroup, FormElement } from "./";

@Pateo.subscribe(w.filters.startDate, w.filters.endDate)
export default class Header extends React.PureComponent {

    state = {
        startErrors: [],
        endErrors: [],
    }

    onStartChange = (value: moment.Moment | null) => {
        const startErrors: string[] = [];
        if (value!.diff(w.data.minDate.emit()) < 0)
            startErrors.push(`Start date can't be less than ${w.data.minDate.emit().format("DD/MM/YYYY")}`);
        if (value!.diff(w.filters.endDate.emit()) > 0)
            startErrors.push(`Start date can't be greater than end date`);
        if (this.state.startErrors.length !== 0 || startErrors.length !== 0)
            this.setState({ startErrors });
        if (startErrors.length === 0)
            w.filters.startDate.set(value);
    }

    onEndChange = (value: moment.Moment | null) => {
        const endErrors: string[] = [];
        if (value!.diff(w.data.maxDate.emit()) > 0)
            endErrors.push(`End date can't be greater ${w.data.maxDate.emit().format("DD/MM/YYYY")}`);
        if (value!.diff(w.filters.startDate.emit()) < 0)
            endErrors.push(`End date can't be less than start date`);
        if (this.state.endErrors.length !== 0 || endErrors.length !== 0)
            this.setState({ endErrors });
        if (endErrors.length === 0)
            w.filters.endDate.set(value);
    }

    onResetClick = () => {
        w.filters.startDate.set(w.data.minDate.emit());
        w.filters.endDate.set(w.data.maxDate.emit());
    }

    render = () => {
        const { startErrors, endErrors } = this.state;
        const minDate = w.data.minDate.emit();
        const maxDate = w.data.maxDate.emit();
        const startDate = w.filters.startDate.emit();
        const endDate = w.filters.endDate.emit();
        return (
            <FormGroup>
                <FormElement>
                    <DatePicker
                        label="Start"
                        sx={{ width: 175 }}
                        onChange={this.onStartChange}
                        value={w.filters.startDate.emit()}
                        minDate={minDate}
                        maxDate={endDate ?? maxDate}
                    />
                </FormElement>
                <FormElement>
                    <DatePicker
                        label="End"
                        sx={{ width: 175 }}
                        onChange={this.onEndChange}
                        value={w.filters.endDate.emit()}
                        minDate={startDate ?? minDate}
                        maxDate={maxDate}
                    />
                </FormElement>
                {(minDate.diff(startDate) !== 0 || maxDate.diff(endDate) !== 0) && (
                    <FormElement>
                        <Button
                            children="Show all"
                            sx={{ backgroundColor: "#4f91d0", height: 39 }}
                            onClick={this.onResetClick}
                            variant="contained"
                            disableElevation
                        />
                    </FormElement>
                )}
                {startErrors.map(item => <div key={item} className="text-danger fw-semibold ps-2 pt-2">{item}</div>)}
                {endErrors.map(item => <div key={item} className="text-danger fw-semibold ps-2 pt-2">{item}</div>)}
            </FormGroup>
        );
    }

}