module.exports = function shuffle(type, playlistTracks){
   if (type == "random")
   {
      return shuffRandom(playlistTracks);
   }
   if (type === "artists" || type === "album")
   {
      return shuffCategory(playlistTracks, type);
   }
};

const shuffRandom = (playlistTracks) => {
   let URIs = extractURI(playlistTracks);
   let newURIs;
   newURIs = fischerYates(fischerYates(URIs));
   return newURIs;
}


const shuffCategory = (playlistTracks, category) => {
   let dict = extractDict(playlistTracks, category);
   let shuffedKeys = fischerYates(fischerYates(Object.keys(dict)));
   let combinedURIs = [];
   for (let i = 0; i < Object.keys(dict).length; i++)
   {
      let key = shuffedKeys[i];
      let tempURIs = dict[key];
      if (category = "album")
      {
         //sort album here
      }

      if (category == "artists")
      {
         tempURIs = fischerYates(fischerYates(tempURIs));
      }
      combinedURIs = combinedURIs.concat(tempURIs);
   }
   return combinedURIs;
}
       
///////////////////////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////////////////////
   
const fischerYates = (array) => {
   var lastIndex = array.length, toSwap, toBeSwapped;

   while (lastIndex) {
      toBeSwapped = Math.floor(Math.random() * lastIndex--);

      toSwap = array[lastIndex];
      array[lastIndex] = array[toBeSwapped];
      array[toBeSwapped] = toSwap;
   }

   return array;
};


const extractURI = (playlistTracks) => {
   let URIs = [];
   for (var i = 0; i < playlistTracks.length; i++) {
      URIs.push(playlistTracks[i].track.uri);
   }
   return URIs;
}


const extractDict = (playlistTracks, key) => {
   let dict = {};
   let newKey;
   for (var i = 0; i < playlistTracks.length; i++) {
      if (key == "artists")
      {
         newKey = playlistTracks[i].track[key][0].id;
      }
      else {
         newKey = playlistTracks[i].track[key].id;
      }
      let newVal = playlistTracks[i].track.uri;
      if (!(newKey in dict)) {
         dict[newKey] = [];
      }
      dict[newKey].push(newVal);
   }
   return dict;
}


