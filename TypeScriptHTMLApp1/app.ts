/// <reference path="scripts/typings/jquery/jquery.d.ts" />

class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

class Heroes {
    hero: string;
    currentTeam: number;
    heroCount: number;

    constructor() {
        this.currentTeam = 1;
        this.heroCount = 1;

        //var divString = this.generateDivString();

    }

    generateDivString(): string {
        var result = "team" + this.currentTeam + "-hero" + this.heroCount;

        if (this.currentTeam == 1) {
            this.currentTeam = 2;
        } else {
            this.heroCount += 1;
            this.currentTeam = 1;
        }

        return result;
    }

}





window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();

    var heroes = new Heroes();
    $('#heroes').on('click', 'img', function () {
        var heroName = $(this).attr('id');
        //alert(heroName);

        
        var insertDivPath = heroes.generateDivString();
        var heroElement = document.createElement("img");
        heroElement.src = "img/" + heroName + "_hphover.png";
        heroElement.id = insertDivPath + "-hero";
        heroElement.className = "selectedHero";

        $('.selectedHero').on('click', '*', function () {
            var childId = $(this).attr('id');
            var parentId = childId.substr(0, 11);
            document.getElementById(parentId).removeChild(
                document.getElementById(childId));
        });
        document.getElementById(insertDivPath).appendChild(heroElement);
    });

    //var heroesElement = document.getElementById('heroes');
    //var heroes = new Heroes(heroesElement);

};