let champions = [];
let currentRole = 'All';

document.addEventListener('DOMContentLoaded', () => {
    loadChampions();
    setupChampionSearch();
    setupRoleFilters();
});

async function loadChampions() {
    try {
        const response = await fetch('/api/champions');
        champions = await response.json();
        
        // Sort champions by Korean name
        champions.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
        
        displayChampions(champions);
    } catch (error) {
        console.error('Error loading champions:', error);
    }
}

function setupChampionSearch() {
    const searchInput = document.getElementById('championSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterAndDisplayChampions(searchTerm, currentRole);
    });
}

function setupRoleFilters() {
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current role and filter champions
            currentRole = button.dataset.role;
            const searchTerm = document.getElementById('championSearch').value.toLowerCase();
            filterAndDisplayChampions(searchTerm, currentRole);
        });
    });
}

function filterAndDisplayChampions(searchTerm, role) {
    let filteredChampions = champions.filter(champion => 
        (champion.name.toLowerCase().includes(searchTerm) || 
         champion.id.toLowerCase().includes(searchTerm)) &&
        (role === 'All' || champion.tags.includes(role))
    );
    displayChampions(filteredChampions);
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
        
        const info = document.createElement('div');
        info.className = 'champion-info';
        
        const name = document.createElement('h3');
        name.textContent = champion.name;
        
        const role = document.createElement('div');
        role.className = 'champion-role';
        role.textContent = champion.tags[0];
        
        const difficultyBar = document.createElement('div');
        difficultyBar.className = 'difficulty-bar';
        
        const difficultyFill = document.createElement('div');
        difficultyFill.className = 'difficulty-fill';
        difficultyFill.style.width = `${(champion.info.difficulty / 10) * 100}%`;
        
        difficultyBar.appendChild(difficultyFill);
        info.appendChild(name);
        info.appendChild(role);
        info.appendChild(difficultyBar);
        
        card.appendChild(img);
        card.appendChild(info);
        grid.appendChild(card);
    });
}

async function showChampionDetails(championId) {
    try {
        const response = await fetch(`/api/champions/${championId}`);
        const champion = await response.json();
        
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
                <div class='champion-skills'>
                    <h3>스킬 정보</h3>
                    <div class='passive-skill'>
                        <img src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/passive/${champion.passive.image.full}' 
                             alt='${champion.passive.name}'>
                        <div class='skill-content'>
                            <h4>패시브 - ${champion.passive.name}</h4>
                            <p class='skill-description'>${champion.passive.description}</p>
                        </div>
                    </div>
                    <div class='active-skills'>
                        ${champion.spells.map((spell, index) => `
                            <div class='skill'>
                                <img src='https://ddragon.leagueoflegends.com/cdn/13.24.1/img/spell/${spell.image.full}' 
                                     alt='${spell.name}'>
                                <div class='skill-content'>
                                    <h4>${['Q', 'W', 'E', 'R'][index]} - ${spell.name}</h4>
                                    <p class='skill-description'>${spell.description}</p>
                                    <div class='skill-details'>
                                        ${spell.cooldown ? `<p>쿨다운: ${spell.cooldown.join('/')}초</p>` : ''}
                                        ${spell.cost ? `<p>소모값: ${spell.cost.join('/')}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
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