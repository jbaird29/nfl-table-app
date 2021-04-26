const assert = require("assert");

/** -----------------------------------------------------------------------------------------------------------
 * Global variables for metadata
 * ------------------------------------------------------------------------------------------------------------
 */
const meta = {
    tbls: {},
    dims: {},
    aggs: {},
    fltrs: {},
};
const tbls = meta.tbls;
const dims = meta.dims;
const aggs = meta.aggs;
const fltrs = meta.fltrs;

module.exports = meta;

/** -----------------------------------------------------------------------------------------------------------
 * Class for Tables
 * ------------------------------------------------------------------------------------------------------------
 */
class Table {
    constructor({ name, sqlName, sqlJoin = {} }) {
        this.name = name;
        this.sqlName = sqlName;
        this.sqlJoin = sqlJoin;
    }
    buildSQL() {
        return `${this.sqlName} AS ${this.name}`;
    }
    buildJoinSQL() {
        return `${this.sqlJoin.toTable.name}.${this.sqlJoin.toTableField} = ${this.name}.${this.sqlJoin.fromTableField}`;
    }
}

tbls.prod = new Table({
    name: "prod",
    sqlName: "`nfl-table.main.prod`",
});
tbls.stats = new Table({
    name: "stats",
    sqlName: "`nfl-table.main.statistics`",
});
tbls.games = new Table({
    name: "games",
    sqlName: "`nfl-table.main.games`",
    sqlJoin: {
        toTable: tbls.stats,
        toTableField: "game_id",
        fromTableField: "id",
    },
});
tbls.player_info = new Table({
    name: "player_info",
    sqlName: "`nfl-table.main.player_info`",
    sqlJoin: {
        toTable: tbls.stats,
        toTableField: "player_reference",
        fromTableField: "player_gsis_id",
    },
});
tbls.player_stats = new Table({
    name: "player_stats",
    sqlName: "`nfl-table.main.player_stats`",
});
tbls.team_stats = new Table({
    name: "team_stats",
    sqlName: "`nfl-table.main.team_stats`",
});

/** -----------------------------------------------------------------------------------------------------------
 * Class for Dimension fields
 * ------------------------------------------------------------------------------------------------------------
 */
class Dimension {
    constructor({
        sql,
        creationSQL,
        statType,
        title,
        dataType,
        expose = false,
        shortTitle = title,
        description = "",
        width = "75px",
        format = "dec_0",
    }) {
        assert(typeof sql !== "undefined", "Missing sql");
        assert(typeof creationSQL !== "undefined", "Missing buildSQL");
        assert(typeof statType !== "undefined", "Missing statType");
        assert(["number", "string"].includes(dataType), "Invalid datatype");
        assert(["general", "pass", "rush", "recv"].includes(statType), "Invalid statType");
        assert(["string", "dec_0", "dec_1", "dec_2", "percent", "index"].includes(format), "Invalid format");
        assert(typeof title !== "undefined", "Missing title");
        assert(!sql.includes("undefined"), "SQL statement includes undefined");
        assert(!creationSQL.includes("undefined"), "SQL statement includes undefined");
        this.sql = sql;
        this.creationSQL = creationSQL;
        this.statType = statType;
        this.title = title;
        this.shortTitle = shortTitle;
        this.description = description;
        this.expose = expose;
        this.width = width;
        this.dataType = dataType;
        this.format = format;
    }
    buildCreationSQL() {
        return `${this.creationSQL} AS ${this.sql}`;
    }
}

/** -----------------------------------------------------------------------------------------------------------
 * Class for Aggregate fields
 * ------------------------------------------------------------------------------------------------------------
 */
class Aggregate {
    // statType must be 4 characters long
    constructor({
        name,
        sql,
        statType,
        title,
        expose = true,
        includeInSummary = false,
        shortTitle = title,
        description = "",
        width = "75px",
        dataType = "number",
        format = "dec_0",
    }) {
        assert(typeof name !== "undefined", "Missing name");
        assert(typeof sql !== "undefined", "Missing sql");
        assert(typeof statType !== "undefined", "Missing statType");
        assert(
            ["info", "pass", "rush", "recv"].includes(name.slice(0, 4)),
            'Invalid name; make sure first 4 letters are a stat type or "info"'
        );
        assert(["general", "pass", "rush", "recv"].includes(statType), "Invalid statType");
        assert(["string", "dec_0", "dec_1", "dec_2", "percent", "index"].includes(format), "Invalid format");
        assert(typeof title !== "undefined", "Missing title");
        assert(!sql.includes("undefined"), "SQL statement includes undefined");
        this.name = name;
        this.sql = sql;
        this.statType = statType;
        this.title = title;
        this.shortTitle = shortTitle;
        this.description = description;
        this.expose = expose;
        this.includeInSummary = includeInSummary;
        this.width = width;
        this.dataType = dataType;
        this.format = format;
    }
    buildSQL() {
        return `${this.sql} AS ${this.name}`;
    }
}

