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
        watch(data){
        }

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
          console.log('data.Info.To_Office_id',data.Info.To_Office_id)

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
        label: "Người quản lý",
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
        label: "Người quản lý",
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

                this._formElements.FromMangerId,
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
                this._formElements.ToMangerId,
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
      From_Office_id: undefined

    };
  }
}
