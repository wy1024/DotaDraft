﻿/// <reference path="scripts/typings/jquery/jquery.d.ts" />

class Heroes {
    // For sending ajax request
    team1: Array<string>;
    team2: Array<string>;

    team1HeroSlot: number;
    team2HeroSlot: number;

    team1NumberOfHeroes: number;
    team2NumberOfHeroes: number;
    totalNumberOfHeroesSelected: number;

    constructor() {
        this.team1 = new Array<string>();
        this.team2 = new Array<string>();

        this.team1HeroSlot = 1;
        this.team2HeroSlot = 1;

        this.team1NumberOfHeroes = 0;
        this.team2NumberOfHeroes = 0;
        this.totalNumberOfHeroesSelected = 0;
    }
    
    addHeroToTeam(heroName: string, teamNumber: number): string {
        this.totalNumberOfHeroesSelected = this.totalNumberOfHeroesSelected + 1;

        var result = "";

        if (teamNumber == 1) {
            // Get the first empty team slot
            var emptyHeroSlot = 1;
            while (emptyHeroSlot < 6) {
                if (this.team1[emptyHeroSlot] == null) {
                    break;
                }
                emptyHeroSlot++;
            }

            // Put hero to empty slot
            this.team1[emptyHeroSlot] = heroName;
            result = "team" + teamNumber + "-hero" + emptyHeroSlot;

            this.team1NumberOfHeroes += 1;
        } else {
            // Get the first empty team slot
            var emptyHeroSlot = 1;
            while (emptyHeroSlot < 6) {
                if (this.team2[emptyHeroSlot] == null) {
                    break;
                }
                emptyHeroSlot++;
            }

            // Put hero to empty slot
            this.team2[emptyHeroSlot] = heroName;
            result = "team" + teamNumber + "-hero" + emptyHeroSlot;

            this.team2NumberOfHeroes += 1;
        }
        
        return result;
    }

    removeHeroFromTeam(teamNumber: number, heroSlot: number) {
        this.totalNumberOfHeroesSelected = this.totalNumberOfHeroesSelected - 1;

        if (teamNumber == 1) {
            this.team1[heroSlot] = null;
            this.team1NumberOfHeroes -= 1;
        } else {
            this.team2[heroSlot] = null;
            this.team2NumberOfHeroes -= 1;
        }
    }
}

function sendAjaxRequest(heroes: Heroes) {
    // Clear preferred team border
    document.getElementById("team1").style.border = "none";
    document.getElementById("team2").style.border = "none";

    // Send Ajax request to get suggestions
    var skill = $('#skill').val();
    var requestString = "/gethint.php?skill=" + skill;

    for (var i = 1; i < 6; i++) {
        if (heroes.team1[i] != null) {
            requestString += "&t1_" + (i) + "=" + heroes.team1[i];
        }
        
    }
    for (var i = 1; i < 6; i++) {
        if (heroes.team2[i] != null) {
            requestString += "&t2_" + (i) + "=" + heroes.team2[i];
        }

    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var responseText = xmlhttp.responseText;
            //alert(responseText);

            // Show team advantage: team1-1000-team2-2000
            if (responseText.indexOf("team1") == 0) {
                var split = responseText.split('/');
                var team1Advantage = +split[1];
                var team2Advantage = +split[3];

                // Highlight border
                if (team1Advantage > team2Advantage) {
                    document.getElementById("team1").style.border = "solid";
                } else {
                    document.getElementById("team2").style.border = "solid";
                }

                // Display advantage points
                var advantagePointsLeftElement = document.createElement("b");
                advantagePointsLeftElement.innerText = "Advantage: " + team1Advantage;

                var advantagePointsRightElement = document.createElement("b");
                advantagePointsRightElement.innerText = "Advantage: " + team2Advantage;

                document.getElementById("suggestionLeft").appendChild(advantagePointsLeftElement);
                document.getElementById("suggestionRight").appendChild(advantagePointsRightElement);
            } else {
                
                // Ignore the last /
                var leftRightCount = 0;
                var heroAndIndexes = responseText.substr(0, responseText.length - 1).split("/");

                heroAndIndexes.forEach(function (entry) {
                    var heroAndIndexSeperated = entry.split(" ");
                    var imageSrc = "/img/" + heroAndIndexSeperated[0] + "_hphover.png";

                    var suggestedHeroElement = document.createElement("img");
                    suggestedHeroElement.src = imageSrc;
                    suggestedHeroElement.style.minWidth = "100%";
                    suggestedHeroElement.style.minHeight = "100%";
                    suggestedHeroElement.style.maxWidth = "100%";
                    suggestedHeroElement.style.maxHeight = "100%";

                    suggestedHeroElement.title = heroAndIndexSeperated[0];
                    suggestedHeroElement.innerHTML = heroAndIndexSeperated[1];

                    var advantageElement = document.createElement("p");
                    advantageElement.innerText = heroAndIndexSeperated[1];

                    var suggestedHeroDivElement = document.createElement("div");
                    suggestedHeroDivElement.className = "suggestedHeroes";
                    suggestedHeroDivElement.appendChild(suggestedHeroElement);
                    suggestedHeroDivElement.appendChild(advantageElement);

                    if (leftRightCount < 10) {
                        document.getElementById("suggestionLeft").appendChild(suggestedHeroDivElement);
                    } else {
                        document.getElementById("suggestionRight").appendChild(suggestedHeroDivElement);
                    }
                    leftRightCount++;
                });
            }


        }
    }
    xmlhttp.open("GET", requestString, true);
    xmlhttp.send();
}

