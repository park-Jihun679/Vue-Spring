import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import axios from '@/api';
const initState = {
  token: '', // 접근 토큰(JWT)
  user: {
    username: '', // 사용자 ID
    email: '', // Email
    roles: [], // 권한 목록
  },
};
export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });
  const isLogin = computed(() => !!state.value.user.username); // 로그인 여부
  const username = computed(() => state.value.user.username); // 로그인 사용자 ID
  const email = computed(() => state.value.user.email); // 로그인 사용자 email

  // 로그인 액션
  const login = async (member) => {
    const { data } = await axios.post('/api/auth/login', member);
    state.value = { ...data }; // 서버 응답 데이터로 상태 업데이트

    // localStorage에 상태 저장
    localStorage.setItem('auth', JSON.stringify(state.value));
  };

  // 로그아웃 액션
  const logout = () => {
    localStorage.clear(); // localStorage 완전 삭제
    state.value = { ...initState }; // 상태를 초기값으로 리셋
  };

  // 토큰 얻어오기 액션
  const getToken = () => state.value.token;

  // 상태 복원 로직
  // - localStorage에 인증 정보(auth)가 저장되어 있을 경우 상태 복원
  const load = () => {
    const auth = localStorage.getItem('auth');
    if (auth != null) {
      state.value = JSON.parse(auth); // JSON 문자열을 객체로 변환
      console.log(state.value);
    }
  };
  
  // 회원정보 수정
  const changeProfile = (member) => {
    state.value.user.email = member.email;
    localStorage.setItem('auth', JSON.stringify(state.value));
  };

  // 스토어 초기화 시 자동 실행
  load();

  // 외부에서 사용할 수 있도록 반환
  return {
    state,
    username,
    email,
    isLogin,
    login,
    logout,
    changeProfile,
    getToken,
  };
});
