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
// const room = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"
var biz_logo = "";



const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');
var data = "" 

function Room(roomname, pk , user , partner) {
  
  socket.emit('room', roomname)
  
  nickname = user
  
  fetch('https://www.scrapmk.com/api/chat/chatroom/' + "애완용꿀꿀이" + "/" + "lee")
    .then(response => response.json())
    .then(data => {
      // console.log(data, data[0].sender, data.length)
//       if(data.length > 20){
//         document.getElementsByClassName('total').style.height="auto";
//       }
//     else{
//       document.getElementsByClassName('total').style.height="1000px";
//     }
// biz_logo = data[i].biz_logo
    
      for (var i = 0; i < data.length; i++) {
        if (data[i].sender === pk){
          messages.appendChild(buildNewMessage(user + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group , data[i].biz_logo , data[i].created ) );
        }
        else{
          messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group , data[i].biz_logo , data[i].created)); 
        }
      }

    
  }) 
    .catch(error => console.error(error));

    messages.scrollTop = messages.scrollHeight;

}

function Test(arg, chat, roomname) {
  nickname = arg
  socket.emit('message', arg + ":" + chat + "방이름" + roomname)
  messages.scrollTop = messages.scrollHeight;

  //post -> nickname , partner , content , group , imageurl -> 이미지를 보낼경우 [ content -> 공백 ] , 텍스트를 보낼경우 [ imageurl -> 공백 ] 
  /*
    nickname = data['nickname']
    partner_nickname = data['partner_nickname']
    content = data['content']
    group = data['group']
    image_url = data['image_url']
  */ 
}

socket.on('message', (data) => {
  handleNewMessage(data);
  messages.scrollTop = messages.scrollHeight;
})

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message , biz_logo , totaltime));
}

const serverMessage = (message) => {
  console.log(nickname)
  if(message.split(":")[0] === nickname){
  
    const div = document.createElement("div");
    div.classList.add('senderbox');
    div.prepend(sendMessage(message));

  return div;
  }
  else{

    const div = document.createElement("div");
    let text = document.createTextNode(message.split("방이름")[0]);
    div.classList.add('receiverbox');

    div.prepend(text);
    document.body.prepend(div)
    return div;
 
  }
}

const buildNewMessage = (message , logo_image , date) => {
  // console.log(nickname)
  if (message.split(":")[0] === nickname) {

    const div = document.createElement("div");
    div.classList.add('senderbox');
    
    div.prepend(sendMessage(message.split("방이름")[0]));
    div.appendChild(sendsecondMessage(date));

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
 
    let text = document.createTextNode(message.split("방이름")[0]);
    

    div.classList.add('receiverbox');
    logo.classList.add('receiverimgae');

    div.prepend(logo);
    div.appendChild(receivebox(message.split("방이름")[0] , date));
    
    document.body.prepend(div)

    return div;

  }
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
// socket.emit('room', room)

const handleSubmitNewMessage = () => {
//   socket.emit('message', nickname + ":" + message.value + "방이름" + room)
   Room()
}

