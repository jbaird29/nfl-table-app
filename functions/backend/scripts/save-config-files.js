const fs = require('fs')
const {dims, aggs, tbls, fltrs} = require('../queries/metadata')

function writeStatList(aggs) {
    const statList = [
        {
            label: "Passing", 
            key: 'pass',
            options: []
        }, {
            label: "Rushing", 
            key: 'rush',
            options: []
        }, {
            label: "Receiving", 
            key: 'recv',
            options: []
        },
    ]
    for (const field in aggs) {
        if (aggs[field].expose === true) {
            statList.find(statGroup => statGroup.key === aggs[field].statType)
            .options.push({title: aggs[field].title, label: aggs[field].title, value: field, key: field, align:'left'})
        }
    }
    fs.writeFile('../../../src/inputs/statsInputs.json', JSON.stringify(statList), function (err) {
        if (err) return console.log(err);
    })
}

function writeFilters(fltrs) {
    const stats = Object.entries(fltrs).filter(([key, value]) => value.placement === 'stats' && value.expose).map(([key, value]) => 
        ({name: value.name, statType: value.statType, linkedAggs: value.linkedAggs, 
        linkedFilters: value.linkedFilters, formProps: value.formProps, ui: value.ui }) )

    const general = Object.entries(fltrs).filter(([key, value]) => value.placement === 'general' && value.expose).map(([key, value]) => 
        ({name: value.name, formProps: value.formProps, ui: value.ui }) )

    const where = Object.entries(fltrs).filter(([key, value]) => value.placement === 'where' && value.expose).map(([key, value]) => 
        ({name: value.name, formProps: value.formProps, ui: value.ui }) )

    fs.writeFile('../../../src/inputs/filtersGeneral.json', JSON.stringify(general), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile('../../../src/inputs/filtersStats.json', JSON.stringify(stats), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile('../../../src/inputs/filtersWhere.json', JSON.stringify(where), function (err) {
        if (err) return console.log(err);
    });
}


writeStatList(aggs);
writeFilters(fltrs);

