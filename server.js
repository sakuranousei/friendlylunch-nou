const express = require("express");
const app = express();
const fs = require("fs");

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const flash = require('connect-flash');


//init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);


//日付 サーバーサイドでは日本時間にならないので日本時間に変換
const today = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
const year = today.getFullYear();
const month = ("0" + (today.getMonth() + 1)).slice(-2); //２桁で取得する。04等
const week = today.getDay();
const day = ("0" + today.getDate()).slice(-2);　
const hour = ("0" + (today.getHours())).slice(-2);
const minute = ("0" + today.getMinutes()).slice(-2);
//年・月・日・曜日を取得
const week_ja = new Array("日", "月", "火", "水", "木", "金", "土");
const thisDay = year + "-" + month + "-" + day;
console.log(thisDay);


//数値かどうか判定する関数。数値であればtrueを返す
const isNumber = (n) => {
  const v = n - 0; //"10" - 0;=> 10, "a" - 0;=> NaN, 数値でなければNaNを返す
  if ( v || v === 0 ) {
    return true;
  }
  return false;
};


// middleware
app.use(express.static("public"));

// middleware related to passport
app.use(session({ secret: 'keyboard cat' }));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//テンプレートエンジン
app.set('views', './views');
app.set('view engine', 'ejs');

// dotenv
require('dotenv').config();


// passport
passport.use(
  'users-local',
  new LocalStrategy(
  (username, password, done) => {
    if (username !== process.env.KEY1){
      // Error
      return done(null, false, { message : 'ユーザーネームに誤りがあります' });
    } else if(password !== process.env.KEY2) {
      // Error
      return done(null, false, { message : 'パスワードに誤りがあります。' });
    } else{
      // Success and return user information.
      return done(null, { username: username, password: password});
    }
  }));

//passport セッション管理 passportがユーザー情報をシリアライズすると呼び出される
passport.serializeUser((user, done) => {
  console.log('Serialize ...');
  done(null, user);
});

//passportがユーザー情報をデシリアライズすると呼び出される。
passport.deserializeUser((user, done) => {
  console.log('Deserialize ...');
  done(null, user);
});

//passport ログインしていないと（isAuthenticatedがないと）そのページに遷移できない
function isAuthenticated(req, res, next) {
  const auth = req.isAuthenticated();
  if (auth !== true) {
    // res.send('ログインしてください');
    res.redirect("/");
  } else {
    const auth = req.isAuthenticated();
    console.log(auth);
    const userName = process.env.KEY1;
    if(userName == null) {
      // res.send('ログインしてください');
      res.redirect("/edit");
    } else {
      return next();
    }};
  } 


//if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT)"
    );
    console.log("New table Users created!"); 
    db.run(
      "CREATE TABLE Menus (id INTEGER PRIMARY KEY AUTOINCREMENT, store TEXT, menu TEXT, price INTEGER, tellnum INTEGER)"
    );
    console.log("New table Menus created!");
    db.run(
      "CREATE TABLE Orders (id INTEGER PRIMARY KEY AUTOINCREMENT,date TEXT, user TEXT, store TEXT, menu TEXT, price INTEGER, change INTEGER, ordered_check TEXT, changed_check TEXT)"
    );
    console.log("New table Orders created!"); 
    // insert default table
    db.run(
      "CREATE TABLE Tellnums (id INTEGER PRIMARY KEY AUTOINCREMENT, store TEXT, tellnums INTEGER)"
    );
    console.log("New table Tellnums created!")
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
        'INSERT INTO Orders (user, store, menu, price) VALUES ("山田　太郎", "さくら弁当", "普通", "500"), ("山田　太郎", "さくら弁当", "おかずのみ", "280")'
      );
    });
    db.serialize(() => {
      db.run(
        'INSERT INTO Tellnums (store, tellnums) VALUES ("さくら弁当", "4854318")'
      );
    });
  } else {
    console.log('Database "Users" ready to go!');
    console.log('Database "Menus" ready to go!');
    console.log('Database "Orders" ready to go!');
    console.log('Database "Tellnums" ready to go!');
    // db.each("SELECT * from Users", (err, row) => {
    //   if (row) {
    //     console.log(`record: ${row.user}`);
    //   }
    // });
  }
});


// ログインページへの遷移
app.get("/", (req, res) => {
  res.render(`${__dirname}/views/login.ejs`);
});

//ログイン認証
app.post('/users/authentication',
  passport.authenticate('users-local',
    {
      failureRedirect : '/users/failure',
      successRedirect : '/users/success',
      failureFlash: true
    }
  )
);

