require("dotenv").config();

const express = require("express");
const cors = require("cors");

const assistantRoutes = require("./routes/assistantRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// AI CAMPUS ASSISTANT ROUTE
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
    () => {

        console.log(

            `Smart Campus AI server running on http://localhost:${PORT}`

        );

    }
);