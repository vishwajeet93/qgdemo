function onPageDetailsReceived(pageDetails)  {
    document.getElementById('summary').innerText = pageDetails.summary;
}
var statusDisplay = null;
function addBookmark() {
  event.preventDefault();
  var summary = document.getElementById('summary').value;
  var url = 'http://localhost:9000/?properties=%7B%22annotators%22:%22tokenize,ssplit%22,%22outputFormat%22:%22json%22%7D';
  console.log(summary);
  jQuery.ajax({
  url : url,
  type: "POST",
  data : summary,
  success : function(res){
      console.log(res);
      var sentsarr = res["sentences"];
      var sents = [];
      var sent = '';
      for (var i=0;i<sentsarr.length;i++){
        for (var j=0;j<sentsarr[i]["tokens"].length;j++){
          sent = sent + sentsarr[i]["tokens"][j]["word"] + ' ';
        }
        sents.push(sent);
        sent = '';
      }
      console.log(sents);
      console.log(sents[0]);
      var data = [{"src" :null,"beam_size":5,"replace_unk":"true",
          "withAttn":"true"}];
      var i,dat;
      qna.innerHTML = '';
      for (i in sents){
          data[0].src = sents[i];
          dat = JSON.stringify(data);
          console.log(data);
          var targetUrl = 'http://52.172.194.2:7784/translator/translate';
          var proxyUrl ='https://cors-anywhere.herokuapp.com/';
          var postUrl = proxyUrl+targetUrl;
        jQuery.ajax({
            type: "POST",
            data : dat,
            url : postUrl,
            dataType:'json',
            contentType: "application/json",
            success: function(res) {
                console.log(res);
              qna.innerHTML +=  "<li class= list-group-item>" +"<span style='color:blue;font-weight:bold'>Question : </span>"+ res[0][0]["tgt"] + "</li>";
              qna.innerHTML +=  "<li class = 'list-group-item list-group-item-success' >" +"<span style='color:red;font-weight:bold'>Answer : </span>"+ res[0][0]["src"] + "</li>" + "<br/>";
            }
        });
      }
    }
    });

}

window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    qna = document.getElementById('qna');
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This injects
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});
