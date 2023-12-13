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

            function sliceTab(text) {
                text = text.replace(" ", "")
                if (text.startsWith(" ")) [
                    text = sliceTab(text)
                ]

                return text;
            }

            if (line.startsWith(" ")) {
                line = sliceTab(line)
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
                continue;
            }else if (line.startsWith("@print")) {
                line = line.replace("@v", "");
                line = line.split(" ");
                line = line.reverse()
                line.pop()
                const value = line.reverse().join(" ");

                code += `\n console.log(${value});`
                continue;
            }else if (line.startsWith("@end")) {
                code += `\n };`
                continue;
            }else if (line.startsWith("@for")) {
                line = line.replace("@for", "");
                line = line.split(" ");
                const name = line[1]
                line = line.reverse()
                line.pop()
                const value = line[0];

                code += `\n for (let ${name} of ${value}) {`;
                continue;
            }else if (line.startsWith("@if")) {
                line = line.replace("@if", "");
                line = line.split(" ");
                line = line.reverse()
                line.pop()
                const which = line.reverse().join(" ");

                code += `\n if (${which}) {`;
                continue;
            }else if (line.startsWith("@fn")) {
                line = line.replace("@fn", "");
                line = line.split(" ");
                line = line.reverse()
                line.pop()
                const func = line.reverse().join(" ");

                code += `\n function ${func} {`;
                continue;
            }else if (line.startsWith("@while")) {
                line = line.replace("@while", "");
                line = line.split(" ");
                line = line.reverse()
                line.pop()
                const which = line.reverse().join(" ");

                code += `\n while (${which}) {`;
                continue;
            }else if (line.startsWith("@elif")) {
                line = line.replace("@elif", "");
                line = line.split(" ");
                line = line.reverse()
                line.pop()
                const which = line.reverse().join(" ");

                code += `\n } else if (${which}) {`;
                continue;
            }else if (line.startsWith("@else")) {
                line = line.replace("@else", "");
                code += `\n } else {`;
                continue;
            }

            if (line.startsWith("@")) {
                code += `\n ${line.substring(1, line.length)};`
                continue;
            }

            code += `\n ${line}`;
        }

        code += `;\n /*BC-INJECT*/function range(n){let r=[],e=0;for(;r.push(e),!(++e>=n););return r}`
        return code;
    }

    // exe
    execute(js) {
        return new Function(`
// % BaseCompiler %
${js}
`)();
    }
}

const c = new BaseCompiler();

const { readFile } = require('node:fs');

const beautify = require('beautify');
 
readFile('./index.xjs', (err, data) => {
  if (err) throw err;
    const result = c.compile(data.toString())
    console.log(beautify(result, {format: 'js'}));
    c.execute(result)
}); 