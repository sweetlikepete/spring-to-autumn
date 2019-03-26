

import express from "express";

import data from "../../data";


const manifestRouter = function(){

    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    router.get("/manifest.json", async (req, res) => {

        const success = 200;

        res
        .status(success)
        .send(JSON.stringify({
            name: data.name,
            short_name: data.shortName,
            description: data.metadata.description,
            icons: [
                {
                    src: "/images/app-icons/128x128.png",
                    sizes: "128x128",
                    type: "image/png"
                },
                {
                    src: "/images/app-icons/192x192.png",
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: "/images/app-icons/384x384.png",
                    sizes: "384x384",
                    type: "image/png"
                },
                {
                    src: "/images/app-icons/512x512.png",
                    sizes: "512x512",
                    type: "image/png"
                }
            ],
            start_url: "/?utm_source=web_app_manifest",
            background_color: data.colors.background,
            display: "standalone",
            theme_color: data.colors.theme
        }))
        .end();

    });

    return router;

};

export default manifestRouter;
