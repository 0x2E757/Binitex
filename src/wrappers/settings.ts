import Pateo from "pateo";

export enum TableKind {
    standart = "Standart",
    extended = "Extended",
}

export const tableKind = new Pateo.StaticWrapper(TableKind.standart);