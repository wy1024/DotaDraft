/// <reference path="scripts/typings/jquery/jquery.d.ts" />
var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toUTCString(); }, 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();
var Heroes = (function () {
    function Heroes() {
        this.nextTeamSlot = 1;
        this.nextHeroSlot = 1;
        this.totalNumberOfHeroesSelected = 0;
        //var divString = this.generateDivString();
    }
    Heroes.prototype.canRemove = function (selectedHerosTeam, selectedHeroesSlot) {
        if (this.nextTeamSlot == 1 && selectedHerosTeam == 2) {
            if (selectedHeroesSlot == this.nextHeroSlot - 1) {
                return true;
            }
        }
        if (this.nextTeamSlot == 1 && selectedHerosTeam == 1) {
            return false;
        }
        if (this.nextTeamSlot == 2 && selectedHerosTeam == 1) {
            if (this.nextHeroSlot == selectedHeroesSlot) {
                return true;
            }
        }
        if (this.nextTeamSlot == 2 && selectedHerosTeam == 2) {
            return false;
        }
        return false;
    };
    Heroes.prototype.addHeroToTeam = function () {
        var result = "team" + this.nextTeamSlot + "-hero" + this.nextHeroSlot;
        if (this.nextTeamSlot == 1) {
            this.nextTeamSlot = 2;
        }
        else {
            this.nextHeroSlot += 1;
            this.nextTeamSlot = 1;
        }
        this.totalNumberOfHeroesSelected = this.totalNumberOfHeroesSelected + 1;
        return result;
    };
    Heroes.prototype.removeHeroFromTeam = function () {
        if (this.nextTeamSlot == 1) {
            if (this.nextHeroSlot > 1) {
                this.nextTeamSlot = 2;
                this.nextHeroSlot = this.nextHeroSlot - 1;
            }
        }
        else {
            this.nextTeamSlot = 1;
        }
        this.totalNumberOfHeroesSelected = this.totalNumberOfHeroesSelected - 1;
    };
    return Heroes;
})();
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    var heroes = new Heroes();
    // Select a hero
    $('#heroes').on('click', 'img', function () {
        if (heroes.totalNumberOfHeroesSelected !== 10) {
            $(this).hide();
            var heroName = $(this).attr('id');
            // Create hero element and add to selected
            var insertDivPath = heroes.addHeroToTeam();
            var heroElement = document.createElement("img");
            heroElement.src = "img/" + heroName + "_hphover.png";
            heroElement.id = insertDivPath + "-hero";
            heroElement.className = "selectedHero";
            document.getElementById(insertDivPath).appendChild(heroElement);
            // Send Ajax request to get suggestions
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    document.getElementById("suggestedHero").innerHTML += xmlhttp.responseText + " ";
                }
            };
            xmlhttp.open("GET", "SelectHero.php?q=" + heroName, true);
            xmlhttp.send();
        }
    });
    // Remove a selected hero
    $('.selected').on('click', '*', function () {
        // Get the id clicked on
        var childId = $(this).attr('id');
        var parentId = childId.substr(0, 11);
        //team1-hero1
        var selectedHerosTeam = +parentId.substr(4, 1);
        var selectedHerosCount = +parentId.substr(10, 1);
        if (heroes.canRemove(selectedHerosTeam, selectedHerosCount)) {
            // Put the hero back to the pool
            var img = $(this).attr('src');
            var heroName = img.substring(4, img.indexOf("_hphover.png"));
            $("#" + heroName).show();
            // Set heroes counts
            heroes.removeHeroFromTeam();
            // Remove the element
            document.getElementById(parentId).removeChild(document.getElementById(childId));
        }
    });
    //var heroesElement = document.getElementById('heroes');
    //var heroes = new Heroes(heroesElement);
};
//# sourceMappingURL=app.js.map