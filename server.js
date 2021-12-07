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
      "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT)"
    );
    console.log("New table Users created!"); 
    db.run(
      "CREATE TABLE Menus (id INTEGER PRIMARY KEY AUTOINCREMENT, store TEXT, menu TEXT, price INTEGER)"
    );
    console.log("New table Menus created!");  
    // insert default table
    db.serialize(() => {
      db.run(
        'INSERT INTO Users (user) VALUES ("ユーザー１"), ("ユーザー２"), ("ユーザー３")'
      );
    });
    db.serialize(() => {
      db.run(
        'INSERT INTO Menus (store, menu, price) VALUES ("さくら弁当", "普通", "500"), ("さくら弁当", "おかずのみ", "280")'
      );
    });
  } else {
    console.log('Database "Users" ready to go!');
    console.log('Database "Menus" ready to go!');
    db.each("SELECT * from Users", (err, row) => {
      if (row) {
        console.log(`record: ${row.user}`);
      }
    });
    db.each("SELECT * from Menus", (err, row) => {
      if (row) {
        console.log(`record: ${row.store}, ${row.menu}, ${row.price}`);
      }
    });
  }
});


//http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render(`${__dirname}/views/index.ejs`);
});

app.get("/edit", (request, response) => {
  response.render(`${__dirname}/views/edit.ejs`);
});

//フロントエンドへサーバーサイドからUserデータを送付
app.get("/getUsersData", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//フロントエンドへサーバーサイドからMenusデータを送付
app.get("/getMenusData", (request, response) => {
  db.all("SELECT * from Menus", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


//Usersテーブルの追加・更新 Upsert処理
app.post("/users/addEdit", (req, res) => {
  const getUserId = req.body.userId;
  const getUserName = req.body.userName;
  for(let i = 0; i < getUserId.length; i++) {
    // console.log(getUserId[i], getUserName[i]);
    const stmt = db.prepare("INSERT OR REPLACE INTO Users (id, user) VALUES (?, ?)", getUserId[i], getUserName[i]);
    stmt.run();
    stmt.finalize();
  }
  return res.render(`${__dirname}/views/edit.ejs`);
});


//Menusテーブルの追加・更新 Upsert処理
app.post("/menus/addEdit", (req, res) => {
  const getMenuId = req.body.menuId;
  const getMenuStore = req.body.menuStore;
  const getMenuName = req.body.menuName;
  const getMenuPrice = req.body.menuPrice;
  for(let i = 0; i < getMenuId.length; i++) {
    console.log(getMenuId[i], getMenuStore[i], getMenuName[i], getMenuPrice[i]);
    const stmt = db.prepare("INSERT OR REPLACE INTO Menus (id, store, menu, price) VALUES (?, ?, ?, ?)", getMenuId[i], getMenuStore[i], getMenuName[i], getMenuPrice[i]);
    stmt.run();
    stmt.finalize();
  }
  return res.render(`${__dirname}/views/edit.ejs`);
});


//Usersテーブルの削除
app.get("/users/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Users WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  return res.render(`${__dirname}/views/edit.ejs`);
});


//Menusテーブルの削除
app.get("/menus/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Menus WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  return res.render(`${__dirname}/views/edit.ejs`);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

