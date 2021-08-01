const express = require("express");
const {League, Player, PlayerSeason, Season} = require("./db/models/index")
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express()

const PORT = 8000
async function getData() {

    function range(size, startAt=0){
        return [...Array(size).keys()].map(i => i+startAt)
    }
    const date = new Date().getFullYear()
    const size = date - 2018
    const array = range(size, 2018)

    const getLeagueInfo = async (espnId) => {
        const [league, created] = await League.findOrCreate({where: {espnId: espnId}})
        const currentYear = new Date().getFullYear()
        let leagueData = await axios.get(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${currentYear}/segments/0/leagues/${espnId}`, {
            headers: {
                cookie: "espn_s2=AECPR9CSh6x6jxSG9ssT27%2B5hFi5Q%2BNu4nI0ufSbt%2FawuGXvFZcsqVngqO%2B%2FyYsI1LQAmNI80Y62RW8fIjr1lgaS57wZV%2B2Jp%2B62UKZeXVIbH%2Fs7Sd8t9jCiL887forlV2%2Bs%2BUG2OsGftcMibUCHCazwgZ5ZrmisHAzozHsRFDOgQUCgi%2FT825x5Ylo%2FT1HNitSzo0IGZzwB%2FJoG9cVcZ0Dx67bdW%2Bv6NgaAa4jtKRu8lSzo6pbUIUweGXQJ9rqjbSgKTsk2ZQYSZJXKTwA4d8JkN%2FA8d3VVVeF%2B0gJnSx2pLG%2FOrIHGZMPzNFrPR9YCNeQ%3D"
            }
        })
        league.active = leagueData.data.status.isActive
        league.name = leagueData.data.settings.name
        league.save()
        return league
    }

    const league = await getLeagueInfo("104204")
    
    const getSingleSeasonData = async (league, year) => {
        const [season, createdSeason] = await Season.findOrCreate({where: {year: year, leagueId: league.id}})
        let leagueData = await axios.get(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${league.espnId}`, {
            headers: {
                cookie: "espn_s2=AECPR9CSh6x6jxSG9ssT27%2B5hFi5Q%2BNu4nI0ufSbt%2FawuGXvFZcsqVngqO%2B%2FyYsI1LQAmNI80Y62RW8fIjr1lgaS57wZV%2B2Jp%2B62UKZeXVIbH%2Fs7Sd8t9jCiL887forlV2%2Bs%2BUG2OsGftcMibUCHCazwgZ5ZrmisHAzozHsRFDOgQUCgi%2FT825x5Ylo%2FT1HNitSzo0IGZzwB%2FJoG9cVcZ0Dx67bdW%2Bv6NgaAa4jtKRu8lSzo6pbUIUweGXQJ9rqjbSgKTsk2ZQYSZJXKTwA4d8JkN%2FA8d3VVVeF%2B0gJnSx2pLG%2FOrIHGZMPzNFrPR9YCNeQ%3D"
            }
        })
        const members = leagueData.data.members
        const teams = leagueData.data.teams

        // console.log("Members:", members)
        console.log("Teams:", teams)
        teams.forEach(team => {
            const owners = members.filter((member) => team.owners.includes(member.id))
            owners.forEach( async owner => {
                const name = team.location + " " + team.nickname
                const [player, createdPlayer] = await Player.findOrCreate({where:{name:owner.displayName}})
                const [playerSeason, createdPlayerSeason] = await PlayerSeason.findOrCreate({where: {playerId: player.id, seasonId: season.id}})
                playerSeason.espnId = owner.id
                playerSeason.teamId = team.id
                playerSeason.teamName = name
                const ps = await playerSeason.save()
                console.log(ps)
            })
        })
    }

    getSingleSeasonData(league, 2018)

    // try{
    //     let leagueData = await axios.get("https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/104204", {
    //         headers: {
    //             cookie: "espn_s2=AECPR9CSh6x6jxSG9ssT27%2B5hFi5Q%2BNu4nI0ufSbt%2FawuGXvFZcsqVngqO%2B%2FyYsI1LQAmNI80Y62RW8fIjr1lgaS57wZV%2B2Jp%2B62UKZeXVIbH%2Fs7Sd8t9jCiL887forlV2%2Bs%2BUG2OsGftcMibUCHCazwgZ5ZrmisHAzozHsRFDOgQUCgi%2FT825x5Ylo%2FT1HNitSzo0IGZzwB%2FJoG9cVcZ0Dx67bdW%2Bv6NgaAa4jtKRu8lSzo6pbUIUweGXQJ9rqjbSgKTsk2ZQYSZJXKTwA4d8JkN%2FA8d3VVVeF%2B0gJnSx2pLG%2FOrIHGZMPzNFrPR9YCNeQ%3D"
    //         }
    //     })
    //     console.log(leagueData.data)
    // } catch{
    //     console.log("League not found")
    // }

}

getData()


app.listen(PORT, () => { console.log("We are live on " + PORT)})