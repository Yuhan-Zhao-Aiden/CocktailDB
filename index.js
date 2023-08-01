import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = 3000;


app.get("/", (req, res) => {

})

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})