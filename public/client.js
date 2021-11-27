// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello world :o");

const dreams = [];

// define variables that reference elements on our page
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements["dream"];
const dreamsList = document.getElementById("dreams");
const clearButton = document.querySelector('#clear-dreams');

// request the dreams from our app's sqlite database
fetch("/getDreams", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewDream(row.dream);
    });
  });

// a helper function that creates a list item for a given dream
const appendNewDream = dream => {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
};

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const data = { dream: dreamInput.value };

  fetch("/addDream", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });
  // get dream value and add it to the list
  dreams.push(dreamInput.value);
  appendNewDream(dreamInput.value);

  // reset form
  dreamInput.value = "";
  dreamInput.focus();
};

clearButton.addEventListener('click', event => {
  fetch("/clearDreams", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared dreams");
    });
  dreamsList.innerHTML = "";
});


//日付
//今日の日付データを変数に格納
//変数は"today"とする
const today=new Date(); 
//年・月・日・曜日を取得
const year = today.getFullYear();
const month = today.getMonth()+1;
const week = today.getDay();
const day = today.getDate();
const week_ja= new Array("日","月","火","水","木","金","土");
//年・月・日・曜日を書き出す
document.getElementById("todayDate").textContent=year+"年"+month+"月"+day+"日 "+week_ja[week]+"曜日");
// document.write(year+"年"+month+"月"+day+"日 "+week_ja[week]+"曜日");

//時刻データを取得して変数に格納する
//変数は"time"とする
const time= new Date();
//時・分・秒を取得
const hour = time.getHours();
const minute = time.getMinutes();
const second = time.getSeconds();
document.write(hour+"時",+minute+"分"+second+"秒");

