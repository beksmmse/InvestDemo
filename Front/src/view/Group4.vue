<template>
  <div class="game-container">

        <div v-if="currentPhase === 'INTRO'" class="intro-content fade-in">
            <h1 class="intro-title">Instructions</h1>
            
            <div class="intro-body">
                <p>
                ยินดีต้อนรับเข้าสู่การตอบแบบสอบถาม และขอบคุณที่เข้าร่วมครั้งนี้ในการตอบแบบสอบถามคุณจะต้องการตัดสินใจหลายครั้ง 
                โดยไม่มีคำตอบถูกหรือผิด เราสนใจเพียงว่าผู้เข้าร่วมตัดสินใจอย่างไร
                </p>
                <p>
                เพื่อเป็นการขอบคุณ คุณจะได้รับค่าตอบแทนตั้งต้นจำนวน 50 บาท นอกจากนี้คุณจะสามารถได้รับเงินรางวัลเพิ่มเติมจากผลกำไรสุดท้ายที่คุณทำได้
                </p>
                <p>
                รางวัลและค่าตอบแทนสุดท้ายที่ได้จากการทำการตอบแบบสอบถาม จะจ่ายหลังจากการตอบแบบสอบถามเสร็จสิ้น
                </p>
            </div>

            <div class="instruction-box">
                <ul>
                <li>ในการตอบแบบสอบถามนี้ คุณจะทำการตัดสินใจทั้งหมด 12 รอบ</li>
                <li>สถานการณ์เศรษฐกิจโลก ที่อาจจะมีส่งผลต่อหุ้นที่เราจะซื้อ</li>
                <li>จากนั้นกรุณาเลือกซื้อได้ 3 จาก 5 ตัวเลือก: A/ B/ C/ D/ E โดยรอบแรกคุณจะสามารถทำได้แค่การซื้อเท่านั้น หลังจากรอบสองเป็นต้นไปถึงจะสามารถทำการซื้อและขายได้</li>
                <li>เมื่อสิ้นสุดรอบที่ 12 จะมีแบบสอบถามเพื่อเก็บข้อมูลความพึงพอใจและความรู้สึกของผู้เข้าร่วม</li>
                <li>หลังจบการทดลอง เราจะคำนวณกำไรรวมจาก 12 รอบ ผู้ที่ได้กำไรรวมสูงสุด 3 อันดับแรกจะได้รับรางวัล</li>
                </ul>
            </div>

            <div class="intro-action">
                <button class="btn-pink" @click="startGame">Next</button>
            </div>
            </div>

    <div v-if="!isGameOver && currentPhase === 'USER_INFO'" class="intro-content fade-in">
        <h1 class="intro-title">ข้อมูลส่วนตัว</h1>
        <div class="intro-body">
            <p>กรุณากรอก KKU Mail ของคุณเพื่อเริ่มทำกิจกรรม</p>
            <div class="input-group" style="max-width: 400px; margin: 20px auto;">
                <label style="display:block; text-align:left; margin-bottom:5px; font-weight:bold;">KKU Mail</label>
                <InputText v-model="userEmail" placeholder="example@kku.ac.th" class="w-full" style="width: 100%; padding: 10px;" lang="th" />
            </div>
            <div class="intro-action">
                <button class="btn-pink" @click="confirmUserInfo">Start Game</button>
            </div>
        </div>
    </div>
    

    <div v-if="!isGameOver && currentPhase === 'SITUATION'" class="situation-content fade-in">
        <h1 class="situation-header">สถานการณ์</h1>
        
        <div class="situation-box">
            <p>{{ currentSituationText }}</p>
        </div>

        <div class="action-area center-right">
            <Button label="Next (ไปหน้าซื้อขาย)" @click="goToTradingPhase" class="btn-action p-button-lg" />
        </div>
    </div>

    <div v-if="!isGameOver && currentPhase === 'TRADING'" class="trading-content fade-in">
      
      <div class="main-content">
        
        <div class="panel left-panel">
            <h3 class="panel-title">ราคาตลาด (Round {{ currentRound }})</h3>
            <DataTable :value="currentStocks" showGridlines stripedRows class="clean-table">
                <Column field="symbol" header="ชื่อหุ้น" class="font-bold text-center"></Column>
                <Column field="industry" header="อุตสาหกรรม"></Column>
                <Column field="price" header="ราคา (บาท)" class="text-right font-bold"></Column>
            </DataTable>
        </div>

        <div class="panel right-panel">
            <h3 class="panel-title">คำสั่งซื้อ</h3>
            
            <DataTable 
                :value="currentStocks" 
                showGridlines 
                :rowClass="rowClassCalculator"
                class="clean-table input-table"
            >
                <Column field="symbol" header="หุ้น" style="width: 15%">
                    <template #body="slotProps">
                        <span class="font-bold">{{ slotProps.data.symbol }}</span>
                    </template>
                </Column>

                <Column header="มีอยู่" style="width: 15%">
                    <template #body="slotProps">
                        <span class="font-bold text-blue-600">{{ myPortfolio[slotProps.data.symbol] || 0 }}</span>
                    </template>
                </Column>

                <Column header="จำนวนที่ต้องการซื้อ (ติดลบ = ขาย)" style="width: 35%">
                    <template #body="slotProps">
                        <InputNumber 
                            v-model="slotProps.data.buyQty" 
                            :min="currentRound > 1 ? -(myPortfolio[slotProps.data.symbol] || 0) : 0" 
                            :max="100000"
                            placeholder="0"
                            :disabled="isInputDisabled(slotProps.data)"
                            class="w-full"
                            inputClass="text-center"
                        />
                    </template>
                </Column>

                <Column header="รวมเป็นเงิน (บาท)" style="width: 35%">
                    <template #body="slotProps">
                        <div class="text-right font-bold" :class="{'text-green-600': slotProps.data.buyQty > 0}">
                            {{ formatNumber((slotProps.data.price * (slotProps.data.buyQty || 0))) }}
                        </div>
                    </template>
                </Column>
            </DataTable>

            <div class="footer-summary">
                <div class="status-row">
                    <span>เลือกแล้ว: </span>
                    <span :class="selectedCount === 3 ? 'text-red-600 font-bold' : 'text-blue-600 font-bold'">
                        {{ selectedCount }} / 3 ตัว
                    </span>
                    <span v-if="selectedCount >= 3" class="text-xs text-red-500 ml-2">(ครบโควต้า)</span>
                </div>
                
                <div class="total-row">
                    ยอดซื้อรวมรอบนี้: <span class="total-amount">{{ formatNumber(totalPurchaseThisRound) }}</span> บาท
                </div>

                 <!-- NEW: Redecide Checkboxes -->
                 <div v-if="isRedecideMode" class="decision-section" :class="{'highlight-warning': !isDecisionMade}">
                    <hr class="divider-sm">
                    <div class="checkbox-item">
                        <Checkbox v-model="decisionAI" :binary="true" inputId="cb-ai" @change="onCheckAI" />
                        <label for="cb-ai" class="ml-2 pointer">ฉันตัดสินใจตามคำแนะนำของ AI</label>
                    </div>
                    <div class="checkbox-item mt-2">
                        <Checkbox v-model="decisionSelf" :binary="true" inputId="cb-self" @change="onCheckSelf" />
                        <label for="cb-self" class="ml-2 pointer">ฉันตัดสินใจด้วยตัวเอง</label>
                    </div>
                </div>
            </div>

            <div class="action-area">
                <div v-if="totalPurchaseThisRound > currentCash" class="error-msg">
                    ⚠️ เงินสดไม่พอ
                </div>
                
                <div v-else-if="currentRound === 1 && selectedCount === 0" class="error-msg">
                    ⚠️ รอบแรกบังคับต้องซื้อหุ้นอย่างน้อย 1 ตัว
                </div>

                <div v-else-if="isRedecideMode && !isDecisionMade" class="error-msg">
                    ⚠️ กรุณาเลือกวิธีการตัดสินใจ
                </div>
                
                 <!-- Button Logic: Normal -> Go AI Phase | Redecide -> Confirm & Next -->
                 <Button 
                    v-if="!isRedecideMode"
                    label="ส่งคำสั่งซื้อ" 
                    @click="goToAIPhase" 
                    class="btn-action" 
                    :disabled="totalPurchaseThisRound > currentCash || (currentRound === 1 && selectedCount === 0)"
                />

                <Button 
                    v-else
                    label="ยืนยัน & ไปรอบถัดไป" 
                    @click="confirmAndNextRound" 
                    class="btn-action" 
                    :disabled="totalPurchaseThisRound > currentCash || (currentRound === 1 && selectedCount === 0) || !isDecisionMade"
                />
            </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isGameOver && currentPhase === 'AI_ADVICE'" class="ai-content fade-in">
        <h1 class="ai-header">คำแนะนำจาก AI</h1>

        <div class="ai-box-main">
            {{ currentAIAdviceText }}
        </div>

        <div class="ai-box-sub">
            คุณสามารถตัดสินใจได้อีกรอบ
        </div>

        <div class="ai-decision-area">
            
            <div class="decision-col">
                <button class="btn-ai btn-redecide" @click="backToTrading">
                    ตัดสินใจใหม่
                </button>
            </div>

            <div class="decision-col">
                <button class="btn-ai btn-confirm" @click="confirmAndNextRound">
                    ยืนยันคำตอบเดิม
                </button>
            </div>

        </div>


    </div>

    <div v-else-if="isGameOver" class="summary-content fade-in">
        <div class="summary-card">
            <h2>🎉 สรุปผลการลงทุน 🎉</h2>
            <div class="summary-details">
                <p>เงินสดคงเหลือ: <span>{{ formatCurrency(currentCash) }}</span> บาท</p>
                <p>มูลค่าหุ้นในพอร์ต: <span>{{ formatCurrency(calculatePortfolioValue()) }}</span> บาท</p>
            </div>
            <hr class="divider">
            <h1 class="grand-total">มูลค่ารวมสุทธิ: {{ formatCurrency(currentCash + calculatePortfolioValue()) }} บาท</h1>

            <!-- Leaderboard Section -->
            <div class="leaderboard-section fade-in">
                <h3>🏆 Top 10 Investors (Group 4)</h3>
                <DataTable v-if="leaderboard.length > 0" :value="leaderboard" stripedRows showGridlines class="clean-table leaderboard-table">
                    <Column header="อันดับ">
                        <template #body="slotProps">{{ slotProps.index + 1 }}</template>
                    </Column>
                    <Column field="email" header="ผู้เล่น">
                        <template #body="slotProps">
                            {{ maskEmail(slotProps.data.email) }}
                        </template>
                    </Column>
                    <Column field="netWorthDisplay" header="มูลค่าสุทธิ (บาท)" class="text-right font-bold text-green-600"></Column>
                </DataTable>
                <div v-else class="text-center py-4 text-gray-500">
                    ยังไม่มีข้อมูลรายชื่อผู้เล่นในขณะนี้
                </div>
            </div>

            <div class="summary-actions mt-4" style="display:flex; justify-content:center;">
                <Button label="ไปทำแบบสอบถาม" @click="goToQuestionnaire" class="p-button-success p-button-lg" style="font-weight:bold;" />
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

