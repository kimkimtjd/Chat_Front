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
if(formattedfirst.includes("PM")){
  var second = Number(formattedfirst.split(',')[1].split('-')[1]) + 12
}
else {
  var second = Number(formattedfirst.split(',')[1].split('-')[1])
}

var totaltime = formattedfirst.split(',')[0].split('-')[2] + "-" + formattedfirst.split(',')[0].split('-')[0] + "-" + formattedfirst.split(',')[0].split('-')[1] + " " + 
second  + ":" + formattedfirst.split(',')[1].split('-')[2]


const socket = io("wss://port-0-chat-back-p8xrq2mlf0mbo1w.sel3.cloudtype.app/")
// const socket = io("ws://localhost:3000/")

//아래 주석
var nickname = "";
const room = "e7e3bb53-2e6c-4900-a537-45e8b03fbc99"
var biz_logo = "";
var todaysdads = "";
// const room = 5


const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');
var data = "" 

function Room(roomname, pk , user , partner , logo_image) {
  
  
  // nickname = user

  // 아래 2개는 삭제 , 상단 애완용 꿀꿀이는 user 로 변경예정
  nickname = "kmskms"
  user = nickname
  pk = 3
  partner = "애완용꿀꿀이"
  roomname = "e7e3bb53-2e6c-4900-a537-45e8b03fbc99"

  socket.emit('room', roomname)

  biz_logo = logo_image

  fetch('https://www.scrapmk.com/api/chat/chatroom/' + user + "/" + partner)
    .then(response => response.json())
    .then(data => {
      // console.log(data, data[0].sender, data.length)
//       if(data.length > 20){
//         document.getElementsByClassName('total').style.height="auto";
//       }
//     else{
//       document.getElementsByClassName('total').style.height="1000px";
//     }
//biz_logo = data[i].biz_logo
    
      for (var i = 0; i < data.length; i++) {
        if (data[i].sender === pk){ // [nickname -> user로 변경예정]
          messages.appendChild(buildNewMessage(nickname + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group , data[i].biz_logo , data[i].created , String(data[i].today) ) );
        }
        else{
          messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group , data[i].biz_logo , data[i].created , String(data[i].today) )); 
        }
      }

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

function Test(arg, chat, roomname , today) {
  nickname = arg
  todaysdads = today // 값출력 X
  socket.emit('message', arg + ":" + chat + "방이름" + roomname)

  const scrollTop = messages.scrollTop;
      const scrollHeight = messages.scrollHeight;
      if (scrollTop !== scrollHeight) {
        messages.scrollTop = scrollHeight;
        window.scrollBy(0, window.innerHeight);
      }
}

socket.on('message', (data) => {
  handleNewMessage(data);
  messages.scrollTop = messages.scrollHeight;
})

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message , biz_logo , totaltime , "2023-04-28"));
  console.log(todaysdads)
  // }
  // if(today === "null"){
  //   messages.appendChild(buildNewMessage(message , biz_logo , totaltime , today));
  // }
  // else{
  //   messages.appendChild(buildNewMessage(message , biz_logo , totaltime , today));
  // }
}


const buildNewMessage = (message , logo_image , date , first_today ) => {
  // console.log(nickname)
  if (message.split(":")[0] === nickname) {

    const div = document.createElement("div");
    
    if(first_today === "null"){
      div.classList.add('senderbox');
      div.prepend(sendMessage(message.split("방이름")[0]));
      div.appendChild(sendsecondMessage(date));  
    }
    else {
      div.classList.add('sendertoday');
      div.prepend(todayMessage(first_today));
      div.appendChild(todaysecondMessage(message.split("방이름")[0] , date));
           
    }

    return div;
  }
  else {

    const div = document.createElement("div");
    const logo = document.createElement("img");

    if(logo_image === null || logo_image === "" ){
      logo.setAttribute('src', "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/App/chat_profile.png");
    }
    else{
      logo.setAttribute('src', logo_image);
    }

    div.classList.add('receiverbox');
    logo.classList.add('receiverimgae');

    if(first_today === "null"){
      div.prepend(logo);
      div.appendChild(receivebox(message.split("방이름")[0] , date));
      
      document.body.prepend(div)  
    }
    else {
      div.classList.add('receive_sendertoday');
      div.prepend(todayMessage(first_today));
      div.appendChild(logo)
      div.appendChild(receivesecondbox(message.split("방이름")[0] , date));
      // // div.appendChild(logo);
      // div.appendChild(receivebox(message.split("방이름")[0] , date));

      document.body.prepend(div)  
    }

    return div;

  }
}

