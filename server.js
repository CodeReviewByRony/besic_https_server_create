import { dbConnect } from "./dbConfig/dbConfig.js";
import { app } from "./src/app.js";
import { PORT } from "./src/constent.js";

// db connect function call
dbConnect();

// server connect function call
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server start on https://localhost:${PORT}`);
});
