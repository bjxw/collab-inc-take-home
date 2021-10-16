import { 
    validateConcernFlag,
    validateDistinctCSVs,
    formatCSV,
    formatFields,
    hashCSV
 } from "./compareCSVs.js";

 /*
    Concern flag
    - null
    - empty
    - 2 cases
    - wrong string case
 */
 
/*
    Distinct CSVs
    -check two distinct
    -check two exact copies
    -check two paths same copy
    -*check more than two files?
*/

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