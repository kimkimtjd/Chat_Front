const socket = io("wss://port-0-chat-back-p8xrq2mlf0mbo1w.sel3.cloudtype.app/")
// const socket = io("ws://localhost:3000/")
var nickname = "운영자";
const room = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');

function Room(roomname){
  socket.emit('room', roomname)             
}

function Test(arg , chat , roomname){
  nickname = arg
  socket.emit('message', arg + ":" + chat +"방이름" + roomname)
}

socket.on('message', (data) => {
  handleNewMessage(data);
})

const handleNewMessage = (message) => {
  // messages.appendChild(buildNewMessage(message));
  // if(message.split(":")[0] === nickname ){
    messages.appendChild(buildNewMessage(message));
  // }
  // else{
  //   messagesub.appendChild(buildNewMessage(message));
  // }
}


const buildNewMessage = (message) => {
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

const sendMessage = (message) => {
  const span = document.createElement("span");
  span.classList.add('sender');
  
  span.appendChild(document.createTextNode(message.split("방이름")[0]))

  return span
}

/****************************** 아래 코드는 웹용  위 부분은 공용******************************/ 
 socket.emit('room', room)             
             
 const handleSubmitNewMessage = () => {
      socket.emit('message', nickname + ":" + message.value +"방이름" + room )
 }



