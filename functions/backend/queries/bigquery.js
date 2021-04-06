// Import the Google Cloud client library using default credentials = saved in env variable
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

module.exports.runQuery = async function(queryText, dryRun = false) {

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
        query: queryText,
        location: 'US',  // Location must match that of the dataset referenced in the query.
        dryRun: dryRun
    };

    // Run the query as a job
    try {
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);
        if (dryRun) {
            return job
        }
    
        // Wait for the query to finish
        const [rows] = await job.getQueryResults();  // array; each row is object of column:value
        return rows    
    } catch(error) {
        console.log(error)
        return null
    }
}
