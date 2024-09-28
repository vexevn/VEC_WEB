import {
  FormDirectionType,
  FormElement,
  FormElementType,
  FormInfo,
} from "~/assets/scripts/base/FormInfo";
import { GetGlobalId } from "../../Functions";
import { Para } from "../../Para";
import { SelectOption } from "../../base/SelectOption";
import API from "../../API";

export default class fixed_assets {
  /** @type {string} - description */
  Code;
  /** @type {number} - description */
  Type_id;
  /** @type {string} - description */
  Type_Name;
  /** @type {string} - description */
  Producer_id;
  /** @type {string} - description */
  Producer_Name;
  /** @type {string} - description */
  Model;
  /** @type {string} - description */
  Serial;
  /** @type {string} - description */
  Purchase_Date;
  /** @type {number} - description */
  Order_id;
  /** @type {number} - description */
  Order_detail_id;
  /** @type {number} - description */
  Ware_house_id;
  /** @type {string} - description */
  Invoice_code;
  /** @type {string} - description */
  Invoice_Date;
  /** @type {string} - description */
  Invoice_File;
  /** @type {number} - description */
  Currency_VND;
  Unit_cost;
  /** @type {string} - description */
  Currency_Code;
  /** @type {number} - description */
  CHF;
  /** @type {number} - description */
  _Name_id;
  /** @type {string} - description */
  Project_Code;
  /** @type {string} - description */
  Initial_Holder_id;
  /** @type {string} - description */
  Initial_Holder_Name;
  /** @type {string} - description */
  Curent_Holder_Id;
  /** @type {string} - description */
  Curent_Holder_Name;
  /** @type {number} - description */
  Warranty_Period;
  /** @type {boolean} - description */
  Maintenance;
  /** @type {number} - description */
  Estimated_Life_Min;
  /** @type {number} - description */
  Estimated_Life_Max;
  /** @type {string} - description */
  Disposal_Date;
  /** @type {string} - description */
  Note;
  /** @type {string} - description */
  Images;
  /** @type {number} - description */
  Ticket_Number;
  /** @type {string} - description */
  Name;
  /** @type {number} - description */
  State;
  /** @type {number} - description */
  Status;
  /** @type {number} - description */
  Use_Type_id;
  /** @type {string} - description */
  Registration_Date;
  /** @type {string} - description */
  Engine_no;
  /** @type {string} - description */
  Chassis_no;
  /** @type {string} - description */
  Check_Date;

  /** @type {string} - description */
  Insurance_Date;
  /** @type {string} - description */
  Legal_Owner;
  /** @type {number} - description */
  Vehicle_Type_id;
  /** @type {string} - description */
  Id;
  /** @type {string} - description */
  DateUpdate;
  /** @type {string} - description */
  DateCreate;
  /** @type {string} - description */
  UserCreate;
  /** @type {string} - description */
  UserUpdate;

  /** @type {string} - description */
  QRCode;
  /** @type {string} - description */
  RF_Id;
  /** @type {string} - description */
  Office_Name;
  /** @type {number} - description */
  Office_id;
  /** @type {number} - description */
  Store_id;
  tmp_id;

