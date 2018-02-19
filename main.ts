import * as Methods from "./Methods";

export * from "./monkeypatch";
export * from "./Collectors";
export * from "./Interfaces";
export * from "./StreamFactory";
export * from "./TryFactory";
export { Methods };

// prevent import-organizer extension from removing Methods
// tslint:disable-next-line:no-empty
(x => { } )(Methods);
