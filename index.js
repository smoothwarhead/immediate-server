const express = require("express");
const app = express();
let PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.send("Hello world");
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});