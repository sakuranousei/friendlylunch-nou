console.log("hello world");


// index request the Users from our app's sqlite database
//indexページでUsersデータを呼び出し
fetch("/getUsersData", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewUserRadio(row.id, row.user);
    });
  });


//indexページ Menusデータを呼び出し
// fetch("/getMenusData", {})
//   .then(res => res.json())
//   .then(response => {
//     response.forEach(row => {
//       appendNewMenuRadio(row.id, row.store, row.menu, row.price);
//     });
//   });

fetch("/getMenusData", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewMenuAccordionHeader(row.id, row.store, row.menu, row.price);
    });
  });

// fetch("/getMenusData", {})
//   .then(res => res.json())
//   .then(response => {
//     response.forEach(row => {
//       appendNewMenuAccordionBody(row.id, row.store, row.menu, row.price);
//     });
//   });


//indexページ Usersデータ反映 ラジオボタン a helper function that creates a list item for a given user
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


//indexページ Menusデータ反映 ラジオボタン a helper function that creates a list item for a given user
const appendNewMenuRadio = (id, store, menu, price) => {
  // console.log(id, user);
  const parent = document.getElementById("menusArea");
  const div = document.createElement("div");
    div.className = "form-check mb-4";
  const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.name = "flexRadioDefault"
  const label_store = document.createElement("label");
    label_store.className = "form-check-label";
    label_store.innerText = store;
  const label_menu = document.createElement("label");
    label_menu.className = "form-check-label";
    label_menu.innerText = menu;
  const label_price = document.createElement("label");
    label_price.className = "form-check-label";
    label_price.innerText = price;
  parent.appendChild(div);
  div.append(input);
  div.append(label_store);
  div.append(label_menu);
  div.append(label_price);
}


// indexページ Menusデータ反映 アコーディオン　ヘッダー
const appendNewMenuAccordionHeader = (id, store, menu, price) => {
  const parent = document.getElementById("menusArea");
  const div_1 = document.createElement("div");
    div_1.className = "accordion-item";
  const h2 = document.createElement("h2");
    h2.className = "accordion-header";
    h2.id = `heading_${id}`;
  const button = document.createElement("button");
    button.className = "accordion-button collapsed";
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse_${id}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse_${id}`);
    button.innerText = store;
  const div_2 = document.createElement("div");
    div_2.id = `collapse_${id}`;
    div_2.className = "accordion-collapse collapse";
    div_2.setAttribute("aria-labelledby", `heading_${id}`);
  // const body = appendNewMenuAccordionBody(id, store, menu, price);
  const div_3 = document.createElement("div");
    div_3.className = `accordion-body ${store}`;
  const div_4 = document.createElement("div");
    div_4.className = "form-check";
  const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.value = "";
    input.id = "flexCheckDefault";
  const label_1 = document.createElement("label");
    label_1.className = "form-check-label";
    label_1.for = "flexCheckDefault";
    label_1.innerText = menu;
  const label_2 = document.createElement("label");
    label_2.className = "form-check-label px-3";
    label_2.for = "flexCheckChecked";
    label_2.innerText = price;
  
  if (store !== button.innneText) {
      parent.appendChild(div_1);
      div_1.append(h2);
        h2.append(button);
      div_1.append(div_2);
        div_2.append(div_3);
          div_3.append(div_4);
            div_4.append(input);
            div_4.append(label_1);
            div_4.append(label_2);
      } if (store ) {
          div_3.append(div_4);
            div_4.append(input);
            div_4.append(label_1);
            div_4.append(label_2);
      };
};


// ★アコーディオンボディ
// const appendNewMenuAccordionBody = (id, store, menu, price) => {
//   const storeName = document.getElementsByClassName("accordion-button");
//   const div_4 = document.createElement("div");
//     div_4.className = "form-check";
//   const input = document.createElement("input");
//     input.className = "form-check-input";
//     input.type = "checkbox";
//     input.value = "";
//     input.id = "flexCheckDefault";
//   const label_1 = document.createElement("label");
//     label_1.className = "form-check-label";
//     label_1.for = "flexCheckDefault";
//     label_1.innerText = menu;
//   const label_2 = document.createElement("label");
//     label_2.className = "form-check-label px-3";
//     label_2.for = "flexCheckChecked";
//     label_2.innerText = price;
//   if (store = storeName.innnerText) {
//     const setpoint = 
    
//   }
// };












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
