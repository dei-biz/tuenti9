const fs = require("fs");
const inputData = fs.readFileSync("submitInput.txt");
const outputData = fs.createWriteStream('submitOutput.txt');
const data = inputData.toString().split("\n");
outputData.write(
	data.filter(item => item.indexOf(" ") != -1)
	.map(item => item.split(" "))
	.map(d => Math.ceil(d[0]/2) + Math.ceil(d[1]/2))
	.map((d, i)=>(`Case #${i + 1}: ${d}`))
	.join("\n")
);
outputData.end();