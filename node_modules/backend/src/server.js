import express from "express";
import cors from "cors";

const port = 5000;
const app = express();

app.use(express.json())

app.use(cors({
    origin: true,
}))

// import router

// Catch errors raised by endpoints and respond with JSON error object
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    })
})


app.listen(port, () => console.log(`Backend Server Started at http://localhost:${port}` ))
