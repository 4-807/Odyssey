var textArea = document.getElementById("msg");
var msg_board = document.getElementById("msg-board");
var msg_end = document.getElementById("msg-end");
function sendMsg(msg) {
    socket.emit("chat-message", id, msg);

}
function showMsg(name, msg) {
    msg_board.innerText += (name+":"+msg+"\n");
    msg_board.scrollTop = msg_board.scrollHeight;
}
document.onkeydown=function(e){
    if(e.keyCode == 13){
        if (textArea.hidden){
            e.preventDefault();
            textArea.hidden = false;
            textArea.focus();
            textArea.value = "";
        }else {
            if (textArea.value!=""){
                sendMsg(textArea.value);
                textArea.value = "";
                textArea.hidden = true;
            } else{
                textArea.hidden = true;
            }
        }
    }
};
textArea.onkeydown=function(e){
    if(e.keyCode === 13 && e.ctrlKey){
        textArea.value += "\n";
    }else if(e.keyCode == 13){
        if (!textArea.hidden){
            e.preventDefault();
            e.cancelBubble = true;
            e.stopPropagation();
            if (textArea.value!=""){
                sendMsg(textArea.value);
                textArea.value = "";
                textArea.hidden = true;
            } else{
                textArea.hidden = true;
            }
        }

    }
};