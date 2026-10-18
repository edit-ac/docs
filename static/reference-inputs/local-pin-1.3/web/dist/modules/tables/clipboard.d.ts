export declare function encodeTableClipboard(doc: Document, cells: string[][]): Record<string, string>;
export declare function decodeTableClipboard(doc: Document, data: DataTransfer, literal?: boolean): string[][];
/** Versioned, inert run matrix. Engine admission remains authoritative. */
export declare const TABLE_RICH_MIME = "application/x-edit-ac-table-cells+json";
export type TableRun = [string, [string, ...string[]][]];
export interface TableCellBlock {
    style: [string, ...(string | number)[]];
    runs: TableRun[];
}
export interface TableRichCell {
    paragraphs: TableCellBlock[];
    rowSpan: 1;
    columnSpan: 1;
    header: boolean;
}
export type RichCellMatrix = TableRun[][][] | TableRichCell[][];
export declare function validateRichTableCells(value: unknown, maxCells?: number): TableRichCell[][];
export declare function encodeRichTableClipboard(doc: Document, cells: RichCellMatrix): Record<string, string>;
export declare function decodeRichTableClipboard(data: DataTransfer): RichCellMatrix | undefined;
