const fs = require("fs");
const data = fs.readFileSync("submitInput.txt").toString().split("\n");
const outFile = fs.WriteStream("submitOutput.txt");
const problems = Array.from(new Array(parseInt(data.shift())),(val,idx)=>({idx:idx + 1}));
const unfoldMap = {
    T: (params)=> {
        return [{
            w: params.w,
            h: params.h * 2,
            x: params.x,
            y: params.h - params.y - 1
        }, {
            w: params.w,
            h: params.h * 2,
            x: params.x,
            y: params.h + params.y
        }]
    },
    B: (params)=> {
        return [{
            w: params.w,
            h: params.h * 2,
            x: params.x,
            y: params.y,
        }, {
            w: params.w,
            h: params.h * 2,
            x: params.x,
            y: params.h * 2 - params.y - 1,
        }]
    },
    L: (params)=> {
        return [{
            w: params.w * 2,
            h: params.h,
            x: params.w + params.x,
            y: params.y,
        }, {
            w: params.w * 2,
            h: params.h,
            x: params.w - params.x - 1,
            y: params.y,
        }]
    },
    R:(params)=> {
        return [{
            w: params.w * 2,
            h: params.h,
            x: params.x,
            y: params.y,
        }, {
            w: params.w * 2,
            h: params.h,
            x: params.w * 2 - params.x -1,
            y: params.y,
        }]
    },
}
let output = [];

problems.forEach((problem) => {
    const [w, h, folds, punches] = data.shift().split(" ").map(Number);
    problem.folds = data.splice(0,folds);
    problem.punches = data.splice(0,punches).map(punch => {
        const [x, y] = punch.split(" ").map(Number);
        return {w: w, h: h, x: x, y: y};
    });
    problem.folds.forEach((fold) => {
        let newPunches = [];
        problem.punches.forEach(punch =>{
            newPunches = newPunches.concat(unfoldMap[fold](punch)) 
        });
        problem.punches = newPunches;

    });
    output.push(`Case #${problem.idx}:`);
    output = output.concat(problem.punches
        .sort((a, b) => (a.x - b.x || a.y - b.y))
        .map(p => `${p.x} ${p.y}`)
    );
});
outFile.write(output.join("\n"));
outFile.close();