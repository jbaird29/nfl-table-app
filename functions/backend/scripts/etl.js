const fs = require('fs')
const {dims, aggs, tbls} = require('../queries/metadata')
const bq = require('../queries/bigquery');

function getCreationSQL() {
    let sql = ``
    sql += `CREATE OR REPLACE TABLE\n` 
    sql += `  ${tbls.prod.sqlName}\n`
    sql += `PARTITION BY\n`
    sql += `  RANGE_BUCKET(${dims.season_year.sql}, GENERATE_ARRAY(2012, 2021, 1))\n`
    sql += `CLUSTER BY\n`
    sql += `  ${dims.stat_type.sql}, ${dims.player_name_with_position.sql}, ${dims.team_name.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    Object.values(dims).forEach(field => {
        sql += `    ${field.buildCreationSQL()},\n`
    })
    sql += `  FROM\n`
    sql += `    ${tbls.stats.buildSQL()}\n`
    sql += `  JOIN\n`
    sql += `    ${tbls.games.buildSQL()}\n`
    sql += '  ON\n'
    sql += `    ${tbls.games.buildJoinSQL()}\n`
    sql += `  JOIN\n`
    sql += `    ${tbls.player_info.buildSQL()}\n`
    sql += '  ON\n'
    sql += `    ${tbls.player_info.buildJoinSQL()}\n`
    sql += `)`
    return sql
}

function writeCreationSQL() {
    fs.writeFile('./sql/create-prod.sql', getCreationSQL(), function (err) {
        if (err) return console.log(err);
    })
}

function getPlayerStats() {
    let sql = ``
    sql += `CREATE OR REPLACE TABLE\n` 
    sql += `  ${tbls.player_stats.sqlName}\n`
    sql += `CLUSTER BY\n`
    sql += `  ${dims.player_gsis_id.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    sql += `    ${dims.player_gsis_id.sql} AS ${dims.player_gsis_id.sql},\n`
    sql += `    ${dims.player_name_with_position.sql} AS ${dims.player_name_with_position.sql},\n`
    sql += `    ${dims.season_year.sql} AS ${dims.season_year.sql},\n`
    Object.values(aggs).filter(field => field.includeInSummary).forEach(field => {
        sql += `    ${field.sql} AS ${field.name},\n`
    })
    sql += `  FROM\n`
    sql += `    ${tbls.prod.sqlName}\n`
    sql += `  GROUP BY 1, 2, 3\n`
    sql += `)`
    return sql
}

async function writePlayerStats() {
    const sql = await getPlayerStats()
    fs.writeFile('./sql/create-player-stats.sql', sql, function (err) {
        if (err) return console.log(err);
    })
}

function getTeamStats() {
    let sql = ``
    sql += `CREATE OR REPLACE TABLE\n` 
    sql += `  ${tbls.team_stats.sqlName}\n`
    sql += `CLUSTER BY\n`
    sql += `  ${dims.team_id.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    sql += `    ${dims.team_id.sql} AS ${dims.team_id.sql},\n`
    sql += `    ${dims.team_name.sql} AS ${dims.team_name.sql},\n`
    sql += `    ${dims.season_year.sql} AS ${dims.season_year.sql},\n`
    Object.values(aggs).filter(field => field.includeInSummary).forEach(field => {
        sql += `    ${field.sql} AS ${field.name},\n`
    })
    sql += `  FROM\n`
    sql += `    ${tbls.prod.sqlName}\n`
    sql += `  GROUP BY 1, 2, 3\n`
    sql += `)`
    return sql
}

function writeTeamStats() {
    const sql = getTeamStats()
    fs.writeFile('./sql/create-team-stats.sql', sql, function (err) {
        if (err) return console.log(err);
    })
}

async function executeQueries() {
    const creationSQL = getCreationSQL()
    const result1 = await bq.runQuery(creationSQL)
    console.log(result1)

    const playerStatsSQL = getPlayerStats()
    const result2 = await bq.runQuery(playerStatsSQL)
    console.log(result2)

    const teamStatsSQL = getTeamStats()
    const result3 = await bq.runQuery(teamStatsSQL)
    console.log(result3)
}

writePlayerStats()
writeTeamStats()
writeCreationSQL()
executeQueries()