/* eslint-disable import/namespace */
/* eslint-disable no-console */

/*
  This script generates mock data for local development.
  This way you don'thave to point to an actual API,
  but you can enjoy realistic, but randomized data,
  and rapid page loads due to a local,static data.
*/

import { generate, extend } from "json-schema-faker";
import { schema } from "./mockDataSchema";
import fs from "fs";

extend("faker", () => require("faker"));
const json = JSON.stringify(generate(schema));

fs.writeFile("./src/api/db.json", json, function (err) {
  if (err) {
    return console.log(err);
  } else {
    console.log("Mock data generated");
  }
});
