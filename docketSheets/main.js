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
        // replaceWithCSV(row);
        convertToColumns(row);
    })
    .on('end', function(){
        csvWriteStream.end();
    });

readStream.pipe(csvReadStream);

function replaceWithCSV(row){
    var val = row[DOCKET_SHEET_ENTRIES_COL];

    val = parseArray(row[DOCKET_SHEET_ENTRIES_COL]);

    row[DOCKET_SHEET_ENTRIES_COL] = val.join(',');
    csvWriteStream.write(row);
}

function convertToColumns(row){
    var val = row[DOCKET_SHEET_ENTRIES_COL];

    val = parseArray(row[DOCKET_SHEET_ENTRIES_COL]);

    csvWriteStream.write(val);
}

function parseArray(val){
    if(typeof val !== 'string') return val;
    
    const ESCAPE_CHAR = '\\';
    let rtn = [];
    
    for(let i=0, l=val.length,c,s; i<l; i++){
        c = val[i];

        if(c === '"') {
            s = getInnerString(val, i, '"');
            rtn.push(s.subStr);
            i = s.index;
        }else if(c === "'") {
            s = getInnerString(val, i, "'");
            rtn.push(s.subStr);
            i = s.index;
        }
    }

    return rtn;

    function getInnerString(str, startIndex, delimiter) {
        let s = '',
            c = str[++startIndex],
            l = str.length;

        while( startIndex<l && c !== delimiter){
            if( c >= 'a' && c <= 'z'
                || c >= 'A' && c <= 'Z'
                || c >= '0' && c <= '9'){
                s += c;
            } else if(c === ESCAPE_CHAR){
                s += ' ';
                ++startIndex;
            } else {
                s += ' ';
            }

            c = str[++startIndex];
        }

        return {
            index: startIndex,
            subStr: s
        };
    }
}
