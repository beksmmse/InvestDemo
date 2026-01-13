<script setup>
import { ref } from 'vue';

const ageConsent = ref(false);
const researchConsent = ref(false);
</script>

<template>
  <div class="home-wrapper">
    <div class="glass-card fade-in">
      <header class="home-header">
        <h1 class="main-title">ยินดีต้อนรับสู่กิจกรรมวิจัย</h1>
        <p class="subtitle">การศึกษาทางวิชาการเพื่อศึกษาการตัดสินใจภายใต้ข้อมูลรูปแบบต่าง ๆ</p>
      </header>

      <section class="info-section">
        <div class="info-list-card">
          <ul class="home-list">
            <li>การเข้าร่วมเป็นความสมัครใจ</li>
            <li>ข้อมูลของคุณจะถูกเก็บเป็นความลับ</li>
            <li>ไม่มีความเสี่ยงต่อผู้เข้าร่วมกิจกรรม</li>
          </ul>
        </div>
      </section>

      <section class="consent-section">
        <h3 class="consent-title">กรุณายินยอมเงื่อนไขก่อนเริ่มต้น</h3>
        <div class="consent-container">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="ageConsent">
            <span class="checkmark"></span>
            <span class="label-text">ฉันอายุครบ 18 ปีบริบูรณ์แล้ว</span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" v-model="researchConsent">
            <span class="checkmark"></span>
            <span class="label-text">ฉันยินยอมที่จะเข้าร่วมกิจกรรมนี้เพื่อการวิจัยเท่านั้น</span>
          </label>
        </div>
      </section>

      <div v-if="!ageConsent || !researchConsent" class="warning-banner">
        <span class="warning-icon">⚠️</span>
        <span>กรุณายินยอมเงื่อนไขทั้งหมดก่อนเลือกกลุ่มกิจกรรม</span>
      </div>

      <footer class="group-selection">
        <h3 class="selection-title">เลือกกลุ่มกิจกรรมของคุณ</h3>
        <div class="button-grid" :class="{ 'disabled-grid': !ageConsent || !researchConsent }">
          <router-link to="/group1" class="group-link">
            <button class="btn-group" :disabled="!ageConsent || !researchConsent">
              <span class="group-name">Group 1</span>
            </button>
          </router-link>

          <router-link to="/group2" class="group-link">
            <button class="btn-group" :disabled="!ageConsent || !researchConsent">
              <span class="group-name">Group 2</span>
            </button>
          </router-link>

          <router-link to="/group3" class="group-link">
            <button class="btn-group" :disabled="!ageConsent || !researchConsent">
              <span class="group-name">Group 3</span>
            </button>
          </router-link>

          <router-link to="/group4" class="group-link">
            <button class="btn-group" :disabled="!ageConsent || !researchConsent">
              <span class="group-name">Group 4</span>
            </button>
          </router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Sarabun:wght@300;400;600;700&display=swap');

.home-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
  font-family: 'Outfit', 'Sarabun', sans-serif;
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  width: 100%;
  max-width: 800px;
  padding: 50px;
  text-align: center;
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 40px;
  line-height: 1.6;
}

.info-section {
  margin-bottom: 40px;
}

.info-list-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 24px;
  display: inline-block;
  text-align: left;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.home-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.home-list li {
  margin-bottom: 12px;
  padding-left: 28px;
  position: relative;
  color: #4a5568;
}

.home-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #38a169;
  font-weight: 700;
}

.consent-section {
  background: #f8fafc;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
}

.consent-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
}

.consent-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
}

/* Custom Checkbox */
.custom-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
  color: #4a5568;
  transition: color 0.2s;
}

.custom-checkbox:hover {
  color: #2d3748;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 24px;
  width: 24px;
  background-color: #fff;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  margin-right: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

.custom-checkbox:hover input ~ .checkmark {
  border-color: #3182ce;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #3182ce;
  border-color: #3182ce;
  transform: scale(1.05);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.warning-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff5f5;
  color: #c53030;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid #feb2b2;
}

.warning-icon {
  margin-right: 8px;
}

.selection-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 24px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  transition: opacity 0.3s ease;
}

.disabled-grid {
  opacity: 0.6;
}

.btn-group {
  width: 100%;
  padding: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  background: white;
  color: #3182ce;
  border: 2px solid #3182ce;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Outfit', sans-serif;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.btn-group:hover:not(:disabled) {
  background-color: #3182ce;
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(49, 130, 206, 0.3);
}

.btn-group:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-group:disabled {
  background-color: #edf2f7;
  border-color: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

.group-link {
  text-decoration: none;
}

@media (max-width: 640px) {
  .glass-card {
    padding: 30px 20px;
  }
  .main-title {
    font-size: 1.8rem;
  }
  .button-grid {
    grid-template-columns: 1fr;
  }
  .main-title {
    font-size: 1.8rem;
  }
}
</style>