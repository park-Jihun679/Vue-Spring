<script setup>
import api from '@/api/boardApi';
import { ref, reactive, computed } from 'vue';
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router';

const cr = useRoute();              // 현재 라우트 정보
const router = useRouter();         // 라우터 인스턴스

const page = ref({});              // 페이지 데이터 저장
const articles = computed(() => page.value);  // 반응형 게시글 목록

const load = async () => {
  try {
    page.value = await api.getList();
    console.log(page.value);
  } catch {}
};

load(); // 해당 컴포넌트가 로드되자마자 load() 함수를 불러서
// 백엔드 서버로부터 json으로 받아오자
</script>

<template>
  <div>
    <h1 class="mb-3"><i class="fa-solid fa-paste"></i> 게시글 목록</h1>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 60px">No</th>
          <th>제목</th>
          <th style="width: 100px">작성자</th>
          <th style="width: 120px">작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.no">
          <td>{{ article.no }}</td>
          <td>
            <router-link
              :to="{ name: 'board/detail', params: { no: article.no } }"
            >
              {{ article.title }}
            </router-link>
          </td>
          <td>{{ article.writer }}</td>
          <td>{{ moment(article.regDate).format('YYYY-MM-DD') }}</td>
        </tr>
      </tbody>
    </table>
    <div class="my-5 d-flex">
      <div class="flex-grow-1 text-center">페이지 네이션</div>

      <div>
        <router-link :to="{ name: 'board/create' }" class="btn btn-primary">
          <i class="fa-solid fa-pen-to-square"></i> 글 작성</router-link
        >
      </div>
    </div>
  </div>
</template>
