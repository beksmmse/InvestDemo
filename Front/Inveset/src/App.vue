
<template>
  <div id="app">
    <h1>ยินดีต้อนรับสู่การวิจัยนี้</h1>
    <h2>เป็นการศึกษาทางวิชาการเพื่อศึกษาการตัดสินใจภายใต้ข้อมูลรูปแบบต่าง ๆ โดยใช้เวลาประมาณ 20 นาที</h2>
    <ul class="home">
      <li>การเข้าร่วมเป็นความสมัครใจ</li>
      <li>ไม่มีความเสี่ยงต่อผู้เข้าร่วม</li>
    </ul>
    <input type="checkbox" id="eighteen" name="eighteen" value="eighteenchecked">
    <label class="home" for="eighteen">ฉันอายุครบ 18 ปีบริบูรณ์แล้ว</label><br>
    <input type="checkbox" id="accept" name="accept" value="acceptchecked">
    <label class="home" for="accept">ฉันยินยอมที่จะเข้าร่วมกิจกรรมนี้เพื่อการวิจัยเท่านั้น</label><br>
    <button>ฉันเห็นด้วยและไปต่อ</button>
  </div>
</template>

<script setup>
  console.log("App component loaded");
</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
