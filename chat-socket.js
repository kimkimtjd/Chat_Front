const socket = io("wss://port-0-chat-back-p8xrq2mlf0mbo1w.sel3.cloudtype.app/")
// const socket = io("ws://localhost:3000/")

//아래 주석
var nickname = "";
// const room = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"



const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');

// pk -> 유저 고유번호 , nickname -> 로그인한사람 닉네임 , partner -> 상대방 닉네임
function Room(roomname, pk , user , partner) {
  
  socket.emit('room', roomname)
  nickname = user
  fetch('https://www.scrapmk.com/api/chat/chatroom/' + user + "/" + partner)
    .then(response => response.json())
    .then(data => {
      // console.log(data, data[0].sender, data.length)
      if(data.length > 20){
        document.getElementsByClassName('total').style.height="auto";
      }
    
      for (var i = 0; i < data.length; i++) {
        if (data[i].sender === pk){
          messages.appendChild(buildNewMessage(user + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group));
        }
        else{
          messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].content.replace('<br/>' , '\n') + "방이름" + data[i].group)); 
        }
      }
    }
    /*
      //     for(var i=0; i<data.length; i++ ){
      //        messages.appendChild(
      //       if(data[i].sender === 1){
      //         const div = document.createElement("div");
      //         div.classList.add('senderbox');
      //         div.prepend(sendMessage("애완용꿀꿀이" + ":" + data[i].content +"방이름" + data[i].group)); 

      //          return div;

      //       }
      //       else{
      //         const div = document.createElement("div");
      //         let text = document.createTextNode( data[i].nickname + ":" + data[i].content +"방이름" + data[i].group.split("방이름")[0] );
      //         div.classList.add('receiverbox');
      //         div.prepend(text);

      //         document.body.appendChild(div); // 생성된 div를 body에 추가
      //          return div;
      //       }
      //     })
      
    */
   ) 
    .catch(error => console.error(error));
}

function Test(arg, chat, roomname) {
  nickname = arg
  socket.emit('message', arg + ":" + chat + "방이름" + roomname)
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
  // console.log(nickname)
  if (message.split(":")[0] === nickname) {

    const div = document.createElement("div");
    div.classList.add('senderbox');
    div.prepend(sendMessage(message));

    return div;
  }
  else {

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
// socket.emit('room', room)

// const handleSubmitNewMessage = () => {
//   socket.emit('message', nickname + ":" + message.value + "방이름" + room)
//   // Room()
// }



