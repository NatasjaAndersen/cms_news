
(function () {
    document.querySelector("#publicnavigationbar").addEventListener("click", menuClick)//Starter med en eventlistener skal bare foregå i publicnavigationbar, når den bliver aktiveret bliver menuklik kaldt som er funktionen under

    function menuClick(evt) { //Menuklik fanger ALLE klik på siden også udenfor menuen, derfor fortæller vi at vi sakl have en evt
        if (!evt.target.classList.contains("menuitem")) {//Her tager vi fat i en evt.target som ser på om der er en class der ineholder menuitem, så hvis du klikker et sted der ikke har dne class så skal der ikek ske noget når man klikker, men hvis stedet indehodler denne class så skal koden køres
            return;
        }
        if (document.querySelector(".itemActive")) { //Hvis det indehodler en class med menuitem så ryger den herned
            document.querySelector(".itemActive").classList.toggle("itemActive");
        }
        evt.target.classList.toggle("itemActive");//Her tager den fat i det element der er klikket på og gør det til active
        var catID = evt.target.dataset.categoryid;//Her tage man ud fra elementets datasæt ved at sige dataset.categoryid (Som er efetr - i HTML koden)

        fetch(`/article?catid=${catID}`)//Her bruger vi en request til article route som er lig med catid, så routen kan trække den information ud
            .then(function (data) {
                return data.json();//Konverter til json etc...
            })
            .then(function (items) {
                var cnt = '';
                items.forEach(function (elm) {
                    cnt += `<article class="article"><h2>${elm.title}</h2>${elm.content}</article>`;
                });
                document.querySelector("#content2").innerHTML = cnt //cnt bliver proppet ind i den id der har id'et #content2
            })
    }
})()
























/**
 * 
 *     fetch(`/article?id=${articleID}`)
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            var content = '';
            jsonData.forEach(function(elm){
                content += `<article class="article"><h4>${elm.title}</h4>${elm.content}<h4></article>`;
            });
            document.querySelector("#content").innerHTML = content;
        })
        .catch(function(err){
            console.log(err);
        });
 */