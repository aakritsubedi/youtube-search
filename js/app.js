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
  $("#by-title").on("submit", function(e) {
    e.preventDefault();
    // prepare the request
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#search-name").val()).replace(/%20/g, "+"),
      maxResults: 5,
      order: "viewCount"
    });
    // execute the request
    request.execute(function(response) {
      var results = response.result;
      $("#resultsTitle").html("");
      $.each(results.items, function(index,item) {
        $.get("player/item.html", function(data) {      
          $("#resultsTitle").append(
            makeData(data, [
              { title: item.snippet.title, videoid: item.id.videoId, description:item.snippet.description, publishedAt: item.snippet.publishedAt, channelTitle: item.snippet.channelTitle, channelId: item.snippet.channelId, tags: 'N/A' }
            ])
          );
        });
      });
    });
  });
});
// by Id
$(function() {
  $("#by-id").on("submit", function(e) {
    e.preventDefault();
    // prepare the request
    var request = gapi.client.youtube.videos.list({
      part: "snippet",
      id: $("#search-id").val(),
    });
    // execute the request
    request.execute(function(response) {
      var results = response.result;
      var tagData= "<ul>";
      $.each(results.items[0].snippet.tags, function( index, tag ) {
        tagData += "<li>"+tag+"</li>"
      });
      tagData += "</ul>";
      
      $("#resultsId").html("");
      $.each(results.items, function(index,item) {
        $.get("player/item.html", function(data) {      
          $("#resultsId").append(
            makeData(data, [
              { title: item.snippet.title, videoid: item.id.videoId, description:item.snippet.description, publishedAt: item.snippet.publishedAt, channelTitle: item.snippet.channelTitle, channelId: item.snippet.channelId, tags: tagData }
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
