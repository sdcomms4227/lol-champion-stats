let champions = {};

document.addEventListener('DOMContentLoaded', () => {
    loadChampions();
    setupChampionSearch();
});

async function loadChampions() {
    try {
        const response = await fetch('/api/champions');
        const data = await response.json();
        champions = data.data;
        displayChampions(Object.values(champions));
    } catch (error) {
        console.error('Error loading champions:', error);
    }
}

function setupChampionSearch() {
    const searchInput = document.getElementById('championSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredChampions = Object.values(champions).filter(champion => 
            champion.name.toLowerCase().includes(searchTerm) || 
            champion.id.toLowerCase().includes(searchTerm)
        );
        displayChampions(filteredChampions);
    });
}

function displayChampions(championList) {
    const grid = document.getElementById('championGrid');
    grid.innerHTML = '';
    
    championList.forEach(champion => {
        const card = document.createElement('div');
        card.className = 'champion-card';
        card.onclick = () => showChampionDetails(champion.id);
        
        const img = document.createElement('img');
        img.src = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.image.full}`;
        img.alt = champion.name;
        
        const name = document.createElement('h3');
        name.textContent = champion.name;
        
        card.appendChild(img);
        card.appendChild(name);
        grid.appendChild(card);
    });
}

async function showChampionDetails(championId) {
    try {
        const response = await fetch(`/api/champions/${championId}`);
        const data = await response.json();
        const champion = data.data[championId];
        
        const modal = document.getElementById('championModal');
        const detailsDiv = document.getElementById('championDetails');
        
        detailsDiv.innerHTML = `
            <div class='champion-header'>
                <img src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.image.full}' 
                     alt='${champion.name}'>
                <h2>${champion.name}</h2>
                <p class='champion-title'>${champion.title}</p>
            </div>
            <div class='champion-info'>
                <h3>챔피언 정보</h3>
                <p>${champion.lore}</p>
                <div class='champion-stats'>
                    <h3>기본 능력치</h3>
                    <ul>
                        <li>체력: ${champion.stats.hp} (+${champion.stats.hpperlevel}/레벨)</li>
                        <li>공격력: ${champion.stats.attackdamage} (+${champion.stats.attackdamageperlevel}/레벨)</li>
                        <li>방어력: ${champion.stats.armor} (+${champion.stats.armorperlevel}/레벨)</li>
                        <li>마법 저항력: ${champion.stats.spellblock} (+${champion.stats.spellblockperlevel}/레벨)</li>
                    </ul>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.style.display = 'none';
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    } catch (error) {
        console.error('Error loading champion details:', error);
    }
} 