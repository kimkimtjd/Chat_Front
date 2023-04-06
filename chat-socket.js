const socket = io("ws://118.67.135.60:3000/")
// const socket = io("ws://localhost:3000/")
const nickname = prompt('닉네임을 알려주세요.');
const room = prompt('kimeender');

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');

 Android.sendData("hello world");

const handleSubmitNewMessage = () => {
  socket.emit('message', nickname + ":" + message.value +"방이름" + room )
   Android.showToast("hello world");
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
  if(message.split(":")[0] === nickname ){
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(message.split("방이름")[0]))
  return li;
  }
  else{
    const li = document.createElement("li");
    li.classList.add('test');
    let text = document.createTextNode(message.split("방이름")[0]);
    li.appendChild(text);
    document.body.appendChild(li)
    return li;
  
  }
}
