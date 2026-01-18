// ===================== 全局常量配置 (你只需要改這裡的賬號！) =====================
// ✅ 賬號管理區 - 你手動新增/刪除/修改的所有賬號都放在這裡
const ACCOUNTS = [
    { username: "admin", password: "admin123", role: "admin", nickname: "超級管理員" }, // 管理員賬號
    { username: "player01", password: "player01", role: "user", nickname: "玩家01" },   // 普通用戶
    { username: "player02", password: "player02", role: "user", nickname: "玩家02" }    // 普通用戶
];
// 屬性對應碼 (固定)
const ATTR_MAP = { water: "wa", fire: "fi", wind: "wi", light: "li", dark: "da" };
// 隊長技能場合+類型 (固定)
const LEADER_SKILL_SCENE = ["通用", "競技場", "工會戰", "地下城", "屬性"];
const LEADER_SKILL_TYPE = ["攻擊力", "防禦力", "體力", "速度", "暴擊率", "暴擊傷害", "抵抗", "命中"];
// 隊伍場合對應人數 (固定)
const TEAM_TYPE_CONFIG = {
    工會戰: 3, 據點戰: 3, 競技場: 4, 即時競技場:5
};
// ===================== 本地存儲數據鍵名 =====================
const STORAGE_KEYS = {
    monsters: "summoners_war_monsters",
    teams: "summoners_war_teams",
    tags: "summoners_war_tags",
    materials: "summoners_war_materials",
    currentUser: "summoners_war_current_user"
};
// ===================== 工具方法 (全局通用) =====================
// 生成魔靈唯一CODE - 嚴格按照你的格式: el:xx/cr:URL編碼名稱
function genMonsterCode(attr, name) {
    const attrCode = ATTR_MAP[attr];
    const urlName = encodeURIComponent(name);
    return `el:${attrCode}/cr:${urlName}`;
}
// 生成隊伍唯一CODE - 嚴格按照你的格式: uni:x/le:魔靈CODE/Tm:魔靈CODE/Tm:魔靈CODE
function genTeamCode(teamType, captainCode, memberCodes) {
    const unitNum = TEAM_TYPE_CONFIG[teamType];
    let code = `uni:${unitNum}/le:${captainCode || "empty"}`;
    memberCodes.forEach(codeItem => {
        if(codeItem) code += `/Tm:${codeItem}`;
    });
    return code;
}
// 檢查重複CODE
function checkDuplicateCode(storageKey, code) {
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    return data.some(item => item.code === code);
}
// 本地存儲封裝
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function loadData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
// 獲取當前登錄用戶
function getCurrentUser() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.currentUser)) || null; }
// 權限校驗
function isAdmin() { const user = getCurrentUser(); return user && user.role === "admin"; }
function isUser() { const user = getCurrentUser(); return user && user.role === "user"; }
// 初始化默認數據
window.onload = () => {
    if(!loadData(STORAGE_KEYS.tags).length) saveData(STORAGE_KEYS.tags, [{name:"無視防禦",color:"#f44336"},{name:"控場",color:"#ffc107"},{name:"治癒",color:"#4caf50"}]);
};