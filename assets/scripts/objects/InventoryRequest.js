import {
  FormDirectionType,
  FormElement,
  FormElementType,
  FormInfo,
} from "~/assets/scripts/base/FormInfo";
import { Para } from "../Para";
import { GetStartMonth, GetTimeNow,IsAfterDate } from "../Functions";
import { SelectOption } from "../base/SelectOption";
import API from "../API";

export default class InventoryRequest {
  /** @type {string} - description */
  From = GetStartMonth();
  /** @type {string} - description */
  To = GetTimeNow();
  /** @type {string} - description */
  State;
  /** @type {string} - description */
  Description;

  Store;
  Offices;

  /** @type {boolean} - description */
  Active = false;
  /** @type {string} - description */
  FromDate;
  /** @type {string} - description */
  ToDate;

  /**
   *
   * @param {InventoryRequest} obj
   */
  constructor(obj) {
    this.update(obj);
  }
  /**
   *
   * @param {InventoryRequest} obj
   */
  update(obj) {
    Object.assign(this, obj);
    this._formElements = {

      From: new FormElement({
        label: "Từ Ngày",
        model: "FromDate",
        type: FormElementType.datePicker,
        attr:{
          disabledCrDate: true,
        }
      }),
      To: new FormElement({
        label: "Đến ngày",
        model: "ToDate",
        type: FormElementType.datePicker, attr:{
          disabledCrDate: true,
        },
        validate(data){
          if(data.ToDate){
            if(!IsAfterDate(data.ToDate, data.FromDate)){
              return 'Thời gian không hợp lệ'
            }
          }
          
        }
      }),
      Active: new FormElement({
        label: "Kích hoạt",
        model: "Active",
        type: FormElementType.checkbox,
        // options: Para.InventoryState.set((p) => (p.placeholder = "All")),
        col: 8,
        labelWidth: 80,
      }),
      Description: new FormElement({
        label: "Mô tả",
        model: "Description",
        type: FormElementType.text,
        attr: {
          type: 'textarea',
          rows: 2
        }
      }),
      Store: new FormElement({
        label: "Store",
        model: "Store",
        type: FormElementType.select,
        options(data) {
          console.log(data.Offices)
          return new SelectOption({
            data: data.Offices && data.Offices.length ? API.dm_GetbyManyOffice : [],
            params: {
              iOffices: data.Offices || [],
            },
            multiple: true,
          })
        }
      }),
      Offices: new FormElement({
        label: "Offices",
        model: "Offices",
        type: FormElementType.select,
        options: Para.Para_Office.set(p => p.multiple = true),
        // watch(data){
        //   console.log(data.Offices)
        // }
      }),
    };
  }

  form() {
    return new FormInfo({
      formData: this,
      labelWidth: 90,
      elements: [
   
        // this._formElements.Offices,
        // this._formElements.Store,
        this._formElements.Description,
        new FormElement({
          
          direction: FormDirectionType.vertical,
          child: [
            this._formElements.From,
            this._formElements.To,
            this._formElements.Active,
          ],
        }),
        new FormElement({
          id: 'Offices_IVT_RQ',
          type: 'Offices_IVT_RQ',
          attr:{
            data: this,
          }
        }),
   
      ],
    });
  }

  toJSON() {
    return {
      ...this,
      _formElements: undefined,
      Office_Info: undefined,
      Store_Info: undefined,
    };
  }
}
