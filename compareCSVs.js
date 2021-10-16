//imports used
import * as fs from 'fs'; //used to read the contents of a file

//BEGIN USER INPUTS ====================================================================================
//Absolute or relative paths to a csv file. See ./csvs folder for input samples
const files = [
    'csvs/CSV1.csv',
    'csvs/CSV2.csv'
];

//Optional String flag to set during call.
const concern = ""; //options = [NULL, "", "subscriber_count", "channel_ownership"];
//END USER INPUTS ======================================================================================

/*
    Function: main()
    Inputs(s): None. See User Inputs section above to manipulate function.
    Output(s): An Array of Strings representing emails OR NULL if an error occurs.
    Description: This is the main function executed to compare two CSV files. The CSV
        files are data with three expected columns: Account Email, Youtube Channel, and
        Subscriber Count. The two CSV files should contain the same Account Emails. The
        function will then compare discrepancies between Youtube Channel and Subscriber
        Count for an Account Email and return an Array of Account Emails whose data fields
        do not match. If an error occurs before output, the function returns null.
*/
function main(){
    var discrepancies = validateCSVs(files, concern);
    console.log(discrepancies);
    return discrepancies;
}

/*
    Function: validateCSVs()
    Input(s): files_array[] - Array containing file paths of .csv files
            concern - optional String flag set to "subscriber_count" OR "channel_ownership"
    Output(s): an array of strings representing emails
    Description: This function takes in an input Array of at least two csv file paths and an
        optional "concern" flag String. Based on the concern flag, the function will compare 
        two Objects, acting as Hashmaps, representing the csvs. The function will then return
        an array of the discrepant emails. 
*/
function validateCSVs(files, concern){
    if(validateConcernFlag(concern)){ //concern flag passes
        if(validateDistinctCSVs(files)){ //distinct CSV passes
            var CSV1 = formatCSV(files[0]);
            var CSV2 = formatCSV(files[1]);
            if(!CSV1 || !CSV2){
                console.error(errors[5])
                return null;
            }

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
        
    return null;
};

/*
    Function: validateConcernFlag()
    Input(s): concern - a string that should be set to NULL, empty, 'subscriber_count', or 'channel_ownership'
    Output(s): boolean - based on whether or not "concern" inputs matches the requirements of the flag
    Description: This function receives a "concern" input string and determines whether or not it matches
        the functional requirements of validateCSVs(). A Boolean will be returned indicating whether or not
        the input satisfies the conditions.
*/
function validateConcernFlag(concern){
    if (!concern) return true; //null or empty case

    concern = concern.toLowerCase(); //standardize input and read
    if(concern === 'subscriber_count' || concern === 'channel_ownership'){
        return true;
    }

    console.error(errors[0]);
    return false;
}

/*
    Function: validateDistinctCSVs()
    Input(s): files - an Array of strings that should represent file paths to a .csv
    Output(s): boolean - represents whether or not the files presented are distinct
    Description: This function validates the input by checking if at least two files
        exist to compare. It then ensures that the two files are of the .csv type
        before comparing their raw contents. The raw content comparison is determined
        by reading the two files and comparing their bytes. A boolean based on the
        file equality is then returned.
*/
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

/*
    Function: formatCSV()
    Input(s): data - a string representing a .csv file's path
    Output(s): Object - an Object acting as a hashmap representing the csv file's content
    Description: This function takes in a csv file path and returns a "hashmap" of the read
        data. The function creates an array where each element is a string representing a row
        of the csv. The csv header fields are parsed and indexed to only fetch the requested
        fields per the requirements. The function then formats the Subscriber Count field for
        Type discrepancies before passing the formatted data to the return function hashCSV();
*/
function formatCSV(data){
    data = fs.readFileSync(data, 'utf8').toString();
    var csv = data.split(/\r?\n/);

    //isolate and identify requirements' CSV fields
    let fieldString = csv.shift();
    var fields = formatFields(fieldString);
    if(!fields){
        return null;
    }

    var field_indices = [
        fields.indexOf('account email'), 
        fields.indexOf('youtube channel'),
        fields.indexOf('subscriber count')
    ];

    //this loops catches any number String in subscriber_count, removes the commas, and itemizes every row 
    for(var i = 0; i < csv.length; i++){
        var temp_subs = csv[i].match(/"(.*?)"/);
        if(temp_subs){ //format subscriber_count if applicable
            csv[i] = csv[i].replace(temp_subs[0], temp_subs[0].replace(',', ''));
            csv[i] = csv[i].replace(/"/g, '');
        }
        csv[i] = csv[i].split(','); //itemize row contents
    }

    return hashCSV(csv, field_indices);
}

/*
    Function: formatFields()
    Input(s): fieldString - a string representing the unparsed header row in a csv
    Output(s): Array - an array where each element is a single data field header
    Description - This function receives an input string and parses it into the an array
        representing the data headers of a csv file. The function checks for the three
        fields of Account Email, Youtube Channel, and Subscriber Count per the requirements.
        If the parsed string satisfies the base fields, the array is returned.
*/
function formatFields(fieldString){
    let fields = fieldString.split(',');
    if(fields.length !== 3){
        console.error(errors[4]);
        return null;
    }
    for(var i = 0; i < fields.length; i++){
        fields[i] = fields[i].trim().toLowerCase();
    }

    if( //validate fields before continuing
        fields.length < 3 ||
        !fields.includes('account email') ||
        !fields.includes('youtube channel') ||
        !fields.includes('subscriber count')
    ){
        console.error(errors[4]);
        return null;
    } 

    return fields;
}

/*
    Function: hashCSV()
    Input(s): csv[] - an Array of Arrays where each element is a parsed row entry of the csv
              field_indices - an Array of indices representing the requested fields to extract
    Output(s): Object - an Object, representing a Hashmap, pairing Account Email-Keys to
        Object-Values where the Object-Values posseses properties 'channel_ownership' and
        'subscriber_count'.
    Description: This function takes in an Array representing a parse csv and an Array of indices
        representing the data fields to read. The function then locates the requested fields and
        begins storing the fields as Key-Value pairs where Key==Account Email and Value==Object
        where Object stores the related fields to the Account Key. The Hashmap created is then
        returned.
*/
function hashCSV(csv, field_indices){
    var hashMap = {};
    var email = field_indices[0];
    var channel = field_indices[1];
    var subs = field_indices[2];
    for(var i = 0; i < csv.length; i++){
        let entry = csv[i];
        let account = entry[email];
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
    'Error 0: validateCSVs() \'concern\' flag must be null, an empty string, \'subscriber_count\', or \'channel_ownership\'. See validateConcernFlag() ',
    'Error 1: validateCSVs() must receive at least 2 unique .csv files. See validateDistinctCSVs()',
    'Error 2: validateCSVs() must receive .csv input filetypes. See validateDistinctCSVs()',
    'Error 3: validateCSVs() inputs must be unique files (raw contents cannot be identical). See validateDistinctCSVs()',
    'Error 4: validateCSVs() must receive .csv files with header fields \'Account Email\', \'Youtube Channel\', and \'Subscriber Count\' ',
    'Error 5: validateCSVs() has reached an error processing a .csv file(s). Please review your input files.'
];

main(); //calls function

//exports used for example unit-testing
export {
    validateConcernFlag,
    validateDistinctCSVs
};