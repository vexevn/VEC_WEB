import {
  FormDirectionType,
  FormElement,
  FormElementType,
  FormInfo,
} from "~/assets/scripts/base/FormInfo";
import { GetStartMonth, GetTimeNow } from "../../Functions";
import { Para } from "../../Para";
import { SelectOption } from "../../base/SelectOption";
import API from "../../API";
import Fixed_Asset_Manager from "./Fixed_Asset_Manager";

export default class transfer_fa {
  Info = new Fixed_Asset_Manager();

  Details = [];

  /**
   *
   * @param {transfer_fa} obj
   */
  constructor(obj) {
    this.update(obj);
  }
  /**
   *
   * @param {transfer_fa} obj
   */
  update(obj) {
    Object.assign(this, obj);
    this._formElements = {
      DateCreate: new FormElement({
        label: "Ngày lập phiếu",
        model: "Info.DateCreate",
        type: FormElementType.datePicker,
        labelWidth: 140,
        // options: Para.Para_Account,
        disabled: true,
        col: 11,
      }),
      UserCreate: new FormElement({
        label: "Người lập phiếu",
        model: "Info.UserCreate",
        type: FormElementType.select,
        labelWidth: 145,
        disabled: true,
        options: Para.Para_Account.set((p) => (p.placeholder = "")),

        // col:11,
      }),
      Approved_Date: new FormElement({
        label: "Ngày duyệt",
        model: "Info.Approved_Date",
        type: FormElementType.datePicker,
        labelWidth: 100,
        // options: Para.Para_Account,
        required: true,
        disabled: true,
        col: 10,
        attr: {
          disabledCrDate: true,
        },
      }),
      Approved_User: new FormElement({
        label: "Người duyệt",
        model: "Info.Approved_User",
        type: FormElementType.select,
        labelWidth: 140,
        disabled: this.disBtn,
        required: true,
        // options: Para.Para_Account.set((p) => (p.placeholder = "")).set(p=>p.disabled(item){
        //   item.Id ==
        // }),
        // disabled: true,
        options(obj) {
          // console.log(obj)
          return new SelectOption({
            data: API.Get_User_QLTS,
            // data: [],
            label: "FullName",
            // IsItemDisabled: item=>{
            //   if(item.Id == obj.Info.UserCreate)
            //     return true;
            //   // return
            // }
          });
        },
      }),

      Start_Date: new FormElement({
        label: "Ngày chuyển",
        model: "Info.Start_Date",
        type: FormElementType.datePicker,
        labelWidth: 140,
        required: true,
        disabled: this.disBtn,
        col: 11,
        attr: {
          disabledCrDate: true,
        },
      }),

      Receive_date: new FormElement({
        label: "Ngày nhận",
        model: "Info.Receive_date",
        type: FormElementType.datePicker,
        labelWidth: 100,
        required: true,
        disabled: true,
        col: 10,
        attr: {
          disabledCrDate: true,
        },
      }),
      From_Office_id: new FormElement({
        label: "Văn phòng chuyển",
        model: "Info.From_Office_id",
        type: FormElementType.select,
        labelWidth: 145,
        required: true,
        disabled: this.isAdd ? false : true,
        options: Para.Para_Office,
        watch(data) {
          // console.log("data.Info.Trasnfer_user", data.Info.Trasnfer_user);
        },
      }),

      To_Office_id: new FormElement({
        label: "Văn phòng nhận",
        model: "Info.To_Office_id",
        type: FormElementType.select,
        labelWidth: 140,
        options: Para.Para_Office,
        disabled: this.disBtn,
        required: true,
        watch(data) {},
      }),
      From_Department_id: new FormElement({
        // required: true,
        label: "Phòng ban chuyển",
        model: "Info.From_Department_id",
        disabled: this.isAdd ? false : true,
        type: FormElementType.select,
        required: true,
        labelWidth: 145,
        watch(data, n, o, t) {
          let slData =
            t.getEntry(data._formElements.From_Department_id.id).selectedData ||
            {};
          //   if (slData) {
          data.Info.Trasnfer_user = slData.Manager_id;
        },

        options(data) {
          // const arr = [data.Office_id];
          //   console.log(data);
          return new SelectOption({
            data: data.Info.From_Office_id ? API.dm_department_Get_List : [],
            params: {
              iOffice_id: data.Info.From_Office_id,
            },
            // multiple: true,
          });
        },
      }),
      To_Department_Id: new FormElement({
        label: "Phòng ban nhận",
        model: "Info.To_Department_Id",
        type: FormElementType.select,
        required: true,
        disabled: this.disBtn,
        labelWidth: 140,

        options(data) {
          // console.log("data.Info.To_Office_id", data.Info.To_Office_id);

          return new SelectOption({
            data: data.Info.To_Office_id ? API.dm_department_Get_List : [],
            params: {
              iOffice_id: data.Info.To_Office_id,
            },
            // multiple: true,
          });
        },
        watch(data, n, o, t) {
          let slData =
            t.getEntry(data._formElements.To_Department_Id.id).selectedData ||
            {};

          console.log(
            slData.Manager_id,
            Para.Para_Account.getName(slData.Manager_id)
          );

          data.Info.Receive_user = slData.Manager_id;
          //  ;
        },
      }),

      Description: new FormElement({
        label: "Mô tả",
        model: "Info.Description",
        disabled: this.disBtn,
        labelWidth: 145,
        type: FormElementType.text,
        attr: {
          rows: 2,
          type: "textarea",
        },
      }),

      Trasnfer_user: new FormElement({
        label: "Người giao",
        model: "Info.Trasnfer_user",
        type: FormElementType.select,
        options: Para.Para_Account,

        labelWidth: 145,
        // options: Para.Para_Account,
        disabled: true,
        // watch(data){
        //     console.log('data.Info.Trasnfer_user',data.Info.Trasnfer_user)
        // }
      }),
      Receive_user: new FormElement({
        label: "Người nhận",
        model: "Info.Receive_user",
        type: FormElementType.select,
        options: Para.Para_Account,
        labelWidth: 140,
        disabled: true,
      }),
    };
  }

