<?php

class Hero {
	var $Name;
	var $AntiIndex;
	var $CorpIndex;

	function __construct($HeroName){
		$this->Name = $HeroName;
		$this->AntiIndex = array();
		$this->CorpIndex = array();
	}

	function addAntiIndex($HeroName, $Value){
		$this->AntiIndex[$HeroName] = $Value;
	}

	function addCorpIndex($HeroName, $Value){
		$this->CorpIndex[$HeroName] = $Value;
	}

	function getAntiIndex($HeroName){
		return $this->AntiIndex[$HeroName];
	}

	function getCorpIndex($HeroName){
		return $this->CorpIndex[$HeroName];
	}
}

class Heroes {
	var $heroes;

	function __construct(){
		$this->heroes = array();
	}

	function addHero($hero){
		array_push($this->heroes, $hero);
	}

	function getHero($heroName){
		if(count($this->heroes) !== 0){
			foreach($this->heroes as $hero){
				if(strcmp($hero->Name, $heroName) == 0){
					return $hero;
				}
			}
		}

		return null;
	}

	function removeHero($hero){
		$index = array_search($hero, $this->heroes);
		if ($index !== false) {
			unset($this->heroes[$index]);
		}
	}
}

class Team {
	var $team;

	function __construct(){
		$this->team = array();
	}

	function addHeroToTeam($hero){
		array_push($this->team, $hero);
	}

	function removeHeroFromTeam($hero){
		$index = array_search($hero, $this->team);
		if ($index !== false) {
			unset($this->team[$index]);
		}
	}

	function pickHero($thisTeam, $opponentTeam, $availableHeroes){
        $sortedHeroArray = array();

        //$bestHero = null;
        //$bestAdvantage = 0;

        foreach($availableHeroes as $availableHero){
            $totalAntiAdvantage = 0;
            $totalCorpAdvantage = 0;

            foreach($opponentTeam->team as $opponentTeamHero){
                $antiIndex = $availableHero->getAntiIndex($opponentTeamHero->Name);
                $totalAntiAdvantage = $totalAntiAdvantage + $antiIndex;
            }

            foreach($thisTeam->team as $corpTeamHero){
                $corpIndex = $availableHero->getCorpIndex($corpTeamHero->Name);
                $totalCorpAdvantage = $totalCorpAdvantage + $corpIndex;
            }
            $totalAdvantage = $totalAntiAdvantage + $totalCorpAdvantage * 0.8;

            //For values that are the same
            $sortedHeroArray[$totalAdvantage*1000000 + rand(0, 1000)] = $availableHero;
        }

        krsort($sortedHeroArray);

        return $sortedHeroArray;
	}

}

$heroes = new Heroes();

// Read heroes from text
$lines = file("resources/heroes.txt");

foreach($lines as $heroName){
    $heroName = substr($heroName, 0, -1);
    
    // Terrible terrible hack, i don't understand why php does this
    if(strpos($heroName, "tiny") !== false){
        $heroName = "tiny";
    }

    $hero = new Hero($heroName);
    
    // Build path to get file
    $skill = $_REQUEST["skill"];
    $path = "resources/HeroIndexes/" . $heroName;
    // Add anti indexes
    $antiFile = file($path . "_Anti_" . $skill . ".txt");
    foreach($antiFile as $antiLine){
        $pieces = explode(" ", $antiLine);
        $otherHero = $pieces[0];
        $advantageString = $pieces[1];
        $hero->addAntiIndex($otherHero, $advantageString);
    }

    // Add corp indexes
    $corpFile = file($path . "_Corp_" . $skill . ".txt");
    foreach($corpFile as $corpLine){
        $pieces = explode(" ", $corpLine);
        $otherHero = $pieces[0];
        $advantageString = $pieces[1];
        $hero->addCorpIndex($otherHero, $advantageString);
    }

    //var_dump($hero);

    $heroes->addHero($hero);
}

$team1 = new Team();
$team2 = new Team();


?>