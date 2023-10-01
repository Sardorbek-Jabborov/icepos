<template>
  <div class="bg-white py-5 px-4">
    <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="hee hee"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="800px"
        ref="html2Pdf">
      <section slot="pdf-content">
        <div class="flex justify-between" slot="pdf-content">
          <p>{{ data?.created_at }}</p>
          <p>Чек № {{ data?.id }}</p>
        </div>
        <p class="font-semibold">Клиент: {{ data?.consumer?.fio }}</p>
        <div class="flex justify-between pb-2 border-b border-gray-700">
          <div class="flex gap-4">
            <p class="uppercase font-medium">Наименование</p>
            <p class="uppercase font-medium">К-во</p>
          </div>
          <p class="uppercase font-medium">Цена</p>
        </div>
        <div class="border-b border-gray-700 pb-1 pt-2" v-for="item in data?.products" :key="item">
          <p>{{ item?.product?.title }}</p>
          <div class="flex justify-between ml-[130px]">
            <p>{{ item?.quantity }}<span class="ml-1">({{ item?.product?.count_in_box }})</span></p>
            <span>*</span>
            <p>{{ item?.product?.consumer_price }} UZS</p>
          </div>
        </div>
        <div class="flex justify-between mt-2">
          <div class="flex gap-20">
            <p class="font-medium uppercase">Итого</p>
            <p class="font-medium">{{ data?.products.length }} <span class="ml-1">(50)</span></p>
          </div>
          <p class="font-medium">{{ data?.total_price }} UZS</p>
        </div>
        <p class="font-medium mt-2">Оплата: {{ data?.paid_price }} UZS</p>
        <p class="font-medium">Текущий долг: {{ data?.debt }}</p>
      </section>
    </vue-html2pdf>
    <VButton class="py-1 w-full flex items-center gap-2">
      <IconsSave class="w-6 h-6"/>
      <span>Check</span>
    </VButton>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import VueHtml2pdf from "vue3-html2pdf";
import IconsSave from "@/components/Icons/Save.vue";
import VButton from "@/components/Button/VButton.vue";

defineProps({
  data: {}
});


</script>