import {
  getMirrorList,
  modelColumnConfig,
  createMirror,
  updateMirror,
  deleteMirror,
  deleteFile,
  updateFile,
  updateFileSort,
} from "@/assets/js/request";
import { mapState, mapMutations } from "vuex";
export const commonMethods = {
  computed: {
      ...mapState(["activeProject"]),
  },
  methods: {
      ...mapMutations(["SET_ACTIVEPROJECT"]),
      toGetMirrorList() {
          getMirrorList({
            projectId: this.activeProject.id,
          }).then((res) => {
            modelColumnConfig({
              modelId: this.activeProject.modelId,
              projectId: this.activeProject.id,
            }).then((colRes) => {
            this.modelColumnConfig = colRes.data
              let tempHead = [
                {
                  colName: "排序",
                  colId: "index",
                  isSystem:'0'
                },
              ];
              let tempList = [];
              let isSystemList = [] //用户自定义添加的列  后端用的0/1值和实际命名含义的true/false相反  所以这里变量名含义会有问题
              
              //后端数据不满足操作  手动处理
              for (let i = 0; i < colRes.data.length; i++) {
                if (0 == colRes.data[i].isHidden && colRes.data[i].isSystem == '1') {
                  isSystemList.push(colRes.data[i].columnName)
              }
             }
              for (let i = 0; i < colRes.data.length; i++) {
                if (0 == colRes.data[i].isHidden) {
                  let item = {
                    colName: colRes.data[i].columnName,
                    colId: colRes.data[i].id,
                    isSystem: colRes.data[i].isSystem,
                  };
                  let specialHead = ["内容", "画面"];
                  if (isSystemList.includes(colRes.data[i].columnName) || specialHead.includes(colRes.data[i].columnName)) {
                    item.specialClass = "width300";
                  }
                  tempHead.push(item);
                }
              }
               // 按 sort属性升序排序
              tempHead.sort((a, b) =>  a.sort - b.sort);
       
              for (let x = 0; x < res.data.length; x++) {
                let item = {
                  rowId: res.data[x].id,
                  announcePlanId: res.data[x].announcePlanId,
                  sort:res.data[x].sort,
                  colObj: [],
                };
    
                for (let y = 0; y < tempHead.length; y++) {
                  let obj = {};
                  obj.colId = tempHead[y].colId;
                  obj.name = tempHead[y].colName;
                  obj.isSystem = tempHead[y].isSystem;
                  obj.content = "";
                  if ("画面" == tempHead[y].colName) {
                    obj.content = [];
                  }
                  for (
                    let j = 0;
                    j < res.data[x].storyBoardMirrorColumns.length;
                    j++
                  ) {
                    if (
                      tempHead[y].colId ==
                      res.data[x].storyBoardMirrorColumns[j].columnConfigId
                    ) {
                      obj.mirrorColumnId =
                        res.data[x].storyBoardMirrorColumns[j].id;
                      if ("画面" == tempHead[y].colName) {
                        let fileList =
                          res.data[x].storyBoardMirrorColumns[j].fileList;
                          fileList.sort((a, b) =>  a.sort - b.sort);
                        obj.content = fileList;
                      } else {
                        obj.content =
                          res.data[x].storyBoardMirrorColumns[j].columnContent;
                      }
                    }
                  }
                  item.colObj.push(obj);
                }
                tempList.push(item);
              }
    
              this.activeProject.storyboardHead = this.storyboardHead = tempHead;
              this.activeProject.storyboardList = this.storyboardList = tempList;
              this.SET_ACTIVEPROJECT(this.activeProject);
              console.log(this.activeProject, "this.activeProject");
            });
          });
        },
        getValue(list, keyName) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.includes(keyName)) {
              return list[i].content;
            }
          }
        },
  }
};