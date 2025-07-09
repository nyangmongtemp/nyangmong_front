import { apiUtils } from './api-utils';
import { API_ENDPOINTS } from './api-endpoints';
import { createPaginationParams, createSearchParams } from './api-utils';

// 게시판 API 사용 예시들

// 1. 커뮤니티 게시판 게시글 목록 조회
export const getCommunityPosts = async (page = 1, size = 10, searchTerm = '', filters = {}) => {
  const paginationParams = createPaginationParams(page, size);
  const searchParams = createSearchParams(searchTerm, filters);
  
  const queryString = new URLSearchParams({
    ...paginationParams,
    ...(searchParams && { search: searchParams })
  }).toString();
  
  const endpoint = `${API_ENDPOINTS.BOARD.COMMUNITY.LIST}?${queryString}`;
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('커뮤니티 게시글 목록 조회 실패:', error);
    throw error;
  }
};

// 2. 커뮤니티 게시글 상세 조회
export const getCommunityPostDetail = async (postId) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.DETAIL(postId);
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('커뮤니티 게시글 상세 조회 실패:', error);
    throw error;
  }
};

// 3. 커뮤니티 게시글 작성
export const createCommunityPost = async (postData) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.CREATE;
  
  try {
    const response = await apiUtils.post(endpoint, postData);
    return response;
  } catch (error) {
    console.error('커뮤니티 게시글 작성 실패:', error);
    throw error;
  }
};

// 4. 커뮤니티 게시글 수정
export const updateCommunityPost = async (postId, postData) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.UPDATE(postId);
  
  try {
    const response = await apiUtils.put(endpoint, postData);
    return response;
  } catch (error) {
    console.error('커뮤니티 게시글 수정 실패:', error);
    throw error;
  }
};

// 5. 커뮤니티 게시글 삭제
export const deleteCommunityPost = async (postId) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.DELETE(postId);
  
  try {
    const response = await apiUtils.delete(endpoint);
    return response;
  } catch (error) {
    console.error('커뮤니티 게시글 삭제 실패:', error);
    throw error;
  }
};

// 6. 커뮤니티 게시글 좋아요
export const likeCommunityPost = async (postId) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.LIKE(postId);
  
  try {
    const response = await apiUtils.post(endpoint);
    return response;
  } catch (error) {
    console.error('커뮤니티 게시글 좋아요 실패:', error);
    throw error;
  }
};

// 7. 커뮤니티 게시글 댓글 조회
export const getCommunityComments = async (postId) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.COMMENT(postId);
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('커뮤니티 댓글 조회 실패:', error);
    throw error;
  }
};

// 8. 커뮤니티 게시글 댓글 작성
export const createCommunityComment = async (postId, commentData) => {
  const endpoint = API_ENDPOINTS.BOARD.COMMUNITY.COMMENT(postId);
  
  try {
    const response = await apiUtils.post(endpoint, commentData);
    return response;
  } catch (error) {
    console.error('커뮤니티 댓글 작성 실패:', error);
    throw error;
  }
};

// 입양 게시판 API 예시
export const getAdoptionPosts = async (page = 1, size = 10, filters = {}) => {
  const paginationParams = createPaginationParams(page, size);
  const searchParams = createSearchParams('', filters);
  
  const queryString = new URLSearchParams({
    ...paginationParams,
    ...(searchParams && { filters: searchParams })
  }).toString();
  
  const endpoint = `${API_ENDPOINTS.BOARD.ADOPTION.LIST}?${queryString}`;
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('입양 게시글 목록 조회 실패:', error);
    throw error;
  }
};

// 분양게시판 목록 조회 (새로운 API)
export const getAdoptionBoardPosts = async (searchWord = '', petCategory = '', address = '', sex = '', page = 1, size = 10) => {
  const params = new URLSearchParams();
  
  if (searchWord) params.append('searchWord', searchWord);
  if (petCategory) params.append('petCategory', petCategory);
  if (address) params.append('address', address);
  if (sex) params.append('sex', sex);
  
  // 페이징 파라미터 추가 (1-based pagination)
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  const queryString = params.toString();
  const endpoint = `${API_ENDPOINTS.BOARD.ADOPTION.LIST}?${queryString}`;
  
  console.log('분양게시판 API 호출 상세:', {
    page,
    size,
    searchWord,
    petCategory,
    address,
    sex,
    endpoint
  });
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('분양게시판 목록 조회 실패:', error);
    throw error;
  }
};

// 파일 업로드 예시
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await apiUtils.upload(API_ENDPOINTS.UPLOAD.IMAGE, formData);
    return response;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

// 사용자 프로필 조회 예시
export const getUserProfile = async () => {
  try {
    const response = await apiUtils.get(API_ENDPOINTS.USER.PROFILE);
    return response;
  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
    throw error;
  }
};

// 사용자 프로필 수정 예시
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiUtils.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
    return response;
  } catch (error) {
    console.error('사용자 프로필 수정 실패:', error);
    throw error;
  }
};

// 유기동물 목록 조회
export const getStrayAnimals = async (searchWord = '', upKindNm = '', careAddr = '', sexCode = '', page = 1, size = 10) => {
  const params = new URLSearchParams();
  
  if (searchWord) params.append('searchWord', searchWord);
  if (upKindNm) params.append('upKindNm', upKindNm);
  if (careAddr) params.append('careAddr', careAddr);
  if (sexCode) params.append('sexCode', sexCode);
  
  // 페이징 파라미터 추가 (1-based pagination)
  params.append('page', (page + 1).toString());
  params.append('size', size.toString());
  
  const queryString = params.toString();
  const endpoint = `${API_ENDPOINTS.STRAY_ANIMAL.LIST}?${queryString}`;
  
  console.log('API 호출 상세:', {
    page,
    size,
    searchWord,
    upKindNm,
    careAddr,
    sexCode,
    endpoint
  });
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('유기동물 목록 조회 실패:', error);
    throw error;
  }
};

// 유기동물 상세 조회
export const getStrayAnimalDetail = async (animalId) => {
  const endpoint = API_ENDPOINTS.STRAY_ANIMAL.DETAIL(animalId);
  
  try {
    const response = await apiUtils.get(endpoint);
    return response;
  } catch (error) {
    console.error('유기동물 상세 조회 실패:', error);
    throw error;
  }
}; 