<script setup>
import api from '@/api/boardApi';
import { ref, reactive, computed, watch } from 'vue';
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router';

const cr = useRoute(); // 현재 라우트 정보
const router = useRouter(); // 라우터 인스턴스

const page = ref({}); // 페이지 데이터 저장
const articles = computed(() => page.value.list); // 반응형 게시글 목록

// Composition API의 reactive 함수를 사용해 반응형 객체 pageRequest를 생성
const pageRequest = reactive({
  // 현재 페이지 번호를 설정: URL 쿼리 파라미터에서 page 값을 가져와 정수로 변환, 없으면 기본값 1
  page: parseInt(cr.query.page) || 1,

  // 한 페이지에 보여줄 항목 수를 설정: URL 쿼리 파라미터에서 amount 값을 가져와 정수로 변환, 없으면 기본값 10
  amount: parseInt(cr.query.amount) || 10,
});

const handlePageChange = async (pageNum) => {
  router.push({ query: { page: pageNum, amount: pageRequest.amount } });
};

watch(cr, async (params) => {
  console.log('WATCH호출됨... 자동 변경된 객체 page>>', cr.query.page);

  pageRequest.page = parseInt(cr.query.page);
  pageRequest.amount = parseInt(cr.query.amount);

  await load(pageRequest);
});

// 아래에 page 번호를 클릭했을 때 함수를 호출하게 함
// 함수는 나를 다시 호출함 (페이지 번호와 한 페이지당 amount)

// 주소가 바뀌고, 주소가 바뀌면 cr의 쿼리를 pageRequest가 변하는지 설정했으므로
// 자동으로 쿼리가 바뀌었을 때 자동으로 처리해줄 것을 설정
// ==> watch를 쓴다.
// load(pageRequest)를 불러줌

// 데이터 로딩 함수
const load = async (query) => {
  try {
    page.value = await api.getList(query);
    console.log(page.value);
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  }
};

load(pageRequest); // 해당 컴포넌트가 로드되자마자 load() 함수를 불러서
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
              :to="{
                name: 'board/detail',
                params: { no: article.no },
                query: cr.query,
              }"
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
      <div class="flex-grow-1 text-center">
        <!-- 페이지 네이션 -->
        <vue-awesome-paginate
          :total-items="page.totalCount"
          :items-per-page="pageRequest.amount"
          :max-pages-shown="5"
          :show-ending-buttons="true"
          v-model="pageRequest.page"
          @click="handlePageChange"
        >
          <template #first-page-button
            ><i class="fa-solid fa-backward-fast"></i
          ></template>
          <template #prev-button
            ><i class="fa-solid fa-caret-left"></i
          ></template>
          <template #next-button
            ><i class="fa-solid fa-caret-right"></i
          ></template>
          <template #last-page-button
            ><i class="fa-solid fa-forward-fast"></i
          ></template>
        </vue-awesome-paginate>
      </div>
      <div>
        <router-link :to="{ name: 'board/create' }" class="btn btn-primary">
          <i class="fa-solid fa-pen-to-square"></i> 글 작성</router-link
        >
      </div>
    </div>
  </div>
</template>
