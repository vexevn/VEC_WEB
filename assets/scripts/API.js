export var linkAPI = "http://10.2.18.18:8114/";
// linkAPI = "http://10.2.18.18:8114/";
linkAPI =
  typeof location != "undefined"
    ? location.protocol + "//" + location.hostname + ":8114/"
    : linkAPI;
if (typeof location != "undefined") {
  if (
    location.host == "tsvp.tctvec.vn" ||
    location.host == "www.tsvp.tctvec.vn"
  )
    linkAPI = location.protocol + "//" + "tsvp.tctvec.vn/asset_api/";
  else linkAPI = location.protocol + "//" + location.hostname + ":8114/";
}

// linkAPI = "https://tsvp.tctvec.vn/asset_api/";
linkAPI = "http://demo.quanlynoibo.com:8114/";
// linkAPI = "http://localhost:63008/";
export var linkPurchase = "http://purchase.quanlynoibo.com:8060";
export default {
  Account_MobileLogin: linkAPI + "Account/MobileLogin",
  Account_ResetPassword: linkAPI + "Account/ResetPassword",
  Account_ChangePassword: linkAPI + "Account/ChangePassword",
  Login: linkAPI + "Account/Login",
  Logout: linkAPI + "Account/Logout",

  GetUserInfo: linkAPI + "Account/GetUserInfo",
  UpdateProfile: linkAPI + "Account/UpdateProfile",
  Account: linkAPI + "Account",
  Get_User_QLTS: linkAPI + "Account/Get_User_QLTS",


  GroupPermission: linkAPI + "GroupPermission",
  Menu: linkAPI + "Menu",
  MenuButton: linkAPI + "MenuButton",

  //Office
  Get_List_Office: linkAPI + "Office/Get_List",
  Add_Office: linkAPI + "Office/Add",
  Edit_Office: linkAPI + "Office/Edit",
  Delete_Office: linkAPI + "Office/Delete",

  //Category
  Get_List_Category: linkAPI + "Category/Get_List",
  Add_Category: linkAPI + "Category/Add",
  Edit_Category: linkAPI + "Category/Edit",
  Delete_Category: linkAPI + "Category/Delete",
  GetKeyword: linkAPI + "Category/GetKeyword",

  //Procurement_Methods
  Get_Procurement_Methods: linkAPI + "Procurement_Methods/Get_List",
  Add_Procurement_Methods: linkAPI + "Procurement_Methods/Add",
  Edit_Procurement_Methods: linkAPI + "Procurement_Methods/Edit",
  Delete_Procurement_Methods: linkAPI + "Procurement_Methods/Delete",

  //Currency
  Get_Currency: linkAPI + "Currency/Get_List",
  Get_CurrentByDate: linkAPI + "Currency/Get_CurrentByDate",
  Add_Currency: linkAPI + "Currency/Add",
  Edit_Currency: linkAPI + "Currency/Edit",
  Delete_Currency: linkAPI + "Currency/Delete",
  Get_History: linkAPI + "Currency/Get_History",

  //Type_of_Competition
  Get_Type_of_Competition: linkAPI + "Type_of_Competition/Get_List",
  Add_Type_of_Competition: linkAPI + "Type_of_Competition/Add",
  Edit_Type_of_Competition: linkAPI + "Type_of_Competition/Edit",
  Delete_Type_of_Competition: linkAPI + "Type_of_Competition/Delete",

  //Project_Info
  Get_Project_Info: linkAPI + "Project_Info/Get_List",
  Add_Project_Info: linkAPI + "Project_Info/Add",
  Edit_Project_Info: linkAPI + "Project_Info/Edit",
  Delete_Project_Info: linkAPI + "Project_Info/Delete",
  Project_Info_Get_Para: linkAPI + "Project_Info/Get_Para",
  Project_Info_Get_ValueCode: linkAPI + "Project_Info/Get_ValueCode",
  Save_Project_Info: linkAPI + "Project_Info/Save",
  Get_Info_Project_Info: linkAPI + "Project_Info/Get_Info",
  Project_Info_ReSync: linkAPI + "Project_Info/ReSync",
  Project_Info_CheckReSync: linkAPI + "Project_Info/CheckReSync",
  Project_Info_ChangeState: linkAPI + "Project_Info/ChangeState",

  //Practice
  Get_Practice: linkAPI + "Practice/Get_List",
  Add_Practice: linkAPI + "Practice/Add",
  Edit_Practice: linkAPI + "Practice/Edit",
  Delete_Practice: linkAPI + "Practice/Delete",

  //Purchase
  Purchase_ExportPurchase: linkAPI + "Purchase/ExportPurchase",
  Add_Purchase: linkAPI + "Purchase/Add",
  Edit_Purchase: linkAPI + "Purchase/Edit",
  Delete_Purchase: linkAPI + "Purchase/Delete",

  Purchase_Search_Name: linkAPI + "Purchase/Search_Name",
  Purchase_Get_Office: linkAPI + "Purchase/Get_Office",
  Purchase_Get_Approval: linkAPI + "Purchase/Get_Approval",
  Purchase_Get_Info: linkAPI + "Purchase/Get_Info",
  Purchase_Submitted: linkAPI + "Purchase/Purchase_Submitted",
  Purchase_Approved: linkAPI + "Purchase/Purchase_Approved",
  Purchase_Adjustment: linkAPI + "Purchase/Purchase_Adjustment",
  Purchase_Amendment: linkAPI + "Purchase/Purchase_Amendment",
  Purchase_RequestVoid: linkAPI + "Purchase/Purchase_RequestVoid",
  Purchase_Voided: linkAPI + "Purchase/Purchase_Voided",
  Purchase_SelfVoided: linkAPI + "Purchase/Purchase_SelfVoided",
  Purchase_SendBack: linkAPI + "Purchase/Purchase_SendBack",
  Purchase_UnVoided: linkAPI + "Purchase/Purchase_UnVoided",
  GetProcurementInfo: linkAPI + "Purchase/GetProcurementInfo",
  Get_Compare_Info: linkAPI + "Purchase/Get_Compare_Info",
  Get_List_Purchase: linkAPI + "Purchase/Get_List",
  Purchase_CancelAmendment: linkAPI + "Purchase/Purchase_CancelAmendment",
  Purchase_SearchOrderProcess: linkAPI + "Purchase/SearchOrderProcess",
  Purchase_SearchPR: linkAPI + "Purchase/SearchPR",
  Purchase_Get_List_Approval: linkAPI + "Purchase/Get_List_Approval",
  Purchase_SendReminder: linkAPI + "Purchase/SendReminder",
  Purchase_SavePurchasingManager: linkAPI + "Purchase/SavePurchasingManager",
  Purchase_SaveTechinicalConsulting:
    linkAPI + "Purchase/SaveTechinicalConsulting",
  Purchase_TranferToProcurement: linkAPI + "Purchase/TranferToProcurement",
  Purchase_ProcurementTranferToOrder:
    linkAPI + "Purchase/ProcurementTranferToOrder",

  EmailConfig_Add: linkAPI + "EmailConfig/Add",
  EmailConfig_Edit: linkAPI + "EmailConfig/Edit",
  EmailConfig_Delete: linkAPI + "EmailConfig/Delete",
  EmailConfig_GetList: linkAPI + "EmailConfig/GetList",
  EmailConfig_TestSendEmail: linkAPI + "EmailConfig/TestSendEmail",

  //Library
  Get_Folder_Library: linkAPI + "Library/Get_Folder",
  Add_Folder_Library: linkAPI + "Library/Add_Folder",
  Edit_Folder_Library: linkAPI + "Library/Edit_Folder",
  Delete_Folder_Library: linkAPI + "Library/Delete_Folder",
  Get_Files_Library: linkAPI + "Library/Get_Files",
  Add_File_Library: linkAPI + "Library/Add_File",
  Edit_File_Library: linkAPI + "Library/Edit_File",
  Delete_File_Library: linkAPI + "Library/Delete_File",

  //PR_Tool_Update
  Get_List_PR_Tool_Update: linkAPI + "PR_Tool_Update/Get_List",
  Add_PR_Tool_Update: linkAPI + "PR_Tool_Update/Add",
  Edit_PR_Tool_Update: linkAPI + "PR_Tool_Update/Edit",
  Delete_PR_Tool_Update: linkAPI + "PR_Tool_Update/Delete",

  //Procurement
  Procurement_Get_Approval: linkAPI + "Procurement/Get_Approval",
  Get_Info_Procurement: linkAPI + "Procurement/Get_Info",
  Procurement_Save: linkAPI + "Procurement/Save",
  Procurement_SaveEvaluation: linkAPI + "Procurement/SaveEvaluation",

  //Vendors
  Get_List_Vendors: linkAPI + "Vendors/Get_List",
  Add_Vendors: linkAPI + "Vendors/Add",
  Edit_Vendors: linkAPI + "Vendors/Edit",
  Delete_Vendors: linkAPI + "Vendors/Delete",
  GetPR_Vendors: linkAPI + "Vendors/GetPR",
  GetPR_Vendors: linkAPI + "Vendors/GetPR",
  Get_Contractor: linkAPI + "Vendors/Get_Contractor",
  Get_All_VendorPR: linkAPI + "Vendors/Get_All_VendorPR",

  fixed_asset_type_Get_List: linkAPI + "fixed_asset_type/Get_List",
  fixed_asset_type_Add: linkAPI + "fixed_asset_type/Add",
  fixed_asset_type_Edit: linkAPI + "fixed_asset_type/Edit",
  fixed_asset_type_Delete: linkAPI + "fixed_asset_type/Delete",
  Get_Fixed_Denghi_thanhly: linkAPI + "Fixed_Asset/Get_Fixed_Denghi_thanhly",

  fixed_asset_state_Get_List: linkAPI + "fixed_asset_state/Get_List",
  fixed_asset_state_Add: linkAPI + "fixed_asset_state/Add",
  fixed_asset_state_Edit: linkAPI + "fixed_asset_state/Edit",
  fixed_asset_state_Delete: linkAPI + "fixed_asset_state/Delete",

  producer_Get_List: linkAPI + "dm_producer/Get_List",
  producer_Add: linkAPI + "dm_producer/Add",
  producer_Edit: linkAPI + "dm_producer/Edit",
  producer_Delete: linkAPI + "dm_producer/Delete",

  dm_store_Get_List: linkAPI + "dm_store/Get_List",
  dm_store_Get_List_by_Type: linkAPI + "dm_store/Get_List_by_Type",
  dm_store_Add: linkAPI + "dm_store/Add",
  dm_store_Edit: linkAPI + "dm_store/Edit",
  dm_store_Delete: linkAPI + "dm_store/Delete",
  dm_GetbyManyOffice: linkAPI + "dm_Store/GetbyManyOffice",
  dm_Get_Tree: linkAPI + "dm_Store/Get_Tree",

  dm_vehicle_Type_Get_List: linkAPI + "dm_vehicle_Type/Get_List",
  dm_vehicle_Type_Add: linkAPI + "dm_vehicle_Type/Add",
  dm_vehicle_Type_Edit: linkAPI + "dm_vehicle_Type/Edit",
  dm_vehicle_Type_Delete: linkAPI + "dm_vehicle_Type/Delete",

  dm_department_Get_List: linkAPI + "dm_department/Get_List",
  dm_department_Add: linkAPI + "dm_department/Add",
  dm_department_Edit: linkAPI + "dm_department/Edit",
  dm_department_Delete: linkAPI + "dm_department/Delete",

  Ware_house_GetDetail: linkAPI + "Ware_house/GetDetail",
  Ware_house_Get_List: linkAPI + "Ware_house/Get_List",
  Ware_house_Add: linkAPI + "Ware_house/Add",
  Ware_house_Edit: linkAPI + "Ware_house/Edit",
  Ware_house_Delete: linkAPI + "Ware_house/Delete",


  fixed_asset_group_Get_List: linkAPI + "fixed_asset_group/Get_List",
  fixed_asset_group_Add: linkAPI + "fixed_asset_group/Add",
  fixed_asset_group_Edit: linkAPI + "fixed_asset_group/Edit",
  fixed_asset_group_Delete: linkAPI + "fixed_asset_group/Delete",

  fixed_asset_Get_List_Individual: linkAPI + "fixed_asset/Get_List_Individual",
  fixed_asset_Get_List: linkAPI + "fixed_asset/Get_List",
  fixed_asset_Add: linkAPI + "fixed_asset/Add",
  fixed_asset_Edit: linkAPI + "fixed_asset/Edit",
  fixed_asset_Delete: linkAPI + "fixed_asset/Delete",
  fixed_asset_Disposal: linkAPI + "fixed_asset/Disposal",
  fixed_asset_Get_List_In_Warehouse:
    linkAPI + "Fixed_Asset/Get_List_In_Warehouse",
  fixed_asset_Get_List_By_Ids: linkAPI + "Fixed_Asset/Get_List_By_Ids",
  Get_Asset_Mapping: linkAPI + "Fixed_Asset/Get_Asset_Mapping",


  Transfer_Get: linkAPI + "Transfer/Get",
  Transfer_Add: linkAPI + "Transfer/Add",
  Transfer_Edit: linkAPI + "Transfer/Edit",
  Transfer_Approved: linkAPI + "Transfer/Approved",
  Transfer_Delete: linkAPI + "Transfer/Delete",

  Ticket_Get_List_ByAssets: linkAPI + "Ticket/Get_List_ByAssets",
  Ticket_Get_Info: linkAPI + "Ticket/Get_Info",
  Ticket_Get_List: linkAPI + "Ticket/Get_List",
  Ticket_Add: linkAPI + "Ticket/Add",
  Ticket_Edit: linkAPI + "Ticket/Edit",
  Ticket_Approved: linkAPI + "Ticket/Approved",
  Ticket_Finish: linkAPI + "Ticket/Finish",
  Ticket_Success: linkAPI + "Ticket/Success",
  Ticket_Cancel: linkAPI + "Ticket/Cancel",
  Ticket_Executor: linkAPI + "Ticket/Executor",
  Ticket_Comment: linkAPI + "Ticket/Comment",
  Ticket_Get_Comment: linkAPI + "Ticket/Get_Comment",

  Inventory_Get_Info: linkAPI + "Inventory/Get_Info",
  Inventory_Get_Print: linkAPI + "Inventory/Get_Print",
  Inventory_Get_List_ByAssets: linkAPI + "Inventory/Get_List_ByAssets",
  Inventory_Get_List: linkAPI + "Inventory/Get_List",
  Inventory_Add: linkAPI + "Inventory/Add",
  Inventory_Edit: linkAPI + "Inventory/Edit",
  Inventory_Submitted: linkAPI + "Inventory/Submitted",
  Inventory_Approved: linkAPI + "Inventory/Approved",
  Inventory_Delete: linkAPI + "Inventory/Delete",
  Get_List_Individual: linkAPI + "Inventory/Get_List_Individual",
  AddRequest: linkAPI + "Inventory/AddRequest",
  EditRequest: linkAPI + "Inventory/EditRequest",
  DeleteRequest: linkAPI + "Inventory/DeleteRequest",
  GetRequest: linkAPI + "Inventory/GetRequest",
  GetRequestActive: linkAPI + "Inventory/GetRequestActive",

  Disposal_Get_List: linkAPI + "Disposal/Get_List",
  Disposal_Add: linkAPI + "Disposal/Add",
  Disposal_Edit: linkAPI + "Disposal/Edit",
  Disposal_GetDetail: linkAPI + "Disposal/GetDetail",

  Dashboard_GetCounterByState: linkAPI + "Dashboard/GetCounterByState",
  GetFixed_Asset_Inventory: linkAPI + "Inventory/GetFixed_Asset_Inventory",

  Language_AddForm: linkAPI + "Language/AddForm",

  //Reports
  Reports_Dashboard: linkAPI + "Reports/Dashboard",
  Reports_Khauhao: linkAPI + "Reports/Khauhao",
  Reports_Baohanh: linkAPI + "Reports/Baohanh",



  Manager_GetList: linkAPI + "Manager/GetList",
  Manager_GetDetail: linkAPI + "Manager/GetDetail",
  Manager_Add_Detail: linkAPI + "Manager/Add_Detail",
  Manager_Edit_Detail: linkAPI + "Manager/Edit_Detail",
  Manager_Add: linkAPI + "Manager/Add",
  Manager_Edit: linkAPI + "Manager/Edit",
  Manager_Approved: linkAPI + "Manager/Approved",
  Manager_Delete: linkAPI + "Manager/Delete",
  Manager_GetList_Approved: linkAPI + "Manager/GetList_Approved",
  Manager_GetList_Received: linkAPI + "Manager/GetList_Received",
  Manager_Accept: linkAPI + "Manager/Accept",


  //Office
  Get_List_Office_Asset: linkAPI + "Office/Get_List_Office_Asset",
  fixed_asset_Get_List_demo: "http://192.168.1.249:8060/Fixed_Asset/Get_List",

  Import_File_FA: "http://demo.quanlynoibo.com:8107/Fixed_Asset/Import_File",
};

export var ServerAPI = {
  APISaveFileToServer: "/API/SaveFileToServer",
};
