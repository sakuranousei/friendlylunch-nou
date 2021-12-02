const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


//テンプレートエンジン
app.set('views', './views');
app.set('view engine', 'ejs');


//init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);


//if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Dreams (id INTEGER PRIMARY KEY AUTOINCREMENT, dream TEXT)"
    );
    console.log("New table Dreams created!"); 
    db.run(
      "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT)"
    );
    console.log("New table Users created!");  
    // insert default table
    db.serialize(() => {
      db.run(
        'INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")'
      );
    });
    db.serialize(() => {
      db.run(
        'INSERT INTO Users (user) VALUES ("ユーザー１"), ("ユーザー２"), ("ユーザー３")'
      );
    });
  } else {
    console.log('Database "Dreams" ready to go!');
    console.log('Database "Users" ready to go!');
    db.each("SELECT * from Dreams", (err, row) => {
      if (row) {
        console.log(`record: ${row.dream}`);
      }
    });
    db.each("SELECT * from Users", (err, row) => {
      if (row) {
        console.log(`record: ${row.user}`);
      }
    });
  }
});


//http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render(`${__dirname}/views/index.ejs`);
});


//endpoint to get all the Names in the database
app.get("/getUsersData", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


//editでのUsersの反映
app.get("/edit/getUsersData", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


app.get("/edit", (request, response) => {
  // response.send("edit");
  response.render(`${__dirname}/views/edit.ejs`);
});


// Usersテーブルの追加・更新 Upsert処理
app.post("/users/addEdit", (req, res) => {
  const getId = req.body.userId;
  const getUser = req.body.userName;
  for(let i = 0; i < getUser.length; i++) {
    // console.log(getId[i], getUser[i]);
    const stmt = db.prepare("INSERT OR REPLACE INTO Users (id, user) VALUES (?, ?)", getId[i], getUser[i]);
    stmt.run();
    stmt.finalize();
  }
  return res.render(`${__dirname}/views/edit.ejs`);
});


app.get("/users/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Users WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  return res.render(`${__dirname}/views/edit.ejs`);
});
  

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

