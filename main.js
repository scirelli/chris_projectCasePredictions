const fs = require('fs'),
      csv = require("fast-csv"),
      stream = fs.createReadStream("Step5_Prediction_Appended_Docketsheet_Chunk1.csv");

const COL_1 = 0,
    CASE_NUMBER = 1,
    PREDICTION = 12;

const NEGOTIATION = 8,
      CLOSED = 11;

const NEGOTIATION_BEFORE_CLOSED = 1;

var map = {},
    csvStream = csv()
        .on("data", function(row){
            var prediction = Number(row[PREDICTION]);
            
            if(prediction === NEGOTIATION || prediction === CLOSED){
                if(!map[row[CASE_NUMBER]]){
                    map[row[CASE_NUMBER]] = { 
                        prevPrediction: prediction,
                        result: 0
                    };
                }else if(prediction === CLOSED && map[row[CASE_NUMBER]].prevPrediction === NEGOTIATION){
                    map[row[CASE_NUMBER]].result = NEGOTIATION_BEFORE_CLOSED;
                }
            }
        })
        .on("end", function(){
            let result = [];
            console.log("Done");

            Object.getOwnPropertyNames(map).forEach(function(name){
                if(map[name].result){
                    result.push([name]);
                }
            });
            console.log(result);

            var ws = fs.createWriteStream("result.csv");
            csv
               .write(result, {headers: false})
               .pipe(ws);
        });
 
stream.pipe(csvStream);