// --- Configuration ---
const totalRounds = 12;
const initialCash = 1000000;
const maxSelection = 3;

const situations = [
    "ค่าเงินบาทแข็งค่าขึ้นเร็ว จากนักลงทุนต่างชาตินำเงินเข้าลงทุน",
    "รัฐบาลสนับสนุนโครงการคนละครึ่ง 3 เฟส",
    "รัฐประกาศลดค่าไฟฟ้า",
    "กฎหมายภาษีคาร์บอนเริ่มมีผล",
    "ควบรวมกิจการค่ายมือถือรายใหญ่ผ่านการอนุมัติ",
    "ผู้บริโภคใส่ใจสุขภาพและคุณภาพชีวิตมากขึ้น",
    "สหภาพแรงงานขนส่งหยุดงานเป็นวงกว้าง",
    "ประเทศไทยเกิดรัฐประหาร",
    "เกิดสงครามใหญ่ในภูมิภาคยุทธศาสตร์",
    "โลกเผชิญวิกฤตอาหาร ราคาสินค้าเกษตรพุ่ง",
    "ประเทศเข้าสู่สังคมผู้สูงอายุชัดเจนขึ้น",
    "ตลาดหุ้นหยุดการซื้อขาย นักลงทุนต้องถือเงินสด"
];

