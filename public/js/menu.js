
(function () { //Det hele er pakket ind i en parentes, det betyder at den er lukket inde i sit eget område, closure(?) Det vil sige alle variabler der er deklaret her er kun synlige i den her parentes, så hvis man tilføjer andre moduler med samme var navne vil de ikke påvirke hinaden da de har hver deres arbejdsområde
    document.addEventListener('DOMContentLoaded', menuUpdate); //Vi lytter efter hvornår det hele er blevet loadet i DOM, derefter bliver menuupdate kaldt

    function menuUpdate() { //Den sender en request vha fetch til en route der hedder menuitems
        fetch('/menuitems')
            .then(function (data) {//Det her sikrer os at vi går igang med den næste funktion efter der er svar tilbage fra fetchen, den modtager de data der kommer tilbage fra serveren
                return data.json() //Her konventerer vi dataen til json
            })
            .then(function (menuitems) { //Her skulle menuitems gerne være et array
                var menu = ''; //Det er en tom streng til at starte med fordi det har noget at gøre med datatyper... i og med det er en tom streng så ved den at det er en tekst type/tekst streng) som menuen skal indeholde
                menuitems.forEach(function (item) {//Her bliver arrayet løbet igennem af en forEach løkke
                    menu += `<span class="menuitem" data-categoryid="${item.id}">${item.name}</span>`; //For hvert loop bliver der lavet et spam der bliver tilfjet til menu
                });
                document.querySelector('#publicnavigationbar').innerHTML = menu; //Hernede fortæller vi at publicnavigationbar i html koden sakl indeholde den her streng at vi får den vist
            })
            .then(function () { //Denne her then tager fat i første menu item og simulerer et klik på det.
                document.querySelector('.menuitem').click();//Det første item er de første i <span class="menuitem"....>, hvis den er kommenteret ud vil indhodlet først blive vist når der trykkes på et menu punkt
            })
            .catch(function (err) {
                console.log(err);
            });
    }
})();//De sidste parenteser her er en auto executebale function, det er dem der siger at den skal fungere som et funktionskald. 