/** -----------------------------------------------------------------------------------------------------------
 * Class for filters
 * ------------------------------------------------------------------------------------------------------------
 */
class Filter {
    constructor(
        dimension,
        {
            name,
            singleOperator = "=",
            multipleOperator = "IN",
            joiner = ", ",
            placement = dimension.statType === "general" ? "general" : "stats",
            formProps,
            ui,
            expose = true,
            linkedAggs,
            linkedFilters,
        }
    ) {
        // takes a Dimension object as a paramater
        // requires at least a operator (e.g. >=) and joiner (e.g. 'BETWEEN') for multiple values
        assert(typeof dimension !== "undefined", "Missing dimension");
        assert(typeof name !== "undefined", "Missing name");
        assert(["general", "pass", "rush", "recv"].includes(dimension.statType), "Invalid statType");
        assert(["general", "stats", "where"].includes(placement), "Invalid placement");
        assert(["=", ">="].includes(singleOperator), "Invalid single operator");
        assert(["IN", "BETWEEN"].includes(multipleOperator), "Invalid multiple operator");
        assert([", ", " AND "].includes(joiner), "Invalid joiner");

        this.sql = dimension.sql; // inherit from Dimension
        this.statType = dimension.statType; // inherit from Dimension
        this.dataType = dimension.dataType; // innherit from Dimension
        this.name = name;
        this.singleOperator = singleOperator;
        this.multipleOperator = multipleOperator;
        this.joiner = joiner;
        this.placement = placement; // 'general' || 'stats' || 'where'
        this.formProps = formProps;
        this.ui = ui;
        this.expose = expose;
        this.linkedFilters = linkedFilters; // not using this yet, but could implement in future
        this.linkedAggs = linkedAggs; // currently implementing sparingly
    }
}

/***********************************************************************************************************************
 ************************************************************************************************************************
 **********************************        DIMENSIONS        ************************************************************
 ************************************************************************************************************************
 ************************************************************************************************************************
 */

/** -----------------------------------------------------------------------------------------------------------
 * Informational Fields
 * ------------------------------------------------------------------------------------------------------------
 */
