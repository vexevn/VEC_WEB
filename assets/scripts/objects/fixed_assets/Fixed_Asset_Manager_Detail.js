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

export default class Fixed_Asset_Manager_Detail {
  /** @type {number} - description */
  Fixed_State;
  /** @type {number} - description */
  Fixed_Asset_id;
  /** @type {string} - description */
  Description = "";

  /** @type {string} - description */
  Fixed_Asset_Manager_Id;

  form() {
    return new FormInfo({
      formData: this,
      labelWidth: 100,
      elements: [
        this._formElements.Fixed_Asset_id,
        this._formElements.Fixed_State,
        this._formElements.Description,
      ],
    });
    // return new FormElement({
    //   direction: FormDirectionType.vertical,
    //   child: [

    // });
  }

  /**
   *
   * @param {Fixed_Asset_Manager_Detail} obj
   */
  constructor(obj) {
    this.update(obj);
    this._formElements = {
      Fixed_State: new FormElement({
        label: "Trạng thái",
        model: "Fixed_State",
        options: Para.fixed_asset_state_Get_List,
        type: "select",
      }),
      Fixed_Asset_id: new FormElement({
        label: "Tài sản",
        model: "Fixed_Asset_id",
        type: "select",
        disabled(data){
          if(data.Id) return true;
          else false
        },
        options(data) {
          return new SelectOption({
            data: API.fixed_asset_Get_List,
            params: {
              Office_id: data.From_Office_id,
              Store_id: data.From_Department_id,
            },
            IsItemDisabled: item=>{
              if(data.table.some(p=> item.Id == p.Fixed_Asset_id))
                return true
              else return false;
            }
          });
        },
      }),
      Description: new FormElement({
        label: "Mô tả",
        model: "Description",
        attr: {
          type: "textarea",
        },
        type: "text",
      }),
    };
  }
  /**
   *
   * @param {Fixed_Asset_Manager_Detail} obj
   */
  update(obj) {
    Object.assign(this, obj);
  }

  toJSON() {
    return {
      ...this,
      _formElements: undefined,
    };
  }
}
