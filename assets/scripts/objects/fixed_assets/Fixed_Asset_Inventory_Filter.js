import {
  FormDirectionType,
  FormElement,
  FormElementType,
  FormInfo,
} from "~/assets/scripts/base/FormInfo";
import { Para } from "~/assets/scripts/Para";
import { GetStartMonth, GetTimeNow } from '~/assets/scripts/Functions'

import { SelectOption } from "~/assets/scripts/base/SelectOption";
import API from "~/assets/scripts/API";

export default class Fixed_Asset_Inventory_Filter {
 

  Office_id = 0;

  FromDate = GetStartMonth();
  ToDate = GetTimeNow();
  /**
   *
   * @param {Fixed_Asset_Inventory_Filter} obj
   */
  constructor(obj) {
    this.update(obj);
  }
  /**
   *
   * @param {Fixed_Asset_Inventory_Filter} obj
   */
  update(obj) {
    Object.assign(this, obj);
    this._formElements = {
     
      FromDate: new FormElement({
        label: "Từ ngày",
        model: "FromDate",
        type: FormElementType.datePicker,
       
        labelWidth: 90,
      }),
     
      ToDate: new FormElement({
        label: "Đến ngày",
        model: "ToDate",
        type: FormElementType.datePicker,
       
        labelWidth: 90,
      }),
    
      Office_id: new FormElement({
        label: "Văn phòng",
        model: "Office_id",
        type: FormElementType.select,
        options: Para.Para_Office,
        labelWidth: 90,
      }),
    };
  }

 

  form4() {
   
    return new FormInfo({
      formData: this,
      elements: [this._formElements.Office_id,
        this._formElements.FromDate,
            this._formElements.ToDate,
      ],
    });
  }


  toJSON() {
    return {
      ...this,
      _formElements: undefined,
    };
  }
}
