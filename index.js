//fetch 40 man roster, create cards, fill both sides of the cards, and fetch career stats
function getRoster() {
fetch("https://mlb-data.p.rapidapi.com/json/named.roster_40.bam?team_id='108'", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
		"x-rapidapi-host": "mlb-data.p.rapidapi.com"
	}
})
    .then(response => response.json())
    .then(data => {
        
        data.roster_40.queryResults.row.forEach( player => {

            
            const id = player.player_id;
            const position = player.position_txt;
            const photo = `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:silo:current.png/r_max/w_180,q_auto:best/v1/people/${player.player_id}/headshot/silo/current`;

            //creates the card
            const card = document.createElement('div');
            card.classList.add('card');
            card.id = id;

            //creates the front side of the card
            const front = document.createElement('div');
            front.classList.add('card__face');
            front.classList.add('card__face--front');

            const frontHTML = `
                <h3>${player.name_display_first_last}</h3>
                <img src="${photo}" height="180" width="180" loading="lazy">
                <p>${position}</p>
            `;
            front.innerHTML = frontHTML;

            //creates the back side of the card
            const back = document.createElement('div');
            back.classList.add('card__face');
            back.classList.add('card__face--back');

            const backHTML = `
                <p>Bats: ${player.bats} Throws: ${player.throws}</p>
                <p>${player.height_feet}'${player.height_inches}" ${player.weight}lb</p>
                <p>Career Stats:</p>
            `;
            back.innerHTML = backHTML;

            const table = document.createElement('table');
            if (position !== 'P') {//if player is not a pitcher, fill the table head with these headers
                card.setAttribute('data-position', 'position');
                //fetch career hitting data and post it to table
                fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_career_hitting.bam?player_id='${id}'&game_type='R'&league_list_id='mlb'`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
                    "x-rapidapi-host": "mlb-data.p.rapidapi.com"
                }
                    })
                        .then(response => response.json())
                        .then(data => {
                            const statList = data.sport_career_hitting.queryResults.row;
                        
                            const tableHTML = `
                                <table>
                                    <tr>
                                        <th>G</th>
                                        <th>AVG</th>
                                        <th>H</th>
                                        <th>HR</th>
                                        <th>SLG</th>
                                    </tr>
                                    <tr>
                                        <td>${statList.g}</td>
                                        <td>${statList.avg}</td>
                                        <td>${statList.h}</td>
                                        <td>${statList.hr}</td>
                                        <td>${statList.slg}</td>
                                    </tr>
                                </table>
                            `;
                            table.innerHTML = tableHTML;
                        })
                        .catch(err => {
                            console.error(err);
                        });
            }
                        else {//create a table for pitchers
                            card.setAttribute('data-position', 'pitcher');
                            table.classList.add('pitcher-table');
                        
                            //fetch career hitting data and post it to table
                            fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_career_pitching.bam?player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
                                "x-rapidapi-host": "mlb-data.p.rapidapi.com"
                            }
                                })
                                    .then(response => response.json())
                                    .then(data => {

                                        const statList = data.sport_career_pitching.queryResults.row;
                                        const tableHTML = `
                                            <table>
                                                <tr>
                                                    <th>R</th>
                                                    <th>IP</th>
                                                    <th>ERA</th>
                                                    <th>SO</th>
                                                    <th>WHIP</th>
                                                </tr>
                                                <tr>
                                                    <td>${statList.w}-${statList.l}</td>
                                                    <td>${statList.ip}</td>
                                                    <td>${statList.era}</td>
                                                    <td>${statList.so}</td>
                                                    <td>${statList.whip}</td>
                                                </tr>
                                            </table>
                                        `;
                                        table.innerHTML = tableHTML;

                                    })
                                    .catch(err => {
                                        console.error(err);
                                    });

                        }


            back.append(table);

            card.append(front);
            card.append(back);

            document.querySelector('#cards').append(card);

            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped');
            });             
        })
    })
    .catch(err => {
        console.error(err);
    });
}
document.addEventListener('DOMContentLoaded', getRoster);


//show and hide cards
function sortBy(filter) {//parameter comes from nav button clicked
    const li = document.querySelectorAll(`.${filter}-li`);
    const nav = document.querySelectorAll('.nav');
    nav.forEach( item => {
        item.classList.remove('active');
    });
    li.forEach( item => {
        item.classList.add('active');
    })


    const visibility = {
        'pitcher': {
            visible: 'pitcher',
            hidden: 'position'
        },
        'position': {
            visible: 'position',
            hidden: 'pitcher'
        }
    }
    if (filter === 'pitcher' || filter === 'position') { //if the parameter is pitcher or position, show all cards that fit the parameter, hide all the cards that don't
        const visible = document.querySelectorAll(`[data-position='${visibility[filter].visible}']`);
        const hidden = document.querySelectorAll(`[data-position='${visibility[filter].hidden}']`);
        visible.forEach( player => {
            player.classList.add('visible');
            player.classList.remove('hidden');
        });
        hidden.forEach( player => {
            player.classList.add('hidden');
            player.classList.remove('visible');
        });
    } 
    else {//show all cards
        const pitchers = document.querySelectorAll(`[data-position='pitcher']`);
        const position = document.querySelectorAll(`[data-position='position']`);
        pitchers.forEach( player => {
            player.classList.add('visible');
            player.classList.remove('hidden');
        });
        position.forEach( player => {
            player.classList.add('visible');
            player.classList.remove('hidden');
        });
    }
}

//script for the hamburger menu
let menuOpen = false;
function hamburgerMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if(!menuOpen) {
        menuBtn.classList.add('open');
        menuOpen = true;
        hamburgerMenu.classList.remove('closed');
    } else {
        menuBtn.classList.remove('open');
        menuOpen = false;
        hamburgerMenu.classList.add('closed');
    }
}
document.querySelector('.menu-btn').addEventListener('click', hamburgerMenu);

//shows the add player option
function showAddPlayer() {
    document.querySelector('.add-player').classList.toggle('hidden');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    //hides nav menu when app player is opened
    if (!hamburgerMenu.classList.contains('closed')) {
        hamburgerMenu.classList.toggle('closed');
        document.querySelector('.menu-btn').classList.remove('open');
        menuOpen = false;
    }
    
}
document.querySelector('.x-button').addEventListener('click', showAddPlayer);

//creates a new player
function newPlayer() {
    const div = document.querySelector('#cards');
    //get input values
    const position = document.querySelector('#player-position').value;
    const photo = document.querySelector('#player-img').value;

    const statsArr = [document.querySelector('#g').value, document.querySelector('#avg').value, document.querySelector('#h').value, document.querySelector('#hr').value, document.querySelector('#slg').value];

    //creates the card
    const card = document.createElement('div');
    card.classList.add('card');

    //creates the front side of the card
    const front = document.createElement('div');
    front.classList.add('card__face');
    front.classList.add('card__face--front');

    const frontHTML = `
        <h3>${document.querySelector('#player-name').value}</h3>
        <img src="${photo}" height="180" width="180" loading="lazy">
        <p>${position}</p>
    `;
    front.innerHTML = frontHTML;

    //creates the back side of the card
    const back = document.createElement('div');
    back.classList.add('card__face');
    back.classList.add('card__face--back');

    const backHTML = `
        <p>Bats: ${document.querySelector('#bats').value} Throws: ${document.querySelector('#throws').value}</p>
        <p>${document.querySelector('#feet').value}'${document.querySelector('#inches').value}" ${document.querySelector('#weight').value}lb</p>
        <p>Career Stats:</p>
    `;
    back.innerHTML = backHTML;

    const table = document.createElement('table');
            if (position !== 'P') {//if player is not a pitcher, fill the table head with these headers

                const [g, avg, h, hr, slg] = statsArr;

                card.setAttribute('data-position', 'position');

                const tableHTML = `
                    <table>
                        <tr>
                            <th>G</th>
                            <th>AVG</th>
                            <th>H</th>
                            <th>HR</th>
                            <th>SLG</th>
                        </tr>
                        <tr>
                            <td>${g}</td>
                            <td>${avg}</td>
                            <td>${h}</td>
                            <td>${hr}</td>
                            <td>${slg}</td>
                        </tr>
                    </table>
                `;
                table.innerHTML = tableHTML;
            }
            else {
                card.setAttribute('data-position', 'pitcher');
                table.classList.add('pitcher-table');

                const [r, ip, era, so, whip] = statsArr;

                const tableHTML = `
                    <table>
                        <tr>
                            <th>R</th>
                            <th>IP</th>
                            <th>ERA</th>
                            <th>SO</th>
                            <th>WHIP</th>
                        </tr>
                        <tr>
                            <td>${r}</td>
                            <td>${ip}</td>
                            <td>${era}</td>
                            <td>${so}</td>
                            <td>${whip}</td>
                        </tr>
                    </table>
                `;
                table.innerHTML = tableHTML;
            }

            back.append(table);

            card.append(front);
            card.append(back);
            card.classList.add('visible');
            document.querySelector('#cards').append(card);

            card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
            });  
        
        document.querySelector('.add-player').classList.toggle('hidden');
        const clearedInputs = document.querySelectorAll('.add-player input');
        clearedInputs.forEach( input => {
            input.value = '';
        })
}
document.querySelector('#add-player-button').addEventListener('click', newPlayer);

function inputPlayerStats() {
    const position = document.querySelector('#player-position').value;
    if (position === 'P') {
        const stats = ['W-L', 'IP', 'ERA', 'SO', 'WHIP'];
        const table = document.querySelector('#new-player-stats');
        stats.forEach( (stat, index) => {
            const td = table.rows[0].cells[index];
            td.textContent = stat;
        });
    }
    else {
        const stats = ['G', 'AVG', 'H', 'HR', 'SLG'];
        const table = document.querySelector('#new-player-stats');
        stats.forEach( (stat, index) => {
            const td = table.rows[0].cells[index];
            td.textContent = stat;
        });
    }
}
document.querySelector('#player-position').addEventListener('change', inputPlayerStats);