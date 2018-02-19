import { IStream, IStreamFactory } from "./Interfaces";
export declare const TypesafeStreamFactory: IStreamFactory;
export declare const InplaceStreamFactory: IStreamFactory;
export declare const stream: <T>(iterable: Iterable<T>) => IStream<T>;
