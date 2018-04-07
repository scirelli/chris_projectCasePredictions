const fs = require('fs'),
      csv = require("fast-csv");

const DOCKET_SHEET_ENTRIES_COL = 'Docket Sheet Entries';

const map = {},
    csvWriteStream = csv.createWriteStream({headers: false}),
    writeableStream = fs.createWriteStream('result.csv'),
    readStream = fs.createReadStream("20180323_Docket_Text file for Junk Classification.csv"),
    csvReadStream = csv({headers:true});

csvWriteStream.pipe(writeableStream);

csvReadStream
    .on('data', function(row) {
        var val = row[DOCKET_SHEET_ENTRIES_COL];

        val = parseArray(row[DOCKET_SHEET_ENTRIES_COL]);

        row[DOCKET_SHEET_ENTRIES_COL] = val.join(',');
        csvWriteStream.write(row);
    })
    .on('end', function(){
        csvWriteStream.end();
    });

readStream.pipe(csvReadStream);


function parseArray(val){
    if(typeof val !== 'string') return val;
    
    let rtn = [];

    for(let i=0, l=val.length,c,s; i<l; i++){
        c = val[i];

        if(c === '"' || c === "'") {
            s = '';
            c = val[++i];
            while( i<l && c !== '"' && c !== "'"){
                if( c >= 'a' && c <= 'z'
                    || c >= 'A' && c <= 'Z'
                    || c >= '0' && c <= '9'){
                    s += c;
                }else{
                    s += ' ';
                }
                c = val[++i];
            }
            rtn.push(s);
        }
    }

    return rtn;
}