// ข้อความคำแนะนำจาก AI ในแต่ละรอบ
const aiAdviceList = [
    "แนะนำ SCB, CPN เพราะเงินทุนต่างชาติหนุนหุ้นการเงินและอสังหาฯ \nขณะที่ PTT เสียเปรียบรายได้ดอลลาร์",
    "แนะนำ CP, CPN ได้ประโยชน์ตรงจากกำลังซื้อและทราฟฟิกในห้าง",
    "แนะนำ CP, CPN, TRUE ต้นทุนดำเนินงานลด โดยเฉพาะค้าปลีกและห้าง",
    "แนะนำ SCB, CPN เพราะกระทบน้อยและปรับตัวด้าน ESG ได้ง่ายกว่า PTT",
    "แนะนำ TRUE เด่นสุดจากการแข่งขันลดและเกิด Synergy",
    "แนะนำ CP, CPN จากอาหารคุณภาพและไลฟ์สไตล์สุขภาพ",
    "แนะนำ SCB, TRUE กระทบน้อยกว่า CP ที่พึ่งพาโลจิสติกส์",
    "แนะนำ SCB, PTT เป็นหุ้นใหญ่ เสถียร รัฐหนุน",
    "แนะนำ PTT ราคาพลังงานสูงขึ้น หนุนกำไร",
    "แนะนำ CP ได้ประโยชน์จากราคาสินค้าเกษตรสูง",
    "แนะนำ SCB, CP จากบริการการเงินและอาหารสุขภาพ",
    "ไม่แนะนำลงทุนหุ้นใด ถือเงินสด"
];

