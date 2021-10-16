REQUIREMENTS 
- Input is two different CSV files
- each CSV contains Account Email, Youtube Channel, Subscriber Count
- assume the Account Emails are the same between files and are reliable
- function should take in two CSV file paths and an optional "concern" parameter
- if the two file paths are not distinct raise an error
- "concern" parameter == subscriber_count | channel_ownership
- Output is a list of Account Emails with discrepancies
- if "concern" is provided, output all unique discrepancies
- formatting for files is not consistent

BONUSES
- use performant comparison algorithms
- Allow more than two files to be compared through the interfact

QUESTIONS
- is it safe to assume function inputs will be valid when called? can I make my own assumptions?
- is it safe to assume emails are sorted/in order?
- what formatting is inconsistent? is this only in relation to channelIDs. furthermore, is it safe to
    assume channelIDs will hold one of the four valid formats?
- is the UC pre-fix always a prefix or can it be part of a channelID?
- is it safe to assume channelIDs and sub counts are valid?
- do you have the solution output for the provided CSV examples?
- am I allowed to use packages?

QUESTIONS ANSWERED
1. Is it safe to assume the inputs will be valid for my function? If not, can I make predefined
assumptions for my design?
    - No there is no guarantee. Best to think through edge cases and handle accordingly.

2. Given that the emails are reliable, is it safe to assume the CSVs have the same number of entries
and are entries sorted in any way?
    - Yes, both CSVs would have the same # of rows and have the same emails. However, they might not be sorted.

3. Will the content fields of each entry always be valid (e.g. no typos in a Youtube ID) and non-null?
    - No there is no guarantee on this. That is one of the reasons for the discrepancy. 

4. What is considered a distinct file? Is this determined by the file path or raw contents?
    - raw contents

5. Are Youtube IDs always 22 characters when stripped of the domain + "UC" prefix? Follow up, can an ID
start with "UC" or will it always be a prefix?
    - Youtube channel IDs are 24 characters long. They always start with UC. However, in the files, they could have been stored as a link or with the channel IDs or with Channel IDs without the redundant UC or even with a typo (if its a typo, it's a discrepancy to be printed out if found)

6. Is there an example solution output for the provided CSV input?
    - The function outputs a list of account emails with a discrepancy.
    - If a concern is provided as a parameter, only output the discrepancies which are related to that data.
    - If no concern is provided, output all the unique discrepancies

7. Am I allowed to utilize 3rd party packages as part of my solution?
    - Sure. We would prefer to see a solution that gives us insights into your grasp of CS basics and how you approach the problem. If you would like to use a 3rd party library, kindly make sure to use the most efficient algorithm for comparisons.

CURRENT WORKFLOW IN MIND 
- take in at least 2 CSV file paths
- check whether or not the files are unique
- standardize formatting on "Youtube channel" and "Subscriber count"
    - strip excess spaces on the sides
    - for youtube channel, condense to 22 char channel
    - for subscriber count, convert to an int
- *sort by email before iterating across entries?
- check "concern" flag to determine which fields to be compared
- compare each file entry, if "Youtube Channel" or "Subscriber count" != then add to final array[]
- return final array

WORKFLOW FOR >2 FILES
- utilize a hashmap and use one CSV as the "truthy" copy
- store e-mails as keys given assumptions that e-mails are the same and reliable
- store an object as value where object contains properties "youtube channel" and "subscriber count"
    - before storing ensure a consistent format for future comparisons
- begin iterating across each CSV and compare to hashmap
    - make sure iterated pair values are also formatted before comparing
- store mismatched emails in array[] based on "concerns" or discrepancies
- return final array