function createHeroElement(heroName: string, insertDivPath: string): HTMLElement {
    var heroElement = document.createElement("img");
    heroElement.src = "../img/" + heroName + "_hphover.png";
    heroElement.id = insertDivPath + "-hero";
    heroElement.className = "selectedHero";
    return heroElement;
}


document.addEventListener("DOMContentLoaded", function (event) {
    var heroes = new Heroes();
    var suggestionLeft = document.getElementById("suggestionLeft");
    var suggestionRight = document.getElementById("suggestionRight");

    // Select a hero
    // To the left
    $('.left').click(function () {
        if (heroes.team1NumberOfHeroes < 5) {
            var divOfHero = $(this).parent();

            divOfHero.hide();
            var heroName = divOfHero.attr('id');

            // Create hero element and add to selected
            var insertDivPath = heroes.addHeroToTeam(heroName, 1);
            var heroElement = createHeroElement(heroName, insertDivPath);
            document.getElementById(insertDivPath).appendChild(heroElement);

            // Remove last suggested results first
            while (suggestionLeft.hasChildNodes()) {
                suggestionLeft.removeChild(suggestionLeft.lastChild);
            }
            while (suggestionRight.hasChildNodes()) {
                suggestionRight.removeChild(suggestionRight.lastChild);
            }

            // Dont need to recommend when all are picked
            sendAjaxRequest(heroes);
        }
    });

    // To the right
    $('.right').click(function () {
        if (heroes.team2NumberOfHeroes < 5) {
            var divOfHero = $(this).parent();

            divOfHero.hide();
            var heroName = divOfHero.attr('id');

            // Create hero element and add to selected
            var insertDivPath = heroes.addHeroToTeam(heroName, 2);
            var heroElement = createHeroElement(heroName, insertDivPath);
            document.getElementById(insertDivPath).appendChild(heroElement);

            // Remove last suggested results first
            while (suggestionLeft.hasChildNodes()) {
                suggestionLeft.removeChild(suggestionLeft.lastChild);
            }
            while (suggestionRight.hasChildNodes()) {
                suggestionRight.removeChild(suggestionRight.lastChild);
            }

            // Dont need to recommend when all are picked
            //if (heroes.totalNumberOfHeroesSelected !== 10) {
                sendAjaxRequest(heroes);
        }
    });

    // Suggestion click
    // To the left
    $('#suggestionLeft').on("click", "img", function () {
        if (heroes.team1NumberOfHeroes < 5) {
            var heroName = $(this).attr('title');

            // Hide hero from hero pool
            $('#' + heroName).hide();

            // Create hero element and add to selected
            var insertDivPath = heroes.addHeroToTeam(heroName, 1);
            var heroElement = createHeroElement(heroName, insertDivPath);
            document.getElementById(insertDivPath).appendChild(heroElement);

            // Remove last suggested results first
            while (suggestionLeft.hasChildNodes()) {
                suggestionLeft.removeChild(suggestionLeft.lastChild);
            }
            while (suggestionRight.hasChildNodes()) {
                suggestionRight.removeChild(suggestionRight.lastChild);
            }

            // Dont need to recommend when all are picked
                sendAjaxRequest(heroes);
        }
    });

    // To the right
    $('#suggestionRight').on("click", "img", function () {
        if (heroes.team2NumberOfHeroes < 5) {
            var heroName = $(this).attr('title');

            // Hide hero from hero pool
            $('#' + heroName).hide();

            // Create hero element and add to selected
            var insertDivPath = heroes.addHeroToTeam(heroName, 2);
            var heroElement = createHeroElement(heroName, insertDivPath);
            document.getElementById(insertDivPath).appendChild(heroElement);

            // Remove last suggested results first
            while (suggestionLeft.hasChildNodes()) {
                suggestionLeft.removeChild(suggestionLeft.lastChild);
            }
            while (suggestionRight.hasChildNodes()) {
                suggestionRight.removeChild(suggestionRight.lastChild);
            }

            // Dont need to recommend when all are picked
                sendAjaxRequest(heroes);
        }
    });
    
    // Remove a selected hero
    $('.selected').on('click', '*', function () {
        // Get the id clicked on
        var childId = $(this).attr('id');
        var parentId = childId.substr(0, 11);
        //team1-hero1
        var selectedHerosTeam = +parentId.substr(4, 1);
        var selectedHerosSlot = +parentId.substr(10, 1);
        
        // Put the hero back to the pool
        var img = $(this).attr('src');
        var heroName = img.substring(7, img.indexOf("_hphover.png"));
        $("#" + heroName).show();

        // Remove the element
        heroes.removeHeroFromTeam(selectedHerosTeam, selectedHerosSlot);
        document.getElementById(parentId).removeChild(document.getElementById(childId));

        // Remove last suggested results first
        while (suggestionLeft.hasChildNodes()) {
            suggestionLeft.removeChild(suggestionLeft.lastChild);
        }
        while (suggestionRight.hasChildNodes()) {
            suggestionRight.removeChild(suggestionRight.lastChild);
        }

        // Dont need to recommend when none are picked
        if (heroes.totalNumberOfHeroesSelected !== 0) {
            sendAjaxRequest(heroes);
        }
    });

    // Change a skill level
    $('#skill').change(function () {
        // Remove last suggested results first
        while (suggestionLeft.hasChildNodes()) {
            suggestionLeft.removeChild(suggestionLeft.lastChild);
        }
        while (suggestionRight.hasChildNodes()) {
            suggestionRight.removeChild(suggestionRight.lastChild);
        }

        if (heroes.totalNumberOfHeroesSelected !== 0) {
            sendAjaxRequest(heroes);
        }
    });
});