const stockInfo = [
  { id: 1, symbol: 'SCB', industry: 'ธนาคาร' },
  { id: 2, symbol: 'CPN', industry: 'อสังหา' },
  { id: 3, symbol: 'PTT', industry: 'พลังงาน/น้ำมัน' },
  { id: 4, symbol: 'TRUE', industry: 'โทรคมนาคม' },
  { id: 5, symbol: 'CP', industry: 'ค้าปลีก/เบ็ดเตล็ด' },
];

const allRoundPrices = [
    [120, 50, 35, 20, 65], [127, 52, 33, 20, 62], [128, 57, 32, 21, 70],
    [128, 59, 31, 24, 75], [131, 45, 26, 22, 63], [131, 49, 26, 36, 59],
    [130, 55, 24, 36, 70], [122, 52, 20, 36, 60], [100, 41, 18, 35, 55],
    [94, 37, 45, 33, 50], [90, 35, 46, 33, 62], [88, 42, 43, 35, 68]
];

// --- State ---
const currentRound = ref(1);
const currentCash = ref(initialCash);
const isGameOver = ref(false);
const currentPhase = ref('INTRO'); 
const userEmail = ref(''); 

const myPortfolio = ref({ SCB: 0, CPN: 0, PTT: 0, TRUE: 0, CP: 0 });
const currentStocks = ref([]);
const decisionAI = ref(false); // New
const decisionSelf = ref(false); // New
const isRedecideMode = ref(false); // New state
const gameLogs = ref([]);
const leaderboard = ref([]); // Leaderboard data
const startTime = ref(null);


// --- Functions ---
const loadRoundData = (round) => {
    const priceIndex = round - 1;
    const prices = allRoundPrices[priceIndex] || allRoundPrices[0];
    currentStocks.value = stockInfo.map((info, idx) => ({
        ...info,
        price: prices[idx],
        buyQty: null 
    }));
    // Reset Redecide State on new round
    isRedecideMode.value = false;
    decisionAI.value = false;
    decisionSelf.value = false;
};

const currentSituationText = computed(() => situations[currentRound.value - 1] || "ไม่มีข้อมูลเหตุการณ์");
const currentAIAdviceText = computed(() => aiAdviceList[currentRound.value - 1] || "ไม่มีคำแนะนำ");

onMounted(() => { 
    loadRoundData(1);
    fetchLeaderboard();
});

// --- Navigation Flow ---

const startGame = () => {
    startTime.value = new Date();
    currentPhase.value = 'USER_INFO';
    window.scrollTo(0,0);
};

const confirmUserInfo = () => {
    const email = userEmail.value.trim();
    const emailRegex = /^[a-zA-Z0-9._-]+@(kku\.ac\.th|kkumail\.com)$/;
    
    if(!email) {
        alert("กรุณากรอก KKU Mail");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("กรุณากรอก KKU Mail ให้ถูกต้อง (ตัวอย่าง: example@kku.ac.th หรือ example@kkumail.com)");
        return;
    }
    currentPhase.value = 'SITUATION';
    window.scrollTo(0,0);
};

const goToTradingPhase = () => {
    currentPhase.value = 'TRADING';
    window.scrollTo(0,0);
};

const goToAIPhase = () => {
    // ยังไม่ตัดเงินจริง แค่เปลี่ยนหน้าไปฟังคำแนะนำ
    currentPhase.value = 'AI_ADVICE';
    window.scrollTo(0,0);
};

const backToTrading = () => {
    // กลับไปหน้าซื้อขาย โดยค่า buyQty ยังคงอยู่ (เพราะเราไม่ได้ reloadData)
    isRedecideMode.value = true;
    currentPhase.value = 'TRADING';
};
const onCheckAI = () => { if(decisionAI.value) decisionSelf.value = false; };
const onCheckSelf = () => { if(decisionSelf.value) decisionAI.value = false; };
const isDecisionMade = computed(() => decisionAI.value || decisionSelf.value);

// --- Calculation Helpers ---

const selectedCount = computed(() => {
    // Count distinct stocks that have holding > 0 OR are being bought > 0
    // Basically, projected holding > 0
    const projectedHoldings = currentStocks.value.map(s => {
        const currentQty = myPortfolio.value[s.symbol] || 0;
        const buySellQty = s.buyQty || 0;
        return (currentQty + buySellQty) > 0;
    });
    return projectedHoldings.filter(Boolean).length;
});

const isInputDisabled = (stockData) => {
    const currentQty = myPortfolio.value[stockData.symbol] || 0;
    const inputQty = stockData.buyQty || 0;
    const isCurrentlyActive = (currentQty + inputQty) > 0;
    
    if (selectedCount.value >= maxSelection && !isCurrentlyActive) {
        return true;
    }
    return false;
};

