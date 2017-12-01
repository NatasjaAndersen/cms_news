const helpers = require('./../helpers');
const database = require('./../data/database');
const url = require('url');
const qs = require('querystring');

module.exports = {
    'GET' : function(req, res){
        var query = url.parse(req.url).query
        var params = qs.parse(query);
        var sql = 'select * from articles where category_id = ?';
        database.query(res, sql, [params.catid], function(data){
            helpers.respond(res, data);
        });
    },

    'POST' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            var sql = 'insert into articles (category_id, title, content) values(?, ?, ?)';
            var values = [formData.catId, formData.title, formData.article];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            });
        });
},

'DELETE' : function(req, res){
    helpers.getFormData(req,res,function(formData){
        if(helpers.objEmpty(formData)){
            helpers.respond(res, {besked : "DEr opstod en fejl"},500)
            return;
    
    }
    var sql = 'delete from articles where id = ?';
    var values = [formData.id];
    database.query(res, sql, values, function(data){
        helpers.respond(res, data);
        })
    });
},

'PUT': function (req, res) {
    var cookie = helpers.getCookies(req)  // Først hentes browserens cookie fra det indkommende request... 
    database.verifySession(res, cookie, function (data) {   // ...dernæst verificeres om sessionen er gyldig.
        if(helpers.objEmpty(data)){
            // Hvis vi er her, er der ikke fundet en gylig session i databasen der matcher browserens cookie...
            helpers.redirect(res, '/'); // ...derfor redirectes brugeren tilbage til '/'
            return  // og afslutter kommunikationen.
        }
        // Hvis vi er her er det fordi der er fundet en gyldig session i databasen der matcher browserens cookie
        
        helpers.getFormData(req, res, function (formData) {  // Hent data fra formen
            if(helpers.objEmpty(formData)){ // Check om der er nogle data
                helpers.respond(res, {besked: 'Der opstod en fejl'})    // Hvis ikke, så send fejlbesked.
            }

            
            var sql = 'update articles set category_id = ?, title = ?, content = ? where id = ?';
            var values = [formData.id, formData.category_id, formData.title, formData.article];
            database.query(res, sql, values, function (data) {
                helpers.respond(res, data);
            });
        });
    });
}



//      'POST' : function(req, res){
//         helpers.getFormData(req, res, function(formData){
//             if(helpers.objEmpty(formData)){
//                 helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
//                 return;
//             }
//             var sql = 'insert into articles (category_id, title, content) values(?, ?, ?)';
//             var values = [formData.catId, formData.title, formData.article];
//             database.query(res, sql, values, function(data){
//                 helpers.respond(res, data);
//             });
//         });
// }


//     'POST' : function(req, res){
//         helpers.getFormData(req,res,function(formData){
//             if(helpers.objEmpty(formData)){
//                 helpers.respond(res, {besked : "DEr opstod en fejl"},500)
//                 return;
        
//         }
//         var sql = 'insert into articles (ntitle,content,created ) values(?, ?, ?, ?)';
//         var values = [formData.caname, formData.catpos];
//         database.query(res, sql, values, function(data){
//             helpers.respond(res, data);
//         })
//     });
// },

// 'POST' : function(req, res){
//     helpers.getFormData(req,res,function(formData){
//         if(helpers.objEmpty(formData)){
//             helpers.respond(res, {besked : "DEr opstod en fejl"},500)
//             return;
    
//     }
//     var sql = 'insert into articles (id, category_id, title,content,created) values(?, ?, ?, ?, ?)';
//     var values = [formData.articleKategori, formData.articleTitle, formData.articleContent];
//     database.query(res, sql, values, function(data){
//         helpers.respond(res, data);
//     })
// });
// },





//  // Opdaterer et menupunkts 'name' og/eller 'position' i databasen
//  'PUT': function (req, res) {
    
//     var cookie = helpers.getCookies(req)  // Først hentes browserens cookie fra det indkommende request... 
//     database.verifySession(res, cookie, function (data) {   // ...dernæst verificeres om sessionen er gyldig.
//         if(helpers.objEmpty(data)){
//             // Hvis vi er her, er der ikke fundet en gylig session i databasen der matcher browserens cookie...
//             helpers.redirect(res, '/'); // ...derfor redirectes brugeren tilbage til '/'
//             return  // og afslutter kommunikationen.
//         }
//         // Hvis vi er her er det fordi der er fundet en gyldig session i databasen der matcher browserens cookie
        
//         helpers.getFormData(req, res, function (formData) {  // Hent data fra formen
//             if(helpers.objEmpty(formData)){ // Check om der er nogle data
//                 helpers.respond(res, {besked: 'Der opstod en fejl'})    // Hvis ikke, så send fejlbesked.
//             }

//             var values = [formData.catname, formData.catpos, formData.id]
//             var sql = "update articles set title = ?, content =?, position = ? where id = ?";
//             database.query(res, sql, values, function (data) {
//                 helpers.respond(res, data);
//             });
//         });
//     });
// }





};