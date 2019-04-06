var config = {
    apiKey: "AIzaSyDAn3VPX6S1lMOwDpYm3-dG5tl4mFlHkqw",
    authDomain: "project-3b316.firebaseapp.com",
    databaseURL: "https://project-3b316.firebaseio.com",
    projectId: "project-3b316",
    storageBucket: "project-3b316.appspot.com",
    messagingSenderId: "612772461949"
};
firebase.initializeApp(config);

const height = document.getElementById('header__form-group__height-i');
const weight = document.getElementById('header__form-group__weight-i');
const result = document.querySelector('.header__result');
const list = document.querySelector('.bmi__records-list');
const li = document.querySelector('.bmi__records-li');

const bmili = firebase.database().ref('bmi');

result.addEventListener('click', function() {
    if (weight.value === '' || height.value === '') {
      return
    }
    const now = Date.now();    
    let bmi = weight.value / ((height.value / 100) * (height.value / 100));
    bmili.push({height: height.value, weight: weight.value, bmi: bmi.toFixed(2), time: now});
});

bmili.on('value', function(snapshot) {
    // console.log(snapshot.val());
    
    let str = '';
    let ideal = '';
    let color = '';
    const data = [];
    
    snapshot.forEach((item) => {
      data.push({key: item.key, bmi: item.val().bmi, height: item.val().height, weight: item.val().weight, time: item.val().time});
    });
    data.reverse();

    for (const item in data) {
      if (data[item].bmi <= 16.5) {
        ideal = '體重不足';
        color = "#d73f3f";
      }
      else if (data[item].bmi > 18.5 && data[item].bmi < 25) {
        ideal = '理想';
        color = '#86D73F';
      } else if (data[item].bmi > 16.5 && data[item].bmi < 18) {
        ideal = '過輕';
        color = '#31BAF9';
      } else if (data[item].bmi > 25 && data[item].bmi < 30) {
        ideal = '過重';
        color = '#FF982D';    
      } else if (data[item].bmi >= 30 && data[item].bmi < 35) {
        ideal = '輕度肥胖';
        color = '#FF6C03';    
      } else if (data[item].bmi >= 35 && data[item].bmi < 40) {
        ideal = '中度肥胖';
        color = '#FF6C03';    
      } else if (data[item].bmi >= 40) {
        ideal = '重度肥胖';
        color = '#FF1200';
      };
      str += `
      <li class="bmi__records-li" style="border-color:${color}" data-key=${data[item].key}>
        <span class="bmi__records-span" style="margin: 0px 60px 0px 19px;width:150px">${ideal}</span>
        <span class="bmi__records-span" style="margin-right: 42px;width:200px">
            <span class="bmi__records-tag">BMI</span>
            <span style="width:200px">${data[item].bmi}</span>
        </span>
        <span class="bmi__records-span" style="margin-right:42px;width:220px">
            <span class="bmi__records-tag">weight</span>
            <span>${data[item].weight}kg</span>
        </span>
        <span class="bmi__records-span" style="width:500px">
            <span class="bmi__records-tag">height</span>
            <span style="margin-right: 42px">${data[item].height}cm</span>
            <span class="bmi__records-tag">${timestamp(data[item].time)}</span>
        </span>
      </li>`;
    }    
    list.innerHTML = str;
});

list.addEventListener('click', function(e) {
  if (e.target.nodeName === 'LI') {
    bmili.child(e.target.dataset.key).remove();
  }
});

function timestamp(value) {
  const n = new Date(value);
  const y = n.getFullYear();
  const m = n.getMonth() + 1;
  const d = n.getDate();
  const hour = n.getHours();
  const min = n.getMinutes();
  const sec = n.getSeconds();

  return `${m}-${d}-${y} ${hour}:${min}:${sec}`
}