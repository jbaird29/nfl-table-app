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
    sql += `  ${dims.stat_type.sql}, ${dims.player_name.sql}, ${dims.player_position.sql}, ${dims.team_name.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    Object.values(dims).forEach(field => {
        sql += `    ${field.buildCreationSQL()},\n`
    })
    sql += `  FROM\n`
    sql += `    ${tbls.s.buildSQL()}\n`
    sql += `  JOIN\n`
    sql += `    ${tbls.g.buildSQL()}\n`
    sql += '  ON\n'
    sql += `    ${tbls.g.buildJoinSQL()}\n`
    sql += `)`
    return sql
}

function writeCreationSQL() {
    fs.writeFile('./sql/create-prod.sql', getCreationSQL(), function (err) {
        if (err) return console.log(err);
    })
}

function getAllAggregateSQL() {
    let sql = ``
    sql += `SELECT\n`
    Object.values(aggs).forEach(field => {
        sql += `    ${field.buildSQL()},\n`
    })
    sql += `FROM\n`
    sql += `    ${tbls.prod.sqlName}\n`
    return sql
}

function writeAllAggregatesSQL() {
    fs.writeFile('./sql/test-all-aggregates.sql', getAllAggregateSQL(), function (err) {
        if (err) return console.log(err);
    })
}


async function getPlayerStats() {
    const sqlPartitionRange = `SELECT MIN(${dims.partition_player_id.sql}) AS min, MAX(${dims.partition_player_id.sql}) AS max 
        FROM ${tbls.prod.sqlName}`
    const range = await bq.runQuery(sqlPartitionRange)
    const {min, max} = range[0]

    let sql = ``
    sql += `CREATE OR REPLACE TABLE\n` 
    sql += `  ${tbls.player_stats.sqlName}\n`
    sql += `PARTITION BY\n`
    sql += `  RANGE_BUCKET(${dims.partition_player_id.sql}, GENERATE_ARRAY(${min}, ${max+1}, 1))\n`
    sql += `CLUSTER BY\n`
    sql += `  ${dims.season_year.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    sql += `    ${dims.partition_player_id.sql} AS ${dims.partition_player_id.sql},\n`
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
    const min = 1
    const max = 32

    let sql = ``
    sql += `CREATE OR REPLACE TABLE\n` 
    sql += `  ${tbls.team_stats.sqlName}\n`
    sql += `PARTITION BY\n`
    sql += `  RANGE_BUCKET(${dims.partition_team_id.sql}, GENERATE_ARRAY(${min}, ${max+1}, 1))\n`
    sql += `CLUSTER BY\n`
    sql += `  ${dims.season_year.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    sql += `    ${dims.partition_team_id.sql} AS ${dims.partition_team_id.sql},\n`
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


writePlayerStats()
writeTeamStats()
writeCreationSQL()
writeAllAggregatesSQL()