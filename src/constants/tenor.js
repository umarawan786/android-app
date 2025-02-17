/*
Content Formats: https://developers.google.com/tenor/guides/response-objects-and-errors#content-formats

Tenor's API offers the following five base formats in a variety of sizes: 
  - GIF
  - MP4
  - Transparent WebP
  - WebM
  - Transparent GIF
  
The MP4 and WebM formats play their clip only once, with the exception of the loopedmp4, which plays the clip a few times. 
The GIF format plays its clip on a continuous loop. 
The transparent formats are for sticker content and aren't available in GIF search results.

Posts endpoint: curl "https://tenor.googleapis.com/v2/posts?key=API_KEY&client_key=my_test_app&ids=11586094175715197775"
*/

export const ALL_CONTENT_FILTERS = ["off", "low", "medium", "high"];
