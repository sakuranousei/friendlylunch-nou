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
    db.run(
      "CREATE TABLE Orders (id INTEGER PRIMARY KEY AUTOINCREMENT,date TEXT, user TEXT, store TEXT, menu TEXT, price INTEGER, change INTEGER)"
    );
    console.log("New table Orders created!"); 
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
    db.serialize(() => {
      db.run(
        'INSERT INTO Orders (user, store, menu, price) VALUES ("山田　太郎", さくら弁当", "普通", "500"), ("山田　太郎", "さくら弁当", "おかずのみ", "280")'
      );
    });
    
  
  } else {
    console.log('Database "Users" ready to go!');
    console.log('Database "Menus" ready to go!');
    console.log('Database "Orders" ready to go!');
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
    db.each("SELECT * from Orders", (err, row) => {
      if (row) {
        console.log(`record: ${row.id}, ${row.date}, ${row.user}, ${row.store}, ${row.menu}, ${row.price}, ${row.change}`);
      }
    });
  }
});


// ログインページへの遷移
app.get("/", (req, res) => {
  res.render(`${__dirname}/views/login.ejs`);
});


// インデックスページへの遷移
app.get("/index", (request, response) => {
  response.render(`${__dirname}/views/index.ejs`);
});


// 実績ページへの遷移
app.get("/records", (req, res) => {
  res.render(`${__dirname}/views/records.ejs`);
});


// 編集ページへの遷移
app.get("/edit", (request, response) => {
  response.render(`${__dirname}/views/edit.ejs`);
});


//サーバーサイドからフロントエンドへUserデータを送付
app.get("/getUsersData", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//サーバーサイドからフロントエンドへMenusデータを送付
app.get("/getMenusData", (request, response) => {
  db.all("SELECT * from Menus", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//サーバーサイドからフロントエンドへOrdersデータを送付
app.get("/getOrdersData", (request, response) => {
  db.all("SELECT * from Orders", (err, rows) => {
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


//Ordersテーブルの削除
app.get("/orders/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Orders WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  return res.render(`${__dirname}/views/records.ejs`);
});


//Ordersテーブルの追加・更新
app.get("/orders/update/:ordersUpdateArray", (req, res) => {
  const ordersUpdateArray = req.params.ordersUpdateArray;
  // console.log(JSON.stringify(ordersUpdateArray)); 
  // console.log(ordersUpdateArray[0]); //山
  // console.log(JSON.stringify(ordersUpdateArray)); //"山田　太郎,さくら弁当,普通,450,"
  const array = ordersUpdateArray.split(',');
  // console.log(array); //[ '山田　太郎', 'さくら弁当', '普通', '450', '100' ]
  // console.log(array[0]); //山田　太郎
  // console.log(array);
  // console.log(array[0]); //山
  for (let h = 0; h < (array.length/6); h++) {
    const obj_h = {};
    // const date = new Date(); //日時取得
    // date.setTime(date.getTime() + 1000*60*60*9); //日本時間に変換。UTC協定世界時+9
    // obj_h.date = date;
    for (let i = 6*h; i < 6 + 6*h; i++) {
      if (i==0 || i % 6 == 0) {
        const date = array[i];
        obj_h.date = date;
      }
      if (i % 6 == 1) {
        const user = array[i];
        obj_h.user = user;
      }
      if (i % 6 == 2) {
        const store = array[i];
        obj_h.store = store;
      }
      if (i % 6 == 3) {
        const menu = array[i];
        obj_h.menu = menu;
      }
      if (i % 6 == 4) {
        const price = array[i];
        obj_h.price = price;
      }
      if (i % 6 == 5) {
        const change = array[i];
        obj_h.change = change;
      }
    }
  console.log("--------------------");
  console.log(ordersUpdateArray); //山形　新庄,さくら弁当,普通,450,
  console.log(array.length); //10
  console.log(obj_h);
  console.log(obj_h.user);
  console.log(obj_h.menu);
  const stmt = db.prepare("INSERT OR REPLACE INTO Orders (date, user, store, menu, price, change) VALUES (?, ?, ?, ?, ?, ?)", obj_h.date, obj_h.user, obj_h.store, obj_h.menu, obj_h.price, obj_h.change);
    stmt.run();
    stmt.finalize();
  }
  return res.render(`${__dirname}/views/index.ejs`);
});


//listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

