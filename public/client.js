console.log("hello world");


// index request the Users from our app's sqlite database
fetch("/getUsersData", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewUserRadio(row.id, row.user);
    });
  });


//index userラジオボタンの関数 a helper function that creates a list item for a given user
const appendNewUserRadio = (id, user) => {
  // console.log(id, user);
  const parent = document.getElementById("usersArea");
  const div = document.createElement("div");
    div.className = "form-check mb-4";
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


//日付
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth()　+ 1;
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
