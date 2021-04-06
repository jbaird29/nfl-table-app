const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const {Query} = require('./backend/queries/query');
const bq = require('./backend/queries/bigquery');
const meta = require('./backend/queries/metadata');
const createSID = require('./backend/utils/create-sid')


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.runQuery = functions.https.onRequest(async function(req, res){
    functions.logger.log(JSON.stringify(req.body))
    try {
        const query = new Query(meta, req.body)
        const sql = query.buildSQL()
        functions.logger.log(sql)
        console.log(sql)
        const queryPromise = bq.runQuery(sql)
        const tableProps = query.buildTableProps()
        const queryResult = await queryPromise    // this begins execution of tableProps while awaiting resolution of the Promise
        queryResult ? res.status(200).send({dataSource: queryResult, columns: tableProps}) : res.res.status(400).send({error: "Query invalid."})
    } catch(err) {
        functions.logger.warn(err)
        res.status(400).send({error: "Could not complete request with given parameters."})
    }
})

exports.saveState = functions.https.onRequest(async function(req, res){
    const saveData = req.body
    functions.logger.log(saveData)
    const {queryFormV, calcsFormV, tableInfo, queryFields, calcsFields} = saveData
    const stateID = createSID(JSON.stringify(saveData))
    functions.logger.log("Attempting to save stateID: ", stateID)
    try {
        const docRef = db.collection('states').doc(stateID)
        await docRef.set({
            queryFields: JSON.stringify(queryFields),
            calcsFields: JSON.stringify(calcsFields),
            queryFormV: queryFormV,
            calcsFormV: calcsFormV,
            tableInfo: JSON.stringify(tableInfo)
        });
        functions.logger.log(`Saved ${stateID}`)
        res.status(201).send({stateID: stateID})
    } catch (err) {
        functions.logger.warn(err)
        res.status(400).send({error: "Could not complete request."})
    }
})

exports.loadState = functions.https.onRequest(async function(req, res){
    const stateID = req.query.sid
    functions.logger.log("Attempting to load stateID: ", stateID)
    try {
        const docRef = db.collection('states').doc(stateID)
        const doc = await docRef.get();
        if (!doc.exists) {
            functions.logger.warn('No such document!');
            res.status(400).send({error: "Could not complete request. No such document"})
        } else {
            const data = doc.data()
            const queryFields = JSON.parse(data.queryFields)
            const calcsFields = JSON.parse(data.calcsFields)
            const tableInfo = JSON.parse(data.tableInfo)
            try {
                const query = new Query(meta, queryFields)
                const sql = query.buildSQL()
                functions.logger.log(sql)
                const queryPromise = bq.runQuery(sql)
                const tableProps = query.buildTableProps()
                const queryResult = await queryPromise
                functions.logger.log(`Loaded ${stateID}`)
                queryResult ? res.status(200).send({queryFields, calcsFields, tableInfo, tableData:{dataSource: queryResult, columns: tableProps}}) : res.res.status(400).send({error: "Query invalid."})
            } catch(err) {
                functions.logger.warn(err)
                res.status(400).send({error: "Could not complete request with given parameters."})
            }
        }
    } catch (err) {
        functions.logger.warn(err)
        res.status(400).send({error: "Could not complete request."})
    }
})


exports.loadStandardPage = functions.https.onRequest(async function(req, res){
    const {type, id} = req.query
    const sqlID        = type === 'player' ? 'player_gsis_id'               : 'team_id'
    const sqlDimension = type === 'player' ? 'player_name_with_position'    : 'team_name'
    const sqlTableName = type === 'player' ? meta.tbls.player_stats.sqlName : meta.tbls.team_stats.sqlName

    let querySQL = ''
    querySQL += `SELECT * EXCEPT(${sqlID}, ${sqlDimension}) FROM ${sqlTableName} `
    querySQL += ` WHERE ${sqlID} = '${id}' ORDER BY season_year ASC`

    let infoSQL = ''
    if (type === 'player') {
        infoSQL += `SELECT full_name, birth_date, main.calculate_age(CURRENT_DATE(), birth_date) AS age, `
        infoSQL += ` college, weight, height, jersey_number, team_name, team_abbreviation, headshot_url, player_position `
        infoSQL += ` FROM \`nfl-table.main.player_info\``
        infoSQL += ` WHERE ${sqlID} = '${id}' `
    } else if (type === 'team') {
        infoSQL += `SELECT team_name, team_abbreviation, coach, venue, general_manager, owners, logo_url `
        infoSQL += ` FROM \`nfl-table.main.team_info\` WHERE ${sqlID} = '${id}' `
    } else {
        res.status(400).send({error: "Type invalid."})
    }

    functions.logger.log(querySQL)
    functions.logger.log(infoSQL)
    console.log(querySQL)
    console.log(infoSQL)
    
    const queryPromise = bq.runQuery(querySQL)
    const infoPromise  = bq.runQuery(infoSQL)
    const tableProps = Object.values(meta.aggs).filter(field => field.includeInSummary).map(field => ({
        dataIndex: field.name
        , key: field.name
        , title: field.shortTitle
        , width: field.width
        , dataType: field.dataType
        , format: field.format
        , align: 'right'
    }))
    tableProps.splice(0, 0, {
        dataIndex: meta.dims.season_year.sql
        , key: meta.dims.season_year.sql
        , title: meta.dims.season_year.shortTitle
        , width: meta.dims.season_year.width
        , dataType: meta.dims.season_year.dataType
        , format: meta.dims.season_year.format
        , align: 'left'
        , fixed: 'left'
    })
    try {
        const queryResult = await queryPromise
        const infoResult  = await infoPromise
        queryResult ? res.status(200).send({tableData: {dataSource: queryResult, columns: tableProps}, info: infoResult[0]}) : res.res.status(400).send({error: "Query invalid."})
    } catch(err) {
        functions.logger.warn(err)
        res.status(400).send({error: "Could not complete request with given parameters."})
    }
})
