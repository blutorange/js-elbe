import { StreamFactory, Stream } from "./Interfaces";
export declare const TypesafeStreamFactory: StreamFactory;
export declare const InplaceStreamFactory: StreamFactory;
export declare const stream: <T>(iterable: Iterable<T>) => Stream<T>;
