console.log("hello world");


//indexページでUsersデータを呼び出し
async function fetchGetUsersData () {
  fetch("/getUsersData", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendUserRadio(row.id, row.user);
      });
    });  
};


//indexページでmenusデータを呼び出し
async function fetchGetMenusData () {
  fetch("/getMenusData", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendMenuAccordionHeader(row.id, row.store, row.menu, row.price);
      });
    });
};


//indexページでOrdersデータの呼び出し 当日の集計用
async function fetchGetTodaysOrders () {
  fetch("/getTodaysOrders", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendTodaysOrders(row.id, row.store, row.user, row.menu, row.price, row.ordered_check);
      });
    });

  fetch("/getTodaysChanges", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendTodaysChanges(row.id, row.user, row.change, row.changed_check);
      });
    });

  fetch("/getTodaysStoresTotalAmount", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendTodaysStoresTotalAmount(row.store, row.sum);
      });
    });
};


//indexページでOrdersから注文済みuserの呼び出し
async function fetchOrderedUsers () {
  fetch("/getTodaysOrders", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendOrderedUserTransform(row.user);
      });
    });
};


//indexページでUsersから当面注文不要のuserの呼び出し
async function fetchUnnecessaryUsers () {
  fetch("/getUnnecessaryUsers", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendUnnecessaryUserTransform(row.user);
      });
    });
};


//indexページでTellnumsデータの呼び出し
async function fetchGetTellnumsData () {
  fetch("/getTellnumsData", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendTellnums(row.store, row.tellnumsText);
      });
    });
};


fetchGetUsersData().then(fetchGetMenusData()).then(fetchGetTodaysOrders()).then(fetchOrderedUsers()).then(fetchUnnecessaryUsers()).then(fetchGetTellnumsData());


//enter押しでsubmitしないようにする。
document.onkeypress = submit_cancel;
function submit_cancel(){
    if( window.event.keyCode == 13 ){
        return false;
    }
};


//日付　クライアントサイドでは自動的に日本時間になっているため日本時間に変更する必要なし。
const today = new Date();
const year = today.getFullYear();
const month = ("0" + (today.getMonth()+1)).slice(-2); //２桁で取得する。04等
const week = today.getDay();
const day = ("0" + today.getDate()).slice(-2);　
const hour = ("0" + today.getHours()).slice(-2);
const minute = ("0" + today.getMinutes()).slice(-2);
//年・月・日・曜日を取得
const week_ja = new Array("日", "月", "火", "水", "木", "金", "土");
//年・月・日・曜日を書き出す
document.getElementById("todayDate").textContent =　year + "年" + month + "月" + day + "日 " + week_ja[week] + "曜日";
document.getElementById("todayTime").textContent = hour + "時" + minute + "分";
document.getElementById("todayDate2").textContent =　"本日" + month + "月" + day + "日 " + "の当番用";
const thisDay = year + "-" + month + "-" + day;
console.log(thisDay);


