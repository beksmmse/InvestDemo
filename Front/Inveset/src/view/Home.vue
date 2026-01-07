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
    <!-- <button>ฉันเห็นด้วยและไปต่อ</button> -->


    <div class="button-group">
        <router-link to="/group1">
          <button>Group 1</button>
        </router-link>

        <router-link to="/group2">
          <button>Group 2</button>
        </router-link>

        <router-link to="/group3">
          <button>Group 3</button>
        </router-link>

        <router-link to="/group4">
          <button>Group 4</button>
        </router-link>
    </div>

  </div>
</template>