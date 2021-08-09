const {League, Player, PlayerSeason, Season} = require("../db/models/index")
const {range} = require("../helpers/functions")
const axios = require('axios');


class EspnApiConn {
    static async getLeagueInfo(espnId){
        const [league, created] = await League.findOrCreate({where: {espnId: espnId}})
        const currentYear = new Date().getFullYear()
        let leagueData = await axios.get(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${currentYear}/segments/0/leagues/${espnId}?view=mSettings`, {
            headers: {
                cookie: "espn_s2=AECPR9CSh6x6jxSG9ssT27%2B5hFi5Q%2BNu4nI0ufSbt%2FawuGXvFZcsqVngqO%2B%2FyYsI1LQAmNI80Y62RW8fIjr1lgaS57wZV%2B2Jp%2B62UKZeXVIbH%2Fs7Sd8t9jCiL887forlV2%2Bs%2BUG2OsGftcMibUCHCazwgZ5ZrmisHAzozHsRFDOgQUCgi%2FT825x5Ylo%2FT1HNitSzo0IGZzwB%2FJoG9cVcZ0Dx67bdW%2Bv6NgaAa4jtKRu8lSzo6pbUIUweGXQJ9rqjbSgKTsk2ZQYSZJXKTwA4d8JkN%2FA8d3VVVeF%2B0gJnSx2pLG%2FOrIHGZMPzNFrPR9YCNeQ%3D"
            }
        })
        league.active = leagueData.data.status.isActive
        league.name = leagueData.data.settings.name

        league.startYear = leagueData.data.status.previousSeasons[0]
        league.save()
        return league
    }

    static async getSingleSeasonData(league, year){
        const [season, createdSeason] = await Season.findOrCreate({where: {year: year, leagueId: league.id}})
        if (createdSeason){
            const url = year >=2018 ? `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${league.espnId}` : `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${league.espnId}?seasonId=${year}`
            let leagueData = await axios.get(url, {
                headers: {
                    cookie: "espn_s2=AECPR9CSh6x6jxSG9ssT27%2B5hFi5Q%2BNu4nI0ufSbt%2FawuGXvFZcsqVngqO%2B%2FyYsI1LQAmNI80Y62RW8fIjr1lgaS57wZV%2B2Jp%2B62UKZeXVIbH%2Fs7Sd8t9jCiL887forlV2%2Bs%2BUG2OsGftcMibUCHCazwgZ5ZrmisHAzozHsRFDOgQUCgi%2FT825x5Ylo%2FT1HNitSzo0IGZzwB%2FJoG9cVcZ0Dx67bdW%2Bv6NgaAa4jtKRu8lSzo6pbUIUweGXQJ9rqjbSgKTsk2ZQYSZJXKTwA4d8JkN%2FA8d3VVVeF%2B0gJnSx2pLG%2FOrIHGZMPzNFrPR9YCNeQ%3D"
                }
            })
            const members = year >=2018 ? leagueData.data.members : leagueData.data[0].members
            const teams = year >=2018 ? leagueData.data.teams : leagueData.data[0].teams
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
                })
            })
        }
    }

    static async getSeasons(league){
        const date = new Date().getFullYear()
        const size = date - league.startYear
        const array = range(size, league.startYear)

        console.log(array)

        // this.getSingleSeasonData(league, 2010)
        
        array.forEach(year => {
            this.getSingleSeasonData(league, year)
        })
    }



}

module.exports = EspnApiConn