const fs = require('fs');
const mongodb = require('mongodb');

const START_BLOCK = 3800000;
const END_BLOCK = 4800000;
const BLOCKS_PER_FILE = 100000;

const jsonToDatabase = async () => {

    // Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
    // let uri = 'mongodb://owner:uUvg8pZdDgG3EZPfC6ArJnW8KsxUtqsP@ds123490.mlab.com:23490/tokenexplorer';
    let uri = 'mongodb://localhost:27017/tokenexplorer';

    try {
        await mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {

            if (err) throw err;

            /*
             * Get the database from the client. Nothing is required to create a
             * new database, it is created automatically when we insert.
             */

            let db = client.db('tokenexplorer')

            /*
             * First we'll add a few songs. Nothing is required to create the
             * songs collection; it is created automatically when we insert.
             */

            let transferRecords = db.collection('transferRecords');

            // Note that the insert method can take either an array or a dict.

            for (let i = START_BLOCK; i < END_BLOCK; i += BLOCKS_PER_FILE) {

                const records = JSON.parse(fs.readFileSync(`./EOSTransferRecords-${i}-${i + BLOCKS_PER_FILE}.json`));

                transferRecords.insert(records, function (err, result) {

                    console.log("content", records);

                    if (err) throw err;

                    /*
                     * Finally we run a query which returns all the hits that spend 10 or
                     * more weeks at number 1.
                     */
                    // transferRecords.find({ blockNumber: { $gte: 10 } }).sort({ blockNumber: 1 }).toArray(function (err, docs) {

                    //     if (err) throw err;

                    //     docs.forEach(function (doc) {
                    //         console.log(
                    //             `Block Number:${doc['blockNumber']}\n${doc['returnValues']['to']} => ${doc['returnValues']['to']}\nTokens: ${doc['returnValues']['tokens']}\n`
                    //         );
                    //     });

                    // });
                });
            }

            // client.close(function (err) {
            //     if (err) throw err;
            // });

        });
    } finally {
        db.close();
    }
}

jsonToDatabase();
