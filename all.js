///////////////指向標籤/////////////////
const heightInfo = document.querySelector('.heightInfo'); //輸入身高值
const weightInfo = document.querySelector('.weightInfo'); //輸入體重值
const getResult = document.querySelector('.getResult'); //看結果按鈕
// const backBtn = document.querySelector('.backBtn'); //回復按鈕
const gotResult = document.querySelector('.gotResult'); //顯示BMI計算結果區域
const record = document.querySelector(".record"); //資料的位置
const day = new Date(); //取得日期
const date = day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
// const warning = document.querySelector(".warning"); //錯誤時的警告內容


/////////////////取得資料/////////////////
let data = JSON.parse(localStorage.getItem('data')) || [];
//本身有資料就parse出來，否則預設是空陣列
updateList(data);
// 頁面開啟時更新資料


/////////////////監聽與更新/////////////////
getResult.addEventListener('click', function(){
  let weightNumber = parseInt(weightInfo.value);
  let heightNumber = parseInt(heightInfo.value);
  if(isNaN(heightNumber) || isNaN(weightNumber) || ""){
    alert('請輸入數字');
  }
  else{
    checkBMI();
    displayChange();
    // colorChange();
    console.log(data[0].BMINumber,data[0].BMILevel)
    weightInfo.value="";
    heightInfo.value="";
  }
});
record.addEventListener('click', deleteList);


/////////////////更新結果內容/////////////////
function displayChange(){
  getResult.style.display = "none";
  gotResult.style.display = "flex";
}


/////////////////BMI計算/////////////////
function checkBMI(){
  let weight = weightInfo.value;
  let height = heightInfo.value;
  let BMIformula = weight / ((height/100) * (height/100));
  let BMINumber = BMIformula.toFixed(2);
  let BMILevel = '';
  let BMILevelColor = '';

  switch (true) {
    case BMINumber < 18.5:
      BMILevel = "過輕";
      BMILevelColor = "#86D73F";
      break;
    case (18.5 <= BMINumber && BMINumber < 24):
      BMILevel = "理想";
      BMILevelColor = "#31BAF9";
      break;
    case (24 <= BMINumber && BMINumber < 27):
      BMILevel = "過重";
      BMILevelColor = "#FF982D";
      break;
    case (27 <= BMINumber && BMINumber < 30):
      BMILevel = "輕度肥胖";
      BMILevelColor = "#FF6C03";
      break;
    case (30 <= BMINumber && BMINumber < 35):
      BMILevel = "中度肥胖";
      BMILevelColor = "#FF6C03";
      break;
    case BMINumber >= 35:
      BMILevel = "重度肥胖";
      BMILevelColor = "#FF1200";
      break;
    default:
      console.log("不正常");
      break;
  };
  var BMIData = {
    BMILevelColor: BMILevelColor,
    BMILevel: BMILevel,
    BMINumber: BMINumber,
    weight: weight,
    height: height,
    date: date
  };
  data.push(BMIData);
  localStorage.setItem('data', JSON.stringify(data));
  updateList(data);
  colorChange(BMILevel,BMINumber)
};


/////////////////btn換顏色＆套值/////////////////
function colorChange(BMILevel,BMINumber){
  let len = data.length -1;
  let str = `
  <p>
  <span class="BMINum">${BMINumber}</span>
  <br>BMI
  </p>
  <span class="resultText">${BMILevel}</span>
  <i class="material-icons backBtn">loop</i>`;
  gotResult.innerHTML = str;
  let backBtn = document.querySelector('.backBtn');//不能在全域宣告要在這宣告
  gotResult.style.borderColor = data[len].BMILevelColor;
  gotResult.style.color = data[len].BMILevelColor;
  backBtn.style.backgroundColor = data[len].BMILevelColor;

  backBtn.addEventListener('click', function(e){
    if (e.target.nodeName !== "I") { return };
    getResult.style.display = "block";
    gotResult.style.display = "none";
  });//back事件要放在裡面
}


/////////////////更新網頁內容/////////////////
function updateList(items) {
  let str = '';
  let len = items.length;
  for (let i = 0; len > i; i++) {
    str += 
        `<div class="list" style="border-left:7px solid ${items[i].BMILevelColor}">
      <span class="recordLevel">${items[i].BMILevel}</span>
      <div class="recordTitle">BMI
         <span class="recordBmi">${items[i].BMINumber}</span>
      </div>
      <div class="recordTitle">weight
         <span class="recordWeight">${items[i].weight}</span>
      </div>
      <div class="recordTitle">height
         <span class="recordHeight">${items[i].height}</span>
      </div>
      <div class="recordDate">${items[i].date}</div>
      <i class="material-icons remove" data-num="0">delete</i>
   </div>`
  }
  record.innerHTML = str;
  
}


///////////////刪除資料/////////////////
function deleteList(e) {
  e.preventDefault();
  if (e.target.nodeName !== "I") {
    return
  };
  let num = e.target.dataset.num;
  data.splice(num,1);

  localStorage.setItem('data', JSON.stringify(data));
  // //新增或刪除都有一個再把資料倒進去的動作，將陣列轉成字串存進 localStorage
  updateList(data);
  //再透過 updateList(data) 重新渲染畫面
}