const rowClassCalculator = (data) => (data.buyQty !== 0 && data.buyQty !== null) ? 'row-active' : '';

const totalPurchaseThisRound = computed(() => {
    return currentStocks.value.reduce((sum, stock) => sum + (stock.price * (stock.buyQty || 0)), 0);
});

// --- Core Logic (Confirm & Next) ---

const confirmAndNextRound = () => {
    // Logic การจบรอบจริง ย้ายมาจาก handleEndRound เดิม
    
    // 1. ตัดเงิน
    currentCash.value -= totalPurchaseThisRound.value;
    
    // 2. เอาหุ้นเข้าพอร์ต
    currentStocks.value.forEach(stock => {
        if(stock.buyQty) myPortfolio.value[stock.symbol] += stock.buyQty;
    });

    // --- Send Data to Backend ---
    const logData = {
        groupName: 'Group4',
        userEmail: userEmail.value,
        round: currentRound.value,
        situation: currentSituationText.value,
        decision: { type: isRedecideMode.value && decisionAI.value ? 'AI' : 'SELF' }, // Logic: If Redecide Mode -> Check checkbox. If not -> 'SELF'
        cash: currentCash.value,
        portfolio: calculatePortfolioValue(),
        totalValue: currentCash.value + calculatePortfolioValue(),
        stocks: currentStocks.value.map(s => ({ symbol: s.symbol, buyQty: s.buyQty || 0, price: s.price }))
    };

    gameLogs.value.push(logData);
    // Data stored locally, will be sent at game end
    // ----------------------------

    // 3. ไปรอบถัดไป หรือ จบเกม
    if (currentRound.value < totalRounds) {
        currentRound.value++;
        loadRoundData(currentRound.value); // รีเซ็ตราคาและจำนวนซื้อเป็น null
        currentPhase.value = 'SITUATION'; 
        window.scrollTo(0,0);
    } else {
        isGameOver.value = true;
        // Batch Save on Game Over
        const endTime = new Date();
        axios.post('http://localhost:3000/api/save-game', {
            groupName: 'Group4',
            userEmail: userEmail.value,
            rounds: gameLogs.value,
            finalCash: currentCash.value,
            finalPortfolio: calculatePortfolioValue(),
            finalTotal: currentCash.value + calculatePortfolioValue(),
            startTime: startTime.value,
            endTime: endTime
        })
        .then(res => {
            console.log('Complete game saved:', res.data);
            fetchLeaderboard();
        })
        .catch(err => console.error('Game save error:', err));
    }


};



const fetchLeaderboard = () => {
    axios.get(`http://localhost:3000/api/leaderboard/Group4`)
        .then(res => {
            leaderboard.value = res.data;
        })
        .catch(err => console.error("Error fetching leaderboard:", err));
};

const maskEmail = (email) => {
    if(!email) return 'Anonymous';
    const [name, domain] = email.split('@');
    if(name.length <= 3) return email;
    return name.substring(0, 3) + '***@' + domain;
};

const goToQuestionnaire = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeqd6oIsU0ZKt2XXy2iQmX36BJEFFFrkkpkhRLxrfPIXFE3LA/viewform?pli=1', '_blank');
};

const restartGame = () => {
    currentRound.value = 1;
    currentCash.value = initialCash;
    isGameOver.value = false;
    currentPhase.value = 'INTRO';
    myPortfolio.value = { SCB: 0, CPN: 0, PTT: 0, TRUE: 0, CP: 0 };
    gameLogs.value = [];
    startTime.value = null; // Reset start time
    loadRoundData(1);
};

const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);

const calculatePortfolioValue = () => {
    const lastPrices = allRoundPrices[totalRounds - 1];
    let val = 0;
    val += myPortfolio.value.SCB * lastPrices[0];
    val += myPortfolio.value.CPN * lastPrices[1];
    val += myPortfolio.value.PTT * lastPrices[2];
    val += myPortfolio.value.TRUE * lastPrices[3];
    val += myPortfolio.value.CP * lastPrices[4];
    return val;
};
</script>

