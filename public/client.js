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



fetch("/getMenusData", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendMenuAccordionHeader(row.id, row.store, row.menu, row.price);
    });
  });


//indexページ Usersデータ反映 ラジオボタン a helper function that creates a list item for a given user
const appendUserRadio = (id, user) => {
  // console.log(id, user);
  const parent = document.getElementById("usersArea");
  const div = document.createElement("div");
    div.className = "form-check mb-4";
  const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "radio";
    input.name = "selectUserName"
    input.value = user;
  const label = document.createElement("label");
    label.className = "form-check-label";
    label.innerText = user;
  parent.appendChild(div);
  div.append(input);
  div.append(label);
}


// indexページ Menusデータ反映 アコーディオン　ヘッダー
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
    input.value = store + "," + menu + "," + price;
    // input.value = [`${store}`, `${menu}`, `${price}`];
    input.name = "selectStoreMenuPrice"
    input.id = "flexCheckDefault";
  const label_menu = document.createElement("label");
    label_menu.className = "form-check-label";
    label_menu.for = "flexCheckDefault";
    label_menu.innerText = menu;
  const label_price = document.createElement("label");
    label_price.className = "form-check-label px-3";
    label_price.for = "flexCheckChecked";
    label_price.innerText = price;
  const renderedStore = document.getElementsByClassName(`${store}`);             
  if (renderedStore.length == 0) {
    parent_menuArea.appendChild(div1_accordionItem);
    div1_accordionItem.append(h2_accordionHeader);
      h2_accordionHeader.append(button_store);
    div1_accordionItem.append(div2_accordionCollapse);
      div2_accordionCollapse.append(div3_accordionBody);
          div3_accordionBody.append(div4_formCheck);
          div4_formCheck.append(input);
          div4_formCheck.append(label_menu);
          div4_formCheck.append(label_price);
  } else {
    renderedStore[0].append(div3_accordionBody);
          div3_accordionBody.append(div4_formCheck);
          div4_formCheck.append(input);
          div4_formCheck.append(label_menu);
          div4_formCheck.append(label_price);
    }          
  };


// const ordersUpdateBtn = document.getElementById("ordersUpdateBtn");
// ordersUpdateBtn.addEventListener("click", () => {
//   const input_selectUserName = document.querySelectorAll("input[name=selectUserName]:checked");
//     if(0 < input_selectUserName.length) {
//       for (const checked_data of input_selectUserName) {
//         console.log(checked_data.value);
//       }
//     };
//   const input_selectStoreMenuPrice = document.querySelectorAll("input[name=selectStoreMenuPrice]:checked");
//     if(0 < input_selectStoreMenuPrice.length) {
//       for (const checked_data of input_selectStoreMenuPrice) {
//         console.log(checked_data.value);
//       }
//     };
//   const input_selectChangeValue = document.querySelectorAll("input[name=selectChangeValue]");
//   if(0 < input_selectChangeValue.length) {
//     for (const checked_data of input_selectChangeValue) {
//       console.log(checked_data.value);
//     }
//   };
// });


//ordersテーブルへのupdate情報の集計
const ordersUpdateBtn = document.getElementById("ordersUpdateBtn");
ordersUpdateBtn.addEventListener("click", () => {
  const checked_selectUserName = document.querySelectorAll("input[name=selectUserName]:checked");
  const checked_selectStoreMenuPrice = document.querySelectorAll("input[name=selectStoreMenuPrice]:checked");
  const selectChangeValue = document.querySelectorAll("input[name=selectChangeValue]");
  const ordersAddArray = [];
  
  if (checked_selectUserName.length == 0 || checked_selectStoreMenuPrice.length == 0) {
    document.getElementById("errormessage").textContent = "エラー：ユーザー名・お店・メニューを選択してください。";
  };

  if(checked_selectStoreMenuPrice.length == 1 && checked_selectUserName.length == 1) {
    document.getElementById("errormessage").textContent = "";
    for (const data_selectUserName of checked_selectUserName) {
      ordersAddArray.push(data_selectUserName.value);
    }
    for (const data_selectStoreMenuPrice of checked_selectStoreMenuPrice) {
      const ary = data_selectStoreMenuPrice.value.split(',');
      for (let i = 0; i < ary.length; i++) {
        ordersAddArray.push(ary[i]);
      }
    }
    for (const data_selectChangeValue of selectChangeValue) {
      ordersAddArray.push(data_selectChangeValue.value);
    }
  };

  if(checked_selectStoreMenuPrice.length > 1 && checked_selectUserName.length == 1) {
    document.getElementById("errormessage").textContent = "";
    console.log(checked_selectStoreMenuPrice.length); //2
    
    for (let i = 0; i < checked_selectStoreMenuPrice.length; i++) { //2
      
      
      ordersAddArray.push(checked_selectUserName[0].value);
      
      for (const data_selectStoreMenuPrice of checked_selectStoreMenuPrice) {
      const ary = data_selectStoreMenuPrice.value.split(',');
        console.log(ary.length); //3
        console.log(ary); //(3) ['さくら弁当', '普通', '450'] (3) ['さくら弁当', 'おかずのみ', '350']
        for (let f = 0; f < ary.length; f++) {
          ordersAddArray.push(ary[f]);
        }
      }
      
      ordersAddArray.push(selectChangeValue[0].value); 
      
    }
  };
  


  console.log(ordersAddArray);
});




