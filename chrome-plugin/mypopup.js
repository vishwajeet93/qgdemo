function onPageDetailsReceived(pageDetails)  {
    document.getElementById('summary').innerText = pageDetails.summary;
}
var statusDisplay = null;
var $container = $('.container');
var $backdrop = $('.backdrop');
var $highlights = $('.highlights');
var $textarea = $('textarea');
var $bla = $('.form-control');
var ua = window.navigator.userAgent.toLowerCase();
var isIE = !!ua.match(/msie|trident\/7|edge/);

function handleInput() {
  var text = document.getElementById('summary').value;
  // console.log($bla);
  // console.log(text);
  var highlightedText = applyHighlights(text);
  // console.log('h' , highlightedText);
  document.getElementById('highlights').innerHTML = highlightedText;
  // $highlights.html(highlightedText);
  // console.log('inp');
}

function handleScroll() {
  document.getElementById('backdrop').scrollTop = document.getElementById('summary').scrollTop;
  document.getElementById('backdrop').scrollLeft = document.getElementById('summary').scrollLeft;
  console.log(document.getElementById('backdrop').scrollTop);
  console.log(document.getElementById('summary').scrollTop);
  console.log(document.getElementById('backdrop').scrollLeft);
  console.log(document.getElementById('summary').scrollLeft);

}

function bindEvents() {
	// console.log('eve');
  $textarea.on({
    'input': handleInput,
    'scroll': handleScroll
  });
}

function applyHighlights(text) {
  text = text
    .replace(/\n$/g, '\n\n')
    .replace(/[A-Z].*?\b/g, '<mark>$&</mark>');
  
  if (isIE) {
    // IE wraps whitespace differently in a div vs textarea, this fixes it
    text = text.replace(/ /g, ' <wbr>');
  }
  console.log(text);
  // console.log(document.getElementById('summary').style.word-spacing);
  // console.log(document.getElementById('highlights').style.word-spacing);
  return text;
}

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
    // bindEvents();
    // console.log('loa');
    // Handle the bookmark form submit event with our addBookmark function
    // document.getElementById('addbookmark').addEventListener("click", addBookmark);
    document.getElementById('summary').addEventListener("input", handleInput);
    document.getElementById('summary').addEventListener("scroll", handleScroll);
    // // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This injects
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});