  /**
   *
   * @param {fixed_assets} obj
   */
  constructor(obj) {
    this.tmp_id = GetGlobalId();
    this.update(obj);
  }
  /**
   *
   * @param {fixed_assets} obj
   */
  update(obj) {
    Object.assign(this, obj);
    this._formElements = {
      Status: new FormElement({
        label: "Tình trạng tài sản",
        model: "State",
        type: FormElementType.select,
        options() {
          return new SelectOption({
            data: API.fixed_asset_state_Get_List,
          });
        },
      }),
      QRCode: new FormElement({
        label: "QRCode",
        model: "QRCode",
        type: "QRCode",
        col: 6,
        attr: {
          data: this.QRCode,
        },

        isVisible: this.isAdd || !this.QRCode ? false : true,
        // options() {
        //   return new SelectOption({
        //     data: API.fixed_asset_state_Get_List,
        //   });
        // },
      }),
      RF_Id: new FormElement({
        label: "Mã RF",
        model: "RF_Id",
        labelWidth: 70,
        type: FormElementType.text,
        disabled: true,
        // options() {
        //   return new SelectOption({
        //     data: API.fixed_asset_state_Get_List,
        //   });
        // },
      }),
      Code: new FormElement({
        label: "Mã tài sản",
        model: "Code",
        type: FormElementType.text,
        disabled: this.isAdd ? false : true,
        labelWidth: 135,
      }),
      Type_id: new FormElement({
        label: "Loại tài sản",
        model: "Type_id",
        type: FormElementType.select,
        options: Para.fixed_asset_type_Get_List,
        labelWidth: 125,
        required: true,
      }),
      Type_Name: new FormElement({
        label: "Type_Name",
        model: "Type_Name",
        type: FormElementType.text,
      }),
      Producer_id: new FormElement({
        label: "Nhà sản xuất",
        model: "Producer_id",
        type: FormElementType.select,
        options: Para.producer_Get_List,
        labelWidth: 135,
      }),
      Producer_Name: new FormElement({
        label: "Producer_Name",
        model: "Producer_Name",
        type: FormElementType.text,
      }),
      Model: new FormElement({
        label: "Model",
        model: "Model",
        type: FormElementType.text,
      }),
      Serial: new FormElement({
        label: "Serial",
        model: "Serial",
        type: FormElementType.text,
      }),
      Purchase_Date: new FormElement({
        label: "Ngày mua",
        model: "Purchase_Date",
        type: FormElementType.date,
        required: true,
        disabled(data) {
          if (data.Ware_house_id) return true;
        },
      }),
      Order_id: new FormElement({
        label: "Order_id",
        model: "Order_id",
        type: FormElementType.text,
      }),
      Order_detail_id: new FormElement({
        label: "Order_detail_id",
        model: "Order_detail_id",
        type: FormElementType.text,
      }),
      Ware_house_id: new FormElement({
        label: "Ware_house_id",
        model: "Ware_house_id",
        type: FormElementType.text,
      }),
      Invoice_code: new FormElement({
        label: "Invoice_code",
        model: "Invoice_code",
        type: FormElementType.text,
      }),
      Invoice_Date: new FormElement({
        label: "Invoice_Date",
        model: "Invoice_Date",
        type: FormElementType.text,
      }),
      Invoice_File: new FormElement({
        label: "Invoice_File",
        model: "Invoice_File",
        type: FormElementType.text,
      }),
      Unit_cost: new FormElement({
        label: "Phí đơn vị",
        model: "Unit_cost",
        labelWidth: 120,
        type: FormElementType.number,
      }),
      Currency_VND: new FormElement({
        label: "Currency in purchase (VND)",
        model: "Currency_VND",
        type: FormElementType.number,
      }),
      Currency_Code: new FormElement({
        label: "Currency Code",
        model: "Currency_Code",
        type: FormElementType.text,
        // disabled: true,
        disabled: true,
      }),
      CHF: new FormElement({
        label: "CHF",
        model: "CHF",
        type: FormElementType.text,
      }),
      _Name_id: new FormElement({
        label: "_Name",
        model: "_Name_id",
        type: FormElementType.text,
      }),
      Project_Code: new FormElement({
        label: "Mã dự án",
        model: "Project_Code",
        type: FormElementType.text,
        labelWidth: 135,
      }),
      Initial_Holder_id: new FormElement({
        label: "Initial Holder id",
        model: "Initial_Holder_id",
        type: FormElementType.text,
      }),
      Use_Type_id: new FormElement({
        label: "Đối tượng sử dụng",
        model: "Use_Type_id",
        type: FormElementType.select,
        options: Para.TransferType,
        labelWidth: 135,
        watch(data, nv, ov, _this, isFirst) {
          if (!isFirst) {
            data.Curent_Holder_Id = undefined;
            data.Curent_Holder_Name = "";
          }
        },
      }),
      Curent_Holder_person: new FormElement({
        label: "Người giữ hiện tại",
        model: "Curent_Holder_Id",
        type: FormElementType.select,
        // disabled: true,
        options(data) {
          // console.log($t);
          let dataPara = Para.Para_Account.set((p) => {
            p.data = p.data.filter((p1) => p1.Office_id == data.Office_id);
          });
          // console.log(dataPara.data);
          return dataPara;
        },
        isVisible(data) {
          if (data.Use_Type_id == 1 || !data.Use_Type_id) return true;
          return false;
        },
        watch(data, nv, ov, t, isFirst) {
          if (!isFirst && data.Use_Type_id == 1) {
            let entry = t.getEntry(data._formElements.Curent_Holder_person.id);
            if (entry) {
              let sltd = entry.selectedData || {};
              data.Curent_Holder_Name = sltd.FullName;
              // console.log(data.Curent_Holder_Name);
            }
          }
        },
      }),
      Curent_Holder_Id: new FormElement({
        isVisible(data) {
          if (data.Use_Type_id == 2 || data.Use_Type_id == 3) return true;

          return false;
        },
        label: "Người giữ hiện tại",
        model: "Curent_Holder_Id",
        type: FormElementType.select,
        // disabled: true,
        options(data) {
          let dataPa = Para.store_Get_List.set((p) => {
            p.data = p.data.filter((p1) => {
              if (data.Use_Type_id == 2)
                if (p1.isStore == 1 && data.Office_id == p1.Office_id)
                  return true;
              if (data.Use_Type_id == 3 && data.Office_id == p1.Office_id)
                if (p1.isStore == 2) return true;

              return false;
            });
          });
          console.log(dataPa.data);

          return dataPa;
        },
        watch(data, nv, ov, t, isFirst) {
          if (!isFirst && (data.Use_Type_id == 2 || data.Use_Type_id == 3)) {
            let entry = t.getEntry(data._formElements.Curent_Holder_Id.id);
            if (entry) {
              let sltd = entry.selectedData || {};
              data.Curent_Holder_Name = sltd.Name;
              // console.log(data.Curent_Holder_Name);
            }
          }
        },
      }),

      Curent_Holder_Name: new FormElement({
        label: "Curent_Holder_Id",
        model: "Curent_Holder_Name",
        type: FormElementType.text,
      }),
      Warranty_Period: new FormElement({
        label: "Thời hạn bảo hành",
        model: "Warranty_Period",
        type: FormElementType.number,
        labelWidth: 135,
      }),
      Maintenance: new FormElement({
        label: "Bảo trì",
        model: "Maintenance",
        type: FormElementType.checkbox,
      }),
      Estimated_Life: new FormElement({
        direction: FormDirectionType.horizontal,
        child: [
          new FormElement({
            model: "Estimated_Life_Min",
            type: FormElementType.number,
          }),
          new FormElement({
            class: "Es_md",
            label: "-",
            type: FormElementType.label,
            col: 2,
          }),
          new FormElement({
            model: "Estimated_Life_Max",
            class: "esMax",
            type: FormElementType.number,
          }),
        ],
      }),
      Estimated_Life_Max: new FormElement({
        label: "Estimated Max",
        model: "Estimated_Life_Max",
        type: FormElementType.number,
      }),
      Estimated_Life_Min: new FormElement({
        label: "Estimated Min",
        model: "Estimated_Life_Min",
        type: FormElementType.number,
      }),
      Disposal_Date: new FormElement({
        label: "Disposal_Date",
        model: "Disposal_Date",
        type: FormElementType.text,
      }),
      Note: new FormElement({
        label: "Ghi chú",
        model: "Note",
        type: FormElementType.text,
        attr: {
          type: "textarea",
          rows: 4,
        },
      }),
      Images: new FormElement({
        // label: "Attach images",
        model: "Images",
        class: "fa_images",
        type: FormElementType.file,
        options: Para.FixedAssetsImage,
      }),
      Ticket_Number: new FormElement({
        label: "Ticket_Number",
        model: "Ticket_Number",
        type: FormElementType.text,
      }),
      Name: new FormElement({
        label: "Tên tài sản",
        model: "Name",
        type: FormElementType.text,
        labelWidth: 100,
        required: true,
      }),
      State: new FormElement({
        label: "Tình trạng",
        model: "State",
        type: FormElementType.text,
      }),

      Registration_Date: new FormElement({
        label: "Ngày đăng ký",
        model: "Registration_Date",
        type: FormElementType.datePicker,
      }),
      Engine_no: new FormElement({
        label: "Số động cơ",
        model: "Engine_no",
        type: FormElementType.text,
      }),
      Chassis_no: new FormElement({
        label: "Số khung gầm",
        model: "Chassis_no",
        type: FormElementType.text,
      }),
      Check_Date: new FormElement({
        label: "Ngày Kiểm tra ",
        model: "Check_Date",
        type: FormElementType.datePicker,
      }),
      Insurance_Date: new FormElement({
        label: "Ngày bảo hiểm",
        model: "Insurance_Date",
        type: FormElementType.datePicker,
      }),
      Legal_Owner: new FormElement({
        label: "Chủ sở hữu hợp pháp",
        model: "Legal_Owner",
        type: FormElementType.text,
        labelWidth: 145,
      }),
      Vehicle_Type_id: new FormElement({
        label: "Loại phương tiện",
        model: "Vehicle_Type_id",
        type: FormElementType.select,
        options: Para.Para_VehicleType,
      }),
      Local_currency: new FormElement({
        label: "Giá trị tài sản",
        model: "Local_currency",
        type: FormElementType.text,
        labelWidth: 125,
        // options: Para.Para_VehicleType
      }),
      Office_id: new FormElement({
        label: "Văn phòng",
        model: "Office_id",
        type: FormElementType.select,
        labelWidth: 90,
        options: Para.Para_Office,
        required: true,
        watch(data, nv, ov, _this, isFirst) {
          if (!isFirst) {
            data.Curent_Holder_Id = undefined;
            data.Curent_Holder_Name = "";
          }
        },
      }),

      Store_id: new FormElement({
        label: "Phòng ban",
        model: "Store_id",
        type: FormElementType.select,
        labelWidth: 90,
        options(data) {
          // const arr = [data.Office_id];
          // console.log(arr);
          return new SelectOption({
            data: data.Office_id ? API.dm_department_Get_List : [],
            params: {
              iOffice_id: data.Office_id,
            },
            // multiple: true,
          });
        },
      }),

      Physical_location: new FormElement({
        label: "Physical location",
        model: "Physical_location",
        type: FormElementType.text,
        // options: Para.Para_VehicleType
      }),
      Date_disposal: new FormElement({
        label: "Ngày thanh lý",
        model: "Date_disposal",
        type: FormElementType.date,
        disabled: true,
        // options: Para.Para_VehicleType
      }),
      // Vehicle_Type_id: new FormElement({
      //   label: "Vehicle Type",
      //   model: "Vehicle_Type_id",
      //   type: FormElementType.select,
      //   options: Para.Para_VehicleType
      // }),
      Id: new FormElement({
        label: "Id",
        model: "Id",
        type: FormElementType.text,
      }),
      DateUpdate: new FormElement({
        label: "DateUpdate",
        model: "DateUpdate",
        type: FormElementType.text,
      }),
      DateCreate: new FormElement({
        label: "DateCreate",
        model: "DateCreate",
        type: FormElementType.text,
      }),
      UserCreate: new FormElement({
        label: "UserCreate",
        model: "UserCreate",
        type: FormElementType.text,
      }),
      UserUpdate: new FormElement({
        label: "UserUpdate",
        model: "UserUpdate",

        type: FormElementType.text,
      }),
      QRCode_Content: new FormElement({
        label: "Nội dung mã QR",
        model: "QRCode",
        isVisible: this.isAdd || !this.QRCode ? true : false,

        type: FormElementType.text,
        attr: {
          type: "textarea",
          rows: 4,
        },
        col: 8,
      }),
    };
  }

