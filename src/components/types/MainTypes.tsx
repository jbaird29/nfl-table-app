export interface TableRow {
    [key: string]: number;
}

export interface TableColumn {
    align: string;
    dataIndex: string; // e.g. 'season_year' | 'pass_completions_sum'
    key: string; // e.g. 'season_year'
    title: string; // e.g. 'Year'
    dataType: string; // number | string
    format: string; // string | 'dec_0' | 'dec_1' | ...
    width: string; // e.g. '100px'
    fixed?: string; // e.g. 'left'
    render?: any; // function
    sorter?: any; // function
    children?: TableColumn[];
}

export interface TableData {
    columns: TableColumn[];
    dataSource: TableRow[];
}

export interface Query {
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
    calcIndex: string; // 'calc1'
    colIndex1: string; // col1
    operation: "+" | "-" | "*" | "/";
    colIndex2: string; // col2
    format: "percent" | "dec_0" | "dec_1" | "dec_2";
    title: string;
}
