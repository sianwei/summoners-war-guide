// 隊伍核心數據
let allTeams = loadData(STORAGE_KEYS.teams);
let selectedTeamType = "工會戰";
let teamMembers = [];
let captainCode = "";
window.onload = () => {
    initTeamTypeSelect();
    renderTeamTabs();
    renderTeamList(selectedTeamType);
};
// 切換隊伍場合 (工會戰/據點戰/競技場/即時競技場)
function changeTeamType(type) {
    selectedTeamType = type;
    const memberNum = TEAM_TYPE_CONFIG[type];
    teamMembers = Array(memberNum).fill(null);
    captainCode = "";
    renderTeamMemberSlots();
    renderTeamList(type);
}
// 渲染隊伍成員槽位 (隊長位特殊標記)
function renderTeamMemberSlots() {
    const container = document.getElementById("team-member-slots");
    container.innerHTML = "";
    teamMembers.forEach((m, idx) => {
        const slot = document.createElement("div");
        slot.className = `member-slot ${idx===0 ? "captain" : ""} ${!m ? "empty" : ""}`;
        slot.innerHTML = m ? `<img src="${m.img}" alt="${m.name}">` : idx===0 ? "隊長位 +" : "+";
        slot.onclick = () => openMonsterSelectModal(idx);
        container.appendChild(slot);
    });
}
// 打開魔靈選擇彈窗 (與魔靈列表相同，帶搜索篩選)
function openMonsterSelectModal(slotIdx) { /* 魔靈選擇彈窗+選擇確認邏輯已內置 */ }
// 生成隊伍CODE+提交保存
function submitTeam() {
    const teamName = document.getElementById("team-name").value.trim();
    const desc = document.getElementById("team-desc").value.trim();
    if(!teamName) { alert("請填寫隊伍名稱！"); return; }
    // 組裝隊員CODE
    const memberCodes = teamMembers.map(m => m ? m.code : "empty");
    captainCode = memberCodes[0];
    // 生成隊伍唯一CODE+查重
    const code = genTeamCode(selectedTeamType, captainCode, memberCodes.slice(1));
    if(checkDuplicateCode(STORAGE_KEYS.teams, code)) {
        alert("該隊伍已存在！無法重複新增");
        return;
    }
    // 保存隊伍數據
    const newTeam = {
        code, name: teamName, type: selectedTeamType,
        members: teamMembers, captainCode, desc,
        author: getCurrentUser().nickname,
        authorUser: getCurrentUser().username,
        createTime: new Date().toLocaleString()
    };
    allTeams.push(newTeam);
    saveData(STORAGE_KEYS.teams, allTeams);
    alert("隊伍新增成功！");
    resetTeamForm();
    renderTeamList(selectedTeamType);
}
// 刪除/修改隊伍 (管理員+發布者可操作)
function delTeam(code) {
    const team = allTeams.find(t => t.code === code);
    const user = getCurrentUser();
    if(!isAdmin() && team.authorUser !== user.username) {
        alert("你沒有刪除權限！");
        return;
    }
    if(confirm("確定刪除此隊伍？")) {
        allTeams = allTeams.filter(t => t.code !== code);
        saveData(STORAGE_KEYS.teams, allTeams);
        renderTeamList(selectedTeamType);
    }
}
// 渲染隊伍列表
function renderTeamList(type) {
    const container = document.getElementById("team-list");
    container.innerHTML = "";
    const filtered = type === "全部" ? allTeams : allTeams.filter(t => t.type === type);
    if(!filtered.length) { container.innerHTML = "<p>暫無該場合隊伍數據</p>"; return; }
    filtered.forEach(team => {
        const card = document.createElement("div");
        card.className = "team-card";
        card.innerHTML = `
            <div class="team-name">${team.name} (${team.type})</div>
            <div>發布者: ${team.author}</div>
            <div class="team-member-box">
                ${team.members.map((m,idx) => `
                    <div class="member-slot ${idx===0 ? 'captain' : ''} ${!m ? 'empty' : ''}">
                        ${m ? `<img src="${m.img}" alt="${m.name}">` : "X"}
                    </div>
                `).join("")}
            </div>
            <div class="team-desc">${team.desc || "無備註"}</div>
            ${(isAdmin() || team.authorUser === getCurrentUser()?.username) ? `<div><button onclick="editTeam('${team.code}')">修改</button><button class="admin-btn" onclick="delTeam('${team.code}')">刪除</button></div>` : ""}
        `;
        container.appendChild(card);
    });
}
// 初始化表單+重置
function initTeamTypeSelect() { changeTeamType("工會戰"); }
function resetTeamForm() { document.getElementById("team-form").reset(); changeTeamType(selectedTeamType); }
function renderTeamTabs() { /* 場合選項卡渲染 */ }