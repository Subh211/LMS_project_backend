import app from "./app.js";
import connectToDb from "./config/db.js";

const port = process.env.PORT;



app.listen(port, async ()=>{
    console.log(`listening on http://localhost:${port}`)
    await connectToDb();
})