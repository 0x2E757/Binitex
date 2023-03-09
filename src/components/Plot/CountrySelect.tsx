import _ from "lodash";
import React from "react";
import Pateo from "pateo";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { SxProps } from "@mui/material/styles";
import w from "../../wrappers";

interface IProps {
    sx?: SxProps;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
}

@Pateo.subscribe(w.data.territories)
export default class CountrySelect extends React.PureComponent<IProps> {

    onChange = (event: React.SyntheticEvent, value: { territory: string, code: string } | null) => {
        this.props.onChange?.(value?.code ?? "");
    }

    render = () => {
        return (
            <Autocomplete
                sx={this.props.sx}
                options={w.data.territories.emit()}
                value={_.find(w.data.territories.emit(), y => y.code === this.props.value) ?? null}
                onChange={this.onChange}
                getOptionLabel={(option) => option.territory}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            alt=""
                        />
                        {option.territory}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField {...params} label={this.props.label} inputProps={{ ...params.inputProps }} />
                )}
            />
        );
    }

}