<style scoped>
/* --- Global Layout --- */
.game-container {
  font-family: 'Sarabun', sans-serif;
  max-width: 1200px;
  margin: 20px auto;
  padding: 30px;
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* Animation */
.fade-in { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* --- Header --- */
.header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0;
}
.round-info { font-size: 1.8rem; font-weight: 700; color: #333; }
.cash-info { text-align: right; }
.cash-amount { font-size: 1.4rem; font-weight: bold; color: #2ecc71; }
.sub-text { color: #888; font-size: 0.85rem; }

/* --- SITUATION PHASE --- */
.situation-content { display: flex; flex-direction: column; padding: 20px; text-align: center; }
.situation-header { font-size: 2rem; font-weight: bold; color: #2c3e50; margin-bottom: 30px; }
.situation-box {
    background: white; border: 2px solid #333; padding: 60px 40px; 
    font-size: 2.2rem; font-weight: 500; color: #333;
    margin-bottom: 40px; box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
    min-height: 250px; display: flex; align-items: center; justify-content: center;
}

/* --- TRADING PHASE --- */
.main-content { display: flex; gap: 30px; flex-wrap: wrap; }
.panel { flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); min-width: 350px; }
.panel-title { margin-top: 0; margin-bottom: 15px; font-size: 1.2rem; color: #2c3e50; border-left: 5px solid #3498db; padding-left: 10px; }

/* --- AI ADVICE PHASE (NEW CSS) --- */
.ai-content { display: flex; flex-direction: column; align-items: center; padding: 20px; }
.ai-header { font-size: 3rem; font-weight: bold; color: #222; margin-bottom: 30px; }

.ai-box-main {
    width: 80%;
    border: 3px solid #000;
    padding: 30px;
    background-color: white;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.ai-box-sub {
    width: 80%;
    border: 2px solid #000;
    padding: 15px;
    background-color: white;
    text-align: center;
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 40px;
}

.ai-decision-area {
    width: 80%;
    display: flex;
    justify-content: space-between;
    gap: 30px;
}

.decision-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.btn-ai {
    width: 100%;
    padding: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    border: 2px solid #000;
    cursor: pointer;
    transition: all 0.2s;
}

/* --- แก้ไขสีปุ่ม ตัดสินใจใหม่ ให้เป็นสีเดียวกับ btn-action --- */
.btn-redecide {
    /* background-color: #d8b4fe;  สีเดิม (ม่วงอ่อน) */
    /* color: #000; สีเดิม */
    background-color: #3498db; /* สีน้ำเงินใหม่ */
    color: white;
    border: none; /* ลบขอบเดิมของ .btn-ai ออก */
    border-radius: 6px; /* เพิ่มความโค้งมน */
}
.btn-redecide:hover { 
    /* background-color: #c084fc; สีเดิม */
    background-color: #2980b9; /* สี hover ใหม่ */
}

.btn-confirm {
    background-color: #fff;
    color: #000;
}
.btn-confirm:hover { background-color: #f3f4f6; }

.decision-remark {
    margin-top: 10px;
    font-size: 0.9rem;
}

/* --- แก้ไขสีปุ่ม Next ให้เป็นสีเดียวกับ btn-action --- */
.btn-next-step {
    /* background-color: #e9d5ff; สีเดิม (ม่วงอ่อนมาก) */
    /* border: 2px solid #000; ขอบเดิม */
    background-color: #3498db; /* สีน้ำเงินใหม่ */
    color: white;
    border: none;
    border-radius: 6px; /* เพิ่มความโค้งมน */

    /* รักษาสไตล์การจัดวางเดิมไว้ */
    padding: 10px 40px;
    font-size: 1.2rem;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}
.btn-next-step:hover { 
    /* background-color: #d8b4fe; สีเดิม */
    background-color: #2980b9; /* สี hover ใหม่ */
}

.ml-2.pointer {
    margin-left: 0.5rem;
    cursor: pointer;
}


/* --- Clean DataTable Style --- */
:deep(.clean-table .p-datatable-thead > tr > th) {
    background-color: #f8f9fa; color: #495057; border-bottom: 2px solid #dee2e6; padding: 1rem;
}
:deep(.clean-table .p-datatable-tbody > tr > td) {
    padding: 1rem; border-bottom: 1px solid #f0f0f0;
}
:deep(.row-active) { background-color: #e8f5e9 !important; }
:deep(.row-active:hover) { background-color: #c8e6c9 !important; }

:deep(.p-inputnumber-input) { border-radius: 4px; border: 1px solid #ced4da; padding: 8px; }
:deep(.p-inputnumber-input:focus) { border-color: #3498db; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }

/* Footer & Actions */
.footer-summary { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #eee; }
.status-row, .total-row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 5px; }
.total-amount { font-weight: bold; color: #e74c3c; font-size: 1.2rem; }

.action-area { margin-top: 20px; text-align: right; }
/* สไตล์ต้นแบบที่เราต้องการให้เหมือน */
.btn-action {
    background-color: #3498db !important; border: none !important; padding: 12px 30px !important;
    font-size: 1.1rem !important; border-radius: 6px !important; transition: background-color 0.2s;
}
.btn-action:hover { background-color: #2980b9 !important; }
.btn-action:disabled { background-color: #95a5a6 !important; cursor: not-allowed; }
.error-msg { color: #e74c3c; margin-bottom: 10px; font-weight: bold; }

/* Summary Page */
.summary-content { display: flex; justify-content: center; padding-top: 50px; }
.summary-card {
    background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    width: 100%; max-width: 600px; text-align: center;
}
.summary-details { font-size: 1.2rem; margin: 20px 0; }
.summary-details span { font-weight: bold; color: #2c3e50; }
.grand-total { color: #27ae60; font-size: 2rem; margin-top: 10px; }

/* --- INTRO PHASE --- */
.intro-content {
  text-align: center;
  color: #333;
  padding: 20px;
}
.intro-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
}
.intro-body {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
}
.instruction-box {
  background: white;
  border: 2px solid #000000;
  padding: 30px;
  text-align: left;
  max-width: 900px;
  margin: 0 auto 40px auto;
  font-size: 1.3rem;
  border-radius: 10px;
}
.instruction-box ul {
  list-style-type: disc;
  padding-left: 40px;
}
.instruction-box li {
  margin-bottom: 10px;
}
.btn-pink {
  background-color: #3498db;
  border: 2px solid #ffffff;
  color: #000;
  padding: 10px 80px;
  font-size: 1.5rem;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.1s;
}
.btn-pink:hover {
  background-color: #3498db;
  transform: scale(1.02);
}
.btn-pink:active {
  transform: scale(0.98);
}

/* Checkbox & Redecide Styles */
.decision-section { margin-top: 15px; padding: 5px; border-radius: 4px; transition: background-color 0.3s; }
.highlight-warning { border: 1px dashed #e74c3c; background-color: #fff5f5; }
.checkbox-item { display: flex; align-items: center; font-size: 1rem; color: #333; }
.divider-sm { border: 0; border-top: 1px solid #e0e0e0; margin: 10px 0; }
.ml-2.pointer { margin-left: 0.5rem; cursor: pointer; }
.mt-2 { margin-top: 0.5rem; }

/* Leaderboard */
.leaderboard-section { margin-top: 30px; text-align: left; }
.leaderboard-section h3 { text-align: center; color: #f1c40f; text-shadow: 1px 1px 0 #333; font-size: 1.5rem; margin-bottom: 15px; }
.leaderboard-table { font-size: 0.95rem; }

/* Responsive Design */
@media screen and (max-width: 1024px) {
    /* Tablet (iPad) */
    .game-container {
        max-width: 95%;
        padding: 20px;
    }
    .intro-title { font-size: 2.5rem; }
    .situation-box { font-size: 1.8rem; padding: 40px; }
    .ai-header { font-size: 2.5rem; }
    .ai-box-main { width: 95%; font-size: 1.5rem; }
    .ai-box-sub { width: 95%; font-size: 1.3rem; }
    .ai-decision-area { width: 95%; gap: 15px; }
    .btn-ai { font-size: 1.2rem; padding: 15px; }
}

@media screen and (max-width: 768px) {
    /* Mobile (Phone) */
    .game-container {
        max-width: 100%;
        margin: 5px;
        padding: 15px;
        border-radius: 8px;
        min-height: 100vh;
    }
    
    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 30px;
        padding-bottom: 20px;
    }
    .round-info { font-size: clamp(1.3rem, 5vw, 1.8rem); }
    .cash-info { text-align: left; }
    .cash-amount { font-size: clamp(1.1rem, 4vw, 1.4rem); }
    .sub-text { font-size: clamp(0.8rem, 2.5vw, 0.9rem); }
    
    /* Intro */
    .intro-content { padding: 25px 15px; }
    .intro-title { font-size: clamp(1.8rem, 7vw, 2.5rem); }
    .intro-body { font-size: clamp(0.95rem, 3.5vw, 1.15rem); line-height: 1.8; }
    .instruction-box { padding: 20px; font-size: clamp(0.95rem, 3.5vw, 1.1rem); border-radius: 8px; max-width: 100%; }
    .instruction-box ul { padding-left: 20px; }
    .instruction-box li { margin-bottom: 12px; line-height: 1.6; }
    .btn-pink { width: 100%; padding: clamp(12px, 3vw, 18px) 15px; font-size: clamp(1.1rem, 4vw, 1.3rem); border-radius: 6px; }
    .btn-pink:active { transform: scale(0.95); }

    /* Situation */
    .situation-content { padding: 20px 10px; }
    .situation-header { font-size: clamp(1.5rem, 6vw, 2rem); }
    .situation-box { font-size: clamp(1.2rem, 4.5vw, 1.6rem); padding: 25px 15px; min-height: 180px; line-height: 1.8; border-radius: 8px; word-wrap: break-word; }
    .action-area { margin-top: 20px; text-align: center; }

    /* AI Content */
    .ai-content { padding: 15px; }
    .ai-header { font-size: clamp(1.3rem, 5vw, 1.8rem); text-align: center; margin-bottom: 15px; }
    .ai-box-main { width: 100%; font-size: clamp(1.1rem, 4vw, 1.4rem); padding: 20px 15px; line-height: 1.7; border-radius: 8px; word-wrap: break-word; }
    .ai-box-sub { width: 100%; font-size: clamp(1rem, 3.5vw, 1.3rem); padding: 15px 12px; border-radius: 6px; }
    .ai-decision-area { flex-direction: column; width: 100%; gap: 15px; }
    .decision-col { width: 100%; }
    .btn-ai { font-size: clamp(1rem, 3.5vw, 1.2rem); padding: 14px 12px; }
    .btn-redecide, .btn-confirm, .btn-next-step { border-radius: 6px; }

    /* Trading Phase */
    .main-content { flex-direction: column; gap: 20px; padding: 0; }
    .panel { min-width: 100%; padding: 15px; border-radius: 8px; }
    .panel-title { font-size: clamp(1.15rem, 4vw, 1.3rem); margin-bottom: 12px; }
    .btn-action { width: 100% !important; padding: clamp(12px, 3vw, 18px) 15px !important; font-size: clamp(1.05rem, 4vw, 1.3rem) !important; border-radius: 6px !important; margin-top: 15px !important; }
    .btn-action:active { transform: scale(0.95); }
    .btn-action:disabled { opacity: 0.6; }
    .error-msg { font-size: clamp(0.95rem, 3.5vw, 1.1rem); margin-bottom: 12px; padding: 10px; border-radius: 4px; }
    
    /* Footer Summary */
    .footer-summary { margin-top: 20px; padding: 15px; border-radius: 8px; }
    .status-row, .total-row { font-size: clamp(1rem, 3.5vw, 1.15rem); margin-bottom: 10px; padding: 8px 0; flex-wrap: wrap; }
    .total-amount { font-size: clamp(1.1rem, 4vw, 1.3rem); }
    .decision-section { margin-top: 15px; padding: 12px; background-color: white; border-radius: 6px; }
    .checkbox-item { font-size: clamp(0.95rem, 3.5vw, 1.1rem); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
    
    /* Summary Page */
    .summary-content { padding: 15px 10px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .summary-card { padding: 25px 15px; border-radius: 8px; width: 100%; }
    .summary-details { font-size: clamp(1rem, 3.5vw, 1.2rem); margin: 15px 0; }
    .summary-details p { margin-bottom: 10px; line-height: 1.6; }
    .summary-details span { font-weight: bold; color: #2c3e50; }
    .grand-total { font-size: clamp(1.4rem, 6vw, 2rem); margin-top: 20px; color: #27ae60; word-wrap: break-word; }
    
    /* Leaderboard */
    .leaderboard-section { margin-top: 25px; padding: 15px; }
    .leaderboard-section h3 { font-size: clamp(1.2rem, 5vw, 1.5rem); margin-bottom: 15px; }
    .leaderboard-table { font-size: clamp(0.85rem, 3vw, 1rem); }
    
    /* Table Adjustments */
    :deep(.clean-table .p-datatable-thead > tr > th) { padding: 10px 8px; font-size: clamp(0.85rem, 3vw, 1rem); font-weight: bold; }
    :deep(.clean-table .p-datatable-tbody > tr > td) { padding: 10px 8px; font-size: clamp(0.85rem, 3vw, 0.95rem); word-wrap: break-word; }
    :deep(.p-datatable .p-datatable-tbody > tr) { height: auto; }
    :deep(.p-inputnumber-input) { font-size: clamp(0.95rem, 3.5vw, 1rem); padding: 8px !important; width: 100%; }
    
    /* Input Group */
    .input-group { width: 100%; max-width: 100% !important; }
    :deep(.p-inputtext) { font-size: clamp(0.95rem, 3.5vw, 1.1rem); padding: 10px 12px !important; width: 100% !important; }
    
    /* Label Adjustments */
    label { font-size: clamp(0.95rem, 3.5vw, 1.1rem); font-weight: bold; }
}

@media screen and (max-width: 480px) {
    /* Extra Small Phones */
    .game-container { padding: 12px; margin: 0; }
    .intro-title { font-size: clamp(1.6rem, 6vw, 2rem); }
    .instruction-box { padding: 15px; }
    .situation-box { min-height: 150px; padding: 20px 12px; }
    .panel { padding: 12px; }
    .btn-pink, .btn-action { padding: 14px 12px !important; font-size: clamp(1rem, 3.5vw, 1.2rem) !important; }
}
</style>