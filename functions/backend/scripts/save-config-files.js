const fs = require("fs");
const { dims, aggs, tbls, fltrs } = require("../queries/metadata");
const bq = require("../queries/bigquery");

const relativePath = "../../../src/inputs/";

async function writePlayerList() {
    const sqlPlayerList = `SELECT DISTINCT ${dims.player_name_with_position.sql}, ${dims.player_gsis_id.sql}
        FROM ${tbls.prod.sqlName} WHERE ${dims.player_position.sql} in ('QB', 'RB', 'WR', 'TE') ORDER BY 1 ASC`;
    const result = await bq.runQuery(sqlPlayerList);

    const listForSelectProps = result.map((row) => ({ value: row.player_gsis_id, label: row.player_name_with_position }));
    fs.writeFile(relativePath + "playerList.json", JSON.stringify(listForSelectProps), function (err) {
        if (err) return console.log(err);
    });

    // converts: [{value: gsis_id_1, label: player_name_1}]   into: {player_name_1: gsis_id_1, player_name_2: gsis_id_2}
    const playerNameToIDMap = Object.assign(...listForSelectProps.map((props) => ({ [props.label]: props.value })));
    const playerIDToNameMap = Object.assign(...listForSelectProps.map((props) => ({ [props.value]: props.label })));
    fs.writeFile("../lookups/playerNameToIDMap.json", JSON.stringify(playerNameToIDMap), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile("../lookups/playerIDToNameMap.json", JSON.stringify(playerIDToNameMap), function (err) {
        if (err) return console.log(err);
    });
}

async function writeTeamList() {
    const sqlTeamList = `SELECT DISTINCT ${dims.team_name.sql}, ${dims.team_id.sql} 
        FROM ${tbls.prod.sqlName} ORDER BY 1 ASC`;
    const result = await bq.runQuery(sqlTeamList);

    const listForSelectProps = result.map((row) => ({ value: row.team_id, label: row.team_name }));
    fs.writeFile(relativePath + "teamList.json", JSON.stringify(listForSelectProps), function (err) {
        if (err) return console.log(err);
    });

    // converts: [{value: team_id_1, label: team_name_1}]   into: {team_id_1: team_name_1, team_id_2: team_name_2}
    const teamNameToIDMap = Object.assign(...listForSelectProps.map((props) => ({ [props.label]: props.value })));
    const teamIDToNameMap = Object.assign(...listForSelectProps.map((props) => ({ [props.value]: props.label })));
    fs.writeFile("../lookups/teamNameToIDMap.json", JSON.stringify(teamNameToIDMap), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile("../lookups/teamIDToNameMap.json", JSON.stringify(teamIDToNameMap), function (err) {
        if (err) return console.log(err);
    });
}

function writeStatList(aggs) {
    const statList = [
        {
            label: "Passing",
            key: "pass",
            options: [],
        },
        {
            label: "Rushing",
            key: "rush",
            options: [],
        },
        {
            label: "Receiving",
            key: "recv",
            options: [],
        },
    ];
    for (const field in aggs) {
        if (aggs[field].expose === true) {
            statList
                .find((statGroup) => statGroup.key === aggs[field].statType)
                .options.push({ title: aggs[field].title, label: aggs[field].title, value: field, key: field, align: "left" });
        }
    }
    fs.writeFile(relativePath + "statsInputs.json", JSON.stringify(statList), function (err) {
        if (err) return console.log(err);
    });
}

function writeFilters(fltrs) {
    const stats = Object.entries(fltrs)
        .filter(([key, value]) => value.placement === "stats" && value.expose)
        .map(([key, value]) => ({
            name: value.name,
            statType: value.statType,
            linkedAggs: value.linkedAggs,
            linkedFilters: value.linkedFilters,
            formProps: value.formProps,
            ui: value.ui,
        }));

    const general = Object.entries(fltrs)
        .filter(([key, value]) => value.placement === "general" && value.expose)
        .map(([key, value]) => ({ name: value.name, formProps: value.formProps, ui: value.ui }));

    const where = Object.entries(fltrs)
        .filter(([key, value]) => value.placement === "where" && value.expose)
        .map(([key, value]) => ({ name: value.name, formProps: value.formProps, ui: value.ui }));

    const filterInputs = [
        {
            label: "General",
            key: "general",
            options: [],
        },
        {
            label: "Passing",
            key: "pass",
            options: [],
        },
        {
            label: "Rushing",
            key: "rush",
            options: [],
        },
        {
            label: "Receiving",
            key: "recv",
            options: [],
        },
    ];

    const filterComponents = Object.entries(fltrs)
        .filter(([key, value]) => value.expose)
        .map(([key, value]) => ({
            name: value.name,
            statType: value.statType,
            linkedAggs: value.linkedAggs,
            linkedFilters: value.linkedFilters,
            formProps: value.formProps,
            ui: value.ui,
        }));

    filterComponents.forEach((filter) => {
        filterInputs
            .find((statGroup) => statGroup.key === filter.statType)
            .options.push({
                value: filter.name,
                label: filter.formProps.label,
            });
    });

    fs.writeFile(relativePath + "filtersGeneral.json", JSON.stringify(general), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile(relativePath + "filtersStats.json", JSON.stringify(stats), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile(relativePath + "filtersWhere.json", JSON.stringify(where), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile(relativePath + "filterComponents.json", JSON.stringify(filterComponents), function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile(relativePath + "filterInputs.json", JSON.stringify(filterInputs), function (err) {
        if (err) return console.log(err);
    });
}

writePlayerList();
writeTeamList();
writeStatList(aggs);
writeFilters(fltrs);
