// @ts-nocheck

import InputFileModel, { InputFileAccept, InputFileType } from "~/components/form-content/InputFile/InputFIleModel";
import API from "./API";
import { SelectOption } from "./base/SelectOption";
import Group from "~/pages/Setting/group.vue";

export var Para = {
  EmailConfigType: new SelectOption({
    data: [
      { Id: 1, Name: "Create User" },
      { Id: 2, Name: "PR Submitted" },
      { Id: 3, Name: "PR Withdraw" },
      { Id: 4, Name: "PR Approving" },
      { Id: 5, Name: "PR Approved" },
      { Id: 6, Name: "PR Rejected" },
      { Id: 7, Name: "PR Purchasing" },
      { Id: 8, Name: "PR Purchasing Authority" },
      { Id: 9, Name: "PR Techinical" },
      { Id: 10, Name: "PR Purchased" },
      { Id: 11, Name: "PR Void" },
      { Id: 12, Name: "PR Amendment" },
    ]
  }),
  Para_Purchase_State: new SelectOption({
    data: [
      { Id: 1, Name: "Draft" },
      { Id: 2, Name: "Submitted" },
      { Id: 3, Name: "Rejected" },
      { Id: 4, Name: "Endorsed" },
      { Id: 5, Name: "Amendment" },
      { Id: 6, Name: "Approved" },
      // { Id: 7, Name: "Request void" },
      // { Id: 8, Name: "Pending void" },
      { Id: 9, Name: "Voided" },
      { Id: 10, Name: "Adjustment " },
      { Id: 11, Name: "Purchased " },
    ]
  }),



  OrderProcess: new SelectOption({
    data: API.Purchase_SearchOrderProcess,
    remote: true
  }),
  InventoryType: new SelectOption({
    data: [
      { Id: 1, Name: "Online" },
      { Id: 2, Name: "Offline" },
    ]
  }),
  InventoryState: new SelectOption({
    data: [
      { Id: 1, Name: "Request" },
      { Id: 2, Name: "Submitted" },
      { Id: 3, Name: "Approved" },
    ]
  }),
  Para_ProjectCode_Type: new SelectOption({
    data: [
      { Id: 1, Name: "Award" },
      { Id: 2, Name: "Task" },
    ]
  }),
  TicketsState: new SelectOption({
    data: [
      { Id: 1, Name: "New Ticket" },
      { Id: 2, Name: "Duyệt" },
      { Id: 3, Name: "Processing" },
      { Id: 4, Name: "Kết thúc" },
      { Id: 5, Name: "Hủy" },
      { Id: 6, Name: "Từ chối" },
      { Id: 7, Name: "Thành công" },
    ]
  }),
  TransferType: new SelectOption({
    data: [
      { Id: 1, Name: "Người" },
      { Id: 2, Name: "Kho" },
      { Id: 3, Name: "Phòng làm việc" },
      { Id: 4, Name: "Đối tác" },
    ]
  }),
  TransferState: new SelectOption({
    data: [
      // { Id: 0, Name: "Không xác định" },
      { Id: 1, Name: "Chờ duyệt" },
      { Id: 2, Name: "Đã duyệt" },
      { Id: 3, Name: "Không duyệt" },
      { Id: 4, Name: "Từ chối" },
      { Id: 5, Name: "Thành công" },
    ]
  }),

  TransferRecivedState: new SelectOption({
    data: [
      // { Id: 0, Name: "Không xác định" },
      
      { Id: 2, Name: "Phiếu chờ nhận" },

      { Id: 4, Name: "Phiếu từ chối nhận" },
      { Id: 5, Name: "Phiếu đã nhận" },
    ]
  }),
  StoreType: new SelectOption({
    data: [
      { Id: 1, Name: "Store" },
      { Id: 2, Name: "Department" },
      { Id: 3, Name: "Partner" },
    ]
  }),
  OfficeType: new SelectOption({
    data: [
      { Id: 1, Name: "Trong nước" },
      { Id: 2, Name: "Quốc tế" },
    ]
  }),
  Para_Active: new SelectOption({
    data: [
      { Id: 1, Name: "Hoạt động" },
      { Id: 2, Name: "Không hoạt động" },
    ]
  }),
  Para_Use: new SelectOption({
    data: [
      { Id: 1, Name: "Hoạt động" },
      { Id: 2, Name: "Không hoạt động" },
      { Id: 3, Name: "Deactivate" },
    ]
  }),
  SignImage: new InputFileModel({
    accept: InputFileAccept.image,
    baseUrl: '/images/signature/',
    limit: 1,
    type: InputFileType.avatar
  }),
  MenuImage: new InputFileModel({
    accept: InputFileAccept.image,
    baseUrl: '/images/menu/',
    limit: 1,
    // type: InputFileType.avatar
  }),
  Inventory_Attachment: new InputFileModel({
    baseUrl: '/Images/Inventory/Attachment/',
    accept: InputFileAccept.image,
  }),
  Disposal_Attachment: new InputFileModel({
    baseUrl: '/Images/Disposal/Attachment/'
  }),
  PR_Attachment: new InputFileModel({
    baseUrl: '/Images/Purchase/Attachment/',
  }),
  Comment_Attachment: new InputFileModel({
    baseUrl: '/Images/Comment/Attachment/',
  }),

  PR_Procurment_Attachment: new InputFileModel({
    baseUrl: '/Images/Purchase/Procurment_Attachment/',
  }),

  FixedAssetsImage: new InputFileModel({
    baseUrl: '/Images/FixedAssets/Attachment/',
    autoUpload: true,
    accept: "image/*,video/*,audio/*",
    label: 'Gắn ảnh'
  }),

  PR_Procurment_Contract_Attachment: new InputFileModel({
    baseUrl: '/Images/Purchase/Contract_Attachment/',
    limit: 1,
    multiple: false
  }),
  GroupPermission: new SelectOption({
    data: []
  }),
  Para_Office: new SelectOption({
    data: [],
    IsItemDisabled: item => {
      if (item.Use == 2)
        return true;
    },
  }),
  Para_Category: new SelectOption({
    data: []
  }),
  Para_VehicleType: new SelectOption({
    data: []
  }),
  Para_Currency: new SelectOption({
    data: [],
    label: "Currency_Code",
    value: "Currency_Code",
  }),
  Para_Currency_now: new SelectOption({
    data: API.Get_Currency,
    label: "Currency_Code",
    value: "Currency_Code",
  }),
  Para_Practice: new SelectOption({
    data: [],
  }),
  Para_Project_Code: new SelectOption({
    placeholder: 'Chọn một',
    data: [],
    dataExt: [
      { Id: 'Waiting Code', Name: 'Waiting Code' }
    ]
  }),
  PF_Special_id: new SelectOption({
    data: [
      { Id: 1, Name: 'Less than 3 CVs/Quotation' },
      { Id: 2, Name: 'Repeated Order' },
      { Id: 3, Name: 'Others' },
    ],
    placeholder: 'Chưa được chọn',
  }),
  PF_VendorState: new SelectOption({
    data: [
      { Id: 1, Name: 'Approved' },
      { Id: 2, Name: 'Others' },
    ],
  }),
  YesNo: new SelectOption({
    data: [
      { Id: 1, Name: 'Có' },
      { Id: 2, Name: 'Không' },
    ],
  }),
  ContractStatus: new SelectOption({
    data: [
      { Id: 1, Name: 'Completed' },
      { Id: 2, Name: 'On going' },
    ],
  }),
  FixedAssetsState: new SelectOption({
    data: [
      { Id: 1, Name: 'Normal' },
      { Id: 2, Name: 'Transferring' },
      { Id: 3, Name: 'Pending Ticket' },
    ],
  }),

  Para_Project_Award_Code: new SelectOption({
    data: API.Project_Info_Get_ValueCode,
    placeholder: 'Chọn một',
    dataExt: [
      { Id: 'Waiting Code', Name: 'Waiting Code' }
    ],
    params: {
      Type_id: 1
    }
  }),
  Para_Project_Task_Code: new SelectOption({
    data: API.Project_Info_Get_ValueCode,
    placeholder: 'Chọn một',
    dataExt: [
      { Id: 'Waiting Code', Name: 'Waiting Code' }
    ],
    params: {
      Type_id: 2
    }
  }),
  Get_Procurement_Methods: new SelectOption({
    data: [],//API.Get_Procurement_Methods,
    // value: 'Info.Id',
    // label: 'Info.Name',
    placeholder: 'Chưa được chọn'
  }),
  fixed_asset_type_Get_List: new SelectOption({
    data: [],//API.Get_Procurement_Methods,
    // value: 'Info.Id',
    // label: 'Info.Name',
    // labelFormat:(item) => item.Code + " " + item.Name,

    placeholder: 'Chưa được chọn'
  }),
  fixed_asset_group_Get_List: new SelectOption({
    data: [],//API.Get_Procurement_Methods,
    // value: 'Info.Id',
    // label: 'Info.Name',
    // labelFormat:(item) => item.Code + " " + item.Name,

    placeholder: 'Chưa được chọn'
  }),
  fixed_asset_state_Get_List: new SelectOption({
    data: [],//API.Get_Procurement_Methods,
    // value: 'Info.Id',
    // label: 'Info.Name',
    placeholder: 'Chưa được chọn'
  }),
  producer_Get_List: new SelectOption({
    data: [],//API.Get_Procurement_Methods,
    // value: 'Info.Id',
    // label: 'Info.Name',
    placeholder: 'Chưa được chọn'
  }),
  store_Get_List: new SelectOption({
    data: [],//API.Get_Procurement_Methods,
    // value: 'Info.Id',
    // label: 'Info.Name',
    placeholder: 'Chưa được chọn'
  }),
  Get_Type_of_Competition: new SelectOption({
    data: API.Get_Type_of_Competition,
    placeholder: 'Chưa được chọn',
  }),
  Para_Account: new SelectOption({
    data: [],
    placeholder: 'Chưa được chọn',
    label: 'FullName'
  }),
  Para_Account_purchasing: new SelectOption({
    data: [],
    placeholder: 'Chưa được chọn',
    label: 'FullName'
  }),
Para_lang: new SelectOption({
  data: [
    {Id:1,Name:'Tiếng Việt'},
    {Id:2,Name:'English'},
  ]
})

};
