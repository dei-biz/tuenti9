const fs = require("fs");
const util = require("util");
const data = fs.readFileSync("testInput.txt").toString().split("\n");
const outFile = fs.WriteStream("testOutput.txt");
const problems = Array.from(new Array(parseInt(data.shift())),(val,idx)=>({idx:idx + 1}));

const encoder = new util.TextEncoder();

const calculateHash = (inputTest) => {
    const hash = new Int8Array(Array.from(new Array(16), () => 0));
    const textBytes = encoder.encode(inputTest);
    textBytes.forEach((b, i) => {
        hash[i % 16] = hash[i % 16] + b;
    });
    return hash;
};

calculateHashFromBytes = (inputBytes) => {
    const hash = new Int8Array(Array.from(new Array(16), () => 0));
    inputBytes.forEach((b, i) => {
        hash[i % 16] = hash[i % 16] + b;
    });
    return hash;
};

const leftPad = (dataToPad, width) => {
    return new Int8Array(Array.from(new Array(dataToPad.length + width), (val, idx) => idx<width?0:dataToPad[idx - width]));
};

const getPayload = (original, altered, payloadSize) => {
    const originalHash = calculateHash(original);
    const offset = altered.indexOf('---') + 3;

    const hashInitialOffset = offset % 16;

    const beginMsg = altered.slice(0, offset);
    const beginMsgBytes = encoder.encode(beginMsg)
    const endMsg = altered.slice(offset, altered.length);
    const endMsgBytes = encoder.encode(endMsg);
    const paddedEndMsgBytes = leftPad(endMsgBytes, payloadSize);
    const paddedMsg = new Int8Array(beginMsgBytes.length + paddedEndMsgBytes.length);
        paddedMsg.set(beginMsgBytes);
        paddedMsg.set(paddedEndMsgBytes, offset);
    const differences = new Int8Array(16);
    const payLoad = [];
    //for (msgOffset = 0; msgOffset<payloadSize;msgOffset++){
        "03W000000S0e0000Xzzwue08BzQz0Z0DzzzzzzRzzzzzez_zz".split("").forEach((code, i) => {
            paddedMsg.set(encoder.encode(code), offset + i);
            const emptyPayloadedHash = calculateHashFromBytes(paddedMsg);
            originalHash.forEach((byte, i) => {
                differences[i] = byte - emptyPayloadedHash[i];
            });
            console.log(differences.join("_"));
            
        });
    
        /*for (addValue = 48; addValue<123; addValue++){
            paddedMsg.set([addValue], offset + msgOffset);
            const emptyPayloadedHash = calculateHashFromBytes(paddedMsg);
            originalHash.forEach((byte, i) => {
                differences[i] = byte - emptyPayloadedHash[i];
            });
            console.log(differences.join("_"));
            if (differences[(hashInitialOffset + msgOffset) % 16 ] == 0){
                payLoad.push(addValue);
                break;
            }
        }*/
    //}
    return payLoad;
};

const getSum =(byte, steps) => {

}

const getAllowableDifferences = (differences) => {
    differences.forEach(byte => getSum(byte));
}

problems.forEach((problem) => {
    const original = data.splice(0,data.shift()).join("");
    const altered = data.splice(0,data.shift()).join("");
    
    console.log(getPayload(original, altered, 49));

    const payload = "03W000000S0e0000Xzzwue08BzQz0Z0DzzzzzzRzzzzzez_zz";
    const payloadHash = calculateHash(payload);
    
    /*paddedMsg.set(beginMsgBytes);
    paddedMsg.set(paddedEndMsgBytes, offset);
    //paddedMsg.set("1", beginMsgBytes.length);

    paddedMsg.set(payloadHash, offset);
    
    console.log(originalHash, emptyPayloadedHash);
    */
    
    
    
    problem.solution = "TODO";
});
outFile.write(problems.map(m => `Case #${m.idx}: ${m.solution}`).join("\n"));
outFile.end();