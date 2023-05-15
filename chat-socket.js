/******************************************************* 초기 기타 변수 및 환경 셋팅 *******************************************************/

/* 날짜변환 및 소켓연결 */
const now = new Date();
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3
};
const formattedfirst = now.toLocaleString("en-US", options).replace(/[/:\s]/g, "-");
 
if (formattedfirst.includes("PM")) {
  var second = Number(formattedfirst.split(',')[1].split('-')[1]) + 12
}
else {
  var second = Number(formattedfirst.split(',')[1].split('-')[1])
}

var totaltime = formattedfirst.split(',')[0].split('-')[2] + "-" + formattedfirst.split(',')[0].split('-')[0] + "-" + formattedfirst.split(',')[0].split('-')[1] + " " +
  second + ":" + formattedfirst.split(',')[1].split('-')[2]

const socket = io("wss://port-0-chat-back-p8xrq2mlf0mbo1w.sel3.cloudtype.app/")

/* 유저정보 , 상대방정보 , 상대로고FTP , 날짜[totaltime 정리]  */
var nickname = "";
var partner_user = "";
var biz_logo = "";
var todaysdads = "";

/* 메세지 전체 박스 , sender -> 보낸  receiver 받는 */
const messages = document.getElementById('messages');
const senderbox = document.getElementsByClassName('senderbox');
const sendertoday = document.getElementsByClassName('sendertoday');
const receiverbox = document.getElementsByClassName('receiverbox');
const receive_sendertoday = document.getElementsByClassName('receive_sendertoday');
var data = ""

/* 아래는 웹 테스트용 inputbox 
const message = document.getElementById('message');
*/


/******************************************************* 방 입장 및 소캣연결 . 메세지 송수신 *******************************************************/

