window.menu = ''

const version = 'v1.1.0'

const help = `Help:

[he]/[help]: go to help menu    [ver]: check what version you're playing

[s]: see stats    [f]: go farming    [sell]: sell your crops

[u]: go to the upgrades menu    [bu] (upgrade): buy a specified upgrade

[h]: go to the hoe shop    [bh] (hoe): buy a specified hoe, example: {bh stone_hoe}

[eh] (hoe): equip a hoe, example: {eh stone_hoe}

[p]: go to the pet shop    [bp] (pet): buy a specified pet, example: {bp dog}

[ep] (pet): equip a specified pet, example: {ep dog}
`


const pets = {
    null:{
        name:'None',
        boost_name: 'None',
        boost_object: 'auto_crops',
        boost_amt: 0,
        price: null,
        price_multi: 0
    },
    dog:{
        name: 'Dog',
        boost_name: 'Crop Multi',
        boost_object: 'crop_multi',
        boost_amt: 1,
        price: 1000,
    }
}

const hoes = {
    wooden_hoe:{
        name:'Wooden Hoe',
        crop_drop:[2, 2, 3, 3, 5],
        price: null
    },
    stone_hoe:{
        name:'Stone Hoe',
        crop_drop:[3, 3, 3, 3, 3, 4, 4, 6],
        price: 500
    }
}

const basePlayer = {
    coins:0,
    hoe:hoes.wooden_hoe,
    pet:pets.null,
    crops:0,
    sell_multi:1,
    crop_multi:1,
    auto_crops:0,
    upgrades_amt:{

    },
    hoe_has:{
        wooden_hoe:true
    },
    pet_has:{
        null:true
    },
}

var player = {
    ...basePlayer
}

const upgrades = {
    workers:{
        name: 'Workers',
        base_max_amt:15,
        max_amt: 15,
        boost_name: 'Auto Crops',
        boost_object: 'auto_crops',
        boost_amt: .1,
        price: 50,
        price_multi: 2.5
        
    },
    hoe_efficiency:{
        name: 'Hoe Efficiency',
        base_max_amt:50,
        max_amt: 50,
        boost_name: 'Crop Multi',
        boost_object: 'crop_multi',
        boost_amt: .05,
        price: 200,
        price_multi: 1.5
        
    }
}
for (let u in upgrades) {
    if (u in player.upgrades_amt) {
    }
    else {
        player.upgrades_amt = {
            ...player.upgrades_amt,
            [u]:0
        }
    }
}
for (let h in hoes) {
    if (h in player.hoe_has) {
    }
    else {
        player.hoe_has = {
            ...player.hoe_has,
            [h]:false
        }
    }
}

for (let p in pets) {
    if (p in player.pet_has) {
    }
    else {
        player.pet_has = {
            ...player.pet_has,
            [p]:false
        }
    }
}

console.log(player)

window.cooldown = {
    farming:0
}

function tick() {
    reload()
    terminal.clear()
    terminal.echo(menu);

    for (let u in upgrades) {
        if (player[upgrades[u].boost_object] == 1) {
            player[upgrades[u].boost_object] = parseFloat((1 + (upgrades[u].boost_amt * player.upgrades_amt[u])).toFixed(1))
        }
        else {
            player[upgrades[u].boost_object] = parseFloat(((upgrades[u].boost_amt * player.upgrades_amt[u])).toFixed(1))
        }
    }
    for (let p in pets) {
        if (player.pet_has[p]) {
            if (player[pets[p].boost_object] == 1) {
                player[pets[p].boost_object] = parseFloat((1 + (pets[p].boost_amt)).toFixed(1))
            }
            else {
                player[pets[p].boost_object] = parseFloat(((pets[p].boost_amt)).toFixed(1))
            }
        }
    }

    player.crops = parseFloat((player.crops + player.auto_crops).toFixed(1))

    if (cooldown.farming > 0) {
        cooldown.farming = cooldown.farming - 1
        if (cooldown.farming < 0) {
            cooldown.farming = 0
        }
    }

    setTimeout(tick, 1000)
}

export function startGame() {
    menu = `Type 'help' for some help`
    tick()
}

export function helpMenu() {
    menu = help
    terminal.echo(help)
}

export function statsMenu() {
    var returnVal = `Stats:

Hoe: [${player.hoe.name}]
Pet: [${player.pet.name}]

Crops: [${player.crops}]
Auto Crops: [${player.auto_crops} cps]
Crop Multi: [${player.crop_multi}]

Coins: [${player.coins}]
Coin Multi: [${player.sell_multi}]
`
    menu = returnVal
    terminal.echo(returnVal)

}

export function farm() {
    var cropDropLen = player.hoe.crop_drop.length
    var cropDropRandom = Math.floor(Math.random() * cropDropLen)
    var cropDropVal = player.hoe.crop_drop[cropDropRandom]

    cropDropVal = cropDropVal * player.crop_multi

    player.crops = player.crops + cropDropVal
    cooldown.farming = 2.5
    var returnVal = `You farm for a bit
    
    Crops: [${player.crops}] (+${cropDropVal})
    `
    menu = returnVal

    terminal.echo(returnVal)
}

export function upgradesMenu() {
    var returnVal = `Coins: [${player.coins}]\n\nUpgrades:\n\n`
    for (let u in upgrades) {
        var upgrade = upgrades[u]
        returnVal = returnVal + `${upgrade.name}:
\t${upgrade.boost_name}: [${player[upgrade.boost_object]}] + ${upgrade.boost_amt}
\tAmount: ${player.upgrades_amt[u]}/${upgrade.max_amt}
\tPrice: ${upgrade.price}\n\n`
    }
    
    menu = returnVal

    terminal.echo(returnVal)
}

