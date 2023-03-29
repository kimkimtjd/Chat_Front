const socket = io("wss://port-0-chat-back-6g2llfsyx812.sel3.cloudtype.app/")
const nickname = prompt('닉네임을 알려주세요.');
// const room = prompt('입장할 방의 코드를 적어주세요.');

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');

const handleSubmitNewMessage = () => {
  socket.emit('message', { data: nickname + ":" + message.value })

}

socket.on('message', ({ data }) => {
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
  li.appendChild(document.createTextNode(message))
  return li;
  }
  else{
    const li = document.createElement("li");
    li.classList.add('test');
    let text = document.createTextNode(message);
    li.appendChild(text);
    document.body.appendChild(li)
    return li;
  
  }
}