import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "myToDo",
  password: "Venkat@2107",
  port: 5432,
});
db.connect();

let items = [];

function todaysDate() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  return currentDate;
}


app.get("/", async (req, res) => {
  let date = await todaysDate();
  try {
    const result = await db.query("SELECT * FROM list");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      date: date,
      listItems: items,
    });
  } catch (error) { console.log(error); }
});

app.post("/add", async(req, res) => {
  const newItem = req.body.newItem;

  try {
     await db.query("INSERT INTO LIST (title, date) VALUES ($1, $2)", [newItem, todaysDate()]);
     res.redirect('/');
  }catch(error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const updatedText = req.body.updatedItemTitle;
  const updatedItemId = req.body.updatedItemId;

  try {
    const result = await db.query("UPDATE list SET title = $1 WHERE id = $2", [updatedText, updatedItemId]);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async(req, res) => { 
  const itemToBeRemoved = req.body.deleteItemId;
  try {
    await db.query('DELETE FROM list WHERE id = $1', [itemToBeRemoved]);
    res.redirect('/');
  }catch(error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