dims.stat_id = new Dimension({
    sql: "stat_id",
    creationSQL: `${tbls.stats.name}.game_periods_pbp_events_id || '--' || ${tbls.stats.name}.stat_type`,
    statType: "general",
    title: "Stat ID",
    description: "Unique ID for the particular statistic",
    width: "75px",
    dataType: "string",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.stat_type = new Dimension({
    sql: "stat_type",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = 'receive' THEN 'recv' ELSE ${tbls.stats.name}.stat_type END`,
    statType: "general",
    title: "Stat Type",
    width: "175px",
    dataType: "string",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.season_year = new Dimension({
    sql: "season_year",
    creationSQL: `${tbls.games.name}.summary_season_year`,
    statType: "general",
    title: "Season Year",
    shortTitle: "Year",
    width: "75px",
    dataType: "number",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.season_week = new Dimension({
    sql: "season_week",
    creationSQL: `${tbls.games.name}.summary_week_title`,
    statType: "general",
    title: "Season Week",
    shortTitle: "Week",
    width: "75px",
    dataType: "number",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.venue_name = new Dimension({
    sql: "venue_name",
    creationSQL: `${tbls.games.name}.summary_venue_name`,
    statType: "general",
    title: "Venue Name",
    shortTitle: "Venue",
    width: "175px",
    dataType: "string",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.player_id = new Dimension({
    sql: "player_id",
    creationSQL: `${tbls.stats.name}.player_id`,
    statType: "general",
    title: "Player ID",
    dataType: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.player_name = new Dimension({
    sql: "player_name",
    creationSQL: `${tbls.player_info.name}.full_name`,
    statType: "general",
    title: "Player Name",
    shortTitle: "Player",
    width: "175px",
    dataType: "string",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.player_position = new Dimension({
    sql: "player_position",
    creationSQL: `${tbls.player_info.name}.player_position`,
    statType: "general",
    title: "Player Position",
    shortTitle: "Position",
    width: "175px",
    dataType: "string",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.player_name_with_position = new Dimension({
    sql: "player_name_with_position",
    creationSQL: `${dims.player_name.creationSQL} || ' (' || ${dims.player_position.creationSQL} || ')'`,
    statType: "general",
    title: "Player Name (Position)",
    shortTitle: "Player",
    width: "175px",
    dataType: "string",
    format: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.player_gsis_id = new Dimension({
    sql: "player_gsis_id",
    creationSQL: `${tbls.player_info.name}.player_gsis_id`,
    statType: "general",
    title: "GSIS Player ID",
    dataType: "string",
});
// ------------------------------------------------------------------------------------------------------------
dims.team_name = new Dimension({
    sql: "team_name",
    creationSQL: `CASE WHEN ${tbls.stats.name}.team_name = 'Redskins' THEN 'Football Team' ELSE ${tbls.stats.name}.team_name END`,
    statType: "general",
    title: "Team Name",
    shortTitle: "Team",
    width: "175px",
    dataType: "string",
    format: "string",
    description: "Like: Falcons",
});
// ------------------------------------------------------------------------------------------------------------
dims.team_abbreviation = new Dimension({
    sql: "team_abbreviation",
    creationSQL: `${tbls.player_info.name}.team_abbreviation`,
    statType: "general",
    title: "Team Name",
    shortTitle: "Team",
    width: "175px",
    dataType: "string",
    format: "string",
    description: "Like: ATL",
});
// ------------------------------------------------------------------------------------------------------------
dims.team_id = new Dimension({
    sql: "team_id",
    chargers: `WHEN ${tbls.stats.name}.team_id = '9dbb9060-ba0f-4920-829e-16d4d9246b5d' THEN '1f6dcffb-9823-43cd-9ff4-e7a8466749b5'`,
    raiders: `WHEN ${tbls.stats.name}.team_id = '1c1cec48-6352-4556-b789-35304c1a6ae1' THEN '7d4fcc64-9cb5-4d1b-8e75-8a906d1e1576'`,
    rams: `WHEN ${tbls.stats.name}.team_id = '39f349de-6463-4803-ad70-f1e0f144f5ed' THEN '2eff2a03-54d4-46ba-890e-2bc3925548f3'`,
    get creationSQL() {
        return `CASE ${this.chargers} ${this.raiders} ${this.rams} ELSE ${tbls.stats.name}.team_id END`;
    },
    // creationSQL: `${tbls.stats.name}.team_id`,
    statType: "general",
    title: "Team ID",
    description: "NOTE: Chargers, Raiders, Rams have different IDs when they change cities.",
    dataType: "string",
});

/** -----------------------------------------------------------------------------------------------------------
 * Situational Metrics
 * ------------------------------------------------------------------------------------------------------------
 */
dims.inside_20 = new Dimension({
    sql: "inside_20",
    creationSQL: `${tbls.stats.name}.inside_20`,
    statType: "general",
    title: "Was Inside 20",
    dataType: "number",
});
// ------------------------------------------------------------------------------------------------------------
dims.goaltogo = new Dimension({
    sql: "goaltogo",
    creationSQL: `${tbls.stats.name}.goaltogo`,
    statType: "general",
    title: "Was Goal to Go",
    dataType: "number",
});
// ------------------------------------------------------------------------------------------------------------
dims.nullified = new Dimension({
    sql: "nullified",
    creationSQL: `${tbls.stats.name}.nullified`,
    statType: "general",
    title: "Was Nullified",
    dataType: "number",
    description: "1 if nullified by penalty, otherwise NULL", // check to make sure this is accurate
});

/** -----------------------------------------------------------------------------------------------------------
 * Pass Metrics
 * ------------------------------------------------------------------------------------------------------------
 */
dims.pass_yards = new Dimension({
    sql: "pass_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.yards ELSE NULL END`,
    statType: "pass",
    title: "Pass Yards",
    dataType: "number",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_attempt_air_yards = new Dimension({
    sql: "pass_attempt_air_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.att_yards ELSE NULL END`,
    statType: "pass",
    title: "Pass Attempt Yards",
    dataType: "number",
    description:
        "I think this is the number of yards in the air that the ball traveled. " + "This has values whether the pass was complete or not.",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_air_yards = new Dimension({
    sql: "pass_air_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass" AND ${tbls.stats.name}.complete = 1 THEN ${tbls.stats.name}.att_yards ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Air Yards",
    description: "I think this is the number of yards in the air that the ball traveled but only for completions.",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_pocket_time = new Dimension({
    sql: "pass_pocket_time",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.pocket_time ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Pocket Time",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_sack_yards = new Dimension({
    sql: "pass_sack_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.sack_yards ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Sack Yards",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_attempt = new Dimension({
    sql: "pass_was_attempt",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.attempt ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Attempt",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_completion = new Dimension({
    sql: "pass_was_completion",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.complete ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Completion",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_touchdown = new Dimension({
    sql: "pass_was_touchdown",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.touchdown ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Touchdown",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_interception = new Dimension({
    sql: "pass_was_interception",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.interception ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Interception",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_blitzed = new Dimension({
    sql: "pass_was_blitzed",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.blitz ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Blitzed",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_batted = new Dimension({
    sql: "pass_was_batted",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.batted_pass ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Batted",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_on_target = new Dimension({
    sql: "pass_was_on_target",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.on_target_throw ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass On Target",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_hurry = new Dimension({
    sql: "pass_was_hurry",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.hurry ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Hurried",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_knockdown = new Dimension({
    sql: "pass_was_knockdown",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.knockdown ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Pass Knocked Down",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_sack = new Dimension({
    sql: "pass_was_sack",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.sack ELSE NULL END`,
    statType: "pass",
    dataType: "number",
    title: "Was Sack",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_type = new Dimension({
    sql: "pass_incompletion_type",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.incompletion_type ELSE NULL END`,
    statType: "pass",
    dataType: "string",
    title: "Pass Incompletion Type",
    description: "Poorly Thrown, Thrown Away, Dropped Pass, Pass Defended, Spike",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_poor_throw = new Dimension({
    sql: "pass_incompletion_was_poor_throw",
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Poorly Thrown" THEN 1 ELSE 0 END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Was Poor Throw",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_throwaway = new Dimension({
    sql: "pass_incompletion_was_throwaway",
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Thrown Away" THEN 1 ELSE 0 END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Was Throwaway",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_dropped = new Dimension({
    sql: "pass_incompletion_was_dropped",
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Dropped Pass" THEN 1 ELSE 0 END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Was Dropped",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_defended = new Dimension({
    sql: "pass_incompletion_was_defended",
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Pass Defended" THEN 1 ELSE 0 END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Was Defended",
});
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_spike = new Dimension({
    sql: "pass_incompletion_was_spike",
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Spike" THEN 1 ELSE 0 END`,
    statType: "pass",
    dataType: "number",
    title: "Pass Was Spike",
});

/** -----------------------------------------------------------------------------------------------------------
 * Rush Metrics
 * ------------------------------------------------------------------------------------------------------------
 */
dims.rush_yards = new Dimension({
    sql: "rush_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.yards ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Yards",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_attempt = new Dimension({
    sql: "rush_was_attempt",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.attempt ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Attempt",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_touchdown = new Dimension({
    sql: "rush_was_touchdown",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.touchdown ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Touchdown",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_broken_tackles = new Dimension({
    sql: "rush_broken_tackles",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.broken_tackles ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Broken Tackles",
    description: "Number of broken tackles during the run. On one TD run, Aaron Jones had 6 broken tackles!",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_yards_after_contact = new Dimension({
    sql: "rush_yards_after_contact",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.yards_after_contact ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Yards After Contact",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_scramble = new Dimension({
    sql: "rush_was_scramble",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.scramble ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Was Scrumble",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_tackle_for_loss = new Dimension({
    sql: "rush_was_tackle_for_loss",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.tlost ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Was Tackle for Loss",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_tackle_for_loss_yards = new Dimension({
    sql: "rush_tackle_for_loss_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.tlost_yards ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Rush Tackle for Loss Yards",
});
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_firstdown = new Dimension({
    sql: "rush_was_firstdown",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.firstdown ELSE NULL END`,
    statType: "rush",
    dataType: "number",
    title: "Was Rush Firstdown",
});

//* ----------------------------------------------------------------------------------------------------------
//* Recv Metrics
//* ----------------------------------------------------------------------------------------------------------
dims.recv_yards = new Dimension({
    sql: "recv_yards",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.yards ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Receiving Yards",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_reception = new Dimension({
    sql: "recv_was_reception",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.reception ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Was Reception",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_target = new Dimension({
    sql: "recv_was_target",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.target ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Was Receiving Target",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_catchable = new Dimension({
    sql: "recv_was_catchable",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.catchable ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Was Catchable",
    description:
        "For the most part, there are no cases where a ball was catchable but not a target." +
        "So it is safe to title this Catchable Targets. There are only ~10 edge cases where not:" +
        "SELECT target, SUM(catchable) FROM `nfl-table.main.statistics`",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_touchdown = new Dimension({
    sql: "recv_was_touchdown",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.touchdown ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Receiving Was Touchdown",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_yards_after_contact = new Dimension({
    sql: "recv_yards_after_contact",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive"    THEN ${tbls.stats.name}.yards_after_contact ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Receiving Yards After Contact",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_yards_after_catch = new Dimension({
    sql: "recv_yards_after_catch",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive"    THEN ${tbls.stats.name}.yards_after_catch ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Receiving Yards After Catch",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_broken_tackles = new Dimension({
    sql: "recv_broken_tackles",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.broken_tackles ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Receiving Broken Tackles",
});
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_dropped = new Dimension({
    sql: "recv_was_dropped",
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.dropped ELSE NULL END`,
    statType: "recv",
    dataType: "number",
    title: "Was Drop",
});

/***********************************************************************************************************************
 ************************************************************************************************************************
 **********************************        AGGREGATES        ************************************************************
 ************************************************************************************************************************
 ************************************************************************************************************************
 */

//* -----------------------------------------------------------------------------------------------------------
//* Pass Aggregates
//* -----------------------------------------------------------------------------------------------------------
aggs.pass_completions_sum = new Aggregate({
    name: "pass_completions_sum",
    includeInSummary: true,
    title: "Pass Completions",
    shortTitle: "Pass CMP",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_completion.sql} ELSE NULL END)`,
});
aggs.pass_incompletions_sum = new Aggregate({
    name: "pass_incompletions_sum",
    includeInSummary: false,
    title: "Pass Incompletions",
    shortTitle: "Pass Incompletions",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN IFNULL(${dims.pass_was_attempt.sql},0) - IFNULL(${dims.pass_was_completion.sql},0) ELSE NULL END)`,
});
aggs.pass_attempts_sum = new Aggregate({
    name: "pass_attempts_sum",
    includeInSummary: true,
    title: "Pass Attempts",
    shortTitle: "Pass ATT",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_attempt.sql}  ELSE NULL END)`,
    description: "Total Attempts = Pass Completions + Pass Incompletions",
});
aggs.pass_completion_percentage = new Aggregate({
    name: "pass_completion_percentage",
    includeInSummary: true,
    title: "Pass Completion %",
    shortTitle: "Pass CMP %",
    statType: "pass",
    sql: `${aggs.pass_completions_sum.sql} / ${aggs.pass_attempts_sum.sql}`,
    format: "percent",
});
aggs.pass_yards_sum = new Aggregate({
    name: "pass_yards_sum",
    includeInSummary: true,
    title: "Pass Yards",
    shortTitle: "Pass YDS",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_yards.sql} ELSE NULL END)`,
});
aggs.pass_yards_per_attempt = new Aggregate({
    name: "pass_yards_per_attempt",
    includeInSummary: true,
    title: "Yards / Pass Att",
    shortTitle: "Pass Y/A",
    statType: "pass",
    sql: `${aggs.pass_yards_sum.sql} / ${aggs.pass_attempts_sum.sql}`,
    format: "dec_1",
});
aggs.pass_touchdowns_sum = new Aggregate({
    name: "pass_touchdowns_sum",
    includeInSummary: true,
    title: "Pass Touchdowns",
    shortTitle: "Pass TDS",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_touchdown.sql} ELSE NULL END)`,
});
aggs.pass_interceptions_sum = new Aggregate({
    name: "pass_interceptions_sum",
    includeInSummary: true,
    title: "Pass Interceptions",
    shortTitle: "Pass INT",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_interception.sql} ELSE NULL END)`,
});
aggs.pass_rating = new Aggregate({
    name: "pass_rating",
    includeInSummary: true,
    title: "Passer Rating",
    shortTitle: "Pass RTG",
    statType: "pass",
    sqlA: `GREATEST(LEAST((IFNULL(SAFE_DIVIDE(${aggs.pass_completions_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) - 0.3) * 5.00, 2.375), 0)`,
    sqlB: `GREATEST(LEAST((IFNULL(SAFE_DIVIDE(${aggs.pass_yards_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) - 3.0) * 0.25, 2.375), 0)`,
    sqlC: `GREATEST(LEAST(IFNULL(SAFE_DIVIDE(${aggs.pass_touchdowns_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) * 20.0, 2.375), 0)`,
    sqlD: `GREATEST(LEAST(2.375 - (IFNULL(SAFE_DIVIDE(${aggs.pass_interceptions_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) * 25.0), 2.375), 0)`,
    get sql() {
        return `100 * ((${this.sqlA})+(${this.sqlB})+(${this.sqlC})+(${this.sqlD}))/6`;
    },
    format: "dec_1",
});
aggs.pass_air_yards_sum = new Aggregate({
    name: "pass_air_yards_sum",
    includeInSummary: true,
    title: "Total Air Yards",
    shortTitle: "Air YDS",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_air_yards.sql} ELSE NULL END)`,
});
aggs.pass_pocket_time_average = new Aggregate({
    name: "pass_pocket_time_average",
    includeInSummary: true,
    title: "Average Time in Pocket",
    shortTitle: "Avg Time in Pocket",
    format: "dec_2",
    statType: "pass",
    sql: `AVG(CASE WHEN true THEN ${dims.pass_pocket_time.sql} ELSE NULL END)`,
});
aggs.pass_batted_sum = new Aggregate({
    name: "pass_batted_sum",
    title: "Passes Batted",
    shortTitle: "Passes Batted",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_batted.sql} ELSE NULL END)`,
});
aggs.pass_knockdowns_sum = new Aggregate({
    name: "pass_knockdowns_sum",
    title: "Passes Knocked Down",
    shortTitle: "Passes Knocked Down",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_knockdown.sql} ELSE NULL END)`,
});
aggs.pass_sacked_sum = new Aggregate({
    name: "pass_sacked_sum",
    includeInSummary: true,
    title: "Total Sacks Taken",
    shortTitle: "Sacks",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_sack.sql} ELSE NULL END)`,
});
aggs.pass_sack_yards_sum = new Aggregate({
    name: "pass_sack_yards_sum",
    includeInSummary: true,
    title: "Total Sacks Yards Taken",
    shortTitle: "Sack Yards",
    statType: "pass",
    sql: `SUM(CASE WHEN true THEN ${dims.pass_sack_yards.sql} ELSE NULL END)`,
});
aggs.pass_on_target_sum = new Aggregate({
    name: "pass_on_target_sum",
    title: "Total On-target Pass Attempts",
    shortTitle: "Pass INT",
    statType: "pass",
    sql: `SUM(CASE WHEN true AND (${dims.pass_was_on_target.sql} = 1) THEN ${dims.pass_was_attempt.sql} ELSE NULL END)`,
});
aggs.pass_on_target_percentage = new Aggregate({
    name: "pass_on_target_percentage",
    title: "% of Attempts On-target",
    shortTitle: "Pass ATT ON-TGT %",
    statType: "pass",
    sql: `100 * ${aggs.pass_on_target_sum.sql} / ${aggs.pass_attempts_sum.sql}`,
    format: "dec_1",
});

//* -----------------------------------------------------------------------------------------------------------
//* Rush Aggregates
//* -----------------------------------------------------------------------------------------------------------
aggs.rush_attempts_sum = new Aggregate({
    name: "rush_attempts_sum",
    includeInSummary: true,
    title: "Rushing Attempts",
    shortTitle: "Rush ATT",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_was_attempt.sql}  ELSE NULL END)`,
});
aggs.rush_yards_sum = new Aggregate({
    name: "rush_yards_sum",
    includeInSummary: true,
    title: "Rushing Yards",
    shortTitle: "Rush YDS",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_yards.sql} ELSE NULL END)`,
});
aggs.rush_yards_per_attempt = new Aggregate({
    name: "rush_yards_per_attempt",
    includeInSummary: true,
    title: "Yards / Rush",
    shortTitle: "Rush Y/A",
    statType: "rush",
    sql: `${aggs.rush_yards_sum.sql} / ${aggs.rush_attempts_sum.sql}`,
    format: "dec_1",
});
aggs.rush_touchdowns_sum = new Aggregate({
    name: "rush_touchdowns_sum",
    includeInSummary: true,
    title: "Rush Touchdowns",
    shortTitle: "Rush TDS",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_was_touchdown.sql} ELSE NULL END)`,
});
aggs.rush_broken_tackles_sum = new Aggregate({
    name: "rush_broken_tackles_sum",
    includeInSummary: true,
    title: "Rush Total Broken Tackles",
    shortTitle: "Broken Tackles",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_broken_tackles.sql} ELSE NULL END)`,
});
aggs.rush_yards_after_contact_sum = new Aggregate({
    name: "rush_yards_after_contact_sum",
    includeInSummary: true,
    title: "Rush Yards Ater Contact",
    shortTitle: "YDS After Contact",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_yards_after_contact.sql} ELSE NULL END)`,
});
aggs.rush_yards_after_per_attempt = new Aggregate({
    name: "rush_yards_after_per_attempt",
    format: "dec_1",
    includeInSummary: true,
    title: "Rush Yards Ater Contact",
    shortTitle: "Avg YDS After Contact",
    statType: "rush",
    sql: `${aggs.rush_yards_after_contact_sum.sql} / ${aggs.rush_attempts_sum.sql}`,
});
aggs.rush_tackle_for_loss_sum = new Aggregate({
    name: "rush_tackle_for_loss_sum",
    includeInSummary: true,
    title: "Total Times Tackled for Loss",
    shortTitle: "TCKL for Loss",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_was_tackle_for_loss.sql} ELSE NULL END)`,
});
aggs.rush_tackle_for_loss_yards_sum = new Aggregate({
    name: "rush_tackle_for_loss_yards_sum",
    includeInSummary: true,
    title: "Total Yards from Tackles for Loss",
    shortTitle: "TCKL for Loss YDS",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_tackle_for_loss_yards.sql} ELSE NULL END)`,
});
aggs.rush_firstdown_sum = new Aggregate({
    name: "rush_firstdown_sum",
    includeInSummary: true,
    title: "Total Rushing Firstdowns",
    shortTitle: "Rush Firstdowns",
    statType: "rush",
    sql: `SUM(CASE WHEN true THEN ${dims.rush_was_firstdown.sql} ELSE NULL END)`,
});

//* -----------------------------------------------------------------------------------------------------------
//* Receiving Aggregates
//* -----------------------------------------------------------------------------------------------------------
aggs.recv_receptions_sum = new Aggregate({
    name: "recv_receptions_sum",
    includeInSummary: true,
    title: "Total Receptions",
    shortTitle: "Recv REC",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_reception.sql} ELSE NULL END)`,
});
aggs.recv_targets_sum = new Aggregate({
    name: "recv_targets_sum",
    includeInSummary: true,
    title: "Total Targets",
    shortTitle: "Recv TGT",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_target.sql} ELSE NULL END)`,
});
aggs.recv_catch_percentage = new Aggregate({
    name: "recv_catch_percentage",
    includeInSummary: true,
    expose: true,
    title: "Total Receptions / Targets",
    shortTitle: "Catch %",
    statType: "recv",
    sql: `${aggs.recv_receptions_sum.sql} / ${aggs.recv_targets_sum.sql}`,
    format: "percent",
});
aggs.recv_dropped_sum = new Aggregate({
    name: "recv_dropped_sum",
    includeInSummary: true,
    title: "Total Drops",
    shortTitle: "Recv Drops",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_dropped.sql} ELSE NULL END)`,
});
aggs.recv_catchable_sum = new Aggregate({
    name: "recv_catchable_sum",
    includeInSummary: true,
    title: "Total Catchable Targets",
    shortTitle: "Recv Catchable Targets",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_catchable.sql} ELSE NULL END)`,
});
aggs.recv_yards_sum = new Aggregate({
    name: "recv_yards_sum",
    includeInSummary: true,
    title: "Receiving Yards",
    shortTitle: "Recv YDS",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_yards.sql} ELSE NULL END)`,
});
aggs.recv_touchdowns_sum = new Aggregate({
    name: "recv_touchdowns_sum",
    includeInSummary: true,
    title: "Receiving Touchdowns",
    shortTitle: "Recv TDS",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_touchdown.sql} ELSE NULL END)`,
});
aggs.recv_yards_per_reception = new Aggregate({
    name: "recv_yards_per_reception",
    includeInSummary: true,
    expose: true,
    title: "Yards / Receptions",
    shortTitle: "Y/REC",
    statType: "recv",
    sql: `${aggs.recv_yards_sum.sql} / ${aggs.recv_receptions_sum.sql}`,
    format: "dec_1",
});
aggs.recv_yards_after_catch_sum = new Aggregate({
    name: "recv_yards_after_catch_sum",
    includeInSummary: true,
    title: "Yards after Catch",
    shortTitle: "Recv YDS after Catch",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_yards_after_catch.sql} ELSE NULL END)`,
});
aggs.recv_broken_tackles_sum = new Aggregate({
    name: "recv_broken_tackles_sum",
    includeInSummary: true,
    title: "Broken Tackles after Catch",
    shortTitle: "Recv Broken Tackles",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_broken_tackles.sql} ELSE NULL END)`,
});
aggs.recv_yards_after_contact_sum = new Aggregate({
    name: "recv_yards_after_contact_sum",
    includeInSummary: true,
    title: "Receiving Yards after Contact",
    shortTitle: "Recv YDS after Contact",
    statType: "recv",
    sql: `SUM(CASE WHEN true THEN ${dims.recv_yards_after_contact.sql} ELSE NULL END)`,
});

/***********************************************************************************************************************
 ************************************************************************************************************************
 ************************************        FILTERS        *************************************************************
 ************************************************************************************************************************
 ************************************************************************************************************************
 */
fltrs.stat_type = new Filter(dims.stat_type, {
    name: "stat_type",
    expose: false, // this is used in WHERE clause; generated by API request depending on what stats are selected
});

/** -----------------------------------------------------------------------------------------------------------
 * Row-type filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.season_year = new Filter(dims.season_year, {
    name: "season_year",
    expose: true,
    formProps: {
        label: "Year",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            options: [
                { align: "left", title: "2020", label: "2020", value: "2020", key: "2020" },
                { align: "left", title: "2019", label: "2019", value: "2019", key: "2019" },
                { align: "left", title: "2018", label: "2018", value: "2018", key: "2018" },
                { align: "left", title: "2017", label: "2017", value: "2017", key: "2017" },
                { align: "left", title: "2016", label: "2016", value: "2016", key: "2016" },
                { align: "left", title: "2015", label: "2015", value: "2015", key: "2015" },
                { align: "left", title: "2014", label: "2014", value: "2014", key: "2014" },
                { align: "left", title: "2013", label: "2013", value: "2013", key: "2013" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.team_name = new Filter(dims.team_name, {
    name: "team_name",
    expose: false, // this is enetered manually into the 'row-tye' filters option
});
// ------------------------------------------------------------------------------------------------------------
fltrs.player_name_with_position = new Filter(dims.player_name_with_position, {
    name: "player_name_with_position",
    expose: false, // this is enetered manually right now
});
// ------------------------------------------------------------------------------------------------------------
fltrs.team_id = new Filter(dims.team_id, {
    name: "team_id",
    expose: false, // this is enetered manually right now
});
// ------------------------------------------------------------------------------------------------------------
fltrs.player_gsis_id = new Filter(dims.player_gsis_id, {
    name: "player_gsis_id",
    expose: false, // this is enetered manually right now
});

/** -----------------------------------------------------------------------------------------------------------
 * General filters
 * ------------------------------------------------------------------------------------------------------------
 */
// ------------------------------------------------------------------------------------------------------------
fltrs.player_position = new Filter(dims.player_position, {
    name: "player_position",
    formProps: {
        label: "Player Position",
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
    },
    ui: {
        type: "select",
        props: {
            placeholder: "Position",
            mode: "multiple",
            showSearch: true,
            allowClear: true,
            options: [
                { align: "left", label: "QB", value: "QB", key: "QB" },
                { align: "left", label: "RB", value: "RB", key: "RB" },
                { align: "left", label: "WR", value: "WR", key: "WR" },
                { align: "left", label: "TE", value: "TE", key: "TE" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.inside_20 = new Filter(dims.inside_20, {
    name: "inside_20",
    formProps: {
        label: "Inside 20?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.goaltogo = new Filter(dims.goaltogo, {
    name: "goaltogo",
    formProps: {
        label: "Goal to Go?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});

/** -----------------------------------------------------------------------------------------------------------
 * Pass filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.pass_pocket_time = new Filter(dims.pass_pocket_time, {
    name: "pass_pocket_time",
    multipleOperator: "BETWEEN",
    joiner: " AND ",
    formProps: {
        label: "Time in Pocket",
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    },
    ui: {
        type: "slider",
        props: { range: true, max: 10, min: 0, step: 0.1, marks: { 0: "0s", 10: "10s" }, included: true, style: { margin: "0 25px" } },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_attempt_air_yards = new Filter(dims.pass_attempt_air_yards, {
    name: "pass_attempt_air_yards",
    multipleOperator: "BETWEEN",
    joiner: " AND ",
    formProps: {
        label: "Attempt Air Yards",
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    },
    ui: {
        type: "slider",
        props: { range: true, max: 100, min: 0, step: 1, included: true, style: { margin: "0 25px" } },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_incompletion_type = new Filter(dims.pass_incompletion_type, {
    name: "pass_incompletion_type",
    linkedAggs: ["pass_incompletions_sum", "pass_attempts_sum", "pass_pocket_time_average"],
    formProps: {
        label: "Type of Pass Incompletion",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            allowClear: true,
            optionFilterProp: "label",
            options: [
                { align: "left", title: "Poorly Thrown", label: "Poorly Thrown", value: "Poorly Thrown", key: "poorly_thrown" },
                { align: "left", title: "Thrown Away", label: "Thrown Away", value: "Thrown Away", key: "thrown_away" },
                { align: "left", title: "Dropped Pass", label: "Dropped Pass", value: "Dropped Pass", key: "dropped_pass" },
                { align: "left", title: "Pass Defended", label: "Pass Defended", value: "Pass Defended", key: "pass_defended" },
                { align: "left", title: "Spike", label: "Spike", value: "'Spike'", key: "spike" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_hurried = new Filter(dims.pass_was_hurry, {
    name: "pass_was_hurried",
    formProps: {
        label: "Pass Hurried?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_blitzed = new Filter(dims.pass_was_blitzed, {
    name: "pass_was_blitzed",
    formProps: {
        label: "Pass Blitzed?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_sack = new Filter(dims.pass_was_sack, {
    name: "pass_was_sack",
    formProps: {
        label: "Sack Taken?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_batted = new Filter(dims.pass_was_batted, {
    name: "pass_was_batted",
    formProps: {
        label: "Pass Batted?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_on_target = new Filter(dims.pass_was_on_target, {
    name: "pass_was_on_target",
    formProps: {
        label: "Throw on Target?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});

/** -----------------------------------------------------------------------------------------------------------
 * Rush filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.rush_yards = new Filter(dims.rush_yards, {
    name: "rush_yards",
    multipleOperator: "BETWEEN",
    joiner: " AND ",
    formProps: {
        label: "YDS Gained on ATT",
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    },
    ui: {
        type: "slider",
        props: { range: true, max: 100, min: -10, step: 1, included: true, style: { margin: "0 25px" } },
    },
});
// ------------------------------------------------------------------------------------------------------------
fltrs.rush_was_scramble = new Filter(dims.rush_was_scramble, {
    name: "rush_was_scramble",
    formProps: {
        label: "Was Scramble?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});

/** -----------------------------------------------------------------------------------------------------------
 * Recv filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.recv_was_catchable = new Filter(dims.recv_was_catchable, {
    name: "recv_was_catchable",
    formProps: {
        label: "Was Target Catchable?",
        labelCol: { span: 16 },
        wrapperCol: { span: 8 },
    },
    ui: {
        type: "select",
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
                { align: "left", title: "Yes", label: "Yes", value: "1", key: "1" },
                { align: "left", title: "No", label: "No", value: "0", key: "0" },
            ],
        },
    },
});
