// Set up config
var rng = Math.floor((Math.random() * 10000) + 1);
var didConfig = {
        clientId: "DIM-LIVE.ICE.WEB-PROD",
        debug: true,
        cssOverride: "https://"+window.location.hostname+"/assets/styles/css/disney-one-id.css?"+rng,
        l10nContent: "PROD",
        responderPage: "https://"+window.location.hostname+"/oneIdResponder.html"
};
var did = DisneyID.get(didConfig);
did.init();


const didOptElems = document.querySelectorAll('.did-opt-in');
didOptElems.forEach(elem => {
  elem.addEventListener("click", e => {
    e.preventDefault();
    iniOneId();
  })
})

// Mutation observer for when featured event loads in
var callback = function(mutationsList) {
  for(var mutation of mutationsList) {
    if (mutation.type == 'childList') {
      document.querySelectorAll('.did-opt-in').forEach(elem => {
        elem.addEventListener("click", e => {
          e.preventDefault();
          iniOneId();
        })
      })
    }
  }
};
var observer = new MutationObserver(callback);
observer.observe(document.body, {childList: true});

function iniOneId() {
  // console.log('iniOneId');
  //did = DisneyID.get();
  did.getLoggedInStatus().then((function (status) {
    if (status) {
      return alert('It looks like you already are a Preferred Customer. You will receive updates and offers as they come available. Thank you!');
    }
    return did.launchRegistration();
  }))
}