/* 방입장 */
function Room(roomname, pk, user, partner, logo_image) {

  // nickname = user
  // partner_user = partner
  
  /* 아래는 웹 테스트용 inputbox */
    nickname = "애완용꿀꿀이"
    user = nickname
    pk = 1
    partner = "lee"
    roomname = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"
    logo_image = "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/Chat/1Screenshot_20230511_110843_KakaoTalk.jpg2023-05-15+13%3A20"

  socket.emit('room', roomname)

  biz_logo = logo_image

  fetch('https://www.scrapmk.com/api/chat/chatroom/' + user + "/" + partner)
    .then(response => response.json())
    .then(data => {
    
      for (var i = 0; i < data.length; i++) {
        
        /* 메세지 */  
        if (data[i].image_url === "") {
          if (data[i].sender === pk) {
            messages.appendChild(buildNewMessage(nickname + ":" + data[i].content.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
          else {
            messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].content.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
        }
        
        /* 명함 */
        else if(data[i].image_url === "no"){

        }

        /* 이미지 */
        else if(data[i].image_url !== ""){
          if (data[i].sender === pk) {
            messages.appendChild(buildNewMessage(nickname + ":" + data[i].content.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
          else {
            messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].content.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
        }

      }

      /* 스크롤 하단으로 이동 */
      setTimeout(() => {
        const scrollTop = messages.scrollTop;
        const scrollHeight = messages.scrollHeight;
        if (scrollTop !== scrollHeight) {
          messages.scrollTop = scrollHeight;
          window.scrollBy(0, window.innerHeight);
        }
      }, 0);
    })
    .catch(error => console.error(error));

}

/* 메세지 송신 */
function Test(arg, chat, roomname, today) {
  nickname = arg

  /* 현재시간 1번쨰 메세지가 아닐경우 */
  if (todaysdads === totaltime.slice(10, 16)) {
    socket.emit('message', arg + ":" + chat + today + "null" + "방이름" + roomname)
  }
  /* 현재시간 1번쨰 메세지일경우 -> 시간 초기화 */
  else {
    todaysdads = totaltime.slice(10, 16)
    socket.emit('message', arg + ":" + chat + today + totaltime.slice(10, 16) + "방이름" + roomname)
  }

  /* 스크롤 하단으로 이동 */
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  if (scrollTop !== scrollHeight) {
    messages.scrollTop = scrollHeight;
    window.scrollBy(0, window.innerHeight);
  }

  /* Refresh */
  senderbox.remove();
  sendertoday.remove();
  receiverbox.remove();
  receive_sendertoday.remove();

  Room();

}

/* 소켓연결 및 스크롤 이동 */
socket.on('message', (data) => {
  handleNewMessage(data);
  messages.scrollTop = messages.scrollHeight;
})


/******************************************************* 1차 본인여부 검증 *******************************************************/

/* 소켓 연결 후 메세지 송수신 [1차 -> buildNewMessage로 값을전달 ] */
const handleNewMessage = (message) => {

  /* 이미지 및 명함 dfkjhdsfkjdshfjkshf -> 판별하기 위해 임의의 변수 셋팅 */
  if(message.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com/Chat")){
    if (message.includes("null")) {
      messages.appendChild(buildNewMessage(message.replace("null", ""), biz_logo, totaltime, "null", "null"));
    }
    else {
      messages.appendChild(buildNewMessage(message.replace(totaltime.slice(0, 10), "").replace(totaltime.slice(10, 16), ""), biz_logo, totaltime, totaltime.slice(0, 10), totaltime.slice(10, 16)));
    }
  }

  /* 메세지 */
  else{
    if (message.includes("null")) {
      messages.appendChild(buildNewMessage(message.replace("null", ""), biz_logo, totaltime, "null", "null"));
    }
    else {
      messages.appendChild(buildNewMessage(message.replace(totaltime.slice(0, 10), "").replace(totaltime.slice(10, 16), ""), biz_logo, totaltime, totaltime.slice(0, 10), totaltime.slice(10, 16)));
    }
  }
}

/* 
  소켓 연결 후 메세지 송수신 [2차 -> 
    
    first_today -> 날짜일경우 첫메세지 , null일경우 첫메세지 X , 송수신동일

    송신 [ 금일 첫메세지일경우 ]
    ----------------------
      todayMessage로 메세지 내용을 전달
      todaysecondMessage 날짜 , 시간 

    송신 [ 금일 첫메세지아닐경우 ]
    ----------------------
      todayMessage로 메세지 내용을 전달
      sendsecondMessage 날짜 , 시간
  
    수신 [ 금일 첫메세지일경우 ]
    ----------------------
      todayMessage로 메세지 내용을 전달
      receivesecondbox 날짜 , 시간 

    수신 [ 금일 첫메세지아닐경우 ]
    ----------------------
      todayMessage로 메세지 내용을 전달
      receivebox 날짜 , 시간 

  ] 
  */
const buildNewMessage = (message, logo_image, date, first_today, minute) => {
  
  /* 송신 */
  if (message.split(":")[0] === nickname) {

    const div = document.createElement("div");

    if (first_today === "null") {
      div.classList.add('senderbox');
      div.prepend(sendMessage(message.split("방이름")[0]));
      div.appendChild(sendsecondMessage(date, minute));
    }
    else {
      div.classList.add('sendertoday');
      div.prepend(todayMessage(first_today));
      div.appendChild(todaysecondMessage(message.split("방이름")[0], date, minute));

    }

    return div;
  }

  /* 수신 */
  else {

    const div = document.createElement("div");
    const logo = document.createElement("img");

    if (logo_image === null || logo_image === "") {
      logo.setAttribute('src', "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/App/chat_profile.png");
    }
    else {
      logo.setAttribute('src', logo_image);
    }

    div.classList.add('receiverbox');
    logo.classList.add('receiverimgae');

    if (first_today === "null") {
      div.prepend(logo);
      div.appendChild(receivebox(message.split("방이름")[0], date, minute));
      document.body.prepend(div)
    }
    else {
      div.classList.add('receive_sendertoday');
      div.prepend(todayMessage(first_today));
      div.appendChild(logo)
      div.appendChild(receivesecondbox(message.split("방이름")[0], date, minute));
      
      document.body.prepend(div)
    }

    return div;

  }
}


/******************************************************* 이미지 [ 카메라 , 앨범 ] *******************************************************/
/******************************************************* 명함 *******************************************************/





/******************************************************* 송.수신 공용 *******************************************************/

/* 송신 , 수신 - 금일 1번째 메세지일경우 이미지 및 문구 생성 부분 */
const todayMessage = (first_today) => {
  const div = document.createElement("div");

  div.classList.add('today_active');

  //div.prepend(logo);
  div.appendChild(todaybox(first_today));

  return div
}

const todaybox = (first_today) => {
  const logo = document.createElement("img");
  logo.setAttribute('src', "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/calendar_month(1).svg");

  const span = document.createElement("span");
  const div = document.createElement("div");


  div.classList.add('today_text');
  div.prepend(logo)
  div.appendChild(span)
  span.appendChild(document.createTextNode(first_today))

  return div
}

const todaysecondMessage = (first, second, minute) => {
  const div = document.createElement("div");
  div.classList.add('today_total_box');

  div.appendChild(sendMessage(first.split("방이름")[0]));
  div.appendChild(sendsecondMessage(second, minute));

  return div
}

/******************************************************* 송신 *******************************************************/

/* 송신 -> 메세지내용 */
const sendMessage = (message) => {

  
  /* 이미지 */
  if(message.includes("https://scrapmarket.s3.ap-northeast-2.amazonaws.")){
    const chat_image = document.createElement("img");
    chat_image.classList.add('chat_image');
    chat_image.setAttribute('src', message.replace(":","").replace(nickname ,"").replace(nickname ,"").replace(totaltime.slice(10, 16),""));
 
    return img
  }
  /* 메세지 */
  else{
      const span = document.createElement("span");
      span.classList.add('sender');
      span.prepend(document.createTextNode(message.split("방이름")[0].split(":")[1]))
  
      return span
  }

  
}

/* 송신 - 시간 */
const sendsecondMessage = (datesecond, minute) => {
  const span = document.createElement("span");
  span.classList.add('sendertime');

  var second = ""

  if (datesecond.slice(11, 12) === "0") {
    second = "오전" + datesecond.slice(11, 16)
  }

  //10 ~12
  else if (datesecond.slice(11, 12) === "1") {

    //10 ~12 
    if (datesecond.slice(12, 13) === "0" || datesecond.slice(12, 13) === "1" || datesecond.slice(12, 13) === "2") {
      second = "오전" + datesecond.slice(11, 16)
    }
    //13 ~ 19
    else {
      second = "오후" + String(Number(datesecond.slice(11, 13)) - 12) + ":" + datesecond.slice(14, 16)
    }
  }
  //20 ~24
  else if (datesecond.slice(11, 12) === "2") {

    second = "오후" + Number(datesecond.slice(11, 13)) - 12 + ":" + datesecond.slice(14, 16)

  }


  if (String(minute) === "null") {
    span.prepend(document.createTextNode(""))
  }
  else {
    span.prepend(document.createTextNode(second))
  }

  return span
}


/******************************************************* 수신 *******************************************************/


/* 수신 - 금일 1번째아닐경우 flex로인해 분리작업진행 */
const receivebox = (text, date, minute) => {
  const div = document.createElement("div");
  div.classList.add('receiversecond');
  div.prepend(receiveMessage(text));
  div.appendChild(receivesecondMessage(date, minute));
  return div
}

/* 수신 - 금일 1번째일경우  flex로인해 분리작업진행*/
const receivesecondbox = (text, date, minute) => {
  const div = document.createElement("div");
  div.classList.add('receiversecond_today');
  div.prepend(receiveMessage(text));
  div.appendChild(receivesecondMessage(date));
  return div
}

/* 수신 - 메세지  */
const receiveMessage = (message) => {

  if(message.split("방이름")[0].split(":")[1].includes("https://scrapmarket.s3.ap-northeast-2.amazonaws.")){
    const chat_image = document.createElement("img");
    chat_image.classList.add('chat_image');
    chat_image.setAttribute('src', message.split("방이름")[0].split(":")[1] );
  
    return img
  }
  else{
    const span = document.createElement("span");
    span.classList.add('receivetext');  
    span.prepend(document.createTextNode(message.split("방이름")[0].split(":")[1]))
  
    return span
  }

  
}

/* 수신 - 시간 */
const receivesecondMessage = (datesecond, minute) => {
  const span = document.createElement("span");
  span.classList.add('receivetime');

  var second = ""

  if (datesecond.slice(11, 12) === "0") {
    second = "오전" + datesecond.slice(11, 16)
  }

  //10 ~12
  else if (datesecond.slice(11, 12) === "1") {

    //10 ~12 
    if (datesecond.slice(12, 13) === "0" || datesecond.slice(12, 13) === "1" || datesecond.slice(12, 13) === "2") {
      second = "오전" + datesecond.slice(11, 16)
    }
    //13 ~ 19
    else {
      second = "오후" + String(Number(datesecond.slice(11, 13)) - 12) + ":" + datesecond.slice(14, 16)
    }
  }
  //20 ~24
  else if (datesecond.slice(11, 12) === "2") {

    second = "오후" + Number(datesecond.slice(11, 13)) - 12 + ":" + datesecond.slice(14, 16)

  }

  if (String(minute) === "null") {
    span.prepend(document.createTextNode(""))
  }
  else {
    span.prepend(document.createTextNode(second))
  }

  return span
}


/****************************** 아래 코드는 웹용  위 부분은 공용******************************/
// socket.emit('room', room)

window.onload = function() {
    Room()
 };

// const handleSubmitNewMessage = () => {
//   // socket.emit('message', nickname + ":" + message.value + "방이름" + room)
//   Room()
// }
