import {
  FormDirectionType,
  FormElement,
  FormElementType,
  FormInfo,
} from "~/assets/scripts/base/FormInfo";
import { Para } from "../Para";
import { GetStartMonth, GetTimeNow } from "../Functions";
import { SelectOption } from "../base/SelectOption";
import API from "../API";

export default class Fixed_Asset_Inventory_Filter {
  /** @type {string} - description */
  From = GetStartMonth();
  /** @type {string} - description */
  To = GetTimeNow();
  /** @type {string} - description */
  State;
  /** @type {string} - description */
  iFixed_assset_id;

  Office_id = 0;

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
      From: new FormElement({
        label: "From Date",
        model: "From",
        type: FormElementType.datePicker,
        attr: {
          disabledCrDate: true,
        },
      }),
      To: new FormElement({
        label: "To Date",
        model: "To",
        type: FormElementType.datePicker,
        attr: {
          disabledCrDate: true,
        },
      }),
      State: new FormElement({
        label: "Tình trạng",
        model: "State",
        type: FormElementType.select,
        options: Para.InventoryState.set((p) => (p.placeholder = "All")),
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

  form() {
    return new FormInfo({
      formData: this,
      elements: [
        new FormElement({
          direction: FormDirectionType.horizontal,
          child: [
            this._formElements.From,
            this._formElements.To,
            this._formElements.State,
          ],
        }),
      ],
    });
  }
  form3() {
    return new FormInfo({
      formData: this,
      elements: [this._formElements.Office_id],
    });
  }


  form2() {
    return new FormInfo({
      formData: this,
      elements: [this._formElements.Office_id,
        new FormElement({
          label: "Từ ngày",
          model: "From",
          type: FormElementType.datePicker,
         
        }),
        new FormElement({
          label: "Đến ngày",
          model: "To",
          type: FormElementType.datePicker,
         
        }),
      ],
    });
  }

  formInventRequest() {
    return new FormInfo({
      formData: this,
      labelWidth: 90,
      elements: [
        this._formElements.Office_id,
        this._formElements.From,
        this._formElements.To,
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
