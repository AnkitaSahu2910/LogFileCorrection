const fs = require('fs');

async function checkLogFile (req,res){

        let fileContents = await readFile('Logs.txt'); 
        let modifiedArrWithKeyValuePair = prepareKeyValuePairOFFileData(fileContents);
        let finalOutputArray = [];
        //Looping through each user to get session data .
        for(let user of distinctUsersInFile(modifiedArrWithKeyValuePair))
        {
            let logDataForParticularUser = modifiedArrWithKeyValuePair.filter(function(val){
              return val.name == user;
            })
            // If a logfile has 'End' in the start or 'Start' in the end of file, Adding a corresponding Start and End.
            if(logDataForParticularUser[0].action == "End") logDataForParticularUser = addMissingStarts(logDataForParticularUser,modifiedArrWithKeyValuePair,user);
            if(logDataForParticularUser[logDataForParticularUser.length-1].action == "Start") logDataForParticularUser = addMissingEnds(logDataForParticularUser,modifiedArrWithKeyValuePair,user);
            //Finding Out Count Of 'Start' & 'End'
            var countStart = logDataForParticularUser.filter(value => value.action == 'Start').length;
            var countEnd = logDataForParticularUser.filter(value => value.action == 'End').length;
            if(countStart != countEnd)
            {
               if  (countStart > countEnd )
               {
                //Adding missing Ends
                 while ((countStart - countEnd) > 0)
                 {
                  logDataForParticularUser = addMissingEnds(logDataForParticularUser,modifiedArrWithKeyValuePair,user);
                    --countStart;
                 }
                 finalOutputArray = prepareFinalOutput(logDataForParticularUser ,user,finalOutputArray);
               }
               else if  (countEnd > countStart )
               {
                //Adding missing Starts
                 while ((countEnd - countStart) > 0)
                 {
                  logDataForParticularUser = addMissingStarts(logDataForParticularUser,modifiedArrWithKeyValuePair,user);
                    --countEnd;
                 }
                 finalOutputArray = prepareFinalOutput(logDataForParticularUser ,user,finalOutputArray);
               }
            }
            else{
              finalOutputArray = prepareFinalOutput(logDataForParticularUser ,user,finalOutputArray);
            }
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${finalOutputArray}`);

}
function prepareKeyValuePairOFFileData(fileContents){
  const convertedDataIntoArray = fileContents. toString(). replace(/\r\n/g,'\n'). split('\n');
  let modifiedArrWithKeyValuePair = convertedDataIntoArray.map(function(str)
    { 
      let tempArray = str.split(" ");
      return {time : tempArray[0], name : tempArray[1], action : tempArray[2]}
    })
  return modifiedArrWithKeyValuePair
}
function findTotalSessionTime (logDataForParticularUser){
    let time = 0;
    while(logDataForParticularUser.length > 0)
    {
        let endTime,startTime ;
        endTime = logDataForParticularUser.find(function(value,index) {
            if(value.action == 'End')
            { 
                logDataForParticularUser.splice(index,1);
                return true ;
            }
        })
        startTime = logDataForParticularUser.find(function(value,index) {
            if(value.action == 'Start')
            { 
                logDataForParticularUser.splice(index,1);
                return true;
            }
        })
        time = time + (new Date("2000-01-01T" +endTime.time).getTime() - new Date("2000-01-01T" + startTime.time).getTime())/1000;
    }
    return time;
} 
function addMissingStarts (logDataForParticularUser,modifiedArrWithKeyValuePair,user){
    logDataForParticularUser.unshift({time : modifiedArrWithKeyValuePair[0].time, name : user, action : "Start"});
    return logDataForParticularUser
}
function addMissingEnds (logDataForParticularUser,modifiedArrWithKeyValuePair,user){
  logDataForParticularUser.push({time : modifiedArrWithKeyValuePair[modifiedArrWithKeyValuePair.length-1].time, name : user, action : "End"});
  return logDataForParticularUser
}
function prepareFinalOutput (logDataForParticularUser ,user,finalOutputArray){
  finalOutputArray.push(`${user} ${logDataForParticularUser.length/2} ${findTotalSessionTime(logDataForParticularUser)}`);
  return finalOutputArray
}
function distinctUsersInFile (modifiedArrWithKeyValuePair){
    //Taking out distinct users in file.
    let distinctNamesInFile = []
    for (let j = 0; j < modifiedArrWithKeyValuePair.length; j++)
    {
      if (distinctNamesInFile.indexOf(modifiedArrWithKeyValuePair[j].name) == -1)
      distinctNamesInFile.push(modifiedArrWithKeyValuePair[j].name);
    }
      return distinctNamesInFile;
}
function readFile(filePath){
       return new Promise((resolve, reject) => {
         fs.readFile(filePath, 'utf8', (error, fileContent) => {
          if (error != null) {
           reject(error);
            return;
          }
          resolve(fileContent);
         });
        });
}
module.exports = { checkLogFile,readFile,distinctUsersInFile,findTotalSessionTime,
                   prepareKeyValuePairOFFileData,prepareFinalOutput }