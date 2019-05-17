const fs = require("fs");

const inputData = fs.readFileSync("/Users/david/Documents/code/tuenti/2/submitInput.txt");
const outputData = fs.createWriteStream('/Users/david/Documents/code/tuenti/2/submitOutput.txt');
const data = inputData.toString().split("\n");
const problems = Array.from({length: parseInt(data.shift())}, (obj,i) => ({idx:i+1}));

const count = (data, to, currentCount) => {
	to.forEach( planet => {
		if (planet === "New Earth" ){
			currentCount++;
		}else{
			currentCount =  count(data, data[planet], currentCount);
		}
	});
	return currentCount;
};


problems.forEach( problem =>{
	const destinations  = data.splice(0, parseInt(data.shift()))
		.reduce((obj, item)=>{
			const parts = item.split(/[:,]/);
			obj[parts.shift()] = parts;
			return obj;
		}, {});
	problem.result = count(destinations,destinations["Galactica"], 0);
});

outputData.write(
	problems.map(problem => `Case #${problem.idx}: ${problem.result}`).join("\n")
);
outputData.end();