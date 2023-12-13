class BaseCompiler {
    constructor() {}

    // to JS
    compile(code) {
        const lines = code.split("\n")
        const vars = {
            NaN: NaN
        };
        code = ""

        for (let line of lines) {
            if (line.startsWith("#")) {
                continue;
            }

            if (line.startsWith("@v")) {
                line = line.replace("@v", "");
                line = line.split(" ");
                const name = line[1];
                line = line.reverse();
                line.pop()
                line.pop()
                const value = line.reverse().join(" ")
                vars[name] = 0;

                code += `\n var ${name} = ${value};`
            }else if (line.startsWith("@print")) {
                line = line.replace("@v", "");
                line = line.split(" ");
                line = line.reverse()
                line.pop()
                const value = line.reverse().join(" ");

                code += `\n console.log(${value});`
            }
        }

        return code;
    }

    // exe
    execute(js) {
        return new Function(`
(() => {
// % BaseCompiler %
${js}
// $ BaseCompiler %
})()
`)();
    }
}

const c = new BaseCompiler();

const { readFile } = require('node:fs');

readFile('./index.xjs', (err, data) => {
  if (err) throw err;
    const result = c.compile(data.toString())
    console.log(result);
    c.execute(result)
}); 