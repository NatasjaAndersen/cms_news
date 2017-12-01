(function () {
    document.addEventListener("click", menuclick, true);

    function menuclick(e) {
        var caller = e.target;
        if (!caller.dataset.cmd) {
            return;
        }
        if (document.querySelector('.itemActive')) {
            document.querySelector('.itemActive').classList.toggle('itemActive');
        }
        caller.classList.toggle('itemActive');

        switch (caller.dataset.cmd) {
            case 'logout': // OK
                logout();
                break;
            case 'categories': // OK 
                categories();
                break;
            case 'catEdit': // OK
                catEdit(caller);
                break;
            case 'catAdd':  // OK
                catAdd(caller);
                break;
            case 'catDelete' :   // OK
                catDelete(caller)
                break;
            case 'article' :
                article(caller);
                break
            case 'edit' : 
                edit();
                break;
            case 'articleAdd' : // OK
                articleAdd(caller);
                break;
            case 'articleDelete':
                articleDelete(caller);
                break;
            case 'articleEdit':
                articleEdit(caller);
                break;
            case 'users':   // OK
                users(caller);
                break;
            case 'userAdd' :    // OK
                userAdd(caller);
                break;
            case 'userDelete' :     // OK
                userDelete(caller);
                break;
            case 'userEdit' :   // OK
                userEdit(caller);
                break;
            default:
                alert(caller.dataset.cmd);
        }
    }

    // Sender ny artikel til serveren
    function articleAdd(caller){
        var frmId = caller.dataset.frm;
        var frm = document.querySelector(`#${frmId}`);
        var frmData = new FormData(frm);
        fetch('/article',{credentials:'include', method: 'post', body: frmData})
        .then(function(data){
            document.querySelector('div[data-cmd="article"]').click();
        })
        .catch(function(err){
            console.log(err);
        })
    }

    function articleEdit(caller) {
        var formId = caller.dataset.id
        var frm = document.querySelector(`#${formId}`);
        var frmData = new FormData(frm);
        fetch('/article', {
            credentials: 'include',
            method: 'put',
            body: frmData
        })
            .then(function (data) {
                document.querySelector('div[data-cmd="article"]').click();
                // return data.json();
            })
            .catch(function(err){
                console.log(err);
            })
    }


    function articleDelete(caller){
        var formId = caller.dataset.id
        var frm = document.querySelector(`#${formId}`);
        var frmData = new FormData(frm);
        fetch('/article', {
            credentials: 'include',
            method: 'delete',
            body: frmData
        })
        .then(function (data) {
            document.querySelector('div[data-cmd="article"]').click();
            // return data.json();
        })
    }

    // Dropdownbox med artikelkategorier
    function edit(id){
        fetch('/menuitems', {method: 'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            if(jsonData){
                var dropdown = document.createElement("select");
                dropdown.name="catId";
                dropdown.onchange = function(){
                    articleOverview(this)
                };
                var option = document.createElement("option");
                option.value = 0;
                option.textContent = "Vælg kategori";
                dropdown.appendChild(option);
                jsonData.forEach(function(jd){
                    option = document.createElement("option");
                    option.value = jd.id;
                    option.textContent = jd.name;
                    dropdown.appendChild(option);
                });

                var container = document.createElement("div");  // Opret div-container til dropdown
                container.id = "editContainer"                  // Set id på container
                container.className = "tbl-container";          // set className på container
                container.appendChild(dropdown);
                var content = document.querySelector('#content');
                content.innerHTML = '';                         // Tøm #content
                content.appendChild(container);                 // append container til #content
                
            }
        });
    }

    function articleOverview(caller){
        fetch('/article?catid='+caller.value, {method:'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            if(jsonData && jsonData.length > 0){
                // opret container


                var editContainer = document.querySelector("#editContainer");
                while(editContainer.childNodes.length > 1) {
                     editContainer.removeChild(editContainer.lastChild);
                }
                var hr = document.createElement('hr')
                hr.style.margin = '10px';

                editContainer.appendChild(hr);

                jsonData.forEach(function(jd){
                    
                    var form = document.createElement('form');   // Opret form med id
                    form.id = `frm${jd.id}`;
                    
                    var row = document.createElement('div');    // opret row med classname
                    row.className = "tbl-row";

                    var cell = document.createElement('div');   // opret cell med classname
                    cell.className = 'tbl-cell';

                    var input = document.createElement('input');      // opret readonly-input med value
                    input.readOnly = true;  
                    input.value = jd.title;
                            
                    cell.appendChild(input);    // append input til cell
                    input = document.createElement('input');
                    input.type = "hidden";
                    input.value = jd.id;
                    input.name = 'id';
                    cell.appendChild(input);
                    row.appendChild(cell);   // append cell til row

                    cell = document.createElement('div');   // opret cell til img-edit
                    cell.className = "tbl-cell";
                                
                    
                    var img = document.createElement('img'); // opret img til 'rediger-knap'
                    img.classList = "iconImage clickable";
                    img.src = "img/Refresh.png";
                    img.dataset.cmd = "articleEdit";
                    img.dataset.id = `frm${jd.id}`;

                    cell.appendChild(img);  // append img til cell
                    row.appendChild(cell);   // append cell til row

                    cell = document.createElement('div') // opret cell til img-edit
                    cell.className = "tbl-cell";

                    var img = document.createElement('img');    // opret img
                    img.classList = "iconImage clickable";
                    img.src = "img/Trash.png";
                    img.dataset.cmd = "articleDelete";
                    img.dataset.id = `frm${jd.id}`;

                    cell.appendChild(img);  // append img til cell

                    row.appendChild(cell);  // append cell til row

                    form.appendChild(row);   // append row til form

                    // container.appendChild(form);    // append form til container
                    editContainer.appendChild(form);

                });
            }
            
        })
        .catch(function(err){
            console.log(err);
        })
    }

    // Formular med textarea til ny artikel
    function article(){
        fetch('/menuitems', {method : 'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            if(jsonData){
                var dropdown = document.createElement("select");
                dropdown.name="catId";
                var option = document.createElement("option");
                option.value = 0;
                option.textContent = "Vælg kategori";
                dropdown.appendChild(option);
                jsonData.forEach(function(jd){
                    option = document.createElement("option");
                    option.value = jd.id;
                    option.textContent = jd.name;
                    dropdown.appendChild(option);
                });
                var form = document.createElement("form")
                form.id = "frmArticle";

                var title = document.createElement("input")
                title.width = 50;
                title.type = "text";
                title.name = "title";
                title.placeholder = "Artikel overskrift";
                var textarea = document.createElement("textarea")
                textarea.name = "article";
                form.appendChild(title);
                form.appendChild(textarea);
                form.appendChild(dropdown);
                var btn = document.createElement('button')
                btn.type = "button";
                btn.dataset.cmd = "articleAdd"
                btn.dataset.frm = "frmArticle";
                btn.innerHTML = "Upload";
                form.appendChild(btn);
                var container = document.createElement("div");
                container.className = "tbl-container";
                container.appendChild(form);
                var content = document.querySelector('#content');
                content.innerHTML = '';
                content.appendChild(container);
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }

    function users() {
            fetch('/users', { method: 'get' })
                .then(function (data) {
                    return data.json();
                })
                .then(function (jsonData) {
                    var content = `
                                <div class="cat-container"><div class="cat-head">Rediger brugere</div>
                                    <form>
                                        <div class="cat-row">
                                            <div class="cat-cell"><input readonly type="text" value="Navn"></div>
                                            <div class="cat-cell"><input readonly type="text" value="Password"></div>
                                        </div>
                                    </form>`;
                    jsonData.forEach(function (u) {
                        content += `<form id="frm${u.id}">
                                        <div class="cat-row">
                                            <div class="cat-cell">
                                                <input name="id" type="hidden" value="${u.id}">
                                                <input name="username" type="text" value="${u.username}">
                                            </div>
                                            <div class="cat-cell">
                                                <input name="userpass" type="text" value="${u.password}">
                                            </div>
                                            <div class="cat-cell">
                                                <img data-cmd="userEdit" data-id="frm${u.id}" class="iconImage clickable" src="img/refresh.png" title="Opdater">
                                            </div>
                                            <div class="cat-cell">
                                                <img data-cmd="userDelete" data-id="frm${u.id}" class="iconImage clickable" src="img/trash.png" title="Slet">
                                            </div>
                                        </div>
                                    </form>`;
                    });
                    content += `<br><hr>Eller tilføj bruger<form id="frmuserAdd">
                                    <div class="cat-row">
                                        <div class="cat-cell">
                                            <input name="username" type="text" placeholder="Brugernavn">
                                        </div>
                                        <div class="cat-cell">
                                            <input name="userpass" type="text" placeholder="Password">
                                        </div>
                                        <div class="cat-cell">
                                            <img data-cmd="userAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
                                        </div>
                                    </div>
                                <form>`;
        
                    // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
                    content += `</div>`;
                    document.querySelector('#content').innerHTML = content;
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        
        
        function userAdd(caller){
            var form = document.querySelector('#frmuserAdd');
            var formData = new FormData(form);
            fetch('/users',{
                credentials: 'include',
                method: 'post',
                body: formData
            })
            // console.log(formData.getAll('catname'));
            // alert(caller.dataset.cmd);
        
            .then(function(data){
                document.querySelector('div[data-cmd="users"]').click();
            })
            .catch(function(err){
                console.log(err)
            })
        
        }
        
        
        
        
        
        
        
        function userEdit(caller) {
            var formId = caller.dataset.id
            var frm = document.querySelector(`#${formId}`);
            var frmData = new FormData(frm);
            fetch('/users', {
                credentials: 'include',
                method: 'put',
                body: frmData
            })
                .then(function (data) {
                    document.querySelector('div[data-cmd="users"]').click();
                    // return data.json();
                })
        }
        
        
        function userDelete(caller){
            var formId = caller.dataset.id
            var frm = document.querySelector(`#${formId}`);
            var frmData = new FormData(frm);
            fetch('/users', {
                credentials: 'include',
                method: 'delete',
                body: frmData
            })
            .then(function (data) {
                document.querySelector('div[data-cmd="users"]').click();
                // return data.json();
            })
        }

    function categories() {
        fetch('/menuitems', { method: 'get' })
            .then(function (data) {
                return data.json();
            })
            .then(function (jsonData) {
                var content = `
                            <div class="tbl-container"><div class="tbl-head">Rediger menu</div>
                                <form>
                                    <div class="tbl-row">
                                        <div class="tbl-cell"><input class="center" readonly type="text" value="Navn"></div>
                                        <div class="tbl-cell"><input class="center" readonly type="text" value="Position"></div>
                                    </div>
                                </form>`;
                jsonData.forEach(function (d) {
                    content += `<form id="frm${d.id}">
                                    <div class="tbl-row">
                                        <div class="tbl-cell">
                                            <input name="id" type="hidden" value="${d.id}">
                                            <input name="catname" type="text" value="${d.name}">
                                        </div>
                                        <div class="tbl-cell">
                                            <input name="catpos" type="number" value="${d.position}">
                                        </div>
                                        <div class="tbl-cell">
                                            <img data-cmd="catEdit" data-id="frm${d.id}" class="iconImage clickable" src="img/Refresh.png" title="Opdater">
                                        </div>
                                        <div class="tbl-cell">
                                            <img data-cmd="catDelete" data-id="frm${d.id}" class="iconImage clickable" src="img/Trash.png" title="Slet">
                                        </div>
                                    </div>
                                </form>`;
                });
                content += `<br><hr>Eller tilføj<form id="frmCatAdd">
                                <div class="tbl-row">
                                    <div class="tbl-cell">
                                        <input name="catname" type="text" placeholder="Menunavn">
                                    </div>
                                    <div class="tbl-cell">
                                        <input name="catpos" type="number" placeholder="position">
                                    </div>
                                    <div class="tbl-cell">
                                        <img data-cmd="catAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
                                    </div>
                                </div>
                            <form>`;

                // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
                content += `</div>`;
                document.querySelector('#content').innerHTML = content;
            })
            .catch(function (err) {
                console.log(err);
            })
    }    

    function catAdd(caller){
        var form = document.querySelector('#frmCatAdd');
        var formData = new FormData(form);
        fetch('/menuitems', {
            credentials: 'include',
            method: 'post',
            body: formData
        })
            .then(function(){
                document.querySelector('div[data-cmd="categories"]').click();
            })
            .catch(function(err){
                console.log(err)
            })
    }

    function catDelete(caller){
        var formId = caller.dataset.id
        var frm = document.querySelector(`#${formId}`);
        var frmData = new FormData(frm);
        fetch('/menuitems', {
            credentials: 'include',
            method: 'delete',
            body: frmData
        })
        .then(function (data) {
            document.querySelector('div[data-cmd="categories"]').click();
        });
    }

    function catEdit(caller) {
        var formId = caller.dataset.id
        var frm = document.querySelector(`#${formId}`);
        var frmData = new FormData(frm);
        fetch('/menuitems', {
            credentials: 'include',
            method: 'put',
            body: frmData
        })
            .then(function (data) {
                document.querySelector('div[data-cmd="categories"]').click();
                // return data.json();
            })
    }

    function logout() {
        fetch('/logout', { credentials: 'include', method: 'delete' })
            .then(function () {
                document.querySelector("#title").innerHTML = 'Du loggede af...';
                setTimeout(function () { location.href = "/"; }, 1000);
            });
    }

    // Interval-function der holder øje med om session-cookien stadig eksisterer
    setInterval(function () {
        if (!document.cookie.length) {
            alert("Du logges af nu...");
            setTimeout(function () { location.href = "/"; }, 2000);
        }
    }, 1000 * 60 * 5)

})();


























// (function () {
//     document.addEventListener("click", menuclick, true);//Laver en eventlistener der fanger alle museklik på siden (ligeosm den anden fil)

//     function menuclick(e) {//Event havner i variablen e
//         var caller = e.target;//Min e.target fortæller at vi vil have fat i det element klikket fandt sted og var har navnet caller forid det er den der kalder ufnctionen
//         if (!caller.dataset.cmd) {//Hvis elementet har et datasæt så skal vi lave 'noget', men hvis ikke det har det skal vi bare stoppe koden
//             return;//Her ender vi hvis der ikke er noget datasæt
//         }
//         if (document.querySelector('.itemActive')) { //Hvis der er klikket et sted med en event så ender vi hernede med itemactive class
//             document.querySelector('.itemActive').classList.toggle('itemActive');
//         }
//         caller.classList.toggle('itemActive');

//         switch (caller.dataset.cmd) {//Her tjekker vi hvilket element der er klikket på helt præcis, det gør vi ved hjælp at vores datasæt i HTML koden
//             case 'logout': // OK
//                 logout();
//                 break;
//             case 'categories': // OK 
//                 categories(); //Hvis der er klikket på dette datasæt i HTML ender vi hernede som fortæller at vi sakl kalde funktionen cataegories
//                 break;
//             case 'catEdit': // OK
//                 catEdit(caller);
//                 break;
//             case 'catAdd':
//                 catAdd(caller);
//                 break;
//                 case 'catDelete':
//                 catDelete(caller);
//                 break;
//             case 'article':
//                 article();
//                 break;
//             case 'articleEdit':
//                 articleEdit(caller);
//                 break;  
//             case 'articleAdd':
//                 articleAdd(caller);
//                 break;
//             case 'articleDelete':
//                 articleDelete(caller);
//                 break;          
//             case 'users':
//                 users()
//                 break;
//             case 'userEdit':
//                 userEdit(caller);
//                 break;
//             case 'userAdd':
//                 userAdd(caller);
//                 break;
//             case 'userDelete':
//                 userDelete(caller);
//                 break;
//             default:
//                 alert(caller);
//         }
//     }

//     function catDelete(caller){
//         var formId = caller.dataset.id
//         var frm = document.querySelector(`#${formId}`);
//         var frmData = new FormData(frm);
//         fetch('/menuitems', {
//             credentials: 'include',
//             method: 'delete',
//             body: frmData
//         })
//         .then(function (data) {
//             document.querySelector('div[data-cmd="categories"]').click();
//             // return data.json();
//         })
//     }

//     function catEdit(caller) {
//         var formId = caller.dataset.id
//         var frm = document.querySelector(`#${formId}`);
//         var frmData = new FormData(frm);
//         fetch('/menuitems', {
//             credentials: 'include',
//             method: 'put',
//             body: frmData
//         })
//             .then(function (data) {
//                 document.querySelector('div[data-cmd="categories"]').click();
//                 // return data.json();
//             })
//     }

//     function logout() {
//         fetch('/logout', { credentials: 'include', method: 'delete' })
//             .then(function () {
//                 document.querySelector("#title").innerHTML = 'Du loggede af...';
//                 setTimeout(function () { location.href = "/"; }, 1000);
//             });
//     }

//     function categories() {
//         fetch('/menuitems', { method: 'get' })
//             .then(function (data) {
//                 return data.json();
//             })
//             .then(function (jsonData) {
//                 var content = `
//                             <div class="cat-container"><div class="cat-head">Rediger menu</div>
//                                 <form>
//                                     <div class="cat-row">
//                                         <div class="cat-cell"><input readonly type="text" value="Navn"></div>
//                                         <div class="cat-cell"><input readonly type="text" value="Position"></div>
//                                     </div>
//                                 </form>`;
//                 jsonData.forEach(function (d) {
//                     content += `<form id="frm${d.id}">
//                                     <div class="cat-row">
//                                         <div class="cat-cell">
//                                             <input name="id" type="hidden" value="${d.id}">
//                                             <input name="catname" type="text" value="${d.name}">
//                                         </div>
//                                         <div class="cat-cell">
//                                             <input name="catpos" type="number" value="${d.position}">
//                                         </div>
//                                         <div class="cat-cell">
//                                             <img data-cmd="catEdit" data-id="frm${d.id}" class="iconImage clickable" src="img/refresh.png" title="Opdater">
//                                         </div>
//                                         <div class="cat-cell">
//                                             <img data-cmd="catDelete" data-id="frm${d.id}" class="iconImage clickable" src="img/trash.png" title="Slet">
//                                         </div>
//                                     </div>
//                                 </form>`;
//                 });
//                 content += `<br><hr>Eller tilføj<form id="frmCatAdd">
//                                 <div class="cat-row">
//                                     <div class="cat-cell">
//                                         <input name="catname" type="text" placeholder="Menunavn">
//                                     </div>
//                                     <div class="cat-cell">
//                                         <input name="catpos" type="number" placeholder="position">
//                                     </div>
//                                     <div class="cat-cell">
//                                         <img data-cmd="catAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
//                                     </div>
//                                 </div>
//                             <form>`;

//                 // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
//                 content += `</div>`;
//                 document.querySelector('#content').innerHTML = content;
//             })
//             .catch(function (err) {
//                 console.log(err);
//             })
//     }

//     function catAdd(caller){
//         var form = document.querySelector('#frmCatAdd');
//         var formData = new FormData(form);
//         fetch('/menuitems',{
//             credentials: 'include',
//             method: 'post',
//             body: formData
//         })
//         // console.log(formData.getAll('catname'));
//         // alert(caller.dataset.cmd);
    
//         .then(function(){
//             document.querySelector('.menuitem').click();
//         })
//         .catch(function(err){
//             console.log(err)
//         })

//     }



// //..............................Users..............................

// function users() {
//     fetch('/users', { method: 'get' })
//         .then(function (data) {
//             return data.json();
//         })
//         .then(function (jsonData) {
//             var content = `
//                         <div class="cat-container"><div class="cat-head">Rediger brugere</div>
//                             <form>
//                                 <div class="cat-row">
//                                     <div class="cat-cell"><input readonly type="text" value="Navn"></div>
//                                     <div class="cat-cell"><input readonly type="text" value="Password"></div>
//                                 </div>
//                             </form>`;
//             jsonData.forEach(function (u) {
//                 content += `<form id="frm${u.id}">
//                                 <div class="cat-row">
//                                     <div class="cat-cell">
//                                         <input name="id" type="hidden" value="${u.id}">
//                                         <input name="username" type="text" value="${u.username}">
//                                     </div>
//                                     <div class="cat-cell">
//                                         <input name="userpass" type="text" value="${u.password}">
//                                     </div>
//                                     <div class="cat-cell">
//                                         <img data-cmd="userEdit" data-id="frm${u.id}" class="iconImage clickable" src="img/refresh.png" title="Opdater">
//                                     </div>
//                                     <div class="cat-cell">
//                                         <img data-cmd="userDelete" data-id="frm${u.id}" class="iconImage clickable" src="img/trash.png" title="Slet">
//                                     </div>
//                                 </div>
//                             </form>`;
//             });
//             content += `<br><hr>Eller tilføj bruger<form id="frmuserAdd">
//                             <div class="cat-row">
//                                 <div class="cat-cell">
//                                     <input name="username" type="text" placeholder="Brugernavn">
//                                 </div>
//                                 <div class="cat-cell">
//                                     <input name="userpass" type="text" placeholder="Password">
//                                 </div>
//                                 <div class="cat-cell">
//                                     <img data-cmd="userAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
//                                 </div>
//                             </div>
//                         <form>`;

//             // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
//             content += `</div>`;
//             document.querySelector('#content').innerHTML = content;
//         })
//         .catch(function (err) {
//             console.log(err);
//         })
// }


// function userAdd(caller){
//     var form = document.querySelector('#frmuserAdd');
//     var formData = new FormData(form);
//     fetch('/users',{
//         credentials: 'include',
//         method: 'post',
//         body: formData
//     })
//     // console.log(formData.getAll('catname'));
//     // alert(caller.dataset.cmd);

//     .then(function(data){
//         document.querySelector('div[data-cmd="users"]').click();
//     })
//     .catch(function(err){
//         console.log(err)
//     })

// }







// function userEdit(caller) {
//     var formId = caller.dataset.id
//     var frm = document.querySelector(`#${formId}`);
//     var frmData = new FormData(frm);
//     fetch('/users', {
//         credentials: 'include',
//         method: 'put',
//         body: frmData
//     })
//         .then(function (data) {
//             document.querySelector('div[data-cmd="users"]').click();
//             // return data.json();
//         })
// }


// function userDelete(caller){
//     var formId = caller.dataset.id
//     var frm = document.querySelector(`#${formId}`);
//     var frmData = new FormData(frm);
//     fetch('/users', {
//         credentials: 'include',
//         method: 'delete',
//         body: frmData
//     })
//     .then(function (data) {
//         document.querySelector('div[data-cmd="users"]').click();
//         // return data.json();
//     })
// }






// //.................ARTICLES.........................

// function article(){
//     fetch('/menuitems', {method : 'get'})
//     .then(function(data){
//         return data.json();
//     })
//     .then(function(jsonData){
//         if(jsonData){
//             var dropdown = document.createElement("select");
//             dropdown.name="catId";
//             var option = document.createElement("option");
//             option.value = 0;
//             option.textContent = "Vælg kategori";
//             dropdown.appendChild(option);
//             jsonData.forEach(function(jd){
//                 option = document.createElement("option");
//                 option.value = jd.id;
//                 option.textContent = jd.name;
//                 dropdown.appendChild(option);
//             });
//             var form = document.createElement("form")
//             form.id = "frmArticle";

//             var title = document.createElement("input")
//             title.width = 50;
//             title.type = "text";
//             title.name = "title";
//             title.placeholder = "Artikel overskrift";

//             var textarea = document.createElement("textarea")
//             textarea.name = "article";


//             form.appendChild(title);
//             form.appendChild(textarea);
//             form.appendChild(dropdown);

//             var btn = document.createElement('button')
//             btn.type = "button";
//             btn.dataset.cmd = "articleAdd"
//             btn.dataset.frm = "frmArticle";
//             btn.innerHTML = "Upload";

//             form.appendChild(btn);

//             var container = document.createElement("div");
//             container.className = "tbl-container";
//             container.appendChild(form);

//             var content = document.querySelector('#content');
//             content.innerHTML = '';
//             content.appendChild(container);
//         }
//     })
//     .catch(function(err){
//         console.log(err);
//     })
// }

// function articleAdd(caller){
//     var frmId = caller.dataset.frm;
//     var frm = document.querySelector(`#${frmId}`);
//     var frmData = new FormData(frm);
//     fetch('/article',{credentials:'include', method: 'post', body: frmData})
//     .then(function(data){
//         document.querySelector('div[data-cmd="article"]').click();
//     })
//     .catch(function(err){
//         console.log(err);
//     })
// }

// // function article() {
// //     fetch('/article', { method: 'get' })
// //         .then(function (data) {
// //             return data.json();
// //         })
// //         .then(function (jsonData) {
// //             var content = `
// //                         <div class="cat-container"><div class="cat-head">Rediger Artikler</div>
// //                             <form>
// //                                 <div class="cat-row">
// //                                     <div class="cat-cell"><input readonly type="text" value="Kategori"></div>
// //                                     <div class="cat-cell"><input readonly type="text" value="Titel"></div>
// //                                     <div class="cat-cell"><input readonly type="text" value="Indhold"></div>
                                   
// //                                 </div>
// //                             </form>`;
// //             jsonData.forEach(function (a) {
// //                 content += `<form id="frm${a.id}">
// //                                 <div class="cat-row">
// //                                     <div class="cat-cell">
// //                                         <input name="id" type="hidden" value="${a.id}">
// //                                         <input name="articleKategori" type="text" value="${a.category_id}">
// //                                     </div>
// //                                     <div class="cat-cell">
// //                                         <input name="articleTitle" type="text" value="${a.title}">
// //                                     </div>
// //                                     <div class="cat-cell">
// //                                     <input name="articleContent" type="text" value="${a.content}">
// //                                 </div>
                                    
// //                                     <div class="cat-cell">
// //                                         <img data-cmd="userEdit" data-id="frm${a.id}" class="iconImage clickable" src="img/refresh.png" title="Opdater">
// //                                     </div>
// //                                     <div class="cat-cell">
// //                                         <img data-cmd="userDelete" data-id="frm${a.id}" class="iconImage clickable" src="img/trash.png" title="Slet">
// //                                     </div>
// //                                 </div>
// //                             </form>`;
// //             });
// //             content += `<br><hr>Eller tilføj artikler<form id="frmarticleAdd">
// //                             <div class="cat-row">
// //                                 <div class="cat-cell">
// //                                     <input name="articleKategori" type="text" placeholder="kategori">
// //                                 </div>
// //                                 <div class="cat-cell">
// //                                     <input name="articleTitle" type="text" placeholder="titel">
// //                                 </div>
// //                                 <div class="cat-cell">
// //                                 <input name="articleContent" type="text" placeholder="indhold">
// //                             </div>
// //                                 <div class="cat-cell">
// //                                     <img data-cmd="articleAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
// //                                 </div>
// //                             </div>
// //                         <form>`;

//             // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
// //             content += `</div>`;
// //             document.querySelector('#content').innerHTML = content;
// //         })
// //         .catch(function (err) {
// //             console.log(err);
// //         })
// // }


// function articleAdd(caller){
//     var form = document.querySelector('#frmarticleAdd');
//     var formData = new FormData(form);
//     fetch('/article',{
//         credentials: 'include',
//         method: 'post',
//         body: formData
//     })
//     // console.log(formData.getAll('catname'));
//     // alert(caller.dataset.cmd);

//     .then(function(data){
//         document.querySelector('div[data-cmd="article"]').click();
//     })
//     .catch(function(err){
//         console.log(err)
//     })

// }




//     // Interval-functtion der holder øje med om session-cookien stadig eksisterer
//     setInterval(function () {
//         if (!document.cookie.length) {
//             alert("Du logges af nu...");
//             setTimeout(function () { location.href = "/"; }, 2000);
//         }
//     }, 1000 * 60 * 5)

// })();

