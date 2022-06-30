const chai = require('chai');
const { expect } = chai;
const checkLogFile = require("../logFileService.js");

describe('logFileService test',() =>{
it("should be able to read the file", (done) => {
    checkLogFile.readFile("Logs.txt")
        .then(function(res) {
            expect(res).to.be.not.empty;
            done();
        })
        .catch(function(err) {
            expect(err).to.be.empty;
            done();
        })
})
it("should not be able to read the file as file name is wrong in input", (done) => {
    checkLogFile.readFile("Logss.txt")
        .then(function(res) {
            expect(res).to.be.empty;
            done();
        })
        .catch(function(err) {
            expect(err.message).to.include('ENOENT: no such file or directory,');
            done();
        })
})
it("should be able to find distinct names", () => {
    let sampleInput1 = [{time:"14:02:02", name:"Alice99",action:"Start"},
                        {time:"14:02:02", name:"Charlie",action:"Start"},
                        {time:"14:02:02", name:"Alice99",action:"End"}]
    let testRes = checkLogFile.distinctUsersInFile(sampleInput1);
    expect(testRes).to.be.an('array');
    expect(testRes.length).to.be.eq(2);
           
})

it("should be able to return empty array", () => {
    let sampleInput = []
    let testRes = checkLogFile.distinctUsersInFile(sampleInput)
    expect(testRes.length).to.be.eq(0);
           
})
it("should be able to find distinct names", () => {
    let sampleInput = [{time:"14:02:02", name:"Alice99",action:"Start"},
                        {time:"14:02:04", name:"Alice99",action:"Start"},
                        {time:"14:03:02", name:"Alice99",action:"End"},
                        {time:"14:04:02", name:"Alice99",action:"End"}]
    let testRes = checkLogFile.findTotalSessionTime(sampleInput)
    expect(testRes).to.be.eq(178);
           
})
it("should be able to return array of elements", () => {
    let sampleInput = '14:02:03 ALICE99 Start\r\n14:02:05 CHARLIE End\r\n14:02:34 ALICE99 End\r\n14:02:58 ALICE99 Start\r\n14:03:02 CHARLIE Start\r\n14:03:33 ALICE99 Start\r\n14:03:35 ALICE99 End\r\n14:03:37 CHARLIE End\r\n14:04:05 ALICE99 End\r\n14:04:23 ALICE99 End\r\n14:04:41 CHARLIE Start';
    let testRes = checkLogFile.prepareKeyValuePairOFFileData(sampleInput)
    expect(testRes.length).to.be.eq(11);
    expect(testRes).to.be.an('array');
    expect(testRes[0]).to.have.property('action');        
})
it("should be able to return required output format with name,number of sessions and session time", () => {
    let sampleInput = [{time:"14:02:02", name:"Alice99",action:"Start"},
                        {time:"14:02:04", name:"Alice99",action:"Start"},
                        {time:"14:03:02", name:"Alice99",action:"End"},
                        {time:"14:04:02", name:"Alice99",action:"End"}]
    let testRes = checkLogFile.prepareFinalOutput(sampleInput,"Alice99",[])
    expect(testRes.length).to.be.eq(1);
    expect(testRes).to.be.an('array');       
})
it("should be able to return required output format with name,number of sessions and session time but with 0 sessions", () => {
    let sampleInput = []
    let testRes = checkLogFile.prepareFinalOutput(sampleInput,"Alice99",[])
    expect(testRes[0]).to.be.eq('Alice99 0 0');
    expect(testRes).to.be.an('array');       
})
})