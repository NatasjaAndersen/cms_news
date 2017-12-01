const helpers = require('./../helpers');
const database = require('./../data/database');
module.exports = {
    'GET' : function(req, res){
        var cookie = helpers.getCookies(req);
        database.verifySession(res, cookie, function(data){//Tjekker om brugeren er logget ind og hvis ja så får man ikke lov at logge ind igen
            if(helpers.objEmpty(data)){
                // Hvis vi er her er brugeren ikke logget ind
                helpers.redirect(res, '/login.html');
                return;
            } //Den her sørger for at der er en login form at udfylde
            // Hvis vi er her er brugeren allerede logget ind
            // Sætter expiretime til now() + 900000 ms svarende til 15 min ude i fremtiden
            var expiretime = new Date(new Date().getTime() + 900000).toUTCString();  // 900000 ms = 15 min
            res.setHeader('Set-cookie', [`id=${cookie.id}; expires=${expiretime}`]);
            helpers.redirect(res, 'admin/index.html');
            // helpers.fileRespond(res, 'admin/index.html');
        })
        
    },

    'POST' : function(req, res){//Når formen bliver postet det vil sige at der trykkes på submit så bliver den her aktiveret
        helpers.getFormData(req, res, function(userCreds){ //Den trækker datane ud som er indtaste som havner i usercreds
            database.verifyUserCreds(res, userCreds, function(data){//Den slår op i db og tjekekr om der findes en bruger med de pågældende usercreds i db
                var empty = helpers.objEmpty(data);//Her tjekker vi om data er tomt, så hvis det er sandt så ryger vi ned i if empty
                if(empty){ //Her bliver du sendt tilbage til login siden med beskedn at det er forket login
                    // helpers.redirect(res, '/login.html');
                    helpers.fileRespond(res, 'public/login.html', '<h5 class="msg">Forkert brugernavn eller kodeord</h5>');
                    return;
                }
                    //Men er det rigtigt så ryger vi herned som laver en ny session
                database.createSession(res, data[0], function(dbsess){
                    if(helpers.objEmpty(dbsess)){
                        helpers.respond(res, {besked : "Kunne ikke oprette session"}, 404);
                        return;
                    }
                    // Sætter expiretime til now() + 900000 ms svarende til 15 min ude i fremtiden
                    var expiretime = new Date(new Date().getTime() + 900000).toUTCString();  
                    res.setHeader('Set-cookie', [`id=${dbsess}; expires=${expiretime}`]);//Her bliver de rlavet en cookie som har en bestemt udløbstid, men hvergang man laver noget nyt på login sessionen så bliver sessionen fornyet så der kommer nye 15min op i login sessionen
                    // helpers.fileRespond(res, 'admin/index.html');
                    helpers.redirect(res, '/admin/index.html');
                })
            });
        });
    }
};