//indexページ Usersデータ反映 チェックボックス
const appendUserRadio = (id, user) => {
  // console.log(id, user);
  const parent = document.getElementById("usersArea");
  const div = document.createElement("div");
    div.className = "form-check mx-3 mb-4 d-flex align-items-center";
  const input = document.createElement("input");
    input.className = "form-check-input selectUserName";
    input.type = "checkbox";
    input.name = "selectUserName"
    input.value = user;
  const label = document.createElement("label");
    label.className = "form-check-label userLabel mx-4";
    label.innerText = user;
    label.name = "userLabel";
  const noOrderBadge = document.createElement("input");
    noOrderBadge.className = "selectUserBadge border-0 bg-dark rounded text-white text-center";
    noOrderBadge.style = "width:50px;"
    noOrderBadge.type = "button";
    noOrderBadge.name = "selectUserBadge";
    noOrderBadge.onclick = () => this.noOrder(user);
    noOrderBadge.style = "cursor: pointer";
    noOrderBadge.value = "注文なし"
  parent.appendChild(div);
  div.append(input);
  div.append(label);
  div.append(noOrderBadge);
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
    input.value = store　+ "," + menu + "," + price;
    input.name = "selectStoreMenuPrice"
    input.id = "flexCheckDefault";
  const label_menu = document.createElement("label");
    label_menu.className = "form-check-label";
    label_menu.for = "flexCheckDefault";
    label_menu.innerText = menu;
  const label_price = document.createElement("label");
    label_price.className = "form-check-label px-3";
    label_price.for = "flexCheckChecked";
    label_price.innerText =  `${price}円`;
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


//注文決定btn 　ordersテーブルのupdate情報をサーバーに送付
const ordersUpdateBtn = document.getElementById("ordersUpdateBtn");
ordersUpdateBtn.addEventListener("click", () => {
  const checked_selectUserName = document.querySelectorAll("input[name=selectUserName]:checked");
  const checked_selectStoreMenuPrice = document.querySelectorAll("input[name=selectStoreMenuPrice]:checked");
  const selectChangeValue = document.querySelectorAll("input[name=selectChangeValue]");
  const ordersUpdateArray = [];  
  //ユーザー:0 or メニュー:0のとき どっちか一方が0のとき
  if (checked_selectUserName.length == 0 || checked_selectStoreMenuPrice.length == 0) {
    document.getElementById("errormessage").textContent = "エラー：ユーザー名とメニューを選択してください。";
  };
  //ユーザー：1以上 & メニュー：1以上のとき
  if(checked_selectStoreMenuPrice.length >= 1 && checked_selectUserName.length >= 1) {
    document.getElementById("errormessage").textContent = "";
    for (let j = 0; j < checked_selectUserName.length; j++) { //選択されたuserごとにループ、秋田のみ
      for (let i = 0; i < checked_selectStoreMenuPrice.length; i++) { //選択したメニューの数でループ、中華のみ
          ordersUpdateArray.push(thisDay);
          ordersUpdateArray.push(checked_selectUserName[j].value);
        for (let h = 0; h < checked_selectStoreMenuPrice[i].value.split(',').length; h++) { //checked_selectStoreMenuPriceを「あおやま」、「中華弁当」、「500」のそれぞれに分割して配列にpush
          console.log(checked_selectStoreMenuPrice[i].value.split(',')[h]) //「あおやま」、「中華弁当」、「500」 等
          ordersUpdateArray.push(checked_selectStoreMenuPrice[i].value.split(',')[h]); 
        }
        console.log(selectChangeValue[0].value); //お釣り「500」など。二つ目以降のメニューにお釣りを入れない処理はサーバーで。
        ordersUpdateArray.push(selectChangeValue[0].value);  
      }
    }
    console.log(ordersUpdateArray);
    window.location.href = `/orders/update/${ordersUpdateArray}`;
  }  
});


// 注文なしバッジのイベント
function noOrder(user) {
  console.log(user);
  const ordersUpdateArray = [];
  document.getElementById("errormessage").textContent = "";
  ordersUpdateArray.push(thisDay, user, '注文なし', '注文なし', '0', '');
  console.log(ordersUpdateArray); 
  window.location.href = `/orders/update/${ordersUpdateArray}`;
};


//本日の集計　store,user,menu,price
const appendTodaysOrders = (id, store, user, menu, price, ordered_check) => {
  const parent = document.getElementById("appendTodaysOrdersArea");
  const tr_store = document.createElement("tr");
    tr_store.className = `ordered_${store}`;
  const th_store = document.createElement("th");
    th_store.innerText = store;
    th_store.className = "font-weight-bold eachStoreName";
  const th_tellnum = document.createElement("th");
    th_tellnum.className = "tellnumArea";
    th_tellnum.colSpan = "3";
    th_tellnum.innerText = "";
  const tr_order = document.createElement("tr");
    tr_order.className = `ordered_${store}_${user}`;
  const td_id = document.createElement("td");
    td_id.hidden = true;
    td_id.textContent = id;
  const td_user = document.createElement("td");
    td_user.textContent = user;
    td_user.name = "orderedUser";
    td_user.className = "orderedUser px-4 col-5";
  const td_user_same = document.createElement("td");
    td_user_same.textContent = "";
    td_user_same.name = "orderedUserSame";
    td_user_same.className = "orderedUserSame px-4 col-5";
  const td_menu = document.createElement("td");
    td_menu.textContent = menu;
    td_menu.className = "col-4"
  const td_price = document.createElement("td");
    td_price.textContent = price;
    td_price.className = "col-2"
  const td_orderedCheck = document.createElement("td");
  const input_ordered = document.createElement("input");
    input_ordered.className = "form-check-input col-1";
    input_ordered.type = "checkbox";
    input_ordered.name = "ordered_check";
    input_ordered.value = id;
  const label_ordered = document.createElement("label");
    label_ordered.className = "form-check-label";
    label_ordered.innerText = "";
  const orderedStore = document.getElementsByClassName(`ordered_${store}`);
  const orderedStoreUser = document.getElementsByClassName(`ordered_${store}_${user}`);
  // console.log(orderedStore);
  // console.log(orderedStore.length);
  // console.log(orderedStoreUser);
  // console.log(orderedStoreUser.length);
  if (orderedStore.length == 0) {
    parent.appendChild(tr_store);
    tr_store.append(th_store);
    tr_store.append(th_tellnum);
    parent.appendChild(tr_order);
    tr_order.append(td_id);
    tr_order.append(td_user);
    tr_order.append(td_menu);
    tr_order.append(td_price);
    tr_order.append(td_orderedCheck);
    td_orderedCheck.append(input_ordered);
    td_orderedCheck.append(label_ordered);
  } else if (orderedStore.length > 0) {
    if (orderedStoreUser.length == 0) {
      parent.appendChild(tr_order);
      tr_order.append(td_id);
      tr_order.append(td_user);
      tr_order.append(td_menu);
      tr_order.append(td_price);
      tr_order.append(td_orderedCheck);
      td_orderedCheck.append(input_ordered);
      td_orderedCheck.append(label_ordered);
    } else if (orderedStoreUser.length > 0) {
      parent.appendChild(tr_order);
      tr_order.append(td_id);
      tr_order.append(td_user_same);
      tr_order.append(td_menu);
      tr_order.append(td_price);
      tr_order.append(td_orderedCheck);
      td_orderedCheck.append(input_ordered);
      td_orderedCheck.append(label_ordered);
    }
  }
  if (ordered_check == 1) {
    input_ordered.checked = true;
  }
};


//注文した人の要素を変更（取り消し線を引く、文字色を薄くするなど）
const appendOrderedUserTransform = (user) => {
  const selectUserName = document.getElementsByClassName("selectUserName");
  const userLabel = document.getElementsByClassName("userLabel");
  const selectUserBadge = document.getElementsByClassName("selectUserBadge");
    for (let i = 0; i < userLabel.length; i++) {
      if (user == userLabel[i].innerText) { //注文したuserに取り消し線など
        selectUserName[i].disabled = "disabled";
        userLabel[i].className = "form-check-label userLabel mx-4 orderedUser text-decoration-line-through text-secondary";
        // console.log(selectUserBadge[i]); //<input class="selectUserBadge ・・・ value="注文なし" ・・・ >
        selectUserBadge[i].className = "selectUserBadge border-0 bg-secondary rounded text-white text-center";
        selectUserBadge[i].onclick = "";
        selectUserBadge[i].style = "cursor: default";
      }
    }
};


//当面注文不要の人の要素を変更（取り消し線を引く、文字色を薄くするなど）
const appendUnnecessaryUserTransform = (user) => {
  const selectUserName = document.getElementsByClassName("selectUserName");
  const userLabel = document.getElementsByClassName("userLabel");
  const selectUserBadge = document.getElementsByClassName("selectUserBadge");
    for (let i = 0; i < userLabel.length; i++) {
      if (user == userLabel[i].innerText) { //注文したuserに取り消し線など
        selectUserName[i].disabled = "disabled";
        userLabel[i].className = "form-check-label userLabel mx-4 orderedUser text-decoration-line-through text-secondary";
        // console.log(selectUserBadge[i]); //<input class="selectUserBadge ・・・ value="注文なし" ・・・ >
        selectUserBadge[i].className = "selectUserBadge border-0 bg-secondary rounded text-white text-center";
        selectUserBadge[i].onclick = "";
        selectUserBadge[i].style = "cursor: default";
        selectUserBadge[i].value = "当面不要";
      }
    }
};


//本日の集計　お釣り
const appendTodaysChanges = (id, user, change, changed_check) => {
  const parent = document.getElementById("appendTodaysChangesArea");
  const tr = document.createElement("tr");
  const td_id = document.createElement("td");
    td_id.hidden = true;
    td_id.textContent = id;
  const td_user = document.createElement("td");
    td_user.textContent = user;
    td_user.className = "col-6";
  const td_change = document.createElement("td");
    td_change.textContent = change;
    td_change.className = "col-3";
  const td_orderedCheck = document.createElement("td");
    td_orderedCheck.className = "col-3";
  const input_ordered = document.createElement("input");
    input_ordered.className = "form-check-input";
    input_ordered.type = "checkbox";
    input_ordered.name = "changed_check";
    input_ordered.value = id;
    if (changed_check == 1) {
      input_ordered.checked = true;
    }
  const label_ordered = document.createElement("label");
    label_ordered.className = "form-check-label";
    label_ordered.innerText = "";
  parent.appendChild(tr);
  tr.append(td_id);
  tr.append(td_user);
  tr.append(td_change);
  tr.append(td_orderedCheck);
  td_orderedCheck.append(input_ordered);
  td_orderedCheck.append(label_ordered);
}


//本日の集計 店別金額　store sum
const appendTodaysStoresTotalAmount = (store, sum)=> {
  const parent = document.getElementById("appendTodaysStoresTotalAmountArea");
  const tr = document.createElement("tr");
  const td_store = document.createElement("td");
    td_store.textContent = store;
    td_store.className = "col-6";
  const td_sum = document.createElement("td");
    td_sum.textContent = sum;
    td_sum.className = "eachStoreSum col-6"
  parent.appendChild(tr);
  tr.append(td_store);
  tr.append(td_sum);
}


//本日の集計　チェックのリセット
const ordersResetBtn = document.getElementById("ordersResetBtn");
  ordersResetBtn.addEventListener("click", () => {
    window.location.href = `/orders/check/reset`;
  });


//indexページ Tellnumsデータ反映 集計場所に電話番号記述
const appendTellnums = (store, tellnumsText) => {
  const eachStoreName = document.getElementsByClassName("eachStoreName"); //HTMLCollection。そのままでは要素を扱えない。for文を使う。
  const tellnumArea = document.getElementsByClassName("tellnumArea");
  for (let i = 0; i < eachStoreName.length; i++) {
    if (store === eachStoreName[i].innerText) {
      tellnumArea[i].innerText = tellnumsText;
    }
  }
};
