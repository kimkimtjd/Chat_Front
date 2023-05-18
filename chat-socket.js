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


/******************************************************* 채팅 이미지클릭 확댐및 이동 대기중 *******************************************************/

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
          if (data[i].sender === pk) {
            messages.appendChild(buildNewMessage(nickname + "dflksjfdsj" + data[i].content.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
          else {
            messages.appendChild(buildNewMessage(data[i].nickname + "dflksjfdsj" + data[i].content.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
        }

        /* 이미지 */
        else if(data[i].image_url !== ""){
          if (data[i].sender === pk) {
            messages.appendChild(buildNewMessage(nickname + ":" + data[i].image_url.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
          }
          else {
            messages.appendChild(buildNewMessage(data[i].nickname + ":" + data[i].image_url.replace('<br/>', '\n') + "방이름" + data[i].group, data[i].biz_logo, data[i].created, String(data[i].today), data[i].minute));
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

  console.log(chat)
  /* 현재시간 1번쨰 메세지가 아닐경우 */
  if (todaysdads === totaltime.slice(10, 16)) {
    if(chat.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com") && !chat.includes('businesscard_certifycode')){
      socket.emit('message', arg + ":" + chat + today + "null" + "방이름" + roomname)
      console.log("이미지")
    }
    else if(chat.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com") && chat.includes('businesscard_certifycode')){
      socket.emit('message', arg + "dflksjfdsj" + chat + today + "null" + "방이름" + roomname)
      console.log("명함")
    }
    else{
      socket.emit('message', arg + ":" + chat + today + "null" + "방이름" + roomname)
      console.log("메세지")
    }
  }
  /* 현재시간 1번쨰 메세지일경우 -> 시간 초기화 */
  else {
    todaysdads = totaltime.slice(10, 16)
    if(chat.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com") && !chat.includes('businesscard_certifycode')){
      socket.emit('message', arg + ":" + chat + today + "방이름" + roomname)    
      console.log("이미지")
    }
    else if(chat.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com") && chat.includes('businesscard_certifycode')){
      socket.emit('message', arg + "dflksjfdsj" + chat + today + "방이름" + roomname)    
      console.log("명함")
    }
    else{
      socket.emit('message', arg + ":" + chat + today + totaltime.slice(10, 16) + "방이름" + roomname)
      console.log("이미지")
    }
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

/******************************************************* 명함 *******************************************************/
const businesscardMessage = (message) => {
  
  const div = document.createElement("div");
  div.classList.add('today_active');

}

/******************************************************* 1차 본인여부 검증 *******************************************************/

/* 소켓 연결 후 메세지 송수신 [1차 -> buildNewMessage로 값을전달 ] */
const handleNewMessage = (message) => {

  /* 이미지 */
  if(message.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com/Chat") && !message.includes('businesscard_certifycode')){
    if (message.includes("null")) {
      messages.appendChild(buildNewMessage(message.replace("null", ""), biz_logo, totaltime, "null", "null"));
    }
    else {
      messages.appendChild(buildNewMessage(message.replace(totaltime.slice(0, 10), "").replace(totaltime.slice(10, 16), ""), biz_logo, totaltime, totaltime.slice(0, 10), totaltime.slice(10, 16)));
    }
  }

  /* 명함 */
  else if (message.includes("scrapmarket.s3.ap-northeast-2.amazonaws.com/Chat") && message.includes('businesscard_certifycode')){
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
  if (message.split(":")[0] === nickname || message.split("dflksjfdsj")[0] === nickname) {

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
  logo.setAttribute('src', "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/calendar_month(1).svg");

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

/* 송신 */
const sendMessage = (message) => {

  /* 이미지 */
  if(message.includes("https://scrapmarket.s3.ap-northeast-2.amazonaws.") && !message.includes('businesscard_certifycode') ){
    const chat_image = document.createElement("img");
    chat_image.classList.add('chat_image');
    if(message.includes("null")){
      chat_image.setAttribute('src', message.replace(":","").replace(nickname ,"").replace(nickname ,"").replace(totaltime.slice(10, 16),"").replace("null",""));
    }
    else{
      chat_image.setAttribute('src', message.replace(":","").replace(nickname ,"").replace(nickname ,"").replace(totaltime.slice(10, 16),""));
    }
 
    return chat_image
  }
  /* 메세지 */
  else{
    if(message.includes("businesscard_certifycode")){
      
      console.log(message)

      const div = document.createElement("div");
      div.classList.add("businesscard_full")

      const div_logo = document.createElement("div");
      div_logo.classList.add("businesscard_logo")

      const div_logo_img = document.createElement("img");
      div_logo_img.classList.add("businesscard_logo_img")

      /* 로고 */ 
      div_logo_img.setAttribute('src' , message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[0])
      // const parts = message.split("방이름");
      // if (parts.length > 1) {
      //   const subParts = parts[1].split("dflksjfdsj");
      //   if (subParts.length > 1) {
      //     const src = subParts[1].split("&&")[0];
      //     div_logo_img.setAttribute('src', src);
      //   }
      // }

      div.prepend(div_logo)
      div_logo.prepend(div_logo_img)

      /* 명함정보 전체 박스 */
      const div_info_total = document.createElement("div");
      div_info_total.classList.add("businesscard_information")
      div.appendChild(div_info_total)

      /* 닉네임 이름 직급 */
      const div_info_first = document.createElement("div");
      div_info_first.classList.add("businesscard_info_first")

      /* 회사명 지역 상세주소 */
      const div_info_second = document.createElement("div");
      div_info_second.classList.add("businesscard_info_second")

      /* 휴대전화 전화 이메일 */
      const div_info_third = document.createElement("div");
      div_info_third.classList.add("businesscard_info_third")

      /* 1번째줄 이미지 */
      const div_info_first_img = document.createElement("div");
      div_info_first_img.classList.add("businesscard_info_first_logo")

      const div_info_first_img_img = document.createElement("img");
      div_info_first_img_img.setAttribute('src' , "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/businesscard_first.png")
      div_info_first_img_img.classList.add("businesscard_info_first_logo_img")

      div_info_total.prepend(div_info_first)
      div_info_first.prepend(div_info_first_img)
      div_info_first_img.prepend(div_info_first_img_img)

      // 여기
      const div_info_first_box = document.createElement("div");
      div_info_first_box.classList.add("businesscard_info_first_list")
      div_info_first.appendChild(div_info_first_box)

      /* 닉네임 */
      const div_info_first_nickname_box = document.createElement("div");
      div_info_first_nickname_box.classList.add("businesscard_info_nickname")

      const div_info_first_nickname_title = document.createElement("span");
      div_info_first_nickname_title.classList.add("businesscard_info_nickname_title")
      div_info_first_nickname_title.prepend("닉네임")

      const div_info_first_nickname_data = document.createElement("span");
      div_info_first_nickname_data.classList.add("businesscard_info_nickname_data")
      div_info_first_nickname_data.prepend(message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[1])
      

      div_info_first_box.prepend(div_info_first_nickname_box)
      div_info_first_nickname_box.prepend(div_info_first_nickname_title)
      div_info_first_nickname_box.appendChild(div_info_first_nickname_data)


      /* 이름 */
      const div_info_first_name_box = document.createElement("div");
      div_info_first_name_box.classList.add("businesscard_info_name")

      const div_info_first_name_title = document.createElement("span");
      div_info_first_name_title.classList.add("businesscard_info_name_title")
      div_info_first_name_title.prepend("이름")

      const div_info_first_name_data = document.createElement("span");
      div_info_first_name_data.classList.add("businesscard_info_name_data")
      div_info_first_name_data.prepend(message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[2])


      div_info_first_box.appendChild(div_info_first_name_box)
      div_info_first_name_box.prepend(div_info_first_name_title)
      div_info_first_name_box.appendChild(div_info_first_name_data)

      /* 직급 */
      const div_info_first_position_box = document.createElement("div");
      div_info_first_position_box.classList.add("businesscard_info_position")

      const div_info_first_position_title = document.createElement("span");
      div_info_first_position_title.classList.add("businesscard_info_position_title")
      div_info_first_position_title.prepend("직급")

      const div_info_first_position_data = document.createElement("span");
      div_info_first_position_data.classList.add("businesscard_info_position_data")
      div_info_first_position_data.prepend(message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[3])


      div_info_first_box.appendChild(div_info_first_position_box)
      div_info_first_position_box.prepend(div_info_first_position_title)
      div_info_first_position_box.appendChild(div_info_first_position_data)

      
       /* 2번째줄 이미지 */
      const div_info_second_img = document.createElement("div");
      div_info_second_img.classList.add("businesscard_info_second_logo")

      const div_info_second_img_img = document.createElement("img");
      div_info_second_img_img.setAttribute('src' , "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/businesscard_second.png")
      div_info_second_img_img.classList.add("businesscard_info_first_logo_img")

      div_info_total.appendChild(div_info_second)
      div_info_second.prepend(div_info_second_img)
      div_info_second_img.prepend(div_info_second_img_img)

      const div_info_second_box = document.createElement("div");
      div_info_second_box.classList.add("businesscard_info_first_list")
      div_info_second.appendChild(div_info_second_box)

       /* 회사명 */
       const div_info_first_businessname_box = document.createElement("div");
       div_info_first_businessname_box.classList.add("businesscard_info_nickname")
 
       const div_info_first_businessname_title = document.createElement("span");
       div_info_first_businessname_title.classList.add("businesscard_info_nickname_title")
       div_info_first_businessname_title.prepend("회사명")
 
       const div_info_first_businessname_data = document.createElement("span");
       div_info_first_businessname_data.classList.add("businesscard_info_nickname_data")
       div_info_first_businessname_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[4])
 
 
       div_info_second_box.prepend(div_info_first_businessname_box)
       div_info_first_businessname_box.prepend(div_info_first_businessname_title)
       div_info_first_businessname_box.appendChild(div_info_first_businessname_data)
 
 
       /* 지역 */
       const div_info_first_location_box = document.createElement("div");
       div_info_first_location_box.classList.add("businesscard_info_name")
 
       const div_info_first_location_title = document.createElement("span");
       div_info_first_location_title.classList.add("businesscard_info_name_title")
       div_info_first_location_title.prepend("지역")
 
       const div_info_first_location_data = document.createElement("span");
       div_info_first_location_data.classList.add("businesscard_info_name_data")
       div_info_first_location_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[5])
 
 
       div_info_second_box.appendChild(div_info_first_location_box)
       div_info_first_location_box.prepend(div_info_first_location_title)
       div_info_first_location_box.appendChild(div_info_first_location_data)
 
       /* 상세주소 */
       const div_info_first_detail_box = document.createElement("div");
       div_info_first_detail_box.classList.add("businesscard_info_position")
 
       const div_info_first_detail_title = document.createElement("span");
       div_info_first_detail_title.classList.add("businesscard_info_position_title")
       div_info_first_detail_title.prepend("상세주소")
 
       const div_info_first_detail_data = document.createElement("span");
       div_info_first_detail_data.classList.add("businesscard_info_position_data")
       div_info_first_detail_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[6])
 
 
       div_info_second_box.appendChild(div_info_first_detail_box)
       div_info_first_detail_box.prepend(div_info_first_detail_title)
       div_info_first_detail_box.appendChild(div_info_first_detail_data)
 
      /* 3번째줄 이미지 */
      const div_info_third_img = document.createElement("div");
      div_info_third_img.classList.add("businesscard_info_third_logo")

      const div_info_third_img_img = document.createElement("img");
      div_info_third_img_img.setAttribute('src' , "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/businesscard_third.png")
      div_info_third_img_img.classList.add("businesscard_info_third_logo_img")

      div_info_total.appendChild(div_info_third)
      div_info_third.prepend(div_info_third_img)
      div_info_third_img.prepend(div_info_third_img_img)

      const div_info_third_box = document.createElement("div");
      div_info_third_box.classList.add("businesscard_info_first_list")
      div_info_third.appendChild(div_info_third_box)

      /* 휴대전화 */
       const div_info_first_phone_box = document.createElement("div");
       div_info_first_phone_box.classList.add("businesscard_info_nickname")
 
       const div_info_first_phone_title = document.createElement("span");
       div_info_first_phone_title.classList.add("businesscard_info_nickname_title")
       div_info_first_phone_title.prepend("휴대전화")
 
       const div_info_first_phone_data = document.createElement("span");
       div_info_first_phone_data.classList.add("businesscard_info_nickname_data")
      //  div_info_first_phone_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[7]?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'))
      div_info_first_phone_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[7])

       div_info_third_box.prepend(div_info_first_phone_box)
       div_info_first_phone_box.prepend(div_info_first_phone_title)
       div_info_first_phone_box.appendChild(div_info_first_phone_data)
 
 
       /* 전화 */
       const div_info_first_tel_box = document.createElement("div");
       div_info_first_tel_box.classList.add("businesscard_info_name")
 
       const div_info_first_tel_title = document.createElement("span");
       div_info_first_tel_title.classList.add("businesscard_info_name_title")
       div_info_first_tel_title.prepend("전화")
 
       const div_info_first_tel_data = document.createElement("span");
       div_info_first_tel_data.classList.add("businesscard_info_name_data")
       
      //  if (message.split("방이름")[0].split(":")[1].split("&&")[8].length === 10) {
      //   div_info_first_tel_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[8].replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3'))
      // } else if (message.split("방이름")[0].split(":")[1].split("&&")[8].length === 11) {
      //   div_info_first_tel_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[8].replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
      // } else {
        div_info_first_tel_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[8])
      // }

       div_info_third_box.appendChild(div_info_first_tel_box)
       div_info_first_tel_box.prepend(div_info_first_tel_title)
       div_info_first_tel_box.appendChild(div_info_first_tel_data)
 
       /* 이메일 */
       const div_info_first_email_box = document.createElement("div");
       div_info_first_email_box.classList.add("businesscard_info_position")
 
       const div_info_first_email_title = document.createElement("span");
       div_info_first_email_title.classList.add("businesscard_info_position_title")
       div_info_first_email_title.prepend("이메일")
 
       const div_info_first_email_data = document.createElement("span");
       div_info_first_email_data.classList.add("businesscard_info_position_data")
       div_info_first_email_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[9].replace("businesscard_certifycode",""))
 
 
       div_info_third_box.appendChild(div_info_first_email_box)
       div_info_first_email_box.prepend(div_info_first_email_title)
       div_info_first_email_box.appendChild(div_info_first_email_data)

       return div
    }
    else{
      const span = document.createElement("span");
      span.classList.add('sender');
      span.prepend(document.createTextNode(message.split("방이름")[0].split(":")[1]))
  
      return span
    }
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

/* 수신 - 메세지 , 이미지  */
const receiveMessage = (message) => {

  /* 이미지 */
  if(message.includes("https://scrapmarket.s3.ap-northeast-2.amazonaws.")){
    const chat_image = document.createElement("img");
    chat_image.classList.add('chat_image');
    
    if(message.includes("null")){
      chat_image.setAttribute('src', message.replace(":","").replace(nickname ,"").replace(nickname ,"").replace(totaltime.slice(10, 16),"").replace("null",""));
    }
    else{
      chat_image.setAttribute('src', message.replace(":","").replace(nickname ,"").replace(nickname ,"").replace(totaltime.slice(10, 16),""));
    }

    return chat_image
  }
  else{

    if(message.includes("businesscard_certifycode")){
      
      console.log("명함입니다.")

      const div = document.createElement("div");
      div.classList.add("businesscard_full")

      const div_logo = document.createElement("div");
      div_logo.classList.add("businesscard_logo")

      const div_logo_img = document.createElement("img");
      div_logo_img.classList.add("businesscard_logo_img")

      /* 로고 */ 
      div_logo_img.setAttribute('src' , message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[0])
      

      div.prepend(div_logo)
      div_logo.prepend(div_logo_img)

      /* 명함정보 전체 박스 */
      const div_info_total = document.createElement("div");
      div_info_total.classList.add("businesscard_information")
      div.appendChild(div_info_total)

      /* 닉네임 이름 직급 */
      const div_info_first = document.createElement("div");
      div_info_first.classList.add("businesscard_info_first")

      /* 회사명 지역 상세주소 */
      const div_info_second = document.createElement("div");
      div_info_second.classList.add("businesscard_info_second")

      /* 휴대전화 전화 이메일 */
      const div_info_third = document.createElement("div");
      div_info_third.classList.add("businesscard_info_third")

      /* 1번째줄 이미지 */
      const div_info_first_img = document.createElement("div");
      div_info_first_img.classList.add("businesscard_info_first_logo")

      const div_info_first_img_img = document.createElement("img");
      div_info_first_img_img.setAttribute('src' , "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/businesscard_first.png")
      div_info_first_img_img.classList.add("businesscard_info_first_logo_img")

      div_info_total.prepend(div_info_first)
      div_info_first.prepend(div_info_first_img)
      div_info_first_img.prepend(div_info_first_img_img)

      // 여기
      const div_info_first_box = document.createElement("div");
      div_info_first_box.classList.add("businesscard_info_first_list")
      div_info_first.appendChild(div_info_first_box)

      /* 닉네임 */
      const div_info_first_nickname_box = document.createElement("div");
      div_info_first_nickname_box.classList.add("businesscard_info_nickname")

      const div_info_first_nickname_title = document.createElement("span");
      div_info_first_nickname_title.classList.add("businesscard_info_nickname_title")
      div_info_first_nickname_title.prepend("닉네임")

      const div_info_first_nickname_data = document.createElement("span");
      div_info_first_nickname_data.classList.add("businesscard_info_nickname_data")
      div_info_first_nickname_data.prepend(message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[1])
      

      div_info_first_box.prepend(div_info_first_nickname_box)
      div_info_first_nickname_box.prepend(div_info_first_nickname_title)
      div_info_first_nickname_box.appendChild(div_info_first_nickname_data)


      /* 이름 */
      const div_info_first_name_box = document.createElement("div");
      div_info_first_name_box.classList.add("businesscard_info_name")

      const div_info_first_name_title = document.createElement("span");
      div_info_first_name_title.classList.add("businesscard_info_name_title")
      div_info_first_name_title.prepend("이름")

      const div_info_first_name_data = document.createElement("span");
      div_info_first_name_data.classList.add("businesscard_info_name_data")
      div_info_first_name_data.prepend(message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[2])


      div_info_first_box.appendChild(div_info_first_name_box)
      div_info_first_name_box.prepend(div_info_first_name_title)
      div_info_first_name_box.appendChild(div_info_first_name_data)

      /* 직급 */
      const div_info_first_position_box = document.createElement("div");
      div_info_first_position_box.classList.add("businesscard_info_position")

      const div_info_first_position_title = document.createElement("span");
      div_info_first_position_title.classList.add("businesscard_info_position_title")
      div_info_first_position_title.prepend("직급")

      const div_info_first_position_data = document.createElement("span");
      div_info_first_position_data.classList.add("businesscard_info_position_data")
      div_info_first_position_data.prepend(message.split("방이름")[0].split("dflksjfdsj")[1].split("&&")[3])


      div_info_first_box.appendChild(div_info_first_position_box)
      div_info_first_position_box.prepend(div_info_first_position_title)
      div_info_first_position_box.appendChild(div_info_first_position_data)

      
       /* 2번째줄 이미지 */
      const div_info_second_img = document.createElement("div");
      div_info_second_img.classList.add("businesscard_info_second_logo")

      const div_info_second_img_img = document.createElement("img");
      div_info_second_img_img.setAttribute('src' , "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/businesscard_second.png")
      div_info_second_img_img.classList.add("businesscard_info_first_logo_img")

      div_info_total.appendChild(div_info_second)
      div_info_second.prepend(div_info_second_img)
      div_info_second_img.prepend(div_info_second_img_img)

      const div_info_second_box = document.createElement("div");
      div_info_second_box.classList.add("businesscard_info_first_list")
      div_info_second.appendChild(div_info_second_box)

       /* 회사명 */
       const div_info_first_businessname_box = document.createElement("div");
       div_info_first_businessname_box.classList.add("businesscard_info_nickname")
 
       const div_info_first_businessname_title = document.createElement("span");
       div_info_first_businessname_title.classList.add("businesscard_info_nickname_title")
       div_info_first_businessname_title.prepend("회사명")
 
       const div_info_first_businessname_data = document.createElement("span");
       div_info_first_businessname_data.classList.add("businesscard_info_nickname_data")
       div_info_first_businessname_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[4])
 
 
       div_info_second_box.prepend(div_info_first_businessname_box)
       div_info_first_businessname_box.prepend(div_info_first_businessname_title)
       div_info_first_businessname_box.appendChild(div_info_first_businessname_data)
 
 
       /* 지역 */
       const div_info_first_location_box = document.createElement("div");
       div_info_first_location_box.classList.add("businesscard_info_name")
 
       const div_info_first_location_title = document.createElement("span");
       div_info_first_location_title.classList.add("businesscard_info_name_title")
       div_info_first_location_title.prepend("지역")
 
       const div_info_first_location_data = document.createElement("span");
       div_info_first_location_data.classList.add("businesscard_info_name_data")
       div_info_first_location_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[5])
 
 
       div_info_second_box.appendChild(div_info_first_location_box)
       div_info_first_location_box.prepend(div_info_first_location_title)
       div_info_first_location_box.appendChild(div_info_first_location_data)
 
       /* 상세주소 */
       const div_info_first_detail_box = document.createElement("div");
       div_info_first_detail_box.classList.add("businesscard_info_position")
 
       const div_info_first_detail_title = document.createElement("span");
       div_info_first_detail_title.classList.add("businesscard_info_position_title")
       div_info_first_detail_title.prepend("상세주소")
 
       const div_info_first_detail_data = document.createElement("span");
       div_info_first_detail_data.classList.add("businesscard_info_position_data")
       div_info_first_detail_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[6])
 
 
       div_info_second_box.appendChild(div_info_first_detail_box)
       div_info_first_detail_box.prepend(div_info_first_detail_title)
       div_info_first_detail_box.appendChild(div_info_first_detail_data)
 
      /* 3번째줄 이미지 */
      const div_info_third_img = document.createElement("div");
      div_info_third_img.classList.add("businesscard_info_third_logo")

      const div_info_third_img_img = document.createElement("img");
      div_info_third_img_img.setAttribute('src' , "https://scrapmarket.s3.ap-northeast-2.amazonaws.com/businesscard/businesscard_third.png")
      div_info_third_img_img.classList.add("businesscard_info_third_logo_img")

      div_info_total.appendChild(div_info_third)
      div_info_third.prepend(div_info_third_img)
      div_info_third_img.prepend(div_info_third_img_img)

      const div_info_third_box = document.createElement("div");
      div_info_third_box.classList.add("businesscard_info_first_list")
      div_info_third.appendChild(div_info_third_box)

      /* 휴대전화 */
       const div_info_first_phone_box = document.createElement("div");
       div_info_first_phone_box.classList.add("businesscard_info_nickname")
 
       const div_info_first_phone_title = document.createElement("span");
       div_info_first_phone_title.classList.add("businesscard_info_nickname_title")
       div_info_first_phone_title.prepend("휴대전화")
 
       const div_info_first_phone_data = document.createElement("span");
       div_info_first_phone_data.classList.add("businesscard_info_nickname_data")
       div_info_first_phone_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[7])
 
       div_info_third_box.prepend(div_info_first_phone_box)
       div_info_first_phone_box.prepend(div_info_first_phone_title)
       div_info_first_phone_box.appendChild(div_info_first_phone_data)
 
 
       /* 전화 */
       const div_info_first_tel_box = document.createElement("div");
       div_info_first_tel_box.classList.add("businesscard_info_name")
 
       const div_info_first_tel_title = document.createElement("span");
       div_info_first_tel_title.classList.add("businesscard_info_name_title")
       div_info_first_tel_title.prepend("전화")
 
       const div_info_first_tel_data = document.createElement("span");
       div_info_first_tel_data.classList.add("businesscard_info_name_data")
       
      //  if (message.split("방이름")[0].split(":")[1].split("&&")[8].length === 10) {
      //   div_info_first_tel_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[8].replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3'))
      // } else if (message.split("방이름")[0].split(":")[1].split("&&")[8].length === 11) {
      //   div_info_first_tel_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[8].replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
      // } else {
        div_info_first_tel_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[8])
      // }

       div_info_third_box.appendChild(div_info_first_tel_box)
       div_info_first_tel_box.prepend(div_info_first_tel_title)
       div_info_first_tel_box.appendChild(div_info_first_tel_data)
 
       /* 이메일 */
       const div_info_first_email_box = document.createElement("div");
       div_info_first_email_box.classList.add("businesscard_info_position")
 
       const div_info_first_email_title = document.createElement("span");
       div_info_first_email_title.classList.add("businesscard_info_position_title")
       div_info_first_email_title.prepend("이메일")
 
       const div_info_first_email_data = document.createElement("span");
       div_info_first_email_data.classList.add("businesscard_info_position_data")
       div_info_first_email_data.prepend(message.split("방이름")[0].split(":")[1].split("&&")[9])
 
 
       div_info_third_box.appendChild(div_info_first_email_box)
       div_info_first_email_box.prepend(div_info_first_email_title)
       div_info_first_email_box.appendChild(div_info_first_email_data)

       return div
    }
    else{
      const span = document.createElement("span");
      span.classList.add('receivetext');  
      span.prepend(document.createTextNode(message.split("방이름")[0].split(":")[1]))
    
      return span
    }
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
