// const fs = require('fs');
// const path = require('path');

var nbgv = require('nerdbank-gitversioning');
nbgv.getVersion()
    .then((r) => console.log(r))
    .catch((e) => console.error(e));
