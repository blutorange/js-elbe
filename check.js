const fs = require("fs");

const data = fs.readFileSync("./package.json", "utf-8");
const package = JSON.parse(data);
for (let key in package.dependencies) {
    if (package.dependencies[key].indexOf("git") >= 0) {
        throw new Error("Dependencies contain a git repository: " + key);
    }
}