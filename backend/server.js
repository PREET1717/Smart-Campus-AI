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
// MANUAL CORS
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
// AI CAMPUS ASSISTANT
// ==========================================

app.use(
    "/api/assistant",
    assistantRoutes
);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "Smart Campus AI Backend is Working!"

    });

});


// ==========================================
// TEST API
// ==========================================

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message:
            "API connection successful!"

    });

});


// ==========================================
// AI COMPLAINT PREDICTION
// ==========================================

app.post("/api/predict", async (req, res) => {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/predict",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            req.body
                        )

                }
            );


        const data =
            await response.json();


        res.json(data);

    }

    catch (error) {

        console.error(
            "AI Prediction Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "AI Model server is not running"

        });

    }

});


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