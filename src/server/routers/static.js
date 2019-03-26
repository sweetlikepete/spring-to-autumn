

import path from "path";

import express from "express";


const staticRouter = function(){

    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    router.use("/images", express.static("src/app/images"));

    router.use("/fonts", express.static("src/app/fonts"));

    router.use("/pages", express.static("src/app/pages"));

    router.use("/static", express.static("build/client"));

    router.use("/favicon.ico", (req, res) => res.sendFile(path.join(process.cwd(), "src/app/images/favicon.ico")));

    router.use("/robots.txt", (req, res) => res.sendFile(path.join(process.cwd(), "src/app/robots.txt")));

    return router;

};

export default staticRouter;
