

import express from "express";

import manifestRouter from "./routers/manifest";
import pageRouter from "./routers/page";
import staticRouter from "./routers/static";


const app = express();
const port = 8080;

app.use(manifestRouter());
app.use(staticRouter());
app.use(pageRouter());


// eslint-disable-next-line no-process-env
const PORT = process.env.PORT || port;

app.listen(PORT, () => {
    console.log(`App listening on port ${ PORT }`);
    console.log("Press Ctrl+C to quit.");
});