//ログイン失敗
app.get('/users/failure', (req, res) => {
  console.log(req.session);
  res.render(`${__dirname}/views/login.ejs`, { message: req.flash( "error" ), login_people: req.user});
});

//申請側 ログイン成功
app.get('/users/success', (req, res) => {
  console.log(req.session);
  res.render(`${__dirname}/views/index.ejs`);
});

//ログアウト
// app.post('/logout', (req, res) => {
//   req.session.passport.user = undefined;
//   res.render(`${__dirname}/views/login.ejs`);
// });

// インデックスページへの遷移
app.get("/index", isAuthenticated, (req, res) => {
  res.render(`${__dirname}/views/index.ejs`, { login_people: req.user });
});


// 編集ページへの遷移
app.get("/edit", isAuthenticated, (req, res) => {
  res.render(`${__dirname}/views/edit.ejs`, { login_people: req.user });
});


// 実績ページへの遷移
app.get("/records", isAuthenticated, (req, res) => {
  res.render(`${__dirname}/views/records.ejs`, { login_people: req.user });
});


//サーバーサイドからフロントエンドへUserデータを送付
app.get("/getUsersData", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//サーバーサイドからフロントエンドへMenusデータを送付
app.get("/getMenusData", (request, response) => {
  db.all("SELECT * from Menus ORDER by store ASC, price DESC, menu ASC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//サーバーサイドからフロントエンドへOrdersデータを送付
app.get("/getOrdersData", (request, response) => {
  db.all("SELECT * from Orders ORDER by date DESC, id DESC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// ★サーバーサイドからフロントエンドへOrdersデータ20行ごとのデータ送付
// app.get("/getOrdersData/:i", (request, response) => {
//   console.log(request.params.i);
//   const i = request.params.i;
//   if (i == 1) {
//     db.all("SELECT * from Orders ORDER by date DESC, id DESC LIMIT 20 ", (err, rows) => {
//     response.send(JSON.stringify(rows));
//     });
//   } else if (i > 1) {
//     // db.all(`SELECT * from Orders ORDER by date DESC, id DESC OFFSET ${20 * (i - 1)} LIMIT 20`, (err, rows) => {
//     db.all("SELECT * from Orders ORDER by date DESC, id DESC LIMIT 20 OFFSET 20", (err, rows) => {
//     response.send(JSON.stringify(rows));
//     });
//   }
// });

//サーバーサイドからフロントエンドへTellnumsデータを送付
app.get("/getTellnumsData", (request, response) => {
  db.all("SELECT * from Tellnums", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


// 本日の注文者とメニュー id date user store menu price change
app.get("/getTodaysOrders", (request, response) => {
  db.all("SELECT * from Orders WHERE date = '"+thisDay+"' ORDER by store ASC, user ASC, price DESC", (err, rows) => {    
    response.send(JSON.stringify(rows));
  });
});

// 本日のお釣り user change
app.get("/getTodaysChanges", (request, response) => {
  db.all("SELECT id, user, change, changed_check from Orders WHERE date = '"+thisDay+"' and change is not '' ORDER by user ASC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// 本日の店別・合計金額  store sum
app.get("/getTodaysStoresTotalAmount", (request, response) => {
  db.all("SELECT store, sum(price) as sum from Orders WHERE date = '"+thisDay+"' GROUP by store ORDER by store ASC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


//★ Ordersのidの行数を取得
// app.get("/getOrdersIdNumbers", (req, res) => {
//   db.all("SELECT COUNT (id) from Orders", (err, idNunbers) => {
//     res.send(JSON.stringify(idNunbers));
//   });
// });


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
  // return res.render(`${__dirname}/views/edit.ejs`);
  res.redirect("/edit");
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
  // return res.render(`${__dirname}/views/edit.ejs`);
  res.redirect("/edit");
});


//Tellnumsテーブルの追加・更新 Upsert処理
app.post("/tellnums/addEdit", (req, res) => {
  // console.log(req.body);
  const getTellId = req.body.tellId;
  const getTellStoreName = req.body.tellStoreName;
  const getTellNum = req.body.tellNum;
  for(let i = 0; i < getTellId.length; i++) {
    console.log(getTellId[i], getTellStoreName[i], getTellNum[i]);
    const stmt = db.prepare("INSERT OR REPLACE INTO Tellnums (id, store, tellnums) VALUES (?, ?, ?)", getTellId[i], getTellStoreName[i], getTellNum[i]);
    stmt.run();
    stmt.finalize();
  }
  // return res.render(`${__dirname}/views/edit.ejs`);
  res.redirect("/edit");
});


//チェック　Ordersテーブルのordered_checkとchanged_checkの追加・更新 Update処理
app.post("/orders/check", (req, res) => {
  const ordered_checkId = req.body.ordered_check; //単数選択101,複数選択[ '101', '103', '102' ]
  const changed_checkId = req.body.changed_check;
  if (ordered_checkId == undefined) {
    console.log("'ordered_check' is undefined");
  } else if (isNumber(ordered_checkId)) { //数値だった場合  
    const selectId = ordered_checkId;
    console.log(selectId);
    const stmt = db.prepare(`UPDATE Orders set ordered_check = 1 where id = ${selectId}`);
    stmt.run();
    stmt.finalize();
  } else {
    for (let i = 0; i < ordered_checkId.length; i++) {
      const selectId = ordered_checkId[i];
      console.log(selectId);
      const stmt = db.prepare(`UPDATE Orders set ordered_check = 1 where id = ${selectId}`);
      stmt.run();
      stmt.finalize();
    }
  }
  if (changed_checkId == undefined) {
    console.log("'changed_check' is undefined");
  } else if (isNumber(changed_checkId)) {
    const selectId = changed_checkId;
    console.log(selectId);
    const stmt = db.prepare(`UPDATE Orders set changed_check = 1 where id = ${selectId}`);
    stmt.run();
    stmt.finalize();
  } else {
    for (let i = 0; i < changed_checkId.length; i++) {
      const selectId = changed_checkId[i];
      console.log(selectId);
      const stmt = db.prepare(`UPDATE Orders set changed_check = 1 where id = ${selectId}`);
      stmt.run();
      stmt.finalize();
    }
  }
  // return res.render(`${__dirname}/views/index.ejs`);
  res.redirect("/index");
});

//チェックのリセット
app.get("/orders/check/reset", (req, res) => {
  db.all("SELECT * from Orders WHERE date = '"+thisDay+"'", (err, rows) => {
    for (let i = 0; i < JSON.stringify(rows.length); i++) {
      console.log(i);
      console.log(JSON.stringify(rows[i].id));
      const allTodayId = JSON.stringify(rows[i].id);
      const stmt = db.prepare(`UPDATE Orders set ordered_check = "", changed_check = "" where id = ${allTodayId}`);
      stmt.run();
      stmt.finalize();
    }
  });
  // return res.render(`${__dirname}/views/index.ejs`);
  res.redirect("/index");
});


//Usersテーブルの削除
app.get("/users/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Users WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  // return res.render(`${__dirname}/views/edit.ejs`);
  res.redirect("/edit");
});


//Menusテーブルの削除
app.get("/menus/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Menus WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  // return res.render(`${__dirname}/views/edit.ejs`);
  res.redirect("/edit");
});


//Ordersテーブルの削除
app.get("/orders/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Orders WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  // return res.render(`${__dirname}/views/records.ejs`);
  res.redirect("/records");
});


//Tellnumsテーブルの削除
app.get("/tellnums/delete/:deleteId", (req, res) => {
  const deleteId = req.params.deleteId;
  console.log(deleteId);
  const stmt = db.prepare("DELETE FROM Tellnums WHERE id = (?)");
  stmt.run(deleteId);
  stmt.finalize();
  // return res.render(`${__dirname}/views/edit.ejs`);
  res.redirect("/edit");
});


//Ordersテーブルの追加・更新
app.get("/orders/update/:ordersUpdateArray", (req, res) => {
  const ordersUpdateArray = req.params.ordersUpdateArray;
  const array = ordersUpdateArray.split(',');
  for (let h = 0; h < (array.length/6); h++) {
    const obj_h = {};
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
      if (i == 5) {
        const change = array[i];
        obj_h.change = change;
      }
      if (i > 5 && i % 6 == 5) { //2つ目以降のメニューにお釣りを入れない
        const change_none = '';
        obj_h.change = change_none;
      }
    }
  const stmt = db.prepare("INSERT OR REPLACE INTO Orders (date, user, store, menu, price, change) VALUES (?, ?, ?, ?, ?, ?)", obj_h.date, obj_h.user, obj_h.store, obj_h.menu, obj_h.price, obj_h.change);
    stmt.run();
    stmt.finalize();
  }
  // return res.render(`${__dirname}/views/index.ejs`);
  res.redirect("/index");
});


//listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

