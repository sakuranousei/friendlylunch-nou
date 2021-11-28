// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello world :o");

// const dreams = [];

// define variables that reference elements on our page
// const dreamsForm = document.forms[0];
// console.log(dreamsForm);
// console.log(document.forms);
// const dreamInput = dreamsForm.elements["dream"];
// console.log(dreamInput);
// const dreamsList = document.getElementById("dreams");
// const clearButton = document.querySelector("#clear-dreams");

//★② users
// const users = [];
// const usersList = document.getElementById("users");

// request the dreams from our app's sqlite database
// fetch("/getDreams", {})
//   .then(res => res.json())
//   .then(response => {
//     response.forEach(row => {
//       appendNewDream(row.dream);
//     });
//   });

// ★③ index request the Users from our app's sqlite database
fetch("/getUsers", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewUserRadio(row.user);
    });
  });


// a helper function that creates a list item for a given dream
// const appendNewDream = dream => {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
//   dreamsList.appendChild(newListItem);
// };


// ★④ index userラジオボタンの関数 a helper function that creates a list item for a given user
const appendNewUserRadio = user => {
  console.log(user);
  const parent = document.getElementById("usersArea");
  const div = document.createElement("div");
    div.className = "form-check my-4";
  const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "radio";
    input.name = "flexRadioDefault"
  const label = document.createElement("label");
    label.className = "form-check-label";
    label.innerText = user;
  parent.appendChild(div);
  div.append(input);
  div.append(label);
}


// listen for the form to be submitted and add a new dream when it is
// dreamsForm.onsubmit = event => {
//   // stop our form submission from refreshing the page
//   event.preventDefault();

//   const data = { dream: dreamInput.value };

//   fetch("/addDream", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: { "Content-Type": "application/json" }
//   })
//     .then(res => res.json())
//     .then(response => {
//       console.log(JSON.stringify(response));
//     });
//   // get dream value and add it to the list
//   dreams.push(dreamInput.value);
//   appendNewDream(dreamInput.value);

//   // reset form
//   dreamInput.value = "";
//   dreamInput.focus();
// };

// clearButton.addEventListener("click", event => {
//   fetch("/clearDreams", {})
//     .then(res => res.json())
//     .then(response => {
//       console.log("cleared dreams");
//     });
//   dreamsList.innerHTML = "";
// });


//index 日付
//今日の日付データを変数に格納
//変数は"today"とする
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const week = today.getDay();
const day = today.getDate();
const hour = today.getHours();
const minute = today.getMinutes();
//年・月・日・曜日を取得
const week_ja = new Array("日", "月", "火", "水", "木", "金", "土");
//年・月・日・曜日を書き出す
document.getElementById("todayDate").textContent =
  year + "年" + month + "月" + day + "日 " + week_ja[week] + "曜日";
document.getElementById("todayTime").textContent = hour + "時" + minute + "分";




// edit Usersの入力・編集
// function userAddEdit() {
//   const users = document.getElementsByName("users")
//   for (let i = 0; i < users.length; i++) {
//     console.log(users[i].value);
//   }
//   document.getElementById("insertUsers").setAttribute("value",users);
// }




  
//   fetch("/addUsers", {
//   method: "POST",
//   body: name[i].value,
//   body: JSON.stringify(data),
//   headers: { "Content-Type": "application/json" }
// })
//   .then(res => res.json())
//   .then(response => {
//     console.log(JSON.stringify(response));
//   });
  




