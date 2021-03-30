const fs = require('fs')
const {dims, aggs, tbls} = require('../queries/metadata')

function getCreationSQL(fields, tables) {
    let sql = ``
    sql += `CREATE OR REPLACE TABLE\n` 
    sql += `  ${tables.prod.sqlName}\n`
    sql += `PARTITION BY\n`
    sql += `  RANGE_BUCKET(${dims.season_year.sql}, GENERATE_ARRAY(2012, 2021, 1))\n`
    sql += `CLUSTER BY\n`
    sql += `  ${dims.stat_type.sql}, ${dims.player_name.sql}, ${dims.player_position.sql}, ${dims.team_name.sql}\n`
    sql += `AS (\n`
    sql += `  SELECT\n`
    Object.values(fields).forEach(field => {
        sql += `    ${field.buildCreationSQL()},\n`
    })
    sql += `  FROM\n`
    sql += `    ${tables.s.buildSQL()}\n`
    sql += `  JOIN\n`
    sql += `    ${tables.g.buildSQL()}\n`
    sql += '  ON\n'
    sql += `    ${tables.g.buildJoinSQL()}\n`
    sql += `)`
    return sql
}

function writeCreationSQL(fields, tables) {
    fs.writeFile('./sql/create-prod.sql', getCreationSQL(fields, tables), function (err) {
        if (err) return console.log(err);
    })
}

function getAllAggregateSQL(fields, tables) {
    let sql = ``
    sql += `SELECT\n`
    Object.values(fields).forEach(field => {
        sql += `    ${field.buildSQL()},\n`
    })
    sql += `FROM\n`
    sql += `    ${tables.prod.sqlName}\n`
    return sql
}

function writeAllAggregatesSQL(fields, tables) {
    fs.writeFile('./sql/test-all-aggregates.sql', getAllAggregateSQL(fields, tables), function (err) {
        if (err) return console.log(err);
    })
}


writeCreationSQL(dims, tbls)
writeAllAggregatesSQL(aggs, tbls)