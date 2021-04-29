import { Key, SorterResult } from "antd/lib/table/interface";

export interface TableRow {
    [key: string]: number;
}

export interface TableColumn {
    align: any;
    dataIndex: string; // e.g. 'season_year' | 'pass_completions_sum'
    key: string; // e.g. 'season_year'
    title: string; // e.g. 'Year'
    dataType: string; // number | string
    format: string; // string | 'dec_0' | 'dec_1' | ...
    width: string; // e.g. '100px'
    fixed?: any; // e.g. 'left'
    render?: any; // function
    sorter?: any; // function
    children?: TableColumn[];
}

export interface TableData {
    columns: TableColumn[];
    dataSource: TableRow[];
    queryTitle?: string;
}

// export interface TableInfoSorter {
//     field?: Key | Key[] | undefined | null;
//     order?: "ascend" | "descend" | undefined | null;
// }

export interface TableInfo {
    sorter: SorterResult<TableRow> | SorterResult<TableRow>[];
    filters: any; // not using this yet, but might in the future
}

export interface QueryFields {
    row: {
        field: "player_name_with_position" | "team_name" | "season_year";
    };
    where: {
        player_gsis_id?: string[];
        season_year?: string[];
        team_id?: string[];
    };
    columns: QueryColumn[];
}

export interface QueryColumn {
    field: string;
    title?: string;
    having?: string;
    filters?: QueryColumnFilter[];
}

export interface QueryColumnFilter {
    activeFilter: string | undefined; // "player_position" | "inside_20"
    [key: string]: string | string[] | number | number[] | undefined; // player_position: ["QB"] | inside_20: "1"
}

export interface CustomCalcObj {
    colIndex1: string; // col1
    operation: "+" | "-" | "*" | "/";
    colIndex2: string; // col2
    format: "percent" | "dec_0" | "dec_1" | "dec_2";
    title: string;
}

export interface CalcsFields {
    calculations: CustomCalcObj[];
}

export interface SaveData {
    queryFormV: number;
    calcsFormV: number;
    tableInfo: TableInfo;
    tableData: TableData;
    queryFields: QueryFields | null;
    calcsFields: CalcsFields | null;
    timestamp?: number; // this fed in from server as UNIX milliseconds
}
