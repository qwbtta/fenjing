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
                let tempHead = [
                  {
                    colName: "排序",
                    colId: "index",
                  },
                ];
                let tempList = [];
                for (let i = 0; i < colRes.data.length; i++) {
                  if (0 == colRes.data[i].isHidden) {
                    let item = {
                      colName: colRes.data[i].columnName,
                      colId: colRes.data[i].id,
                    };
                    let specialHead = ["内容", "画面"];
                    if (specialHead.includes(colRes.data[i].columnName)) {
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