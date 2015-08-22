<?

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
		$this->CorpIndex[$HeroName];
	}

	//function __toString(){
	//    return $this->Name;
	//}
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
		//print(count($this->heroes));

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

	function pickHero($opponentTeam, $availableHeroes){
        $bestHero = null;
        $bestAdvantage = 0;

        foreach($availableHeroes as $availableHero){
            $totalAntiAdvantage = 0;
            $totalCorpAdvantage = 0;

            foreach($opponentTeam->team as $opponentTeamHero){
                $antiIndex = $availableHero->getAntiIndex($opponentTeamHero->Name);
                //print($antiIndex);
                $totalAntiAdvantage = $totalAntiAdvantage + $antiIndex;
            }

            foreach($this->team as $corpTeamHero){
                $corpIndex = $availableHero->getCorpIndex($corpTeamHero->Name);
                $totalCorpAdvantage = $totalCorpAdvantage + $corpIndex;
            }
            $totalAdvantage = $totalAntiAdvantage + $totalCorpAdvantage;
            if($totalAdvantage > $bestAdvantage){
                $bestAdvantage = $totalAdvantage;
                $bestHero = $availableHero;
            }
            print($availableHero->Name . $totalAdvantage . "/" . $totalAntiAdvantage . "/" . $totalCorpAdvantage);
        }

        return $bestHero;
	}

}

function SelectHero(){

}


$heroes = new Heroes();

// Read heroes from text
$lines = file("resources/heroes.txt");
foreach($lines as $heroName){
    $heroName = substr($heroName, 0, -2);

    // Terrible terrible hack, i don't understand why php does this
    if(strpos($heroName, "tiny") !== false){
        $heroName = "tiny";
    }

    $hero = new Hero($heroName);

    // Add anti indexes
    $path = "resources/HeroIndexes/" . $heroName;

    //print(strlen($path . "_Anti.txt"));

    $antiFile = file($path . "_Anti.txt");
    foreach($antiFile as $antiLine){
        $pieces = explode(" ", $antiLine);
        $otherHero = $pieces[0];
        $advantageString = $pieces[1];
        $hero->addAntiIndex($otherHero, $advantageString);
    }

    // Add corp indexes
    $corpFile = file($path . "_Corp.txt");
    foreach($corpFile as $corpLine){
        $pieces = explode(" ", $corpLine);
        $otherHero = $pieces[0];
        $advantageString = $pieces[1];
        $hero->addCorpIndex($otherHero, $advantageString);
    }

    $heroes->addHero($hero);
}


$team1 = new Team();
$team2 = new Team();

// get the q parameter from URL
$q = $_REQUEST["q"];
$heroH = $heroes->getHero($q);
$heroes->removeHero($heroH);

$team1->addHeroToTeam($heroH);

$ret = $team2->pickHero($team1, $heroes->heroes);


echo $ret->Name;

//var_dump($heroes);

?>