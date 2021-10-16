# Running Instructions
0. Node.js required
1. `git clone` the repo
2. Navigate to repo home directory
3. Adjust input parameters `files` and `concern` as seen between lines 6 - 12 in `compareCSVs.js`. Be sure to save
3. `node .\compareCSVs.js` to run example. A `console.log` is used to reveal output while the function itself returns the expected object.

## Software Used
* Microsoft Visual Studio Code
* Node.js v12.22.5

## Candidate's Letter
Thank you Collab Inc. recruiting team for giving me the chance to take this interview test! It was a blast to tackle this coding challenge and utilize my technical skills to solve the problem. My initial outlining and plans can be found under BENS_NOTES to give you an idea of how I broke down the problem into components to complete the task. As seen in my design, I ultimately chose to go with the idea of a hashmap to directly compare the emails. Personally, I preferred this approach given its ease in reading each CSV file once and allowing for quick lookup for comparison; however, my one reserve on the design is its scalability with CSV entries beyond the thousands - in short I traded memory for runtime. My alternative concept, sacrificing runtime for memory, was to read and sort the CSVs in place by email given that the number of emails and their reliability was ensured. This would theoretically allow for row by row comparisons while minimizing memory usage. 
I would have loved to tackle the multiple file bonus if my time permitted. To summarize how I might have implemented this into the current codebase, I would want to modify my distinct file validation for 2+ files - most likely using a set to track bytes/raw content to determine if any files are duplicates. Additionally, instead of making a hashmap per CSV, I would simply have one CSV hashmap as the "truth" while I compared it to every other CSV's formatted data fields. This would theoretically reduce the amount of memory needed for hashmaps while functionally performing the same work as the original solution.
Thank you again for taking the time to review my submission. I look forward to discussing my test with the team!