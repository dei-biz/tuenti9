const fs = require("fs");
const data = fs.readFileSync("submitInput.txt").toString().split("\n");
const outFile = fs.WriteStream("submitOutput.txt");
const problems = Array.from(new Array(parseInt(data.shift())),(val,idx)=>({idx:idx + 1}));
const least = "_";
const maxSize = 100;

const pad = (stringToPad, paddingChar, length) => stringToPad + paddingChar.repeat(length-stringToPad.length) ;

const comparator = (item1, item2, position) => {
    if (position == 0) return true;
    if (item2.slice(position, position + 1) === least) return true;
    if (item1.slice(0,position) == item2.slice(0,position)) return true
    return false;
}

const removeLinks = (tree, times) => {
    const singles = [].concat(...Object.values(tree).filter(a => a.length == 1));
    if (singles.length == Object.entries(tree).length || times ==0) return tree;
    Object.entries(tree).forEach(([key, value]) => {
        if (value.length > 1) {
            tree[key] = value.filter(el => !singles.includes(el))
        }
    })
    return removeLinks(tree, times -1);
}

const longestChain = (chain, begin) => {
    let element = begin;
    const chained = [];
    removeLinks(chain, maxSize);
    while(element){
        chained.push(element);
        element = chain[element]?chain[element][0]:null;
    }
    return chained;
}

problems.forEach((problem) => {
    const input = data.splice(0,data.shift());
    const maxLength = Math.max.apply(Math, input.map(el => el.length));
    const allLetters = [... new Set(input.join(""))];
    const chain = {};
    const compare = input.map((item, i) => [pad(item, least, maxLength), pad(i>0? input[i-1]:least, least, maxLength)]);
    compare.forEach(words => {
        const [word, previousWord] = words;
        word.split("").forEach((letter, i) =>{
            const lowerLetter = previousWord[i];
            if (comparator(word, previousWord, i) && lowerLetter != letter && lowerLetter != least){
                chain[lowerLetter] = chain[lowerLetter] || [];
                if (!chain[lowerLetter].includes(letter)){
                    chain[lowerLetter].push(letter);
                }
            }
        });
    });
    const smallest = allLetters.filter(x => ![].concat(...Object.values(chain)).includes(x))[0];
    const order = longestChain(chain, smallest);
    problem.solution = order.length === allLetters.length ? order.join(" ") : "AMBIGUOUS"
});
outFile.write(problems.map(m => `Case #${m.idx}: ${m.solution}`).join("\n"));
outFile.end();