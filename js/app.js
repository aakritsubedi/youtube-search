function makeData(e, t) {
  res = e;
  for (var n = 0; n < t.length; n++) {
    res = res.replace(/\{\{(.*?)\}\}/g, function(e, r) {
      return t[n][r];
    });
  }
  return res;
}

$(function() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    // prepare the request
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
      maxResults: 5,
      order: "viewCount"
    });
    // execute the request
    request.execute(function(response) {
      var results = response.result;
      $("#results").html("");
      $.each(results.items, function(index,item) {
        console.log(item.snippet);
        
        $.get("player/item.html", function(data) {      
          $("#results").append(
            makeData(data, [
              { title: item.snippet.title, videoid: item.id.videoId, description:item.snippet.description, publishedAt: item.snippet.publishedAt, channelTitle: item.snippet.channelTitle, channelId: item.snippet.channelId }
            ])
          );
        });
      });
    });
  });
});

function init() {
  gapi.client.setApiKey("AIzaSyClgo5jx9Ojs_T2qQ4kTrRBCvWEJmThDj8");
  gapi.client.load("youtube", "v3", function() {
    // YouTube api is ready
  });
}
