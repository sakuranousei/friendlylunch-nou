// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//テンプレートエンジン
app.set('views', './views');
app.set('view engine', 'ejs');

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// ① if ./.data/sqlite.db does not exist, create it, otherwise print records to console
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

// ★①Usersデータベースの作成
// db.serialize(() => {
//   if (!exists) {
//     db.run(
//       "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
//     );
//     console.log("New table Users created!");

//     // insert default dreams
//     db.serialize(() => {
//       db.run(
//         'INSERT INTO Names (name) VALUES ("名前１"), ("名前２"), ("名前３")'
//       );
//     });
//   } else {
//     console.log('Database "Names" ready to go!');
//     db.each("SELECT * from Names", (err, row) => {
//       if (row) {
//         console.log(`record: ${row.name}`);
//       }
//     });
//   }
// });



// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render(`${__dirname}/views/index.ejs`);
});

// endpoint to get all the dreams in the database
// app.get("/getDreams", (request, response) => {
//   db.all("SELECT * from Dreams", (err, rows) => {
//     response.send(JSON.stringify(rows));
//   });
// });


// ★⑤endpoint to get all the Names in the database
app.get("/getUsers", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//★editでのUsersの反映
app.get("/edit/getUsers", (request, response) => {
  db.all("SELECT * from Users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


app.get("/edit", (request, response) => {
  // response.send("edit");
  response.render(`${__dirname}/views/edit.ejs`);
});

// endpoint to add a dream to the database
// app.post("/addDream", (request, response) => {
//   console.log(`add to dreams ${request.body}`);

//   // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
//   if (!process.env.DISALLOW_WRITE) {
//     const cleansedDream = cleanseString(request.body.dream);
//     db.run(`INSERT INTO Dreams (dream) VALUES (?)`, cleansedDream, error => {
//       if (error) {
//         response.send({ message: "error!" });
//       } else {
//         response.send({ message: "success" });
//       }
//     });
//   }
// });

//★Usersテーブルに追加
// app.post("/addUsers", (request, response) => {
//   console.log(`add to Users ${request.body}`);
//   if (!process.env.DISALLOW_WRITE) {
//   const cleansedUsers = cleanseString(request.body.user);
//   db.run(`INSERT INTO Users (user) VALUES (?)`, cleansedUsers, error => {
//     if (error) {
//       response.send({ message: "error!" });
//     } else {
//       response.send({ message: "success" });
//     }
//   });
//   }
// });

app.post("/users/addEdit", (request, response) => {
  // console.log(request.body.users.length);
  request.body.users.forEach(user => {
    console.log(user);
    db.run(`INSERT INTO Users (user) VALUES (?)`, user, error => {
      if (error) {
        return console.log(error.message);
        // return response.redirect('/');
      } else {
        // return console.log("add or edit success");
        // return response.redirect('/');
        return response.render(`${__dirname}/views/index.ejs`);
      }
    })
  })
});
  





// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});