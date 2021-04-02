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
        const queryResult = await bq.runQuery(sql)
        const tableProps = query.buildTableProps()
        queryResult ? res.status(200).send({dataSource: queryResult, columns: tableProps}) : res.res.status(400).send({error: "Query invalid."})
    } catch(err) {
        functions.logger.warn(err)
        res.status(400).send({error: "Could not complete request with given parameters."})
    }
})

exports.saveState = functions.https.onRequest(async function(req, res){
    const saveData = req.body
    functions.logger.log(saveData)
    const {queryFormV, calcsFormV, queryFields, calcsFields} = saveData
    const stateID = createSID(JSON.stringify(saveData))
    functions.logger.log("Attempting to save stateID: ", stateID)
    try {
        const docRef = db.collection('states').doc(stateID)
        await docRef.set({
            queryFields: JSON.stringify(queryFields),
            calcsFields: JSON.stringify(calcsFields),
            queryFormV: queryFormV,
            calcsFormV: calcsFormV,
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
            try {
                const query = new Query(meta, queryFields)
                const sql = query.buildSQL()
                functions.logger.log(sql)
                const queryResult = await bq.runQuery(sql)
                const tableProps = query.buildTableProps()
                functions.logger.log(`Loaded ${stateID}`)
                queryResult ? res.status(200).send({queryFields, calcsFields, tableData:{dataSource: queryResult, columns: tableProps}}) : res.res.status(400).send({error: "Query invalid."})
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
