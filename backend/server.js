require("dotenv").config();

const express = require("express");

const assistantRoutes = require("./routes/assistantRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());


// ==========================================
// CORS
// ==========================================

app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();

});


// ==========================================
// ROOT TEST
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message:
            "Smart Campus AI Backend is Working!"
    });

});


// ==========================================
// API TEST
// ==========================================

app.get("/api/test", (req, res) => {

    res.status(200).json({
        success: true,
        message:
            "API connection successful!"
    });

});


// ==========================================
// AI ASSISTANT
// ==========================================

app.use(
    "/api/assistant",
    assistantRoutes
);


// ==========================================
// AI PREDICTION
// ==========================================

app.post(
    "/api/predict",
    async (req, res) => {

        try {

            console.log(
                "AI Prediction Request:",
                req.body
            );


            const response =
                await fetch(
                    "https://smart-campus-ai-model.onrender.com/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                req.body
                            )
                    }
                );


            console.log(
                "AI Model Status:",
                response.status
            );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            /*
             * If AI model returns an HTTP error,
             * read it as text instead of trying
             * to parse it as JSON.
             */

            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "AI Model HTTP Error:",
                    response.status,
                    errorText
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "AI Model returned an HTTP error.",

                    status:
                        response.status,

                    details:
                        errorText.substring(
                            0,
                            500
                        )

                });

            }


            /*
             * Make sure the AI model actually
             * returned JSON.
             */

            if (
                !contentType
                    .toLowerCase()
                    .includes("application/json")
            ) {

                const responseText =
                    await response.text();


                console.error(
                    "AI Model returned non-JSON:",
                    responseText.substring(
                        0,
                        500
                    )
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "AI Model returned a non-JSON response.",

                    details:
                        responseText.substring(
                            0,
                            500
                        )

                });

            }


            /*
             * Now safely parse JSON.
             */

            const data =
                await response.json();


            console.log(
                "AI Model Response:",
                data
            );


            return res.json(
                data
            );

        }

        catch (error) {

            console.error(
                "AI Prediction Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to connect to AI Model.",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// 404 DEBUG ROUTE
// ==========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found",

            requested_url:
                req.originalUrl,

            method:
                req.method

        });

    }
);


// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );


        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Smart Campus AI server running on port ${PORT}`
        );

    }
);