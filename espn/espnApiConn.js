const {League, Player, PlayerSeason, Season} = require("../db/models/index")
const {range} = require("../helpers/functions")

class EspnApiConn {
    async getLeagueInfo(espnId){
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
}

module.exports = EspnApiConn