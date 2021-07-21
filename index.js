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
            const player_name = player.name_display_first_last;
            const position = player.position_txt;
            const photo = `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:silo:current.png/r_max/w_180,q_auto:best/v1/people/${player.player_id}/headshot/silo/current`;
            const height = `${player.height_feet}'${player.height_inches}"`;
            const hands = `Bats: ${player.bats} Throws: ${player.throws}`;
            const weight = player.weight;

            const card = document.createElement('div');
            card.classList.add('card');
            card.id = id;

            const front = document.createElement('div');
            front.classList.add('card__face');
            front.classList.add('card__face--front');
            

            const playerName = document.createElement('h3');
            const playerNameTxt = document.createTextNode(player_name);
            playerName.append(playerNameTxt);
            front.append(playerName);

            const img = document.createElement('img');
            img.setAttribute('src', photo);
            img.setAttribute('loading', 'lazy');
            front.append(img);

            const positionP = document.createElement('p');
            const positionTxt = document.createTextNode(position);
            positionP.append(positionTxt);
            front.append(positionP);

            const back = document.createElement('div');
            back.classList.add('card__face');
            back.classList.add('card__face--back');

            const handsP = document.createElement('p');
            const handsTxt = document.createTextNode(hands);
            handsP.append(handsTxt);
            back.append(handsP);
            
            const heightP = document.createElement('p');
            const heightTxt = document.createTextNode(`${height} ${weight}lb`);
            heightP.append(heightTxt);
            back.append(heightP);


            const carStatsP = document.createElement('p');
            const carStatsTxt = document.createTextNode('Career Stats:');
            carStatsP.append(carStatsTxt);
            back.append(carStatsP);

            const table = document.createElement('table');
            const headTr = document.createElement('tr');
            if (position !== 'P') {//if player is not a pitcher, fill the table head with these headers

                card.setAttribute('data-position', 'position');

                const gTh = document.createElement('th');
                gTh.textContent = "G";
                const avgTh = document.createElement('th');
                avgTh.textContent = "AVG";
                const hTh = document.createElement('th');
                hTh.innerText = "H";
                const hrTh = document.createElement('th');
                hrTh.innerText = "HR";
                const slgTh = document.createElement('th');
                slgTh.innerText = "SLG";
                headTr.append(gTh, avgTh, hTh, hrTh, slgTh);
                table.append(headTr);

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
                            const g = statList.g;
                            const avg = statList.avg;
                            const h = statList.h;
                            const hr = statList.hr;
                            const slg = statList.slg;
                            

                            const tr = document.createElement('tr');
                            const gTd = document.createElement('td');
                            gTd.textContent = g;
                            const avgTd = document.createElement('td');
                            avgTd.textContent = avg;
                            const hTd = document.createElement('td');
                            hTd.innerText = h;
                            const hrTd = document.createElement('td');
                            hrTd.innerText = hr;
                            const slgTd = document.createElement('td');
                            slgTd.innerText = slg;
                            tr.append(gTd, avgTd, hTd, hrTd, slgTd);
                            table.append(tr);
                        })
                        .catch(err => {
                            console.error(err);
                        });
            }
                        else {//create a table for pitchers
                            card.setAttribute('data-position', 'pitcher');
                            table.classList.add('pitcher-table');

                            const rTh = document.createElement('th');
                            rTh.textContent = "W-L";
                            const ipTh = document.createElement('th');
                            ipTh.textContent = "IP";
                            const eraTh = document.createElement('th');
                            eraTh.innerText = "ERA";
                            const soTh = document.createElement('th');
                            soTh.innerText = "SO";
                            const whipTh = document.createElement('th');
                            whipTh.innerText = "WHIP";
                            headTr.append(rTh, ipTh, eraTh, soTh, whipTh);
                            table.append(headTr);
                        
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
                                        const r = `${statList.w}-${statList.l}`;
                                        const ip = statList.ip;
                                        const era = statList.era;
                                        const so = statList.so;
                                        const whip = statList.whip;
                                        
            
                                        const tr = document.createElement('tr');
                                        const rTd = document.createElement('td');
                                        rTd.textContent = r;
                                        const ipTd = document.createElement('td');
                                        ipTd.textContent = ip;
                                        const eraTd = document.createElement('td');
                                        eraTd.innerText = era;
                                        const soTd = document.createElement('td');
                                        soTd.innerText = so;
                                        const whipTd = document.createElement('td');
                                        whipTd.innerText = whip;
                                        tr.append(rTd, ipTd, eraTd, soTd, whipTd);
                                        table.append(tr);
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

function sortBy(filter) {
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
    if (filter === 'pitcher' || filter === 'position') {
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
    else {
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
