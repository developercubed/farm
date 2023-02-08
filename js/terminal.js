import { startGame, helpMenu, statsMenu, farm, upgradesMenu, buyUpgrade, hoesMenu, buyHoe, equipHoe, sellCrops, getVersion, buyPet, petsMenu, equipPet } from "./game.js";


await jQuery(function($) {
    window.terminal = $('body').terminal({
        'he':function() {
            terminal.clear()

            helpMenu()
        },
        'help':function() {
            terminal.clear()

            helpMenu()
        },
        's':function() {
            terminal.clear()

            statsMenu()
        },
        'f':function() {
            terminal.clear()
            if (cooldown.farming == 0) {
                farm()
            }
            else {
                menu = `Farming is on cooldown, please wait ${cooldown.farming} seconds`
                terminal.echo(menu)
            }
        },
        'u':function() {
            terminal.clear()

            upgradesMenu()
        },
        'bu':function(upgrade) {
            terminal.clear()

            buyUpgrade(upgrade)
        },
        'h':function() {
            terminal.clear()

            hoesMenu()
        },
        'bh':function(hoe) {
            terminal.clear()

            buyHoe(hoe)
        },
        'eh':function(hoe) {
            terminal.clear()

            equipHoe(hoe)
        },
        'sell':function() {
            terminal.clear()

            sellCrops()
        },
        'ver':function() {
            terminal.clear()

            getVersion()
        },
        'bp':function(pet) {
            terminal.clear()

            buyPet(pet)
        },
        'p':function() {
            terminal.clear()

            petsMenu()
        },
        'ep':function(pet) {
            terminal.clear()

            equipPet(pet)
        }
    }
    , {
        greetings: `Welcome to Farm!`,
        prompt: `>>> `,
        checkArity: false
    });
    startGame()
    
});