export function buyUpgrade(upgrade) {
    if (upgrade in upgrades) {
        var up = upgrades[upgrade]
        if (player.upgrades_amt[upgrade] == up.max_amt) {
            menu = `You have the max amount of ${upgrade}`
            terminal.echo(menu)

        }
        else if (player.coins >= up.price) {
            player.coins = parseFloat((player.coins - up.price).toFixed(1))
            player.upgrades_amt[upgrade] = player.upgrades_amt[upgrade] + 1
            up.price = parseFloat( up.price.toFixed(1) )


            menu = `You bought 1 ${upgrade} for ${up.price} coins \nYour new balance is [${player.coins}] coins`
            up.price = parseFloat((up.price * up.price_multi.toFixed(1)))
            terminal.echo(menu)
        }
        else {
            menu = `You dont have enough coins!`
            terminal.echo(menu)
        }
    }
    else {
        menu = `${upgrade} isnt a valid upgrade`
        terminal.echo(menu)
    }
}

export function hoesMenu() {
    var returnVal = `Coins: [${player.coins}]\n\nHoes:\n\n`
    for (let h in hoes) {
        var hoe = hoes[h]
        returnVal = returnVal + `${hoe.name}:
\tPrice: ${hoe.price}
\tHas: ${player.hoe_has[h]}\n\n`
    }
    
    menu = returnVal

    terminal.echo(returnVal)
}

export function buyHoe(hoe) {
    if (hoe in hoes) {
        var ho = hoes[hoe]
        if (player.hoe_has[hoe] == true) {
            menu = `You already own ${hoe}`
            terminal.echo(menu)

        }
        else if (player.coins >= ho.price) {
            player.coins = player.coins - ho.price
            player.hoe_has[hoe] = true


            menu = `You bought 1 ${hoe} for ${ho.price} coins \nYour new balance is [${player.coins}] coins`
            terminal.echo(menu)
        }
        else {
            menu = `You dont have enough coins!`
            terminal.echo(menu)
        }
    }
    else {
        menu = `${hoe} isnt a valid hoe`
        terminal.echo(menu)
    }
}

export function equipHoe(hoe) {
    if (hoe in hoes) {
        if (player.hoe_has[hoe] == true) {
            player.hoe = hoes[hoe]
            menu = `Equipped ${hoe}`
            terminal.echo(menu)
        }
        else {
            menu = `You dont own ${hoe}`
            terminal.echo(menu)
        }
    }
    else {
        menu = `${hoe} isnt a valid hoe`
        terminal.echo(menu)
    }
}

export function petsMenu() {
    var returnVal = `Coins: [${player.coins}]\n\nPets:\n\n`
    for (let h in pets) {
        if (h != 'null') {
            var pet = pets[h]
            returnVal = returnVal + `${pet.name}:
\t${pet.boost_name}: [${player[pet.boost_object]}] + ${pet.boost_amt}
\tPrice: ${pet.price}
\tHas: ${player.pet_has[h]}\n\n`
        }
    }
    
    menu = returnVal

    terminal.echo(returnVal)
}

export function buyPet(pet) {
    if (pet in pets) {
        var pe = pets[pet]
        if (player.pet_has[pet] == true) {
            menu = `You already own ${pet}`
            terminal.echo(menu)

        }
        else if (player.coins >= pe.price) {
            player.coins = parseFloat((player.coins - pe.price).toFixed(1))
            player.pet_has[pet] = true


            menu = `You bought a ${pet} for ${pe.price} coins \nYour new balance is [${player.coins}] coins`
            terminal.echo(menu)
        }
        else {
            menu = `You dont have enough coins!`
            terminal.echo(menu)
        }
    }
    else {
        menu = `${pet} isnt a valid upgrade`
        terminal.echo(menu)
    }
}

export function equipPet(pet) {
    if (pet in pets) {
        if (player.pet_has[pet] == true) {
            player.pet = pets[pet]
            menu = `Equipped ${pet}`
            terminal.echo(menu)
        }
        else {
            menu = `You dont own ${pet}`
            terminal.echo(menu)
        }
    }
    else {
        menu = `${pet} isnt a valid pet`
        terminal.echo(menu)
    }
}

export function sellCrops() {
    player.coins = player.coins + (player.crops * player.sell_multi)
    menu = `Sold ${player.crops} crops for ${player.crops * player.sell_multi} coins!`
    player.crops = 0
    terminal.echo(menu)
}

function reload() {
    saveGame()
    loadGame()
}

function saveGame() {
    var save = {
        player:{
            
        },
        cooldown:{}
    }
    for (let p in basePlayer) {
        save = {
            ...save,
            player:{
                ...save.player,
                [p]:basePlayer[p]
            }
        }
    }
    for (let p in player) {
        save = {
            ...save,
            player:{
                ...save.player,
                [p]:player[p]
            }
        }
    }
    for (let c in cooldown) {
        save = {
            ...save,
            cooldown:{
                ...save.cooldown,
                [c]:cooldown[c]
            }
        }
    }
    localStorage.setItem('saveData', JSON.stringify(save));
}

function loadGame() {
    try {
        var saveGame = JSON.parse(localStorage.getItem('saveData'));
    }
    catch {
        console.log('could not load any data from local storage')
    }
    try { player = saveGame['player'] } catch {}
    try { cooldown = saveGame['cooldown'] } catch {}
}

export function getVersion() {
    menu = `Version: ${version}`
    terminal.echo(menu)
}

window.addEventListener("load", (event) => {
    loadGame()
});

window.addEventListener("beforeunload", (event) => {
    saveGame()
});