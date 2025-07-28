import axiosInstance from './axios-config';
import { handleAxiosError } from './HandleAxiosError';
import { API_ENDPOINTS } from "./api-endpoints";

// 기본 API 호출 함수들
export const apiUtils = {
  // GET 요청
  get: async (endpoint, config = {}) => {
    try {
      const response = await axiosInstance.get(endpoint, config);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  // POST 요청
  post: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  // PUT 요청
  put: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  // DELETE 요청
  delete: async (endpoint, config = {}) => {
    try {
      const response = await axiosInstance.delete(endpoint, config);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  // PATCH 요청
  patch: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  // 파일 업로드
  upload: async (endpoint, formData, config = {}) => {
    try {
      const response = await axiosInstance.post(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },
};

// 페이지네이션 헬퍼
export const createPaginationParams = (page = 1, size = 10, sort = 'createdAt,desc') => {
  return {
    page: page - 1, // 백엔드에서 0-based pagination을 사용한다고 가정
    size,
    sort,
  };
};

// 검색 파라미터 헬퍼
export const createSearchParams = (searchTerm, filters = {}) => {
  const params = new URLSearchParams();
  
  if (searchTerm) {
    params.append('search', searchTerm);
  }
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  });
  
  return params.toString();
};

// 에러 메시지 추출
export const extractErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

// 성공 메시지 추출
export const extractSuccessMessage = (response) => {
  if (response.message) {
    return response.message;
  }
  if (response.msg) {
    return response.msg;
  }
  return '요청이 성공적으로 처리되었습니다.';
};

// 유기동물 관련 API 함수들
export const strayAnimalAPI = {
  // 유기동물 목록 조회
  getStrayAnimals: async (searchWord = '', kindFilter = '', addressFilter = '', genderFilter = '', page = 0, pageSize = 12) => {
    const params = new URLSearchParams();
    if (searchWord) params.append('searchWord', searchWord);
    if (kindFilter) params.append('upKindNm', kindFilter);
    if (addressFilter) params.append('careAddr', addressFilter);
    if (genderFilter) params.append('sexCode', genderFilter);
    params.append('page', page);
    params.append('pageSize', pageSize);
    
    return await apiUtils.get(`/animalboard-service/stray-animal-board/list?${params.toString()}`);
  },

  // 유기동물 상세 조회
  getStrayAnimalDetail: async (desertionNo) => {
    return await apiUtils.get(`/animalboard-service/stray-animal-board/${desertionNo}`);
  },
};

// 분양게시판 관련 API 함수들
export const adoptionAPI = {
  // 분양게시판 목록 조회
  getAdoptionBoardPosts: async (searchWord = '', petCategory = '', address = '', sex = '', page = 1, pageSize = 12) => {
    const params = new URLSearchParams();
    if (searchWord) params.append('searchWord', searchWord);
    if (petCategory) params.append('petCategory', petCategory);
    if (address) params.append('address', address);
    if (sex) params.append('sex', sex);
    params.append('page', page);
    params.append('pageSize', pageSize);
    
    return await apiUtils.get(`/animalboard-service/animal-board/list?${params.toString()}`);
  },

  // 분양게시판 상세 조회
  getAdoptionBoardDetail: async (postId) => {
    return await apiUtils.get(`/animalboard-service/animal-board/public/${postId}`);
  },

  // 분양글 등록
  createAdoptionPost: async (formData, token) => {
    return await apiUtils.post(
      '/animalboard-service/animal-board',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
          // Content-Type은 axios가 FormData일 때 자동으로 multipart/form-data로 설정
        }
      }
    );
  },

  // 분양 상세 조회 (별칭)
  getAdoptionDetail: async (id) => {
    return await apiUtils.get(`/animalboard-service/animal-board/public/${id}`);
  },

  // 분양글 수정 (PATCH)
  updateAdoptionPost: async (id, formData, token) => {
    return await apiUtils.patch(
      `/animalboard-service/animal-board/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
          // Content-Type은 axios가 FormData일 때 자동으로 multipart/form-data로 설정
        }
      }
    );
  },

  // 분양글 삭제
  deleteAdoptionPost: async (id, token) => {
    return await apiUtils.delete(
      `/animalboard-service/animal-board/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },

  // 예약상태 변경
  updateReservationStatus: async (id, status, token) => {
    return await apiUtils.patch(
      `/animalboard-service/animal-board/reservation/${id}`,
      { reservationStatus: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  },
}; 

export const getAdminLogList = async (page = 0, size = 10, searchWord = "") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (searchWord) params.append("searchWord", searchWord);

  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/log/list?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const getAdminUserList = async (page = 0, size = 10, search = "", report = "false", active = "all") => {
  const params = new URLSearchParams();
  if (search) {
    params.append("keyword", search);
  }
  if (report === "true" || report === "false") params.append("report", report);
  if (active === "true" || active === "false") params.append("active", active);
  params.append("page", page);
  params.append("size", size);

  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/user/list?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const getAdminUserDetail = async (userId) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    API_ENDPOINTS.ADMIN.USER_DETAIL(userId),
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

// 1:1 문의(고객센터) 목록 조회
export const getAdminInquiryList = async (page = 1, size = 10, searchWord = "", answered = "all") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (searchWord) params.append("searchWord", searchWord);
  if (answered === "true" || answered === "false") params.append("answered", answered);

  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/inform/list?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const getAdminInquiryDetail = async (informId) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/inform/${informId}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const patchAdminInquiryReply = async (informId, reply) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.patch(
    `/admin-service/admin/inform/${informId}`,
    { reply },
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.result;
}; 

export const getAdminTermsLastPost = async () => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/terms/lastPost`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const createAdminTerms = async (category, data) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.post(
    `/admin-service/admin/${category}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.result;
};

export const updateAdminTerms = async (category, id, data) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.patch(
    `/admin-service/admin/${category}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.result;
}; 

export const getAdminTermsList = async (category, page = 1, size = 10, searchWord = "") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (searchWord) params.append("searchWord", searchWord);

  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/${category}/list?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
};

export const getAdminTermsDetail = async (category, id) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/${category}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
};

export const deleteAdminTerms = async (category, id) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.delete(
    `/admin-service/admin/${category}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const getUserReportHistory = async (userId) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.get(
    `/admin-service/admin/user/report/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 

export const patchReportConfirm = async (reportId) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const response = await apiUtils.patch(
    `/admin-service/admin/report/${reportId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.result;
}; 