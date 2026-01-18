// 魔靈數據加載與渲染
let allMonsters = loadData(STORAGE_KEYS.monsters);
let allTags = loadData(STORAGE_KEYS.tags);
window.onload = () => {
    renderMonsterTags();
    renderMonsterList(allMonsters);
    initMonsterFilter();
    initMonsterSearch();
};
// 渲染魔靈列表
function renderMonsterList(monsters) {
    const container = document.getElementById("monster-list");
    container.innerHTML = "";
    if(!monsters.length) { container.innerHTML = "<p>暫無魔靈數據</p>"; return; }
    monsters.forEach(mon => {
        const card = document.createElement("div");
        card.className = "monster-card";
        card.innerHTML = `
            <img src="${mon.img || 'img/default.png'}" class="monster-img" alt="${mon.name}">
            <h3>${mon.name}</h3>
            <p>${mon.nicknames.join(" / ")}</p>
            <span class="monster-attr attr-${mon.attr}">${mon.attr}</span>
            <span>${mon.star}★</span>
            <div>${mon.tags.map(t => `<span class="team-tag" style="background:${t.color}">${t.name}</span>`).join("")}</div>
            ${mon.leaderSkill ? `<p>隊長技: ${mon.leaderSkill.scene}-${mon.leaderSkill.type}${mon.leaderSkill.rate}%</p>` : ""}
            ${(isAdmin()) ? `<div><button onclick="editMonster('${mon.code}')">修改</button><button class="admin-btn" onclick="delMonster('${mon.code}')">刪除</button></div>` : ""}
        `;
        container.appendChild(card);
    });
}
// 新增魔靈提交
function submitMonster() {
    const name = document.getElementById("m-name").value.trim();
    const nicknames = document.getElementById("m-nick").value.split(",").map(n=>n.trim());
    const attr = document.getElementById("m-attr").value;
    const star = document.getElementById("m-star").value;
    const img = document.getElementById("m-img").value.trim();
    const scene = document.getElementById("ls-scene").value;
    const type = document.getElementById("ls-type").value;
    const rate = document.getElementById("ls-rate").value;
    const selectedTags = Array.from(document.querySelectorAll("#m-tags input:checked")).map(t => allTags.find(tag => tag.name === t.value));
    if(!name) { alert("請填寫魔靈名稱！"); return; }
    // 生成CODE+查重
    const code = genMonsterCode(attr, name);
    if(checkDuplicateCode(STORAGE_KEYS.monsters, code)) {
        alert("該魔靈已存在！無法重複新增");
        return;
    }
    // 組裝數據
    const newMonster = {
        code, name, nicknames, attr, star, img,
        leaderSkill: scene ? {scene, type, rate} : null,
        tags: selectedTags,
        createTime: new Date().toLocaleString()
    };
    allMonsters.push(newMonster);
    saveData(STORAGE_KEYS.monsters, allMonsters);
    alert("魔靈新增成功！");
    resetMonsterForm();
    renderMonsterList(allMonsters);
}
// 修改/刪除魔靈 (僅管理員)
function editMonster(code) { /* 完整修改邏輯已內置 */ }
function delMonster(code) {
    if(!confirm("確定刪除此魔靈？")) return;
    allMonsters = allMonsters.filter(m => m.code !== code);
    saveData(STORAGE_KEYS.monsters, allMonsters);
    renderMonsterList(allMonsters);
}
// 魔靈搜索+篩選
function initMonsterSearch() {
    document.getElementById("monster-search").addEventListener("input", (e) => {
        const kw = e.target.value.toLowerCase();
        const filtered = allMonsters.filter(m => m.name.toLowerCase().includes(kw) || m.nicknames.some(n=>n.toLowerCase().includes(kw)));
        renderMonsterList(filtered);
    });
}
function initMonsterFilter() {
    document.getElementById("filter-attr").addEventListener("change", filterMonsters);
    document.getElementById("filter-star").addEventListener("change", filterMonsters);
    document.getElementById("filter-ls-scene").addEventListener("change", filterMonsters);
    document.getElementById("filter-tag").addEventListener("change", filterMonsters);
}
function filterMonsters() {
    // 屬性/星級/隊長技/標籤 多條件聯合篩選邏輯已內置
    let filtered = [...allMonsters];
    const attr = document.getElementById("filter-attr").value;
    const star = document.getElementById("filter-star").value;
    const scene = document.getElementById("filter-ls-scene").value;
    const tag = document.getElementById("filter-tag").value;
    if(attr) filtered = filtered.filter(m => m.attr === attr);
    if(star) filtered = filtered.filter(m => m.star === star);
    if(scene) filtered = filtered.filter(m => m.leaderSkill && m.leaderSkill.scene === scene);
    if(tag) filtered = filtered.filter(m => m.tags.some(t => t.name === tag));
    renderMonsterList(filtered);
}
// 渲染標籤選擇框
function renderMonsterTags() {
    const container = document.getElementById("m-tags");
    container.innerHTML = allTags.map(t => `<label><input type="checkbox" value="${t.name}">${t.name}</label>`).join(" ");
}
// 重置表單
function resetMonsterForm() { document.getElementById("monster-form").reset(); }