const assert = require('assert');
const {dims, aggs, fltrs, tbls} = require('../queries/metadata')

// Test that all 'alias' fields are equal to the property names on agg
function testNamingAggs() {
    Object.entries(aggs).forEach(([key, object]) => {
        assert(key === object.name)
        // console.log(key, '===', object.alias)
    })
    console.log('Success')
    return true
}
// Test that all 'sql' fields are equal to the property names on dims
function testNamingDims() {
    Object.entries(dims).forEach(([key, object]) => {
        assert(key === object.sql)
        // console.log(key, '===', object.sql)
    })
    console.log('Success')
    return true
}

testNamingAggs()
testNamingDims()