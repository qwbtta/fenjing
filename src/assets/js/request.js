import axios from "axios";


const baseUrl = "https://kuaifenjing.zaiguwang.com"
let token = localStorage.getItem("token")
axios.interceptors.request.use(config => {
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
// 添加响应拦截器
axios.interceptors.response.use((response) =>{
    // if(response.data.code == 401){
    //   localStorage.removeItem("token")
    //   location.href = location.origin
    // }
	return response.data;
  }, 
  (error)=> {
     
});

  function postJSONData(url, params) {
    return axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  function postFormData(url, params) {
    let forms = new FormData();
    for (const key in params) {
      forms.append(key, params[key]);
    }
    return axios.post(url, forms, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
   


// 登录(手机号 密码)
export const login = (params) => {
    return  postJSONData(baseUrl + "/storyBoard/login",params)
}

// 手机发送短信验证码
export const getCode = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/getCode",params)
}

// 短信验证码登录
export const loginWithCode = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/loginWithCode",params)
}

// 获取项目列表
export const getProjectList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/project/projectList",{
      params: params
  })
}

// 新建组
export const creatProjectGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/creatProjectGroup",params)
}

// 重命名组
export const updateProjectGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/updateProjectGroup",params)
}

// 删除组
export const deleteProjectGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/deleteProjectGroup",params)
}

// 新建项目
export const creatProject = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/creatProject",params)
}

// 重命名项目
export const updateProjectName = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/updateProjectName",params)
}

// 项目移入组
export const moveProjectToGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/moveProjectToGroup",params)
}


// 项目移入回收站
export const deleteProject = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/deleteProject",params)
}

// 项目从回收站恢复
export const roolBackProject = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/roolBackProject",params)
}

// 回收站彻底删除项目
export const cleanOutProject = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/cleanOutProject",params)
}


// 复制分镜到新项目
export const copyProject  = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/project/copyProject",params)
}

// 模板列表
export const getModelList = () => {
  return  axios.get(baseUrl + "/storyBoard/model/modelList")
}

// 分镜列表
export const getMirrorList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/mirror/mirrorList",{
      params: params
  })
}
// 列设置
export const modelColumnConfig = (params) => {
  return  axios.get(baseUrl + "/storyBoard/model/modelColumnConfig",{
      params: params
  })
}

// 新增分镜
export const createMirror = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/mirror/createMirror",params)
}

// 编辑分镜
export const updateMirror = (params) => {
  return  postFormData(baseUrl + "/storyBoard/mirror/updateMirror",params)
}

// 删除分镜
export const deleteMirror = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/mirror/deleteMirror",params)
}

// 删除单个文件
export const deleteFile = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/file/deleteFile",params)
}

// 替换单个文件
export const updateFile = (params) => {
  return  postFormData(baseUrl + "/storyBoard/file/updateFile",params)
}

// 文件排序
export const updateFileSort = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/file/updateFileSort",params)
}


