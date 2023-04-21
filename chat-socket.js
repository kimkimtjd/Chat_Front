const socket = io("wss://port-0-chat-back-p8xrq2mlf0mbo1w.sel3.cloudtype.app/")
// const socket = io("ws://localhost:3000/")

//아래 주석
var nickname = "";
// const room = "d67dc57d-14a3-488b-8f5f-dfeee417ed3c"



const message = document.getElementById('message');
const messages = document.getElementById('messages');
const messagesub = document.getElementById('messagesub');
var data = "" 

// pk -> 유저 고유번호 , nickname -> 로그인한사람 닉네임 , partner -> 상대방 닉네임
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
    }) 
    .catch(error => console.error(error));
}

function Test(arg, chat, roomname) {
  nickname = arg
  socket.emit('message', arg + ":" + chat + "방이름" + roomname)

  //post -> nickname , partner , content , group , imageurl -> 이미지를 보낼경우 [ content -> 공백 ] , 텍스트를 보낼경우 [ imageurl -> 공백 ] 

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


const buildNewMessage = (message , logo_image , date) => {
  // console.log(nickname)
  if (message.split(":")[0] === nickname) {

    const div = document.createElement("div");
    div.classList.add('senderbox');
    
    div.prepend(sendMessage(message , date));

    return div;
  }
  else {

    const div = document.createElement("div");
    const logo = document.createElement("img");

    logo.setAttribute('src', logo_image);
    
    if(parseInt(date.slice(11,13)) < 13){
      if ( parseInt(date.slice(12,13)) === 0){
        data = "오전 10"  + d.slice(13,16)
        let text = document.createTextNode(message.split("방이름")[0] + '\n' +  data);
        div.appendChild(text + '\n' + data );    
      }
      else{
        data = "오전 " + d.slice(12,13).replace("0","1") + d.slice(13,16)
        let text = document.createTextNode(message.split("방이름")[0] + '\n' +  data);
        div.appendChild(text + '\n' + data );      
      }
    }
    else if ( parseInt(date.slice(11,12)) === 2 ){
      data = "오후 " + parseInt(date.slice(11,12)) - 12 + d.slice(13,16)
      let text = document.createTextNode(message.split("방이름")[0] + '\n' +  data);
      div.appendChild(text + '\n' + data );    
    }
    else {
      data = "오후 " + parseInt(date.slice(11,12)) - 12 + d.slice(13,16)
      let text = document.createTextNode(message.split("방이름")[0] + '\n' +  data);
      div.appendChild(text + '\n' + data );    
    }

    

    div.classList.add('receiverbox');
    logo.classList.add('receiverimgae');

    div.prepend(logo);
    
    document.body.prepend(div)
    return div;

  }
}

const sendMessage = (message , date) => {
  const span = document.createElement("span");
  span.classList.add('sender');

  if(parseInt(date.slice(11,13)) < 13){
    if ( parseInt(date.slice(12,13)) === 0){
      data = "오전 10"  + d.slice(13,16)
      span.appendChild(document.createTextNode(message.split("방이름")[0] + '\n' +  data))      
    }
    else{
      data = "오전 " + d.slice(12,13).replace("0","1") + d.slice(13,16)
      span.appendChild(document.createTextNode(message.split("방이름")[0] + '\n' +  data))
    }
  }
  else if ( parseInt(date.slice(11,12)) === 2 ){
    data = "오후 " + parseInt(date.slice(11,12)) - 12 + d.slice(13,16)
    span.appendChild(document.createTextNode(message.split("방이름")[0] + '\n' +  data))
  }
  else {
    data = "오후 " + parseInt(date.slice(11,12)) - 12 + d.slice(13,16)
    span.appendChild(document.createTextNode(message.split("방이름")[0] + '\n' +  data))
  }

  

  return span
}

/****************************** 아래 코드는 웹용  위 부분은 공용******************************/
// socket.emit('room', room)

// const handleSubmitNewMessage = () => {
//   socket.emit('message', nickname + ":" + message.value + "방이름" + room)
//   // Room()
// }


