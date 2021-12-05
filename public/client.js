console.log("hello world");


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



// index request the Users from our app's sqlite database
//indexページでUsersデータを呼び出し
fetch("/getUsersData", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendUserRadio(row.id, row.user);
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
      appendMenuAccordionHeader(row.id, row.store, row.menu, row.price);
    });
    // response.forEach(row => {
    //   appendMenuAccordionBody(row.id, row.store, row.menu, row.price);
    // }); 
  });

// fetch("/getMenusData", {})
//   .then(res => res.json())
//   .then(response => {
//     response.forEach(row => {
//       appendNewMenuAccordionBody(row.id, row.store, row.menu, row.price);
//     });
//   });


//indexページ Usersデータ反映 ラジオボタン a helper function that creates a list item for a given user
const appendUserRadio = (id, user) => {
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
// const appendMenuRadio = (id, store, menu, price) => {
//   // console.log(id, user);
//   const parent = document.getElementById("menusArea");
//   const div = document.createElement("div");
//     div.className = "form-check mb-4";
//   const input = document.createElement("input");
//     input.className = "form-check-input";
//     input.type = "checkbox";
//     input.name = "flexRadioDefault"
//   const label_store = document.createElement("label");
//     label_store.className = "form-check-label";
//     label_store.innerText = store;
//   const label_menu = document.createElement("label");
//     label_menu.className = "form-check-label";
//     label_menu.innerText = menu;
//   const label_price = document.createElement("label");
//     label_price.className = "form-check-label";
//     label_price.innerText = price;
//   parent.appendChild(div);
//   div.append(input);
//   div.append(label_store);
//   div.append(label_menu);
//   div.append(label_price);
// }


// 大元　indexページ Menusデータ反映 アコーディオン　ヘッダー
// const appendMenuAccordionHeader = (id, store, menu, price) => {
//   const parent = document.getElementById("menusArea");
//   const div_1 = document.createElement("div");
//     div_1.className = "accordion-item";
//   const h2 = document.createElement("h2");
//     h2.className = "accordion-header";
//     h2.id = `heading_${id}`;
//   const button = document.createElement("button");
//     button.className = "accordion-button collapsed";
//     button.type = "button";
//     button.setAttribute("data-bs-toggle", "collapse");
//     button.setAttribute("data-bs-target", `#collapse_${id}`);
//     button.setAttribute("aria-expanded", "false");
//     button.setAttribute("aria-controls", `collapse_${id}`);
//     button.innerText = store;
//   const div_2 = document.createElement("div");
//     div_2.id = `collapse_${id}`;
//     div_2.className = "accordion-collapse collapse";
//     div_2.setAttribute("aria-labelledby", `heading_${id}`);
//   // const body = appendNewMenuAccordionBody(id, store, menu, price);
//   const div_3 = document.createElement("div");
//     div_3.className = `accordion-body ${store}`;
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
  
//   console.log(store);
//   console.log(button.innerText);
  
//   parent.appendChild(div_1);
//     div_1.append(h2);
//       h2.append(button);
//     div_1.append(div_2);
//       div_2.append(div_3);
//         div_3.append(div_4);
//           div_4.append(input);
//           div_4.append(label_1);
//           div_4.append(label_2);
// };


// 試し　　indexページ Menusデータ反映 アコーディオン　ヘッダー
const appendMenuAccordionHeader = (id, store, menu, price) => {
  const parent_menuArea = document.getElementById("menusArea");
  const div1_accordionItem = document.createElement("div");
    div1_accordionItem.className = "accordion-item";
  const h2_accordionHeader = document.createElement("h2");
    h2_accordionHeader.className = "accordion-header";
    h2_accordionHeader.id = `heading_${id}`;
  const button_store = document.createElement("button");
    button_store.className = "accordion-button collapsed";
    button_store.type = "button";
    button_store.setAttribute("data-bs-toggle", "collapse");
    button_store.setAttribute("data-bs-target", `#collapse_${id}`);
    button_store.setAttribute("aria-expanded", "false");
    button_store.setAttribute("aria-controls", `collapse_${id}`);
    button_store.innerText = store;
  const div2_accordionCollapse = document.createElement("div");
    div2_accordionCollapse.id = `collapse_${id}`;
    div2_accordionCollapse.className = `accordion-collapse collapse ${store}`;
    div2_accordionCollapse.setAttribute("aria-labelledby", `heading_${id}`);
  const div3_accordionBody = document.createElement("div");
    div3_accordionBody.className = `accordion-body ${store}`;
  const div4_formCheck = document.createElement("div");
    div4_formCheck.className = "form-check";
  const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.value = "";
    input.id = "flexCheckDefault";
  const label_menu = document.createElement("label");
    label_menu.className = "form-check-label";
    label_menu.for = "flexCheckDefault";
    label_menu.innerText = menu;
  const label_price = document.createElement("label");
    label_price.className = "form-check-label px-3";
    label_price.for = "flexCheckChecked";
    label_price.innerText = price;
  
  console.log(store);
  console.log(button_store.innerText);
  const renderedStore = document.getElementsClassName(`${store}`) 
  console.log(renderedStore);
  
  if (store == renderedStore) {
    renderedStore.append(div3_accordionBody);
          div3_accordionBody.append(div4_formCheck);
          div4_formCheck.append(input);
          div4_formCheck.append(label_menu);
          div4_formCheck.append(label_price);
    
  } else  {
    parent_menuArea.appendChild(div1_accordionItem);
    div1_accordionItem.append(h2_accordionHeader);
      h2_accordionHeader.append(button_store);
    div1_accordionItem.append(div2_accordionCollapse);
      div2_accordionCollapse.append(div3_accordionBody);
          div3_accordionBody.append(div4_formCheck);
          div4_formCheck.append(input);
          div4_formCheck.append(label_menu);
          div4_formCheck.append(label_price);
  }
    
  
  
};

//　試し　　indexページ Menusデータ反映 アコーディオン　ボディ
// const appendMenuAccordionBody = (id, store, menu, price) => {
//   const parent = document.getElementById("menusArea");
//   const div_1 = document.createElement("div");
//     div_1.className = "accordion-item";
//   const h2 = document.createElement("h2");
//     h2.className = "accordion-header";
//     h2.id = `heading_${id}`;
//   const button = document.createElement("button");
//     button.className = "accordion-button collapsed";
//     button.type = "button";
//     button.setAttribute("data-bs-toggle", "collapse");
//     button.setAttribute("data-bs-target", `#collapse_${id}`);
//     button.setAttribute("aria-expanded", "false");
//     button.setAttribute("aria-controls", `collapse_${id}`);
//     button.innerText = store;
//   const div_2 = document.createElement("div");
//     div_2.id = `collapse_${id}`;
//     div_2.className = "accordion-collapse collapse";
//     div_2.setAttribute("aria-labelledby", `heading_${id}`);
//   // const body = appendNewMenuAccordionBody(id, store, menu, price);
//   const div_3 = document.createElement("div");
//     div_3.className = `accordion-body ${store}`;
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
  
//   console.log(store);
//   console.log(button.innerText);
  
//         div_3.append(div_4);
//           div_4.append(input);
//           div_4.append(label_1);
//           div_4.append(label_2);
// };




// アコーディオンボディ
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


