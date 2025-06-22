const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models");
const config = require("./config");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/api", apiRoutes); 


sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(config.PORT, () =>
      console.log(`Server running on port ${config.PORT}`)
    );
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });