/*
    This file is an example of how test cases can be built on the overall function. 
    As time permitted, a sample of unit-testing is shown below.
*/
import { 
    validateConcernFlag,
    validateDistinctCSVs
} from "./compareCSVs.js";

function test(){
    testConcern();
    testDistinctCSV();
    return 0;
}

function testConcern(){
    var casesPassed = 6;

    if(!validateConcernFlag()){
        casesPassed--;
        console.error('testConcern() failed on NULL case');
    }

    if(!validateConcernFlag("")){
        casesPassed--;
        console.error('testConcern() failed on empty case')
    }

    if(!validateConcernFlag("subscriber_count")){
        casesPassed--;
        console.error('testConcern() failed on \'subscriber_count\' case');
    }

    if(!validateConcernFlag("channel_ownership")){
        casesPassed--;
        console.error('testConcern() failed on \'channel_ownership\' case');
    }

    if(!validateConcernFlag("CHANNEL_ownership")){
        casesPassed--;
        console.error('testConcern() failed on case sensitivity case');
    }

    if(validateConcernFlag("Totally wrong string")){
        casesPassed--;
        console.error('testConcern() failed on validity case');
    }
    
    console.log(`testConcern() passed ${casesPassed} out of 6!`);
}

function testDistinctCSV(){
    var casesPassed = 3;
    if(!validateDistinctCSVs(['csvs/CSV1.csv', 'csvs/CSV2.csv'])){
        casesPassed--;
        console.error('testDistinctCSV() failed on distinct case');
    }

    if(validateDistinctCSVs(['csvs/CSV1.csv', 'csvs/CSV1.csv'])){
        casesPassed--;
        console.error('testDistinctCSV() failed on exact copy case');
    }

    if(validateDistinctCSVs(['csvs/CSV1.csv', 'csvs/CSV1Copy.csv'])){
        casesPassed--;
        console.error('testDistinctCSV() failed on different path non-distinct case');
    }

    console.log(`testDistinctCSV() passed ${casesPassed} out of 3!`);
}

test();

//NOTES FOR TESTERS AND TEST DESIGNERS ON FURTHER DEVELOPING TEST CASES
/*
    Format CSV
    -ensure output looks good
*/

/*
    Format Fields
    - try normal
    - try rearrangement
    - try less than 3
    - try 3 but wrong
    - try more than 3 but correct
    - try more than 3 but wrong
*/

/*
    hashCSV
    - try weird CSVs
    - try weird field order
*/