  form() {
    return new FormInfo({
      formData: this,
      elements: [
        new FormElement({
          direction: FormDirectionType.horizontal,

          child: [
            new FormElement({
              direction: FormDirectionType.vertical,

              child: [
                // new FormElement({
                //   child: [
                this._formElements.From_Office_id,
                this._formElements.From_Department_id,
                //   ],
                // }),

                new FormElement({
                  child: [
                    this._formElements.Trasnfer_user.set((p) => (p.col = 18)),

                    // this._formElements.Deli_user.set((p) => (p.col = 18)),

                    this._formElements.Start_Date,
                  ],
                }),

                new FormElement({
                  child: [
                    this._formElements.UserCreate.set((p) => (p.col = 18)),

                    // this._formElements.Deli_user.set((p) => (p.col = 18)),

                    this._formElements.DateCreate,
                  ],
                }),
              ],
            }),
            new FormElement({
              direction: FormDirectionType.vertical,

              child: [
                // new FormElement({
                //   child: [
                this._formElements.To_Office_id,
                this._formElements.To_Department_Id,
                //   ],
                // }),
                // this._formElements.Receive_user,

                new FormElement({
                  child: [
                    this._formElements.Receive_user.set((p) => (p.col = 19)),

                    // this._formElements.Receive_user,

                    this._formElements.Receive_date,
                  ],
                }),
                new FormElement({
                  child: [
                    this._formElements.Approved_User.set((p) => (p.col = 19)),

                    // this._formElements.Receive_user,

                    this._formElements.Approved_Date,
                  ],
                }),
              ],
            }),
          ],
        }),

        this._formElements.Description,
        new FormElement({
          type: "transfer_detail",
          id: "transfer_detail",
          attr: {
            data: this,
          },
        }),
      ],
    });
  }

  toJSON() {
    return {
      ...this,
      _formElements: undefined,
      // Info._formElements: undefined,
      table: undefined,
      From_Department_id: undefined,
      From_Office_id: undefined,
    };
  }
}
