const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(express.json({ extended: false }));

app.use("/api/v1/users", require("./routes/auth"));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