  form() {
    return new FormInfo({
      formData: this,
      elements: [
        new FormElement({
          child: [
            new FormElement({
              col: 24,
              direction: FormDirectionType.vertical,
              child: [
                new FormElement({
                  label: "More Thông tin tài sản",
                  type: FormElementType.label,
                }),
                new FormElement({
                  child: [
                    this._formElements.Serial.set((p) => (p.col = 6)),

                    this._formElements.Currency_Code.set((p) => (p.col = 5)),
                    // this._formElements.Unit_cost.set((p) => (p.col = 5)).set(
                    //   (p) => (p.labelWidth = 105)
                    // ),
                    this._formElements.Currency_VND.set((p) => (p.col = 8)).set(
                      (p) => (p.labelWidth = 180)
                    ),
                  ],
                }),
                new FormElement({
                  child: [
                    this._formElements.Warranty_Period.set((p) => (p.col = 7)),
                    this._formElements.Maintenance.set((p) => (p.col = 5)),
                    this._formElements.Estimated_Life_Min.set(
                      (p) => (p.col = 8)
                    ).set((p) => (p.labelWidth = 180)),
                    this._formElements.Estimated_Life_Max.set(
                      (p) => (p.col = 8)
                    ).set((p) => (p.labelWidth = 180)),
                  ],
                }),
                new FormElement({
                  label: "Vehicle Info",
                  type: FormElementType.label,
                  /**
                   *
                   * @param {fixed_assets} data
                   */
                  isVisible(data) {
                    if (data.Type_id == 4) {
                      return true;
                    }
                  },
                }),
                new FormElement({
                  child: [
                    this._formElements.Vehicle_Type_id.set((p) => (p.col = 6)),
                    this._formElements.Registration_Date.set(
                      (p) => (p.col = 6)
                    ),
                    this._formElements.Engine_no.set((p) => (p.col = 6)),
                    this._formElements.Chassis_no.set((p) => (p.col = 6)),
                  ],
                  /**
                   *
                   * @param {fixed_assets} data
                   */
                  isVisible(data) {
                    if (data.Type_id == 4) {
                      return true;
                    }
                  },
                }),
                new FormElement({
                  child: [
                    this._formElements.Check_Date.set((p) => (p.col = 6)),
                    this._formElements.Insurance_Date.set((p) => (p.col = 6)),
                    this._formElements.Legal_Owner.set((p) => (p.col = 6)),
                  ],
                  /**
                   *
                   * @param {fixed_assets} data
                   */
                  isVisible(data) {
                    if (data.Type_id == 4) {
                      return true;
                    }
                  },
                }),

                this._formElements.Note,
                this._formElements.Images,
              ],
            }),
          ],
        }),
      ],
    });
  }

