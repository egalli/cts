const fs = require("fs");
const fg = require("fast-glob");

const prefix = "src/";

(async () => {
  if (!fs.existsSync(prefix)) {
    throw new Error ("Must be run from cts/");
  }

  const files = await fg.async(prefix + "**/*");

  const listing = {};
  for (const entry of files) {
    const file = (typeof entry === "string") ? entry : entry.path;
    const f = file.substring(prefix.length);
    if (f.endsWith(".ts")) {
      const testPath = f.substring(0, f.length - 3);
      listing[testPath] = {};
    } else if (f.endsWith("/README.txt")) {
      const dirPath = f.substring(0, f.length - 10);
      const description = fs.readFileSync(file, "utf8").trim();
      listing[dirPath] = {
        description,
      };
    }
  }

  fs.writeFile("listing.json", JSON.stringify(listing, undefined, 2),
      (err) => { if (err) { throw err; } });
})();