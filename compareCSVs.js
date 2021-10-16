//imports used
import {Buffer} from 'buffer'; //used to compare the byteLength of a files
import * as fs from 'fs'; //used to read the contents of a file

//**USER INPUTS - MODIFY INPUTS HERE
const files = [
    'CSV1.csv',
    'CSV2.csv'
];

const concern = ""; //options = [NULL, "", "subscriber_count", "channel_ownership"];

function main(){
    var discrepancies = validateCSVs(files, concern);
    console.log(discrepancies);
    return discrepancies;
}

/*
    Function: validateCSVs()
    Input(s): files_array [] - array containing file paths of .csv files
            concern - optional flag set to "subscriber_count" OR "channel_ownership"
    Output(s): an array containing emails represented as strings
    Description: This function should receive an input of an array with at least two csv files 
            with unique paths and and an optional "concern" flag described above. If inputs are
            invalid, this function will return an error message.  
*/
function validateCSVs(files, concern){
    if(validateConcernFlag(concern)){ //concern flag passes
        if(validateDistinctCSVs(files)){ //distinct CSV passes
            var CSV1 = formatCSV(files[0]);
            var CSV2 = formatCSV(files[1]);
            var discrepancies = [];
            for(const [email, fields1] of Object.entries(CSV1)){
                let fields2 = CSV2[email];

                if(concern === 'channel_ownership' || concern === 'subscriber_count'){
                    if(fields1[concern] !== fields2[concern]){
                        discrepancies.push(email);
                    }
                } else {
                    if(
                        fields1.channel_ownership !== fields2.channel_ownership ||
                        fields1.subscriber_count !== fields2.subscriber_count
                    ){
                        discrepancies.push(email);
                    }
                }
            }
            return discrepancies;
        }
    }
};

/*
    Function: validateConcernFlag()
    Input(s): concern - a string that should be set to null, empty, 'subscriber_count', or 'channel_ownership'
    Output(s): boolean - based on whether or not "concern" inputs matches the requirements of the flag
    Description: This function receives a "concern" input string and determines whether or not it matches
        the functional requirements of validateCSVs(). A Boolean will be returned indicating whether or not
        the input satisfies the conditions.
*/
function validateConcernFlag(concern){
    if (!concern) return true; //null

    concern = concern.toLowerCase();
    if(concern === 'subscriber_count' || concern === 'channel_ownership'){
        return true;
    }

    console.error(errors[0]);
    return false;
}

function validateDistinctCSVs(files){
    //check if at least two files
    if(files.length < 2){ 
        console.error(errors[1]);
        return false;
    }

    //check if file endings are correct
    if(files[0].toLowerCase().split('.').pop() !== 'csv' && files[1].toLowerCase().split('.').pop() !== 'csv'){
        console.error(errors[2]);
        return false;
    }

    //check if files are distinct
    var file1 = fs.readFileSync(files[0]);
    var file2 = fs.readFileSync(files[1]);
    if(file1.equals(file2)){
        console.error(errors[3]);
        return false;
    }    

    return true;
}

function formatCSV(data){
    data = fs.readFileSync(data, 'utf8').toString();
    var csv = data.split(/\r?\n/);

    //isolate and identify requirements' CSV fields
    let fieldString = csv.shift();
    var fields = formatFields(fieldString);

    var field_indices = [
        fields.indexOf('account email'), 
        fields.indexOf('youtube channel'),
        fields.indexOf('subscriber count')
    ];

    //this loops catches any number-string in subscriber_count, removes the commas, and itemizes every row 
    for(var i = 0; i < csv.length; i++){
        var temp_subs = csv[i].match(/"(.*?)"/);
        if(temp_subs){
            csv[i] = csv[i].replace(temp_subs[0], temp_subs[0].replace(',', ''));
            csv[i] = csv[i].replace(/"/g, '');
        }
        csv[i] = csv[i].split(',');
    }

    return hashCSV(csv, field_indices);
}

function formatFields(fieldString){
    let fields = fieldString.split(',');
    if(fields.length !== 3){
        console.error(errors[4]);
    }
    for(var i = 0; i < fields.length; i++){
        fields[i] = fields[i].trim().toLowerCase();
    }

    if( //validate fields before continuing
        fields.length < 3 ||
        !fields.includes('account email') ||
        !fields.includes('youtube channel') ||
        !fields.includes('subscriber count')
    ) return console.error(errors[4]);

    return fields;
}

function hashCSV(csv, field_indices){
    var hashMap = {};
    var email = field_indices[0];
    var channel = field_indices[1];
    var subs = field_indices[2];
    for(var i = 0; i < csv.length; i++){
        let entry = csv[i];
        let account = entry[email].replace(/'/g, '');
        hashMap[account] = {
            channel_ownership: entry[channel].slice(-22),
            subscriber_count: parseInt(entry[subs])
        }
    }

    return hashMap;
}

/*
    Variable: errors[]
    Description: This array stores possible error outputs from validateCSVs(). The index correlates to the error
        code for ease of interpretation and lookup.
*/
const errors = [
    'Error 0: validateCSVs() \'concern\' flag must be set to an empty string, \'subscriber_count\', or \'channel_ownership\'. See validateConcernFlag() ',
    'Error 1: validateCSVs() must receive at least 2 unique .csv files. See validateDistinctCSVs()',
    'Error 2: validateCSVs() must receive .csv input filetypes. See validateDistinctCSVs()',
    'Error 3: validateCSVs() inputs must be unique files (raw contents cannot be identical). See validateDistinctCSVs()',
    'Error 4: validateCSVs() must receive .csv files with fields \'Account Email\', \'Youtube Channel\', and \'Subscriber Count\' ',
];

main(); //calls function

//exports used for unit-testing
export {
    validateConcernFlag,
    validateDistinctCSVs,
    formatCSV,
    formatFields,
    hashCSV
};