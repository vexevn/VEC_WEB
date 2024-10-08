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
        labelWidth: 110,
        // options: Para.Para_Account,
        disabled: true,
        col: 11,
      }),
      UserCreate: new FormElement({
        label: "Người lập phiếu",
        model: "Info.UserCreate",
        type: FormElementType.select,
        labelWidth: 130,
        disabled: true,
        options: Para.Para_Account.set((p) => (p.placeholder = "")),

        // col:11,
      }),
      Approved_Date: new FormElement({
        label: "Ngày duyệt",
        model: "Info.Approved_Date",
        type: FormElementType.datePicker,
        labelWidth: 90,
        // options: Para.Para_Account,
        required: true,
        disabled: true,

        col: 10,
      }),
      Approved_User: new FormElement({
        label: "Người duyệt",
        model: "Info.Approved_User",
        type: FormElementType.select,
        labelWidth: 125,
        options: Para.Para_Account.set((p) => (p.placeholder = "")),
        disabled: true,
        // col:11,
      }),

      Start_Date: new FormElement({
        label: "Ngày chuyển",
        model: "Info.Start_Date",
        type: FormElementType.datePicker,
        labelWidth: 100,
        required: true,
        col: 11,
        attr: {
          disabledCrDate: true,
        },
      }),

      Receive_date: new FormElement({
        label: "Ngày nhận",
        model: "Info.Receive_date",
        type: FormElementType.datePicker,
        labelWidth: 90,
        required: true,
        col: 10,
        attr: {
          disabledCrDate: true,
        },
      }),
      From_Office_id: new FormElement({
        label: "Văn phòng chuyển",
        model: "Info.From_Office_id",
        type: FormElementType.select,
        labelWidth: 130,
        required: true,
        disabled: this.isAdd ? false : true,
        options: Para.Para_Office,
        watch(data) {
          // console.log("data.Info.FromMangerId", data.Info.FromMangerId);
        },
      }),

      To_Office_id: new FormElement({
        label: "Văn phòng nhận",
        model: "Info.To_Office_id",
        type: FormElementType.select,
        // labelWidth: 120,
        options: Para.Para_Office,
        required: true,
        watch(data) {},
      }),
      From_Department_id: new FormElement({
        // required: true,
        label: "Phòng ban chuyển",
        model: "Info.From_Department_id",
        disabled: this.isAdd ? false : true,
        type: FormElementType.select,
        labelWidth: 130,
        watch(data, n, o, t) {
          let slData =
            t.getEntry(data._formElements.From_Department_id.id).selectedData ||
            {};
          //   if (slData) {
          data.Info.FromMangerId = Para.Para_Account.getName(slData.Manager_id);
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
        // required: true,

        options(data) {
          console.log("data.Info.To_Office_id", data.Info.To_Office_id);

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

          //   console.log(slData);
          data.Info.ToMangerId = Para.Para_Account.getName(slData.Manager_id);
        },
      }),

      Description: new FormElement({
        label: "Mô tả",
        model: "Info.Description",
        labelWidth: 130,
        type: FormElementType.text,
        attr: {
          rows: 2,
          type: "textarea",
        },
      }),

      FromMangerId: new FormElement({
        label: "Người giao",
        model: "Info.FromMangerId",
        type: FormElementType.text,

        labelWidth: 130,
        // options: Para.Para_Account,
        disabled: true,
        // watch(data){
        //     console.log('data.Info.FromMangerId',data.Info.FromMangerId)
        // }
      }),
      ToMangerId: new FormElement({
        label: "Người nhận",
        model: "Info.ToMangerId",
        type: FormElementType.text,
        labelWidth: 125,
        // options: Para.Para_Account,
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
                    this._formElements.FromMangerId.set((p) => (p.col = 18)),

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
                // this._formElements.ToMangerId,

                new FormElement({
                  child: [
                    this._formElements.ToMangerId.set((p) => (p.col = 19)),

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
      table: undefined,
      From_Department_id: undefined,
      From_Office_id: undefined,
    };
  }
}
