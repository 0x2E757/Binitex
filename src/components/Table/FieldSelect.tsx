import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SxProps } from "@mui/material/styles";

interface IProps {
    sx?: SxProps;
    label?: string;
    options: { field: string, headerName?: string }[];
    value?: string;
    onChange?: (event: SelectChangeEvent) => void;
}

export default class FieldSelect extends React.PureComponent<IProps> {

    render = () => {
        return (
            <Box sx={this.props.sx}>
                <FormControl fullWidth>
                    <InputLabel>{this.props.label}</InputLabel>
                    <Select value={this.props.value} label={this.props.label} onChange={this.props.onChange}>
                        {this.props.options.map(option => <MenuItem key={option.field} value={option.field}>{option.headerName}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
        );
    }

}