  form2() {
    return new FormInfo({
      formData: this,
      // labelWidth: 110
      elements: [
        new FormElement({
          child: [
            new FormElement({
              col: 24,
              direction: FormDirectionType.vertical,
              child: [
                new FormElement({
                  label: "Thông tin tài sản cố định",
                  type: FormElementType.label,
                }),

                new FormElement({
                  child: [
                    this._formElements.Code.set((p) => (p.col = 6)),
                    this._formElements.Name.set((p) => (p.col = 6)),
                    this._formElements.Office_id.set((p) => (p.col = 6)),
                    this._formElements.Store_id.set((p) => (p.col = 6)),
                  ],
                }),

                new FormElement({
                  child: [
                    // this._formElements.Initial_Holder_id,
                    this._formElements.Use_Type_id.set((p) => (p.col = 6)),
                    this._formElements.Curent_Holder_Id.set((p) => (p.col = 8)),
                    this._formElements.Curent_Holder_person.set(
                      (p) => (p.col = 8)
                    ),
                    this._formElements.Status.set((p) => (p.col = 6)),
                    new FormElement({
                      col: 4,
                      class: "Estimated",
                      child: [
                        new FormElement({
                          direction: FormDirectionType.horizontal,
                          child: [
                            new FormElement({
                              label: "Khấu hao",
                              class: "Es_label",
                              type: "label",
                              // labelWidth: 125,
                              col: 12,
                            }),
                            this._formElements.Estimated_Life,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),

                new FormElement({
                  child: [
                    this._formElements.Project_Code.set((p) => (p.col = 6)),
                    this._formElements.Type_id.set((p) => (p.col = 8)),
                    // this._formElements.Unit_cost.set((p) => (p.col = 4)).set(
                    //   (p) => (p.labelWidth = 80)
                    // ),
                    // this._formElements.Currency_Code.set((p) => {
                    //   (p.col = 1), (p.label = "");
                    // }).set((p) => (p.disabled = true)),
                    this._formElements.Local_currency.set((p) => (p.col = 6)),
                    this._formElements.Maintenance.set((p) => (p.col = 4)),
                  ],
                }),
                new FormElement({
                  child: [
                    this._formElements.Producer_id.set((p) => (p.col = 6)),
                    this._formElements.Model.set((p) => (p.col = 8)),
                    this._formElements.Serial.set((p) => (p.col = 6)).set(
                      (p) => (p.labelWidth = 80)
                    ),
                    ,
                    this._formElements.RF_Id.set((p) => (p.col = 4)),
                  ],
                }),
                new FormElement({
                  child: [
                    this._formElements.Warranty_Period.set((p) => (p.col = 6)),
                    this._formElements.Purchase_Date.set((p) => (p.col = 5)),
                    this._formElements.Date_disposal.set((p) => (p.col = 6)),
                    // this._formElements.QRCode.set((p) => (p.col = 6)),
                  ],
                }),
                // new FormElement({
                //  col: 10,
                //   class:"Estimated",
                //   child: [
                //     new FormElement({
                //       direction: FormDirectionType.horizontal,
                //       child:[

                //         new FormElement({
                //           label: 'Estimated',
                //           class:"Es_label",
                //           type: 'label',
                //           // labelWidth: 125,
                //           col: 9,
                //         }),
                //         this._formElements.Estimated_Life,
                //       ]
                //     }),

                //   ]
                // }),
                new FormElement({
                  label: "Thông tin phương tiện",
                  type: FormElementType.label,
                  /**
                   *
                   * @param {fixed_assets} data
                   */
                  isVisible(data) {
                    if (data.Type_id == 4) {
                      return true;
                    }
                  },
                }),
                new FormElement({
                  direction: FormDirectionType.horizontal,
                  child: [
                    // this._formElements.Physical_location.set(p => p.col =13),
                  ],
                }),
                new FormElement({
                  child: [
                    this._formElements.Vehicle_Type_id.set((p) => (p.col = 6)),
                    this._formElements.Registration_Date.set(
                      (p) => (p.col = 6)
                    ),
                    this._formElements.Engine_no.set((p) => (p.col = 6)),
                    this._formElements.Chassis_no.set((p) => (p.col = 6)),
                  ],
                  /**
                   *
                   * @param {fixed_assets} data
                   */
                  isVisible(data) {
                    if (data.Type_id == 4) {
                      return true;
                    }
                  },
                }),
                new FormElement({
                  child: [
                    this._formElements.Check_Date.set((p) => (p.col = 6)),
                    this._formElements.Insurance_Date.set((p) => (p.col = 6)),
                    this._formElements.Legal_Owner.set((p) => (p.col = 6)),
                  ],
                  /**
                   *
                   * @param {fixed_assets} data
                   */
                  isVisible(data) {
                    if (data.Type_id == 4) {
                      return true;
                    }
                  },
                }),
                new FormElement({
                  child: [
                    this._formElements.Note,
                    this._formElements.QRCode_Content,
                    this._formElements.QRCode,
                  ],
                }),
                this._formElements.Images,
              ],
            }),
          ],
        }),
      ],
    });
  }

  formView() {
    return new FormInfo({
      formData: this,
      elements: [
        this._formElements.Code.set((p) => (p.disabled = true)),
        this._formElements.Serial.set((p) => (p.disabled = true)),
        this._formElements.Producer_id.set((p) => (p.disabled = true)),
        this._formElements.Model.set((p) => (p.disabled = true)),
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
