<template>
  <div class="bg-white py-5 px-4">
    <div class="flex justify-between">
      <p>16.07.2023 9:22</p>
      <p>Чек №2</p>
    </div>
    <p class="font-semibold">Клиент: Учкун</p>
    <div class="flex justify-between pb-2 border-b border-gray-700">
      <div class="flex gap-4">
        <p class="uppercase font-medium">Наименование</p>
        <p class="uppercase font-medium">К-во</p>
      </div>
      <p class="uppercase font-medium">Цена</p>
    </div>
    <div class="border-b border-gray-700 pb-1 pt-2" v-for="item in 4">
      <p>Натурель бананза</p>
      <div class="flex justify-between ml-[130px]">
        <p>480<span class="ml-1">(10)</span></p>
        <span>*</span>
        <p>1.250 UZS</p>
      </div>
    </div>
    <div class="flex justify-between mt-2">
      <div class="flex gap-20">
        <p class="font-medium uppercase">Итого</p>
        <p class="font-medium">1960 <span class="ml-1">(50)</span></p>
      </div>
      <p class="font-medium">3,780,000</p>
    </div>
    <p class="font-medium mt-2">Оплата: 0.00</p>
    <p class="font-medium">Текущий долг: 9,385,000.00</p>
  </div>
</template>
<script setup lang="ts">
</script>