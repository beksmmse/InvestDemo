<template>
  <div class="game-container">
    
    <div class="header" v-if="!isGameOver">
      <div class="round-info">
        Round {{ currentRound }} of {{ totalRounds }}
      </div>
      <div class="cash-info">
        <div class="cash-text">เงินสดคงเหลือ: <span class="cash-amount">{{ formatCurrency(currentCash) }}</span> บาท</div>
        <small class="sub-text">เพิ่ม-ลด ตามจำนวนหุ้นที่ผู้เข้าร่วมซื้อ-ขาย</small>
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


    <div v-else-if="!isGameOver && currentPhase === 'TRADING'" class="trading-content fade-in">
      
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
                <Column field="symbol" header="หุ้น" style="width: 20%">
                    <template #body="slotProps">
                        <span class="font-bold">{{ slotProps.data.symbol }}</span>
                    </template>
                </Column>

                <Column header="จำนวนที่ต้องการซื้อ" style="width: 40%">
                    <template #body="slotProps">
                        <InputNumber 
                            v-model="slotProps.data.buyQty" 
                            :min="0" :max="100000"
                            placeholder="0"
                            :disabled="isInputDisabled(slotProps.data.buyQty)"
                            class="w-full"
                            inputClass="text-center"
                        />
                    </template>
                </Column>

                <Column header="รวมเป็นเงิน (บาท)" style="width: 40%">
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
            </div>

            <div class="action-area">
                <div v-if="totalPurchaseThisRound > currentCash" class="error-msg">
                    ⚠️ เงินสดไม่พอ
                </div>
                
                <Button 
                    :label="currentRound < totalRounds ? 'ยืนยัน & ไปรอบถัดไป' : 'จบเกม & ดูผลลัพธ์'" 
                    @click="handleEndRound" 
                    class="btn-action" 
                    :disabled="totalPurchaseThisRound > currentCash"
                />
            </div>
        </div>
      </div>
    </div>

    <div v-else-if="isGameOver" class="summary-content fade-in">
        <div class="summary-card">
            <h2>🎉 สรุปผลการลงทุน Group 1 🎉</h2>
            <div class="summary-details">
                <p>เงินสดคงเหลือ: <span>{{ formatCurrency(currentCash) }}</span> บาท</p>
                <p>มูลค่าหุ้นในพอร์ต: <span>{{ formatCurrency(calculatePortfolioValue()) }}</span> บาท</p>
            </div>
            <hr class="divider">
            <h1 class="grand-total">มูลค่ารวมสุทธิ: {{ formatCurrency(currentCash + calculatePortfolioValue()) }} บาท</h1>
            <Button label="เริ่มเกมใหม่" @click="restartGame" class="btn-action mt-4" />
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

// --- Configuration ---
const totalRounds = 12;
const initialCash = 1000000;
const maxSelection = 3;

// ข้อมูลเหตุการณ์ (Situation)
const situations = [
    "เศรษฐกิจนิ่ง ตลาดยังไม่มีข่าวเด่น", 
    "เริ่มมีข่าวลือเรื่องการปรับอัตราดอกเบี้ย",
    "รัฐบาลประกาศนโยบายสนับสนุนพลังงานสะอาด",
    "เกิดวิกฤตภัยแล้ง กระทบภาคการเกษตร",
    "บริษัทโทรคมนาคมรายใหญ่ประกาศควบรวมกิจการ",
    "ธนาคารกลางประกาศลดอัตราดอกเบี้ยนโยบาย",
    "ราคาน้ำมันในตลาดโลกพุ่งสูงขึ้นอย่างรวดเร็ว",
    "มีการประท้วงหยุดงานในภาคอุตสาหกรรม",
    "ค่าเงินบาทแข็งค่าขึ้น ส่งผลกระทบต่อการส่งออก",
    "มีการค้นพบแหล่งก๊าซธรรมชาติใหม่",
    "ดัชนีความเชื่อมั่นผู้บริโภคสูงสุดในรอบปี",
    "วิกฤตโรคระบาดใหม่ เริ่มส่งผลกระทบต่อการท่องเที่ยว"
];

const stockInfo = [
  { id: 1, symbol: 'EGU', industry: 'สาธารณูปโภค' },
  { id: 2, symbol: 'SMC', industry: 'ธนาคาร' },
  { id: 3, symbol: 'THL', industry: 'โทรคมนาคม' },
  { id: 4, symbol: 'CPP', industry: 'ค้าปลีก' },
  { id: 5, symbol: 'PTX', industry: 'พลังงาน' },
];

const allRoundPrices = [
    [50, 120, 40, 30, 70], [55, 115, 42, 28, 75], [60, 110, 45, 35, 80],  
    [58, 112, 44, 34, 78], [65, 125, 48, 38, 85], [70, 130, 50, 40, 90],  
    [68, 128, 49, 39, 88], [75, 140, 55, 45, 95], [72, 135, 52, 42, 92],  
    [80, 150, 60, 50, 100], [85, 155, 65, 55, 105], [90, 160, 70, 60, 110]  
];

