
import { FormElement, FormElementType, FormInfo } from "~/assets/scripts/base/FormInfo";
import { GetTimeNow } from "../../Functions";
import InputFileModel, { InputFileType } from "~/components/form-content/InputFile/InputFIleModel";
import { Para } from "../../Para";


export default class Disposal {
  /** @type {string} - description */
  Serial;
  /** @type {string} - description */
  DateActive = GetTimeNow();
  /** @type {string} - description */
  FileAttach;
  /** @type {string} - description */
  TotalMoney;
  /** @type {string} - description */
  Id;




  /**
   *
   * @param {Disposal} obj
   */
  constructor(obj) {
    this.update(obj);
  }
  /**
   *
   * @param {Disposal} obj
   */
  update(obj) {
    Object.assign(this, obj);
    this._formElements = {
      Serial: new FormElement({
        label: "Serial",
        model: "Serial",
        type: FormElementType.text,
      }),
      DateActive: new FormElement({
        label: "Ngày kích hoạt",
        model: "DateActive",
        type: FormElementType.datePicker,
        labelWidth: 110,
      }),
      FileAttach: new FormElement({
        // label: "FileAttach",
        model: "FileAttach",
        type: FormElementType.file,
        options: Para.Disposal_Attachment
      }),
      TotalMoney: new FormElement({
        label: "Tổng tiền",
        model: "TotalMoney",
        type: FormElementType.number,
      }),
      Id: new FormElement({
        label: "Id",
        model: "Id",
        type: FormElementType.text,
      }),

    };
  }

  form() {
    return new FormInfo({
      formData: this,
      labelWidth: 100,
      elements: [
        new FormElement({

          child: [
            this._formElements.Serial.set(p => p.col = 6),
            this._formElements.DateActive.set(p => p.col = 6),
            this._formElements.TotalMoney.set(p => p.col = 6),

          ]
        }),
        this._formElements.FileAttach,

      ]
    });
  }
  toJSON() {
    return {
      ...this,
      _formElements: undefined
    }
  }

}
