const assert = require('assert');


/** -----------------------------------------------------------------------------------------------------------
 * Global variables for metadata
 * ------------------------------------------------------------------------------------------------------------
 */
const meta = {
    tbls: {},
    dims: {},
    aggs: {},
    fltrs: {}
}
const tbls = meta.tbls
const dims = meta.dims
const aggs = meta.aggs
const fltrs = meta.fltrs

module.exports = meta


 /** -----------------------------------------------------------------------------------------------------------
 * Class for Tables
 * ------------------------------------------------------------------------------------------------------------
 */
class Table {
    constructor({name, sqlName, sqlJoin = {}}) {
        this.name = name
        this.sqlName = sqlName
        this.sqlJoin = sqlJoin
    }
    buildSQL() {
        return `${this.sqlName} AS ${this.name}`
    }
    buildJoinSQL() {
        return `${this.sqlJoin.toTable.name}.${this.sqlJoin.toTableField} = ${this.name}.${this.sqlJoin.fromTableField}`
    }
 }

 tbls.prod = new Table({
    name: 'prod',
    sqlName: '`nfl-table.main.prod`',
 })
 tbls.stats = new Table({
    name: 'stats',
    sqlName: '`nfl-table.main.statistics`',
 })
 tbls.games = new Table({
    name: 'games',
    sqlName: '`nfl-table.main.games`',
    sqlJoin: {
        toTable: tbls.stats,
        toTableField: 'game_id',
        fromTableField: 'id'
    }
})
tbls.player_info = new Table({
    name: 'player_info',
    sqlName: '`nfl-table.main.player_info`',
    sqlJoin: {
        toTable: tbls.stats,
        toTableField: 'player_id',
        fromTableField: 'sportradar_id'
    }
})
tbls.player_stats = new Table({
    name: 'player_stats',
    sqlName: '`nfl-table.main.player_stats`'
})
tbls.team_stats = new Table({
    name: 'team_stats',
    sqlName: '`nfl-table.main.team_stats`'
})



/** -----------------------------------------------------------------------------------------------------------
 * Class for Dimension fields
 * ------------------------------------------------------------------------------------------------------------
 */
class Dimension {
    constructor({sql, creationSQL, statType, title, expose = false,
    shortTitle = title, description = '', width = '75px', dataType = 'number', format = 'dec_0'}) {
        assert(typeof sql !== 'undefined',  'Missing sql')
        assert(typeof creationSQL !== 'undefined',  'Missing buildSQL')
        assert(typeof statType !== 'undefined',  'Missing statType')
        assert(['number', 'string'].includes(dataType), 'Invalid datatype')
        assert(['general', 'pass', 'rush', 'recv'].includes(statType), 'Invalid statType')
        assert(['string', 'dec_0', 'dec_1', 'dec_2', 'percent', 'index'].includes(format), 'Invalid format')
        assert(typeof title !== 'undefined',  'Missing title')
        assert(!sql.includes('undefined'), 'SQL statement includes undefined')
        assert(!creationSQL.includes('undefined'), 'SQL statement includes undefined')
        this.sql = sql
        this.creationSQL = creationSQL
        this.statType = statType
        this.title = title
        this.shortTitle = shortTitle
        this.description = description
        this.expose = expose
        this.width = width
        this.dataType = dataType
        this.format = format
    }
    buildCreationSQL() {
        return `${this.creationSQL} AS ${this.sql}`
    }
 }



/** -----------------------------------------------------------------------------------------------------------
 * Class for Aggregate fields
 * ------------------------------------------------------------------------------------------------------------
 */
 class Aggregate {
    // statType must be 4 characters long
    constructor({name, sql, statType, title, expose = true, includeInSummary = false,
    shortTitle = title, description = '', width = '75px', dataType = 'number', format = 'dec_0'}) {
        assert(typeof name !== 'undefined',  'Missing name')
        assert(typeof sql !== 'undefined',  'Missing sql')
        assert(typeof statType !== 'undefined',  'Missing statType')
        assert(['info', 'pass', 'rush', 'recv'].includes(name.slice(0, 4)), 'Invalid name; make sure first 4 letters are a stat type or "info"')
        assert(['general', 'pass', 'rush', 'recv'].includes(statType), 'Invalid statType')
        assert(['string', 'dec_0', 'dec_1', 'dec_2', 'percent', 'index'].includes(format), 'Invalid format')
        assert(typeof title !== 'undefined',  'Missing title')
        assert(!sql.includes('undefined'), 'SQL statement includes undefined')
        this.name = name
        this.sql = sql
        this.statType = statType
        this.title = title
        this.shortTitle = shortTitle
        this.description = description
        this.expose = expose
        this.includeInSummary = includeInSummary
        this.width = width
        this.dataType = dataType
        this.format = format
    }
    buildSQL() {
        return `${this.sql} AS ${this.name}`
    }
 }


