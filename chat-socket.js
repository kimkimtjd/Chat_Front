const socket = io("wss://port-0-chat-back-p8xrq2mlf0mbo1w.sel3.cloudtype.app/")
// const socket = io("ws://localhost:3000/")

//아래 주석
var nickname = "";
// const room = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"



const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');
var data = "" 

function Room(roomname, pk , user , partner) {
  
  socket.emit('room', roomname)
  
  nickname = user
  
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
    
      for (var i = 0; i < data.length; i++) {
        if (data[i].sender === pk){
          messages.appendChild(buildNewMessage(user + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group , data[i].biz_logo , data[i].created ) );
        }
        else{
          messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group , data[i].biz_logo , data[i].created)); 
        }
      }
      window.scrollTo(0,document.body.scrollHeight);

    }) 
    .catch(error => console.error(error));


}

function Test(arg, chat, roomname) {
  nickname = arg
  socket.emit('message', arg + ":" + chat + "방이름" + roomname)
  window.scrollTo(0,document.body.scrollHeight);

  //post -> nickname , partner , content , group , imageurl -> 이미지를 보낼경우 [ content -> 공백 ] , 텍스트를 보낼경우 [ imageurl -> 공백 ] 

}

socket.on('message', (data) => {
  handleNewMessage(data);
    window.scrollTo(0,document.body.scrollHeight);

})

const handleNewMessage = (message) => {
  messages.appendChild(serverMessage(message));
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

    logo.setAttribute('src', logo_image);
 
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

// const handleSubmitNewMessage = () => {
//   socket.emit('message', nickname + ":" + message.value + "방이름" + room)
//   // Room()
// }

