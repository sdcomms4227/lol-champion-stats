// Load champions when page loads
document.addEventListener('DOMContentLoaded', loadChampions);

async function loadChampions() {
    try {
        const response = await fetch('/api/champions');
        const data = await response.json();
        displayChampions(data.data);
    } catch (error) {
        console.error('Error loading champions:', error);
    }
}

function displayChampions(champions) {
    const championList = document.getElementById('championList');
    championList.innerHTML = '';

    Object.values(champions).forEach(champion => {
        const championCard = document.createElement('div');
        championCard.className = 'champion-card';
        championCard.innerHTML = `
            <img src="https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.id}.png" alt="${champion.name}">
            <h3>${champion.name}</h3>
        `;
        championCard.addEventListener('click', () => showChampionDetails(champion.id));
        championList.appendChild(championCard);
    });
}

async function showChampionDetails(championId) {
    try {
        const response = await fetch(`/api/champions/${championId}`);
        const data = await response.json();
        // Display champion details in a modal or separate section
        console.log('Champion details:', data);
    } catch (error) {
        console.error('Error loading champion details:', error);
    }
}

async function searchSummoner() {
    const summonerName = document.getElementById('summonerName').value;
    if (!summonerName) return;

    try {
        const response = await fetch(`/api/summoner/${summonerName}/mastery`);
        const data = await response.json();
        displaySummonerStats(data);
    } catch (error) {
        console.error('Error searching summoner:', error);
        document.getElementById('summonerStats').innerHTML = `
            <div class="alert alert-danger">
                소환사를 찾을 수 없습니다.
            </div>
        `;
    }
}

function displaySummonerStats(masteryData) {
    const summonerStats = document.getElementById('summonerStats');
    summonerStats.innerHTML = '';

    masteryData.slice(0, 10).forEach(mastery => {
        const masteryCard = document.createElement('div');
        masteryCard.className = 'mastery-card';
        masteryCard.innerHTML = `
            <div class="mastery-info">
                <img src="https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${getChampionId(mastery.championId)}.png" alt="Champion">
                <div class="mastery-details">
                    <h4>${getChampionName(mastery.championId)}</h4>
                    <p>숙련도 레벨: ${mastery.championLevel}</p>
                    <p>숙련도 점수: ${mastery.championPoints.toLocaleString()}</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${(mastery.championPoints / 100000) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
        summonerStats.appendChild(masteryCard);
    });
}

// Helper functions to get champion names and IDs
// Note: In a real application, you would want to maintain a mapping of champion IDs to names
function getChampionName(championId) {
    // This is a placeholder - you would need to implement proper champion ID to name mapping
    return `Champion ${championId}`;
}

function getChampionId(championId) {
    // This is a placeholder - you would need to implement proper champion ID mapping
    return championId;
} 