/** -----------------------------------------------------------------------------------------------------------
 * Class for filters
 * ------------------------------------------------------------------------------------------------------------
 */
 class Filter {
    constructor(dimension, {name, singleOperator = '=', multipleOperator = 'IN', joiner = ', ',
                placement = (dimension.statType === 'general' ? 'general' : 'stats'), 
                formProps, ui, expose = true, linkedAggs, linkedFilters}) {
        // takes a Dimension object as a paramater
        // requires at least a operator (e.g. >=) and joiner (e.g. 'BETWEEN') for multiple values
        // for an 'undefined' value, set value = ''; i.e. if selections are {yes: 1, no: 0, either: ''}
        assert(typeof dimension !== 'undefined',  'Missing dimension')
        assert(typeof name !== 'undefined',  'Missing name')
        assert(['general', 'pass', 'rush', 'recv'].includes(dimension.statType), 'Invalid statType')
        assert(['general', 'stats', 'where'].includes(placement), 'Invalid placement')
        assert(['=', '>='].includes(singleOperator),  'Invalid single operator')
        assert(['IN', 'BETWEEN'].includes(multipleOperator),  'Invalid multiple operator')
        assert([', ', ' AND '].includes(joiner),  'Invalid joiner')

        this.sql = dimension.sql                  // inherit from Dimension
        this.statType = dimension.statType        // inherit from Dimension
        this.name = name
        this.singleOperator = singleOperator
        this.multipleOperator = multipleOperator
        this.joiner = joiner
        this.placement = placement                // 'general' || 'stats' || 'where'
        this.formProps = formProps
        this.ui = ui
        this.expose = expose
        this.linkedFilters = linkedFilters
        this.linkedAggs = linkedAggs
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
    sql: 'stat_id',
    creationSQL: `${tbls.stats.name}.game_periods_pbp_events_id || '--' || ${tbls.stats.name}.stat_type`,
    statType: 'general',
    title: 'Stat ID',
    description: 'Unique ID for the particular statistic',
    width: '75px',
    dataType: 'string',
    format: 'string',
})
// ------------------------------------------------------------------------------------------------------------
dims.stat_type = new Dimension({
    sql: 'stat_type',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = 'receive' THEN 'recv' ELSE ${tbls.stats.name}.stat_type END`,
    statType: 'general',
    title: 'Stat Type',
    width: '175px',
    dataType: 'string',
    format: 'string',
})
// ------------------------------------------------------------------------------------------------------------
dims.season_year = new Dimension({
    sql: 'season_year',
    creationSQL: `${tbls.games.name}.summary_season_year`,
    statType: 'general',
    title: 'Season Year',
    shortTitle: 'Year',
    width: '75px',
    dataType: 'number',
    format: 'string',
})
// ------------------------------------------------------------------------------------------------------------
dims.season_week = new Dimension({
    sql: 'season_week',
    creationSQL: `${tbls.games.name}.summary_week_title`,
    statType: 'general',
    title: 'Season Week',
    shortTitle: 'Week',
    width: '75px',
    dataType: 'number',
    format: 'string',
})
// ------------------------------------------------------------------------------------------------------------
dims.venue_name = new Dimension({
    sql: 'venue_name',
    creationSQL: `${tbls.games.name}.summary_venue_name`,
    statType: 'general',
    title: 'Venue Name',
    shortTitle: 'Venue',
    width: '175px',
    dataType: 'string',
    format: 'string',
})
// ------------------------------------------------------------------------------------------------------------
dims.player_id = new Dimension({
    sql: 'player_id',
    creationSQL: `${tbls.stats.name}.player_id`,
    statType: 'general',
    title: 'Player ID',
})
// ------------------------------------------------------------------------------------------------------------
dims.player_name = new Dimension({
    sql: 'player_name',
    creationSQL: `${tbls.player_info.name}.full_name`,
    statType: 'general',
    title: 'Player Name',
    shortTitle: 'Player',
    width: '175px',
    dataType: 'string',
    format: 'string',
})
// dims.player_name = new Dimension({
//     sql: 'player_name',
//     creationSQL: `${tbls.stats.name}.player_name`,
//     statType: 'general',
//     title: 'Player Name',
//     shortTitle: 'Player',
//     width: '175px',
//     dataType: 'string',
//     format: 'string',
// })
// ------------------------------------------------------------------------------------------------------------
dims.player_position = new Dimension({
    sql: 'player_position',
    creationSQL: `${tbls.player_info.name}.position`,
    statType: 'general',
    title: 'Player Position',
    shortTitle: 'Position',
    width: '175px',
    dataType: 'string',
    format: 'string',
})
// dims.unclean_position = new Dimension({
//     sql: 'unclean_position',
//     creationSQL: `SPLIT(${tbls.stats.name}.player_position, '/')[SAFE_OFFSET(0)]`,
//     statType: 'general',
//     title: 'Player Position (Unclean)',
//     shortTitle: 'Position',
//     width: '175px',
//     dataType: 'string',
//     format: 'string',
//     description: 'In cases with multiple positions (eg TE/B) takes the first one (these are fairly rare)',
//     values: ['LB', 'WR', 'DB', 'CB', 'DE', 'RB', 'S', 'DT', 'TE', 'T', 'G', 'DL', 'QB', 'OL', 'OLB', 'C', 'K', 'ILB', 'P', 'LS', 'FB', 'NT', 'FS', 'SS', 'OT', 'HB', 'MLB', 'H', 'RT', '$LB', 'LOLB']
// })
// dims.player_position_history = new Dimension({
//     sql: 'player_position_history',
//     creationSQL: `CASE WHEN ${dims.unclean_position.creationSQL} = 'HB' THEN 'RB' ELSE ${dims.unclean_position.creationSQL} END`,
//     statType: 'general',
//     title: 'Player Position',
//     shortTitle: 'Position',
//     width: '175px',
//     dataType: 'string',
//     format: 'string',
//     description: 'Cleans HB to be RB',
//     values: ['LB', 'WR', 'DB', 'CB', 'DE', 'RB', 'S', 'DT', 'TE', 'T', 'G', 'DL', 'QB', 'OL', 'OLB', 'C', 'K', 'ILB', 'P', 'LS', 'FB', 'NT', 'FS', 'SS', 'OT', 'MLB', 'H', 'RT', '$LB', 'LOLB']
// })
// dims.player_position = new Dimension({
//     sql: 'player_position',
//     creationSQL: `FIRST_VALUE(${dims.player_position_history.creationSQL}) OVER (PARTITION BY ${dims.player_id.creationSQL} ORDER BY ${dims.season_year.creationSQL} DESC, ${dims.season_week.creationSQL} DESC)`,
//     statType: 'general',
//     title: 'Player Position',
//     shortTitle: 'Position',
//     width: '175px',
//     dataType: 'string',
//     format: 'string',
//     description: 'In cases where a player changed positions (e.g. from FS to CB), this takes the most recent position',
//     values: ['LB', 'WR', 'DB', 'CB', 'DE', 'RB', 'S', 'DT', 'TE', 'T', 'G', 'DL', 'QB', 'OL', 'OLB', 'C', 'K', 'ILB', 'P', 'LS', 'FB', 'NT', 'FS', 'SS', 'OT', 'MLB', 'H', 'RT', '$LB', 'LOLB']
// })
// ------------------------------------------------------------------------------------------------------------
dims.player_name_with_position = new Dimension({
    sql: 'player_name_with_position',
    creationSQL: `${dims.player_name.creationSQL} || ' (' || ${dims.player_position.creationSQL} || ')'`,
    statType: 'general',
    title: 'Player Name (Position)',
    shortTitle: 'Player',
    width: '175px',
    dataType: 'string',
    format: 'string',
})
// dims.player_name_with_position = new Dimension({
//     sql: 'player_name_with_position',
//     creationSQL: `${dims.player_name.creationSQL} || ' (' || ${dims.player_position.creationSQL} || ')'`,
//     statType: 'general',
//     title: 'Player Name (Position)',
//     shortTitle: 'Player',
//     width: '175px',
//     dataType: 'string',
//     format: 'string',
// })
// ------------------------------------------------------------------------------------------------------------
dims.player_gsis_id = new Dimension({
    sql: 'player_gsis_id',
    creationSQL: `${tbls.player_info.name}.player_gsis_id`,
    statType: 'general',
    title: 'GSIS Player ID',
})
// dims.partition_player_id = new Dimension({
//     sql: 'partition_player_id',
//     creationSQL: `DENSE_RANK() OVER (ORDER BY ${dims.player_id.creationSQL} ASC)`,
//     statType: 'general',
//     title: 'Partition Player ID',
//     description: 'This is used as the Partition Key for Materialized Views (which require an integer key).'
// })
// ------------------------------------------------------------------------------------------------------------
dims.team_name = new Dimension({
    sql: 'team_name',
    creationSQL: `CASE WHEN ${tbls.stats.name}.team_name = 'Redskins' THEN 'Football Team' ELSE ${tbls.stats.name}.team_name END`,
    statType: 'general',
    title: 'Team Name',
    shortTitle: 'Team',
    width: '175px',
    dataType: 'string',
    format: 'string',
    description: 'Like: Falcons'
})
// ------------------------------------------------------------------------------------------------------------
dims.team_abbreviation = new Dimension({
    sql: 'team_abbreviation',
    creationSQL: `${tbls.player_info.name}.team`,
    statType: 'general',
    title: 'Team Name',
    shortTitle: 'Team',
    width: '175px',
    dataType: 'string',
    format: 'string',
    description: 'Like: ATL'
})
// ------------------------------------------------------------------------------------------------------------
dims.team_id = new Dimension({
    sql: 'team_id',
    creationSQL: `${tbls.stats.name}.team_id`,
    statType: 'general',
    title: 'Team ID',
    description: 'NOTE: Chargers and Raiders have two different IDs when they change cities.'
})
// ------------------------------------------------------------------------------------------------------------
// dims.partition_team_id = new Dimension({
//     sql: 'partition_team_id',
//     creationSQL: `DENSE_RANK() OVER (ORDER BY ${dims.team_name.creationSQL} ASC)`,
//     statType: 'general',
//     title: 'Partition Player ID',
//     description: 'This is used as the Partition Key for Materialized Views (which require an integer key).'
// })


/** -----------------------------------------------------------------------------------------------------------
 * Situational Metrics
 * ------------------------------------------------------------------------------------------------------------
 */
dims.inside_20 = new Dimension({
    sql: 'inside_20',
    creationSQL: `${tbls.stats.name}.inside_20`,
    statType: 'general',
    title: 'Was Inside 20',
})
// ------------------------------------------------------------------------------------------------------------
dims.goaltogo = new Dimension({
    sql: 'goaltogo',
    creationSQL: `${tbls.stats.name}.goaltogo`,
    statType: 'general',
    title: 'Was Goal to Go',
})
// ------------------------------------------------------------------------------------------------------------
dims.nullified = new Dimension({
    sql: 'nullified',
    creationSQL: `${tbls.stats.name}.nullified`,
    statType: 'general',
    title: 'Was Nullified',
    description: '1 if nullified by penalty, otherwise NULL' // check to make sure this is accurate
})
// ------------------------------------------------------------------------------------------------------------
dims.firstdown = new Dimension({
    sql: 'firstdown',
    creationSQL: `${tbls.stats.name}.firstdown`,
    statType: 'general',
    title: 'Was Firstdown',
})



/** -----------------------------------------------------------------------------------------------------------
 * Pass Metrics
 * ------------------------------------------------------------------------------------------------------------
 */
 dims.pass_yards = new Dimension({
    sql: 'pass_yards',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.yards ELSE NULL END`,
    statType: 'pass',
    title: 'Pass Yards',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_attempt_yards = new Dimension({
    sql: 'pass_attempt_yards',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.att_yards ELSE NULL END`,
    statType: 'pass',
    title: 'Pass Attempt Yards',
    description: 'I think this is the number of yards in the air that the ball traveled. ' 
                +'This has values whether the pass was complete or not.'
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_air_yards = new Dimension({
    sql: 'pass_air_yards',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass" AND ${tbls.stats.name}.complete = 1 THEN ${tbls.stats.name}.att_yards ELSE NULL END`,
    statType: 'pass',
    title: 'Pass Air Yards',
    description: 'I think this is the number of yards in the air that the ball traveled but only for completions.' 
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_pocket_time = new Dimension({
    sql: 'pass_pocket_time',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.pocket_time ELSE NULL END`,
    statType: 'pass',
    title: 'Pass Pocket Time',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_sack_yards = new Dimension({
    sql: 'pass_sack_yards',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.sack_yards ELSE NULL END`,
    statType: 'pass',
    title: 'Pass Sack Yards',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_attempt = new Dimension({
    sql: 'pass_was_attempt',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.attempt ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Attempt',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_completion = new Dimension({
    sql: 'pass_was_completion',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.complete ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Completion',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_touchdown = new Dimension({
    sql: 'pass_was_touchdown',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.touchdown ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Touchdown',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_interception = new Dimension({
    sql: 'pass_was_interception',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.interception ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Interception',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_blitzed = new Dimension({
    sql: 'pass_was_blitzed',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.blitz ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Blitzed',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_batted = new Dimension({
    sql: 'pass_was_batted',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.batted_pass ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Batted',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_on_target = new Dimension({
    sql: 'pass_was_on_target',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.on_target_throw ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass On Target',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_hurry = new Dimension({
    sql: 'pass_was_hurry',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.hurry ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Hurried',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_knockdown = new Dimension({
    sql: 'pass_was_knockdown',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.knockdown ELSE NULL END`,
    statType: 'pass',
    title: 'Was Pass Knocked Down',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_was_sack = new Dimension({
    sql: 'pass_was_sack',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.sack ELSE NULL END`,
    statType: 'pass',
    title: 'Was Sack',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_type = new Dimension({
    sql: 'pass_incompletion_type',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "pass"    THEN ${tbls.stats.name}.incompletion_type ELSE NULL END`,
    statType: 'pass',
    title: 'Pass Incompletion Type',
    description: 'Poorly Thrown, Thrown Away, Dropped Pass, Pass Defended, Spike',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_poor_throw = new Dimension({
    sql: 'pass_incompletion_was_poor_throw',
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Poorly Thrown" THEN 1 ELSE 0 END`,
    statType: 'pass',
    title: 'Pass Was Poor Throw',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_throwaway = new Dimension({
    sql: 'pass_incompletion_was_throwaway',
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Thrown Away" THEN 1 ELSE 0 END`,
    statType: 'pass',
    title: 'Pass Was Throwaway',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_dropped = new Dimension({
    sql: 'pass_incompletion_was_dropped',
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Dropped Pass" THEN 1 ELSE 0 END`,
    statType: 'pass',
    title: 'Pass Was Dropped',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_defended = new Dimension({
    sql: 'pass_incompletion_was_defended',
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Pass Defended" THEN 1 ELSE 0 END`,
    statType: 'pass',
    title: 'Pass Was Defended',
})
// ------------------------------------------------------------------------------------------------------------
dims.pass_incompletion_was_spike = new Dimension({
    sql: 'pass_incompletion_was_spike',
    creationSQL: `CASE WHEN (${dims.pass_incompletion_type.creationSQL}) = "Spike" THEN 1 ELSE 0 END`,
    statType: 'pass',
    title: 'Pass Was Spike',
})



/** -----------------------------------------------------------------------------------------------------------
 * Rush Metrics
 * ------------------------------------------------------------------------------------------------------------
 */
dims.rush_yards = new Dimension({
    sql: 'rush_yards',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.yards ELSE NULL END`,
    statType: 'rush',
    title: 'Rush Yards',
})
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_attempt = new Dimension({
    sql: 'rush_was_attempt',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.attempt ELSE NULL END`,
    statType: 'rush',
    title: 'Rush Attempt',
})
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_touchdown = new Dimension({
    sql: 'rush_was_touchdown',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.touchdown ELSE NULL END`,
    statType: 'rush',
    title: 'Rush Touchdown',
})
// ------------------------------------------------------------------------------------------------------------
dims.rush_broken_tackles = new Dimension({
    sql: 'rush_broken_tackles',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.broken_tackles ELSE NULL END`,
    statType: 'rush',
    title: 'Rush Broken Tackles',
    description: 'Number of broken tackles during the run. On one TD run, Aaron Jones had 6 broken tackles!'
})
// ------------------------------------------------------------------------------------------------------------
dims.yards_after_contact = new Dimension({
    sql: 'yards_after_contact',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.yards_after_contact ELSE NULL END`,
    statType: 'rush',
    title: 'Rush Yards After Contact',
})
// ------------------------------------------------------------------------------------------------------------
dims.rush_was_scramble = new Dimension({
    sql: 'rush_was_scramble',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "rush"    THEN ${tbls.stats.name}.scramble ELSE NULL END`,
    statType: 'rush',
    title: 'Rush Was Scrumble',
})



//* ----------------------------------------------------------------------------------------------------------
//* Recv Metrics
//* ----------------------------------------------------------------------------------------------------------
dims.recv_yards = new Dimension({
    sql: 'recv_yards',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.yards ELSE NULL END`,
    statType: 'recv',
    title: 'Receiving Yards',
})
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_reception = new Dimension({
    sql: 'recv_was_reception',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.reception ELSE NULL END`,
    statType: 'recv',
    title: 'Was Reception',
})
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_target = new Dimension({
    sql: 'recv_was_target',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.target ELSE NULL END`,
    statType: 'recv',
    title: 'Was Receiving Target',
})
// ------------------------------------------------------------------------------------------------------------
dims.recv_was_touchdown = new Dimension({
    sql: 'recv_was_touchdown',
    creationSQL: `CASE WHEN ${tbls.stats.name}.stat_type = "receive" THEN ${tbls.stats.name}.touchdown ELSE NULL END`,
    statType: 'recv',
    title: 'Receiving Was Touchdown',
})





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
    name: 'pass_completions_sum',
    includeInSummary: true,
    title: 'Pass Completions', 
    shortTitle: 'Pass CMP',
    statType: 'pass',
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_completion.sql} ELSE NULL END)`, 
})
aggs.pass_attempts_sum = new Aggregate({
    name: 'pass_attempts_sum',
    includeInSummary: true,
    title: 'Pass Attempts', 
    shortTitle: 'Pass ATT',
    statType: 'pass',
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_attempt.sql}  ELSE NULL END)`, 
})
aggs.pass_completion_percentage = new Aggregate({
    name: 'pass_completion_percentage',
    includeInSummary: true,
    title: 'Pass Completion %', 
    shortTitle: 'Pass CMP %',
    statType: 'pass',
    sql: `${aggs.pass_completions_sum.sql} / ${aggs.pass_attempts_sum.sql}`, 
    format: 'percent', 
})
aggs.pass_yards_sum = new Aggregate({
    name: 'pass_yards_sum',
    includeInSummary: true,
    title: 'Pass Yards',
    shortTitle: 'Pass YDS', 
    statType: 'pass',
    sql: `SUM(CASE WHEN true THEN ${dims.pass_yards.sql} ELSE NULL END)`, 
})
aggs.pass_touchdowns_sum = new Aggregate({
    name: 'pass_touchdowns_sum',
    includeInSummary: true,
    title: 'Pass Touchdowns', 
    shortTitle: 'Pass TDS', 
    statType: 'pass',
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_touchdown.sql} ELSE NULL END)`, 
})
aggs.pass_interceptions_sum = new Aggregate({
    name: 'pass_interceptions_sum',
    includeInSummary: true,
    title: 'Pass Interceptions', 
    shortTitle: 'Pass INT', 
    statType: 'pass',
    sql: `SUM(CASE WHEN true THEN ${dims.pass_was_interception.sql} ELSE NULL END)`, 
})
aggs.pass_rating = new Aggregate({
    name: 'pass_rating',
    includeInSummary: true,
    title: 'Passer Rating', 
    shortTitle: 'Pass RTG', 
    statType: 'pass',
    sqlA: `GREATEST(LEAST((IFNULL(SAFE_DIVIDE(${aggs.pass_completions_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) - 0.3) * 5.00, 2.375), 0)`, 
    sqlB: `GREATEST(LEAST((IFNULL(SAFE_DIVIDE(${aggs.pass_yards_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) - 3.0) * 0.25, 2.375), 0)`, 
    sqlC: `GREATEST(LEAST(IFNULL(SAFE_DIVIDE(${aggs.pass_touchdowns_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) * 20.0, 2.375), 0)`, 
    sqlD: `GREATEST(LEAST(2.375 - (IFNULL(SAFE_DIVIDE(${aggs.pass_interceptions_sum.sql}, ${aggs.pass_attempts_sum.sql}), 0) * 25.0), 2.375), 0)`, 
    get sql() { return `100 * ((${this.sqlA})+(${this.sqlB})+(${this.sqlC})+(${this.sqlD}))/6` }, 
    format: 'dec_1', 
})
 aggs.pass_air_yards_sum = new Aggregate({
    name: 'pass_air_yards_sum',
    title: 'Total Air Yards', 
    shortTitle: 'Air YDS', 
    statType: 'pass',
    sql: `SUM(CASE WHEN true THEN ${dims.pass_air_yards.sql} ELSE NULL END)`,
})
aggs.pass_pocket_time_average = new Aggregate({
    name: 'pass_pocket_time_average',
    title: 'Average Time in Pocket', 
    shortTitle: 'Avg Time in Pocket',
    format: 'dec_2',
    statType: 'pass',
    sql: `AVG(CASE WHEN true THEN ${dims.pass_pocket_time.sql} ELSE NULL END)`, 
})
aggs.pass_yards_per_attempt = new Aggregate({
    name: 'pass_yards_per_attempt',
    title: 'Yards / Pass Att',
    expose: false,   // this can be calculated by user with a custom calculation
    shortTitle: 'Pass Y/A', 
    statType: 'pass',
    sql: `${aggs.pass_yards_sum.sql} / ${aggs.pass_attempts_sum.sql}`, 
    format: 'dec_1', 
})
aggs.pass_on_target_sum = new Aggregate({
    name: 'pass_on_target_sum',
    expose: false,   // this can be calculated by user with a custom calculation
    title: 'Total On-target Pass Attempts', 
    shortTitle: 'Pass INT', 
    statType: 'pass',
    sql: `SUM(CASE WHEN true AND (${dims.pass_was_on_target.sql} = 1) THEN ${dims.pass_was_attempt.sql} ELSE NULL END)`, 
})
aggs.pass_on_target_percentage = new Aggregate({
    name: 'pass_on_target_percentage',
    title: '% of Attempts On-target', 
    expose: false,   // this can be calculated by user with a custom calculation
    shortTitle: 'Pass ATT ON-TGT %', 
    statType: 'pass',
    sql: `100 * ${aggs.pass_on_target_sum.sql} / ${aggs.pass_attempts_sum.sql}`, 
    format: 'dec_1', 
})


//* -----------------------------------------------------------------------------------------------------------
//* Rush Aggregates
//* -----------------------------------------------------------------------------------------------------------
aggs.rush_attempts_sum = new Aggregate({
    name: 'rush_attempts_sum',
    includeInSummary: true,
    title: 'Rushing Attempts', 
    shortTitle: 'Rush ATT', 
    statType: 'rush',
    sql: `SUM(CASE WHEN true THEN ${dims.rush_was_attempt.sql}  ELSE NULL END)`, 
})
aggs.rush_yards_sum = new Aggregate({
    name: 'rush_yards_sum',
    includeInSummary: true,
    title: 'Rushing Yards', 
    shortTitle: 'Rush YDS', 
    statType: 'rush',
    sql: `SUM(CASE WHEN true THEN ${dims.rush_yards.sql} ELSE NULL END)`, 
})
aggs.rush_yards_per_attempt = new Aggregate({
    name: 'rush_yards_per_attempt',
    includeInSummary: true,
    title: 'Yards / Rush', 
    shortTitle: 'Rush Y/A', 
    statType: 'rush',
    sql: `${aggs.rush_yards_sum.sql} / ${aggs.rush_attempts_sum.sql}`, 
    format: 'dec_1', 
})
aggs.rush_touchdowns_sum = new Aggregate({
    name: 'rush_touchdowns_sum',
    includeInSummary: true,
    title: 'Rush Touchdowns', 
    shortTitle: 'Rush TDS', 
    statType: 'rush',
    sql: `SUM(CASE WHEN true THEN ${dims.rush_was_touchdown.sql} ELSE NULL END)`, 
})
aggs.rush_broken_tackles_sum = new Aggregate({
    name: 'rush_broken_tackles_sum',
    title: 'Total Broken Tackles', 
    shortTitle: 'Rush Broken Tackles', 
    statType: 'rush',
    sql: `SUM(CASE WHEN true THEN ${dims.rush_broken_tackles.sql} ELSE NULL END)`, 
})
aggs.rush_yards_after_contact_sum = new Aggregate({
    name: 'rush_yards_after_contact_sum',
    title: 'Yards Ater Contact', 
    shortTitle: 'Rush YDS After Contact', 
    statType: 'rush',
    sql: `SUM(CASE WHEN true THEN ${dims.yards_after_contact.sql} ELSE NULL END)`, 
})



//* -----------------------------------------------------------------------------------------------------------
//* Receiving Aggregates
//* -----------------------------------------------------------------------------------------------------------
aggs.recv_yards_sum = new Aggregate({
    name: 'recv_yards_sum',
    title: 'Receiving Yards', 
    shortTitle: 'Recv YDS', 
    statType: 'recv',
    sql: `SUM(CASE WHEN true THEN ${dims.recv_yards.sql} ELSE NULL END)`, 
})
aggs.recv_receptions_sum = new Aggregate({
    name: 'recv_receptions_sum',
    title: 'Receptions', 
    shortTitle: 'Recv REC', 
    statType: 'recv',
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_reception.sql} ELSE NULL END)`, 
})
aggs.recv_targets_sum = new Aggregate({
    name: 'recv_targets_sum',
    title: 'Receiving Targets', 
    shortTitle: 'Recv TGT', 
    statType: 'recv',
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_target.sql} ELSE NULL END)`, 
})
aggs.recv_touchdowns_sum = new Aggregate({
    name: 'recv_touchdowns_sum',
    title: 'Receiving Touchdowns', 
    shortTitle: 'Recv TDS', 
    statType: 'recv',
    sql: `SUM(CASE WHEN true THEN ${dims.recv_was_touchdown.sql} ELSE NULL END)`, 
})
aggs.recv_yards_per_reception = new Aggregate({
    name: 'recv_yards_per_reception',
    expose: true, 
    title: 'Yards / Catch', 
    shortTitle: 'Y/REC', 
    statType: 'recv',
    sql: `${aggs.recv_yards_sum.sql} / ${aggs.recv_receptions_sum.sql}`, 
    format: 'dec_1', 
})




/***********************************************************************************************************************
************************************************************************************************************************
************************************        FILTERS        *************************************************************
************************************************************************************************************************
************************************************************************************************************************
*/

/** -----------------------------------------------------------------------------------------------------------
 * WHERE filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.player_position = new Filter(dims.player_position, {
    name: 'player_position',
    placement: 'where',
    formProps: {
        label: 'Player Position',
        labelCol: {span: 12}, 
        wrapperCol: {span: 12}
    }, ui: {
    type: 'select',
    props: {
        placeholder: "Position",
        // need to add " " around the value; in order to ensure it goes into request as a string
        options: [
        {align: 'left', label: 'QB', value: "'QB'", key: 'QB'}, {align: 'left', label: 'RB', value: "'RB'", key: 'RB'},
        {align: 'left', label: 'WR', value: "'WR'", key: 'WR'}, {align: 'left', label: 'TE', value: "'TE'", key: 'TE'},
        ]}
    },
})

/** -----------------------------------------------------------------------------------------------------------
 * "Recommended" filters (Row-type filters)
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.season_year = new Filter(dims.season_year, {
    name: 'season_year',
    expose: false,   // this is enetered manually right now because it appears in the 'recommended' section
    formProps: {
        label: 'Year',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
    type: 'select',
    props: {
        optionFilterProp: "label",
        options: [
        {align: 'left', title: '2016', label: '2016', value: '2016', key: '2016'},
        {align: 'left', title: '2017', label: '2017', value: '2017', key: '2017'},
        {align: 'left', title: '2018', label: '2018', value: '2018', key: '2018'},
        {align: 'left', title: '2019', label: '2019', value: '2019', key: '2019'},
        {align: 'left', title: '2020', label: '2020', value: '2020', key: '2020'},
        ]}
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.team_name = new Filter(dims.team_name, {
    name: 'team_name',
    expose: false,   // this is enetered manually right now because it appears above the 'General Filters' box
})
// ------------------------------------------------------------------------------------------------------------
fltrs.player_name_with_position = new Filter(dims.player_name_with_position, {
    name: 'player_name_with_position',
    expose: false,   // this is enetered manually right now because it appears above the 'General Filters' box
})


/** -----------------------------------------------------------------------------------------------------------
 * General filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.stat_type = new Filter(dims.stat_type, {
    name: 'stat_type',
    expose: false,   // this is used in WHERE clause; generated by API request depending on what stats are selected
})
// ------------------------------------------------------------------------------------------------------------
fltrs.inside_20 = new Filter(dims.inside_20, {
    name: 'inside_20',
    formProps: {
        label: 'Inside 20?',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
    type: 'select',
    props: {
        optionFilterProp: "label",
        allowClear: true,
        options: [
        {align: 'left', title: 'Either', label: 'Either', value: '', key: 'either'},
        {align: 'left', title: 'Yes', label: 'Yes', value: '1', key: '1'},
        {align: 'left', title: 'No', label: 'No', value: '0', key: '0'},
        ]}
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.goaltogo = new Filter(dims.goaltogo, {
    name: 'goaltogo',
    formProps: {
        label: 'Goal to Go?',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
    type: 'select',
    props: {
        optionFilterProp: "label",
        allowClear: true,
        options: [
        {align: 'left', title: 'Either', label: 'Either', value: '', key: 'either'},
        {align: 'left', title: 'Yes', label: 'Yes', value: '1', key: '1'},
        {align: 'left', title: 'No', label: 'No', value: '0', key: '0'},
        ]}
    }
})


/** -----------------------------------------------------------------------------------------------------------
 * Pass filters
 * ------------------------------------------------------------------------------------------------------------
 */
fltrs.pass_pocket_time = new Filter(dims.pass_pocket_time, {
    name: 'pass_pocket_time',
    multipleOperator: 'BETWEEN', 
    joiner: ' AND ', 
    formProps: {
        label: 'Time in Pocket',
        labelCol: {span: 10},
        wrapperCol: {span: 14},
    }, ui: {
        type: 'slider',
        props: {range: true, max: 10, min: 0, step: 0.1, marks: {0: '0s', 10: '10s'},
            included: true, style: {margin: '0 25px'}}
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_blitzed = new Filter(dims.pass_was_blitzed,{
    name: 'pass_was_blitzed',
    formProps: {
        label: 'Pass Blitzed?',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
        type: 'select',
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
            {align: 'left', title: 'Either', label: 'Either', value: '', key: 'either'},
            {align: 'left', title: 'Yes', label: 'Yes', value: '1', key: '1'},
            {align: 'left', title: 'No', label: 'No', value: '0', key: '0'},
        ]}
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_batted = new Filter(dims.pass_was_batted, {
    name: 'pass_was_batted',
    formProps: {
        label: 'Pass Batted?',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
        type: 'select',
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
            {align: 'left', title: 'Either', label: 'Either', value: '', key: 'either'},
            {align: 'left', title: 'Yes', label: 'Yes', value: '1', key: '1'},
            {align: 'left', title: 'No', label: 'No', value: '0', key: '0'},
            ]
        }
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_was_on_target = new Filter(dims.pass_was_on_target, {
    name: 'pass_was_on_target',
    formProps: {
        label: 'Throw on Target?',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
        type: 'select',
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
            {align: 'left', title: 'Either', label: 'Either', value: '', key: 'either'},
            {align: 'left', title: 'Yes', label: 'Yes', value: '1', key: '1'},
            {align: 'left', title: 'No', label: 'No', value: '0', key: '0'},
            ]
        }
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.pass_incompletion_type = new Filter(dims.pass_incompletion_type, {
    name: 'pass_incompletion_type',
    linkedAggs: ['pass_attempts_sum'],
    formProps: {
        label: 'Type of Pass Incompletion',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
        type: 'select',
        props: {
            allowClear: true,
            optionFilterProp: "label",
            options: [
            {align: 'left', title: 'Poorly Thrown', label: 'Poorly Thrown', value: "'Poorly Thrown'", key: "'poorly_thrown'"},
            {align: 'left', title: 'Thrown Away', label: 'Thrown Away', value: "'Thrown Away'", key: "'thrown_away'"},
            {align: 'left', title: 'Dropped Pass', label: 'Dropped Pass', value: "'Dropped Pass'", key: "'dropped_pass'"},
            {align: 'left', title: 'Pass Defended', label: 'Pass Defended', value: "'Pass Defended'", key: "'pass_defended'"},
            {align: 'left', title: 'Spike', label: 'Spike', value: "'Spike'", key: "'spike'"},
            ]
        }
    }
})



/** -----------------------------------------------------------------------------------------------------------
 * Rush filters
 * ------------------------------------------------------------------------------------------------------------
 */
 fltrs.rush_yards = new Filter(dims.rush_yards, {
    name: 'rush_yards',
    multipleOperator: 'BETWEEN', 
    joiner: ' AND ', 
    formProps: {
        label: 'YDS Gained on ATT',
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    }, ui: {
        type: 'slider',
        props: {range: true, max: 100, min: -10, step: 1,
            included: true, style: {margin: '0 25px'}}
    }
})
// ------------------------------------------------------------------------------------------------------------
fltrs.rush_was_scramble = new Filter(dims.rush_was_scramble, {
    name: 'rush_was_scramble',
    formProps: {
        label: 'Was Scramble?',
        labelCol: {span: 16},
        wrapperCol: {span: 8},
    }, ui: {
        type: 'select',
        props: {
            optionFilterProp: "label",
            allowClear: true,
            options: [
            {align: 'left', title: 'Either', label: 'Either', value: '', key: 'either'},
            {align: 'left', title: 'Yes', label: 'Yes', value: '1', key: '1'},
            {align: 'left', title: 'No', label: 'No', value: '0', key: '0'},
            ]
        }
    }
})

// idea - instead of slider use two inputNumbers? something like below:
// }, ui: {
//     type: 'inputNumberGroup',
//     elements: [
//         {name: 'min', props: {min: -100}},
//         {name: 'max', props: {min: -100}}
//     ]
// }