/* 이미지 전송X 문자만 주고받는 부분  */
const todayreceive_secondMessage = (first , second , third ) => {
  const div = document.createElement("div");
  const logo = document.createElement("img");

  if(first === null || first === "" ){
    logo.setAttribute('src', "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/App/chat_profile.png");
  }
  else{
    logo.setAttribute('src', first);
  }

  div.classList.add('today_second_box');
  logo.classList.add('receiverimgae');

  div.prepend(logo);
  div.appendChild(receivebox(second, third));

}


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


const todaysecondMessage = (first , second ) => {
  const div = document.createElement("div");
  div.classList.add('today_total_box');

  div.appendChild(sendMessage(first.split("방이름")[0]));
  div.appendChild(sendsecondMessage(second));  
  
  return div
} 


const sendMessage = (message) => {
  const span = document.createElement("span");
  span.classList.add('sender');

  span.prepend(document.createTextNode(message.split("방이름")[0]))
  
  return span
}

const sendsecondMessage = (datesecond) => {
  const span = document.createElement("span");
  span.classList.add('sendertime');
  
  var second = ""

  if(datesecond.slice(11,12) === "0"){
    second  = "오전" + datesecond.slice(11,16)
  }
  
  //10 ~12
  else if(datesecond.slice(11,12) === "1"){
  
    //10 ~12 
    if(datesecond.slice(12,13) === "0" || datesecond.slice(12,13) === "1" || datesecond.slice(12,13) === "2"){
      second  =  "오전" + datesecond.slice(11,16)
    }
    //13 ~ 19
    else {
      second  = "오후" + String(Number(datesecond.slice(11,13))) + ":" +  datesecond.slice(14,16)
    }
  }
  //20 ~24
  else if(datesecond.slice(11,12) === "2"){
  
    second  = "오후" + Number(datesecond.slice(11,13)) - 12 + ":" + datesecond.slice(14,16)
    
  }
  
  span.prepend(document.createTextNode(second))

  return span
}

const receivebox = (text , date) => {
  const div = document.createElement("div");
  div.classList.add('receiversecond');
  div.prepend(receiveMessage(text));
  div.appendChild(receivesecondMessage(date));
  return div
}

const receivesecondbox = (text , date) => {
  const div = document.createElement("div");
  div.classList.add('receiversecond_today');
  div.prepend(receiveMessage(text));
  div.appendChild(receivesecondMessage(date));
  return div
}

const receiveMessage = (message) => {
  const span = document.createElement("span");
  span.classList.add('receivetext');

  span.prepend(document.createTextNode(message.split("방이름")[0]))
  
  return span
}

const receivesecondMessage = (datesecond) => {
  const span = document.createElement("span");
  span.classList.add('receivetime');

  var second = ""

  if(datesecond.slice(11,12) === "0"){
    second  = "오전" + datesecond.slice(11,16)
  }
  
  //10 ~12
  else if(datesecond.slice(11,12) === "1"){
  
    //10 ~12 
    if(datesecond.slice(12,13) === "0" || datesecond.slice(12,13) === "1" || datesecond.slice(12,13) === "2"){
      second  =  "오전" + datesecond.slice(11,16)
    }
    //13 ~ 19
    else {
      second  = "오후" + String(Number(datesecond.slice(11,13))) + ":" +  datesecond.slice(14,16)
    }
  }
  //20 ~24
  else if(datesecond.slice(11,12) === "2"){
  
    second  = "오후" + Number(datesecond.slice(11,13)) - 12 + ":" + datesecond.slice(14,16)
    
  }
  

  span.prepend(document.createTextNode(second))
  
  return span
}


/****************************** 아래 코드는 웹용  위 부분은 공용******************************/
socket.emit('room', room)

window.onload = function() {
    Room()
 };

// const handleSubmitNewMessage = () => {
//   // socket.emit('message', nickname + ":" + message.value + "방이름" + room)
//   Room()
// }
