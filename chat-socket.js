const socket = io("ws://118.67.135.60:3000/")
// const socket = io("ws://localhost:3000/")
<<<<<<< HEAD
// var nickname = "운영자";
// const room = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"
=======
const nickname = prompt('닉네임을 알려주세요.');
const room = "kimeender"
>>>>>>> de17f79a6ff7db0d693ad9f3e2d22c3ba124b88c

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');

<<<<<<< HEAD
function Test(arg , chat , roomname){
 socket.emit('message', arg + ":" + chat +"방이름" + roomname)
 socket.emit('room', roomname)             
 nickname = arg
=======
function Test(arg){
 console.log(arg)
 socket.emit('message', "kimkimtjd" + ":" + arg +"방이름kimeender"
}
             
socket.emit('room', room)             
             
const handleSubmitNewMessage = () => {
  socket.emit('message', nickname + ":" + message.value +"방이름" + room )
>>>>>>> de17f79a6ff7db0d693ad9f3e2d22c3ba124b88c
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
    div.appendChild(sendMessage(message));

  return div;
  }
  else{

    const div = document.createElement("div");
    let text = document.createTextNode(message.split("방이름")[0]);
    div.classList.add('receiverbox');

    div.appendChild(text);
    document.body.appendChild(div)
    return div;
 
  }
}
<<<<<<< HEAD

const sendMessage = (message) => {
  const span = document.createElement("span");
  span.classList.add('sender');
  
  span.appendChild(document.createTextNode(message.split("방이름")[0]))

  return span
}

/****************************** 아래 코드는 웹용  위 부분은 공용******************************/ 
// socket.emit('room', room)             
             
// const handleSubmitNewMessage = () => {
//   socket.emit('message', nickname + ":" + message.value +"방이름" + room )
// }


=======
>>>>>>> de17f79a6ff7db0d693ad9f3e2d22c3ba124b88c
