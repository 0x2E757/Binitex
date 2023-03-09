import _ from "lodash";
import moment from "moment";
import Pateo from "pateo";
import * as data from "./data";

export const startDate = new Pateo.StaticWrapper<moment.Moment | null>(null);
data.minDate.subscribe((date) => startDate.set(date));

export const endDate = new Pateo.StaticWrapper<moment.Moment | null>(null);
data.maxDate.subscribe((date) => endDate.set(date));