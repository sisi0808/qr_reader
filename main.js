var imageObj = new Image();
window.onload = function() {
    document.getElementById("pasteTarget").
        addEventListener("paste", handlePaste);
    var canvas = document.getElementById('canvasTarget');
    var context = canvas.getContext('2d');

    imageObj.onload = function() {
        canvas.width  = imageObj.width;
        canvas.height = imageObj.height;
        context.drawImage(imageObj, 0, 0);
        let judge = checkQRCode(canvas, context);
        if(judge){
            const result = document.getElementById('result')
            result.innerHTML = `<p>${AutoLink(judge)}</p>`
        }
    };
};

function handlePaste(e) {
    for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
        var item = e.clipboardData.items[i];
        console.log("Item type: " + item.type);
        if (item.type.indexOf("image") != -1) {
            //uploadFile(item.getAsFile());
            imageObj.src = URL.createObjectURL(item.getAsFile());
        } else {
            console.log("Discarding non-image paste data");
        }
    }
}

// 画像がＱＲコードかチェックする
function checkQRCode(canvas,context){
  var imageData = context.getImageData( 0, 0, canvas.width, canvas.height );
  var code = jsQR( imageData.data, canvas.width, canvas.height );
  if( code ){
    //alert( code.data );
    return code.data;
  }else{
    alert( "No QR Code found." );
    return false;
  }
}

// 文字列の中にURLが存在していたら、aタグを埋め込む
function AutoLink(str) {
    var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;
    var regexp_makeLink = function(all, url, h, href) {
        return '<a href="h' + href + '">' + url + '</a>';
    }

    return str.replace(regexp_url, regexp_makeLink);
}

// デフォルトでは使用しないが、サーバーにデータを送る必要があるときは以下の関数を弄る
function uploadFile(file) {
    var xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(e) {
        var percentComplete = (e.loaded / e.total) * 100;
        console.log("Uploaded: " + percentComplete + "%");
    };

    xhr.onload = function() {
        if (xhr.status == 200) {
            alert("Sucess! Upload completed");
        } else {
            alert("Error! Upload failed");
        }
    };

    xhr.onerror = function() {
        alert("Error! Upload failed. Can not connect to server.");
    };

    xhr.open("POST", "FileUploader", true);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
}
