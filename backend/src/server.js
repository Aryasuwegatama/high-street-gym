import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import classRouter from "./routes/classes.js";
import blogRouter from "./routes/blog.js";
import XMLRouter from "./routes/XMLImport.js";

const port = 5000;
const app = express();

app.use(express.json())

app.use(cors({
    // origin: ['http://localhost:5000'],
    origin: true,
}))

// enable file upload
app.use(fileUpload({
    // limit file import up to 50 mb
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// import router
app.use("/classes", classRouter)
app.use("/blogs", blogRouter)
app.use("/xml-upload", XMLRouter)


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
