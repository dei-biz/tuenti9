const fs = require("fs");
const data = fs.readFileSync("submitInput.txt").toString().split("\n");
const outFile = fs.WriteStream("submitOutput.txt");
const messages = Array.from(new Array(parseInt(data.shift())),(val,idx)=>({idx:idx + 1}));

const chart = ["1234567890","QWERTYUIOP","ASDFGHJKL;","ZXCVBNM,.-"];

const getPos = (letter) => {
    const pos = {h:0 , r:0}
    chart.forEach((row, i) => {
        if (row.indexOf(letter) != -1) {
            pos.h = row.indexOf(letter);
            pos.r = i;
        };
    });
    return pos;
}

messages.forEach((message) => {
    const key = data.shift();
    const text = data.shift().split("");
    const signature = text[text.length - 1];
    const encryptedSignaturePos = getPos(signature);
    const plainSignaturePos = getPos(key);
    const offset ={
        h: encryptedSignaturePos.h - plainSignaturePos.h,
        r: encryptedSignaturePos.r - plainSignaturePos.r
    };
    const msg = [];
    text.forEach(letter => {
        const position = getPos(letter);
        const newPosition = {
            h: (10 + position.h - offset.h) % 10,
            r: (4 + position.r - offset.r) % 4
        }
        msg.push(letter == " "?" " : chart[newPosition.r][newPosition.h])
    });
    message.data = msg.join("");
});
outFile.write(messages.map(m => `Case #${m.idx}: ${m.data}`).join("\n"));
outFile.close();