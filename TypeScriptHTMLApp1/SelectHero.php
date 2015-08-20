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

	}

}



// Read heroes from text
//$lines = file("resources/heroes.txt");
//foreach($lines as $heroName){
//    $hero = new Hero($heroName);

//}


$heroes = new Heroes();

$hero = new Hero("batrider");
$hero->addAntiIndex("antimage", 4.43);
$heroes->addHero($hero);
//$heroes->removeHero($hero);

$heroFound = $heroes->getHero("batrider");
print($heroFound->Name);
//$index = $heroFound->getAntiIndex("antimage");
//print($index);

//
?>