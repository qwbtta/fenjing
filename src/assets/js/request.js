import Vue from 'vue';
import axios from "axios";


const baseUrl = "https://kuaifenjing.zaiguwang.com"

axios.interceptors.request.use(config => {
  let token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
// 添加响应拦截器
axios.interceptors.response.use((response) =>{
    if(response.data.code == 401){
      localStorage.removeItem("token")
      this.$router.push('/login');
    }
	return response.data;
  }, 
  (error)=> {
    if(error?.response?.data?.code == 401){
      localStorage.removeItem("token")
      this.$router.push('/login');
    }
    console.error(error.response);
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
// 注销登录
export const userLogOff = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/userLogOff",params)
}

// 手机发送短信验证码
export const getCode = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/getCode",params)
}

// 短信验证码登录
export const loginWithCode = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/loginWithCode",params)
}

// 查询用户信息
export const getUserInfo = (params) => {
  return  axios.get(baseUrl + "/storyBoard/userInfo",{
    params: params
})
}

// 搜索用户
export const selContact = (params) => {
  return  axios.get(baseUrl + "/storyBoard/contract/selContact",{
    params: params
})
}

// 发送邀请
export const messageSend = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/message/messageSend",params)
}

// 接受邀请
export const messageApply = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/message/messageApply",params)
}

// 分组列表下用户
export const contactList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/contract/contactList",{
    params: params
})
}

// 分组列表
export const groupList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/contract/groupList",{
    params: params
})
}

// 创建分组
export const addGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/contract/addGroup",params)
}

// 删除分组
export const deleteGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/contract/deleteGroup",params)
}

// 重命名分组
export const updateGroup = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/contract/updateGroup",params)
}

// 联系人加入分组
export const groupContact = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/contract/groupContact",params)
}

// 联系人移出分组
export const removeGroupContact = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/contract/removeGroupContact",params)
}

// 删除联系人
export const deleteContact = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/contract/deleteContact",params)
}


// 消息列表
export const messageList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/message/messageList",{
    params: params
})
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

// 项目协作用户列表
export const userList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/cooperation/userList",{
      params: params
  })
}

// 是否开启链接分享
export const openShare = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/cooperation/openShare",params)
}


// 获取项目协作分享链接
export const shareStatus = (params) => {
  return  axios.get(baseUrl + "/storyBoard/cooperation/shareStatus",{
      params: params
  })
}

// 链接邀请方式新增协作者
export const insertShareCooperation = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/cooperation/insertShareCooperation",params)
}


// 项目新增协作用户
export const insertCooperation = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/cooperation/insertCooperation",params)
}

// 项目移除协作用户
export const deleteCooperation = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/cooperation/deleteCooperation",params)
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

// 分镜排序移动
export const insertMirror = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/mirror/insertMirror",params)
}

// 表头排序移动
export const moveModelColumnConfig = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/model/moveModelColumnConfig",params)
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

// 编辑模板
export const updateModel = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/model/updateModel",params)
}

// 故事版列表
export const storyList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/story/storyList",{
    params: params
  })
}

// 拍摄计划列表
export const shootPlanList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/shootPlan/shootPlanList",{
    params: params
  })
}

// 新建拍摄计划
export const creatShootPlan = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootPlan/creatShootPlan",params)
}

// 新建拍摄计划
export const updateShootPlan = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootPlan/updateShootPlan",params)
}

// 删除拍摄计划
export const deleteShootPlan = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootPlan/deleteShootPlan",params)
}

// 拍摄计划列表
export const getStoryList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/shootPlan/storyList",{
    params: params
  })
}

// 未规划镜头移入/出拍摄计划
export const movePlanSort = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootPlan/movePlanSort",params)
}

// 拍摄计划移动排序
export const updatePlanSort = (params) => {
  return  postJSONData(baseUrl + " /storyBoard/shootPlan/updatePlanSort",params)
}

// 拍摄通告列表
export const shootAnnounceList = (params) => {
  return  axios.get(baseUrl + "/storyBoard/shootAnnounce/shootAnnounceList",{
    params: params
  })
}

// 拍摄通告详情
export const announceInfo = (params) => {
  return  axios.get(baseUrl + "/storyBoard/shootAnnounce/announceInfo",{
    params: params
  })
}

// 新建拍摄通告
export const creatAnnounce = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootAnnounce/creatAnnounce",params)
}

// 删除拍摄通告
export const deleteShootAnnounce = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootAnnounce/deleteShootAnnounce",params)
}


// 编辑拍摄通告
export const updateShootAnnounce = (params) => {
  return  postJSONData(baseUrl + "/storyBoard/shootAnnounce/updateShootAnnounce",params)
}