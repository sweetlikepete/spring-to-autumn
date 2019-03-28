

import fs from "fs-extra";
import path from "path";

import express from "express";
import nunjucks from "nunjucks";

import defaultData from "../../data";


nunjucks.configure(path.join(process.cwd(), "src/app"), { autoescape: true });


const getPage = async function(name, req, res, data = {}){

    try{

        const page = await import(`../../app/pages/${ name }/index.html`);
        const rawAssets = await fs.readFile(path.join(process.cwd(), "build/assets.json"), "utf-8");
        const assets = JSON.parse(rawAssets);

        return nunjucks.renderString(page.default, {
            ...defaultData,
            ...{
                assets,
                req
            },
            ...data
        });

    }catch(err){

        return `
            <html>
                <head></head>
                <body>
                    <h1>${ err.name }</h1>
                    <p>${ err.stack.split("\n").join("<br />") }</p>
                </body>
            </html>
        `;

    }

};

const pageRouter = function(){

    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    router.get("/", async (req, res) => {

        const page = await getPage("index", req, res);

        const success = 200;

        res
        .status(success)
        .send(page)
        .end();

    });

    router.get("/themes/:themeId/", async (req, res) => {

        const themes = defaultData.themes.slice(0);
        const [theme] = themes.filter((th) => th.id === req.params.themeId);
        const episodes = defaultData.episodes.slice(0);

        theme.episodes = theme.episodes.map((episodeId) => {

            if(typeof episodeId === "string"){

                const [episode] = episodes.filter((ep) => ep.id === episodeId);

                return episode;

            }

            return episodeId;

        });

        const page = await getPage("theme", req, res, { theme });

        const success = 200;

        res
        .status(success)
        .send(page)
        .end();

    });

    router.get("/episodes/:episodeId/", async (req, res) => {

        const episodes = defaultData.episodes.slice(0);
        const [episode] = episodes.filter((ep) => ep.id === req.params.episodeId);
        const themes = defaultData.themes.slice(0);

        episode.themes = episode.themes.map((themeId) => {

            if(typeof themeId === "string"){

                const [theme] = themes.filter((th) => th.id === themeId);

                return theme;

            }

            return themeId;

        });

        const page = await getPage("episode", req, res, { episode });

        const success = 200;

        res
        .status(success)
        .send(page)
        .end();

    });

    return router;

};

export default pageRouter;
