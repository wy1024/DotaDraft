<?php
include("SelectHero.php");

// get the q parameter from URL
$t1_1 = $_REQUEST["t1_1"];
$t1_2 = $_REQUEST["t1_2"];
$t1_3 = $_REQUEST["t1_3"];
$t1_4 = $_REQUEST["t1_4"];
$t1_5 = $_REQUEST["t1_5"];

$t2_1 = $_REQUEST["t2_1"];
$t2_2 = $_REQUEST["t2_2"];
$t2_3 = $_REQUEST["t2_3"];
$t2_4 = $_REQUEST["t2_4"];
$t2_5 = $_REQUEST["t2_5"];

// Team 1
if($t1_1 !== null){
    $h = $heroes->getHero($t1_1);
    $heroes->removeHero($h);
    $team1->addHeroToTeam($h);
}
if($t1_2 !== null){
    $h = $heroes->getHero($t1_2);
    $heroes->removeHero($h);
    $team1->addHeroToTeam($h);
}
if($t1_3 !== null){
    $h = $heroes->getHero($t1_3);
    $heroes->removeHero($h);
    $team1->addHeroToTeam($h);
}
if($t1_4 !== null){
    $h = $heroes->getHero($t1_4);
    $heroes->removeHero($h);
    $team1->addHeroToTeam($h);
}
if($t1_5 !== null){
    $h = $heroes->getHero($t1_5);
    $heroes->removeHero($h);
    $team1->addHeroToTeam($h);
}

// Team 2
if($t2_1 !== null){
    $h = $heroes->getHero($t2_1);
    $heroes->removeHero($h);
    $team2->addHeroToTeam($h);
}
if($t2_2 !== null){
    $h = $heroes->getHero($t2_2);
    $heroes->removeHero($h);
    $team2->addHeroToTeam($h);
}
if($t2_3 !== null){
    $h = $heroes->getHero($t2_3);
    $heroes->removeHero($h);
    $team2->addHeroToTeam($h);
}
if($t2_4 !== null){
    $h = $heroes->getHero($t2_4);
    $heroes->removeHero($h);
    $team2->addHeroToTeam($h);
}
if($t2_5 !== null){
    $h = $heroes->getHero($t2_5);
    $heroes->removeHero($h);
    $team2->addHeroToTeam($h);
}


$ret1 = $team1->pickHero($team1, $team2, $heroes->heroes);
$ret2 = $team2->pickHero($team2, $team1, $heroes->heroes);


$numOfHeroesDisplayed = 0;
foreach($ret1 as $advantagePoints => $heroReturned){
    $numOfHeroesDisplayed++;
    if($numOfHeroesDisplayed > 10){
        break;
    }
    $formatedAdvantage = number_format((float)$advantagePoints/100000, 2, '.', '');
    echo $heroReturned->Name . " " . $formatedAdvantage . "/";
}

$numOfHeroesDisplayed = 0;
foreach($ret2 as $advantagePoints => $heroReturned){
    $numOfHeroesDisplayed++;
    if($numOfHeroesDisplayed > 10){
        break;
    }
    $formatedAdvantage = number_format((float)$advantagePoints/100000, 2, '.', '');
    echo $heroReturned->Name . " " . $formatedAdvantage . "/";
}

?>