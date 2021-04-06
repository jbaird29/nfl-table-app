const assert = require('assert');
const {dims, aggs, fltrs, tbls} = require('../queries/metadata')
const bq = require('../queries/bigquery');

// Test that all 'alias' fields are equal to the property names on agg
function testNamingAggs() {
    Object.entries(aggs).forEach(([key, object]) => {
        if (key !== object.name) {console.log(key)}
        assert(key === object.name)
        // console.log(key, '===', object.alias)
    })
    console.log('Success')
    return true
}
// Test that all 'sql' fields are equal to the property names on dims
function testNamingDims() {
    Object.entries(dims).forEach(([key, object]) => {
        if (key !== object.sql) {console.log(key)}
        assert(key === object.sql)
        // console.log(key, '===', object.sql)
    })
    console.log('Success')
    return true
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

async function testAllAggregates() {
    const job = await bq.runQuery(getAllAggregateSQL(), true)
    if (job) {
        console.log('Success')
    }
}

testNamingAggs()
testNamingDims()
testAllAggregates()