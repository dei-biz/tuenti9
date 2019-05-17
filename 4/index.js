const fs = require("fs");
const data = fs.readFileSync("submitInput.txt").toString().split("\n");
const outFile = fs.WriteStream("submitOutput.txt");
const problems = Array.from(new Array(parseInt(data.shift())),(val,idx)=>({idx:idx + 1}));

const gcd = (x, y) => {
    const _gcd = (a, b) => (b === 0 ? a : _gcd(b, a % b)),
        abs = Math.abs;
    return _gcd(abs(x), abs(y));
}
const lcm = (x, y) => x === 0 || y === 0 ? 0 : Math.abs(Math.floor(x / gcd(x, y)) * y);
const lcmG = (arr) => arr.reduce(lcm, 1);

const count = (mult, arr) => {
    const withDups = arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});
    let people = 0;
    let candies = 0;
    Object.keys(withDups).forEach((k) => {
        withDups[k] = mult * withDups[k]/k;
        people += withDups[k];
        candies += parseInt(k) * withDups[k];
    });
    return {people: people, candies: candies};
}

problems.forEach((problem) => {
    data.shift();
    const values = data.shift().split(" ").map(Number).sort().reverse();
    problem.result = count(lcmG(values),  values);
    problem.divider = gcd(problem.result.people, problem.result.candies);
});
outFile.write(problems.map(p => `Case #${p.idx}: ${p.result.candies / p.divider}/${p.result.people / p.divider}`).join("\n"))
outFile.close();