// --- State ---
const currentRound = ref(1);
const currentCash = ref(initialCash);
const isGameOver = ref(false);
const currentPhase = ref('SITUATION'); // เริ่มต้นที่หน้าอ่านข่าวก่อน

const myPortfolio = ref({ EGU: 0, SMC: 0, THL: 0, CPP: 0, PTX: 0 });
const currentStocks = ref([]);

// --- Functions ---
const loadRoundData = (round) => {
    const priceIndex = round - 1;
    const prices = allRoundPrices[priceIndex] || allRoundPrices[0];
    currentStocks.value = stockInfo.map((info, idx) => ({
        ...info,
        price: prices[idx],
        buyQty: null 
    }));
};

const currentSituationText = computed(() => situations[currentRound.value - 1] || "ไม่มีข้อมูลเหตุการณ์");

onMounted(() => { loadRoundData(1); });

const goToTradingPhase = () => {
    currentPhase.value = 'TRADING';
};

const selectedCount = computed(() => currentStocks.value.filter(s => s.buyQty > 0).length);
const isInputDisabled = (currentQty) => selectedCount.value >= maxSelection && !currentQty;

// Logic ไฮไลท์สีเขียวเมื่อมีการกรอกข้อมูล
const rowClassCalculator = (data) => {
    return data.buyQty > 0 ? 'row-active' : '';
};

const totalPurchaseThisRound = computed(() => {
    return currentStocks.value.reduce((sum, stock) => sum + (stock.price * (stock.buyQty || 0)), 0);
});

const handleEndRound = () => {
    if (totalPurchaseThisRound.value > currentCash.value) return;

    currentCash.value -= totalPurchaseThisRound.value;
    currentStocks.value.forEach(stock => {
        if(stock.buyQty > 0) myPortfolio.value[stock.symbol] += stock.buyQty;
    });

    if (currentRound.value < totalRounds) {
        currentRound.value++;
        loadRoundData(currentRound.value);
        currentPhase.value = 'SITUATION'; // กลับไปหน้าอ่านข่าวของรอบใหม่
        window.scrollTo(0,0);
    } else {
        isGameOver.value = true;
    }
};

const restartGame = () => {
    currentRound.value = 1;
    currentCash.value = initialCash;
    isGameOver.value = false;
    currentPhase.value = 'SITUATION';
    myPortfolio.value = { EGU: 0, SMC: 0, THL: 0, CPP: 0, PTX: 0 };
    loadRoundData(1);
};

const formatCurrency = (val) => new Intl.NumberFormat('th-TH').format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);

const calculatePortfolioValue = () => {
    const lastPrices = allRoundPrices[totalRounds - 1];
    let val = 0;
    val += myPortfolio.value.EGU * lastPrices[0];
    val += myPortfolio.value.SMC * lastPrices[1];
    val += myPortfolio.value.THL * lastPrices[2];
    val += myPortfolio.value.CPP * lastPrices[3];
    val += myPortfolio.value.PTX * lastPrices[4];
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

/* --- Clean DataTable Style --- */
:deep(.clean-table .p-datatable-thead > tr > th) {
    background-color: #f8f9fa; color: #495057; border-bottom: 2px solid #dee2e6; padding: 1rem;
}
:deep(.clean-table .p-datatable-tbody > tr > td) {
    padding: 1rem; border-bottom: 1px solid #f0f0f0;
}
/* Highlight Row */
:deep(.row-active) { background-color: #e8f5e9 !important; }
:deep(.row-active:hover) { background-color: #c8e6c9 !important; }

/* Input Styling */
:deep(.p-inputnumber-input) { border-radius: 4px; border: 1px solid #ced4da; padding: 8px; }
:deep(.p-inputnumber-input:focus) { border-color: #3498db; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }

/* Footer & Actions */
.footer-summary { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #eee; }
.status-row, .total-row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 5px; }
.total-amount { font-weight: bold; color: #e74c3c; font-size: 1.2rem; }

.action-area { margin-top: 20px; text-align: right; }
.btn-action {
    background-color: #3498db !important; border: none !important; padding: 12px 30px !important;
    font-size: 1.1rem !important; border-radius: 6px !important; transition: background-color 0.2s;
}
.btn-action:hover { background-color: #2980b9 !important; }
.btn-action:disabled { background-color: #95a5a6 !important; cursor: not-allowed; }
.error-msg { color: #e74c3c; margin-bottom: 10px; font-weight: bold; }

/* --- Summary Page --- */
.summary-content { display: flex; justify-content: center; padding-top: 50px; }
.summary-card {
    background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    width: 100%; max-width: 600px; text-align: center;
}
.summary-details { font-size: 1.2rem; margin: 20px 0; }
.summary-details span { font-weight: bold; color: #2c3e50; }
.grand-total { color: #27ae60; font-size: 2rem; margin-top: 10px; }
</style>