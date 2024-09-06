<template>
  <div id="pf_c" class="pf_c" v-if="loaded">
    <div style="border: 1px solid #ddd; border-radius: 10px; overflow: hidden">
      <div style="overflow: hidden">
        <el-row :gutter="30" class="pf-h">
          <el-col :span="4" class="pf-h-logo">
            <img src="/images/icon/wwf-logo.jpg" alt="" />
          </el-col>
          <el-col :span="16" class="pf-h-title">
            <h2>WWF-Viet Nam</h2>
            <h1 v-if="!obj.Info.Procurement_id" style="color: red">
              Purchase Requisition Form with Total Amount &lt;500CHF
            </h1>
            <h1 v-else>Purchase Requisition Form</h1>
          </el-col>
          <el-col :span="4" style="position: relative">
            <div class="pf-h-serial">
              <div style="" class="text-bold">P/R No.</div>
              <!-- <div
                v-if="!obj.Info.Procurement_id && !obj.Info.Serial"
                class="pr_no"
                style="display: flex; padding: 0"
              >
                <el-input v-model="obj.Info.Procurement_No" />
                <el-button style="padding: 5px" @click="SearchPR()">
                  <i class="fa fa-search"></i>
                </el-button>
              </div> -->
              <div class="pr_no" style="min-width: 200px">
                {{ obj.Info.Serial || "&nbsp;" }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="pf_m">
        <table>
          <tr>
            <td colspan="3" style="width: 180px">
              <label class="text-bold">REQUESTED BY:</label>
            </td>
            <td style="width: 20%">
              <el-input v-model="obj.Info.UserRequest_FullName" disabled />
            </td>
            <td style="width: 80px" class="text-align-right">
              <label class="text-bold">TITLE:</label>
            </td>
            <td style="width: 20%">
              <InputTextArea
                v-model="obj.Info.UserRequest_Title"
                spellcheck="false"
                :minLine="1"
                disabled
              />
            </td>
            <td colspan="2" style="width: 145px" class="text-align-right">
              <label class="text-bold Required">REQUISITION DATE: </label>
            </td>
            <td style="width: 120px">
              <ValidatePR :baseValue="obj.Info.Date_Request" ref="Date_Request">
                <el-date-picker
                  ref="entry"
                  v-model.lazy="obj.Info.Date_Request"
                  type="date"
                  format="dd MMM, yyyy"
                  placeholder="dd MMM, yyyy"
                  prefix-icon="none"
                  :disabled="true"
                ></el-date-picker>
              </ValidatePR>
              <!-- <el-input v-model="obj.Info.Date_Request" />selectFirst -->
            </td>
            <td class="text-align-right" style="width: 140px">
              <label class="text-bold Required">OFFICE: </label>
            </td>
            <td style="width: 20%">
              <ValidatePR :baseValue="obj.Info.Office_id" ref="Office_id">
                <InputSelect
                  style="width: 100%"
                  v-model="obj.Info.Office_id"
                  :model="ParaOfficeLocal"
                  placeholder="---"
                  :disabled="disabled || isPRLink"
                />
              </ValidatePR>
              <!-- <el-input v-model="obj.Info.Office_id" /> -->
            </td>
          </tr>
        </table>

        <table style="border-top: 0">
          <tr>
            <td width="4%" rowspan="2" class="text-align-center">
              <label class="text-bold">Item</label>
            </td>

            <td width="24%" colspan="4" rowspan="2" class="text-align-center">
              <label class="text-bold">Detailed Descriptions</label>
            </td>
            <td width="8%" rowspan="2" class="text-align-center">
              <label class="text-bold">Quantity </label>
            </td>
            <td width="30%" colspan="3" class="text-align-center">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: baseline;
                "
              >
                <label
                  style="margin-right: 5px"
                  class="text-bold Required"
                  title=""
                >
                  Your Currency
                </label>

                <el-tooltip
                  content="Select currency"
                  placement="top"
                  :tabindex="-1"
                >
                  <ValidatePR
                    :baseValue="obj.Info.Money_code"
                    ref="validatecurrency_code"
                  >
                    <InputSelect
                      v-if="loadedCurrency"
                      class="select-currency_code"
                      v-model="obj.Info.Money_code"
                      :model="Para.Para_Currency"
                      placeholder="---"
                      @change="handleChangeCurrencyCode()"
                      :disabled="disabled"
                      ref="currency_code"
                    />
                  </ValidatePR>
                </el-tooltip>
              </div>

              <span
                v-if="obj.Info.Money_code"
                style="font-weight: normal; color: blue; font-style: italic"
              >
                <span>{{ currency_code_info }}</span>
              </span>
            </td>
            <td rowspan="2" class="text-align-center">
              <label class="text-bold">Project Code</label>
            </td>
            <td rowspan="2" class="text-align-center">
              <label class="text-bold">Award Code</label>
            </td>
            <td rowspan="2" class="text-align-center">
              <label class="text-bold">Task Code</label>
            </td>
          </tr>
          <tr>
            <td width="10%" class="text-align-center">
              <label class="text-bold multi-wrap">
                <span>Unit Cost &nbsp;</span>
                <span style="display: flex">
                  (
                  <span class="currency-code" style="color: blue">
                    {{
                      Para.Para_Currency.getName(obj.Info.Money_code) ||
                      obj.Info.Money_code
                    }}
                  </span>
                  )
                </span>
              </label>
            </td>
            <td width="10%" class="text-align-center">
              <label class="text-bold multi-wrap">
                Amount &nbsp;
                <span style="display: flex">
                  (
                  <span class="currency-code" style="color: blue">
                    {{
                      Para.Para_Currency.getName(obj.Info.Money_code) ||
                      obj.Info.Money_code
                    }}
                  </span>
                  )
                </span>
              </label>
            </td>
            <td width="10%" class="text-align-center">
              <label class="text-bold multi-wrap">
                <span
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    flex: 0 0 100%;
                  "
                >
                  Amount
                  <span style="white-space: nowrap; display: flex">
                    ( <span style="color: blue">CHF</span> )
                  </span>
                </span>
                <span
                  v-if="obj.Info.Money_code"
                  style="
                    font-weight: normal;
                    color: blue;
                    font-style: italic;
                    word-break: break-all;
                    font-size: 10px;
                  "
                >
                  ({{ Para.Para_Currency.getName(obj.Info.Money_code) }}/CHF={{
                    currency_code_rate
                  }})
                </span>
              </label>
            </td>
          </tr>

          <tr
            v-for="(item, index) in SosachDetails()"
            :key="item.Id"
            class="items"
          >
            <td class="text-align-center">
              <el-tooltip
                content="Remove line"
                placement="top"
                :tabindex="-1"
                v-if="!item.objOld"
              >
                <el-button
                  v-if="index > 0 && !disabled"
                  type="danger"
                  icon="fa fa-times"
                  class="detail-btn"
                  @click="removeItem(item)"
                ></el-button>
              </el-tooltip>
              <span>{{ index + 1 }}</span>
            </td>

            <td colspan="4">
              <ValidatePR :baseValue="item.Description" ref="validatePR">
                <PRCM
                  :oldValue="item.objOld ? item.objOld.Description : null"
                  :baseValue.sync="item.Description"
                  :isPopup="true"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                >
                  <InputTextArea
                    v-model.lazy="item.Description"
                    spellcheck="false"
                    :disabled="disabled"
                    :minLine="1"
                  />
                </PRCM>
              </ValidatePR>
            </td>
            <td class="text-align-center">
              <ValidatePR :baseValue="item.Quantity" ref="validatePR">
                <PRCM
                  :oldValue="item.objOld ? item.objOld.Quantity : null"
                  :baseValue.sync="item.Quantity"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                  :isNumber="true"
                >
                  <InputNumber
                    v-model="item.Quantity"
                    @change="item.changeValue()"
                    :negative_allowed="false"
                    :disabled="disabled"
                  />
                </PRCM>
              </ValidatePR>
            </td>
            <td class="text-align-right">
              <div class="input-group">
                <ValidatePR :baseValue="item.Unit_Cost" ref="validatePR">
                  <PRCM
                    :oldValue="item.objOld ? item.objOld.Unit_Cost : null"
                    :baseValue.sync="item.Unit_Cost"
                    ref="PRCM"
                    :isoldValue="isoldValue"
                    :isNumber="true"
                  >
                    <InputNumber
                      v-model="item.Unit_Cost"
                      @change="item.changeValue()"
                      :decimal_alway="obj.Info.Money_code != 'VND'"
                      :negative_allowed="false"
                      :disabled="disabled"
                    />
                  </PRCM>
                </ValidatePR>
              </div>
            </td>
            <td class="text-align-right">
              <div class="input-group">
                <PRCM
                  :oldValue="item.objOld ? item.objOld.Money_Total : null"
                  :baseValue.sync="item.Money_Total"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                  :isNumber="true"
                >
                  <InputNumber
                    v-model="item.Money_Total"
                    :decimal_alway="obj.Info.Money_code != 'VND'"
                    :negative_allowed="false"
                    disabled
                  />
                </PRCM>
              </div>
            </td>
            <td class="text-align-right">
              <PRCM
                :oldValue="item.objOld ? item.objOld.Money_CHF : null"
                :baseValue.sync="item.Money_CHF"
                ref="PRCM"
                :isoldValue="isoldValue"
                :isNumber="true"
              >
                <InputNumber
                  v-model="item.Money_CHF"
                  :decimal_alway="true"
                  disabled
                />
              </PRCM>
            </td>
            <td class="text-align-center">
              <!-- {{ item.objOld }} -->
              <ValidatePR :baseValue="item.Project_code" ref="validatePR">
                <PRCM
                  :oldValue="item.objOld ? item.objOld.Project_code : null"
                  :baseValue.sync="item.Project_code"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                >
                  <InputSelect
                    v-if="
                      !(disabled || (item.objOld && item.objOld.Id)) ||
                      isManagerApproval
                    "
                    style="min-width: 100px"
                    v-model="item.Project_code"
                    :model="project_code"
                  />
                  <el-input v-else v-model="item.Project_code" disabled />
                </PRCM>
              </ValidatePR>
            </td>
            <td class="text-align-center">
              <ValidatePR :baseValue="item.Award_code" ref="validatePR">
                <PRCM
                  :oldValue="item.objOld ? item.objOld.Award_code : null"
                  :baseValue.sync="item.Award_code"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                >
                  <InputSelect
                    v-if="!disabled || isManagerApproval"
                    style="min-width: 100px"
                    v-model="item.Award_code"
                    :model="award_code(item)"
                  />
                  <el-input v-else v-model="item.Award_code" disabled />
                </PRCM>
              </ValidatePR>
            </td>
            <td class="text-align-center">
              <ValidatePR :baseValue="item.Task_code" ref="validatePR">
                <PRCM
                  :oldValue="item.objOld ? item.objOld.Task_code : null"
                  :baseValue.sync="item.Task_code"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                >
                  <InputSelect
                    v-if="!disabled || isManagerApproval"
                    style="min-width: 100px"
                    v-model="item.Task_code"
                    :model="task_code(item)"
                  />
                  <el-input v-else v-model="item.Task_code" disabled />
                </PRCM>
              </ValidatePR>
            </td>
          </tr>
          <tr id="summary">
            <td width="4%" class="text-align-center">
              <el-tooltip content="Add line" placement="top" :tabindex="-1">
                <el-button
                  v-if="!disabled"
                  type="success"
                  icon="fa fa-plus"
                  class="detail-btn"
                  @click="addItem()"
                ></el-button>
              </el-tooltip>
            </td>
            <td width="40%" colspan="5" class="text-align-right">
              <label class="text-bold">TOTAL</label>
            </td>
            <td style="background-color: yellow" class="text-bold"></td>
            <td
              style="
                background-color: yellow;
                text-align: right;
                padding-right: 13px;
              "
              class="text-bold"
            >
              <span id="total-sum-amount-currency">
                <!-- {{ obj.totalAmountCurrency() }} -->
                {{
                  ConvertStr.ToMoneyStr(
                    obj.Info.Money_Total,
                    obj.Info.Money_code != "VND"
                  )
                }}
              </span>
            </td>
            <td
              style="
                background-color: yellow;
                text-align: right;
                padding-right: 13px;
              "
              class="text-bold"
            >
              <span id="total-sum-amount">
                <!-- {{ obj.totalAmount() }} -->
                {{ ConvertStr.ToMoneyStr(obj.Info.Money_CHF, true) }}
              </span>
            </td>
            <td colspan="3">
              <el-button
                v-if="
                  obj.Info.Status == 2 && obj.Info.UserCreate == user.UserSerial
                "
                type="primary"
                @click="SendReminder()"
              >
                Send Email reminder to Your Line Manager
              </el-button>
              <el-button
                v-if="
                  obj.Info.Status == 6 &&
                  obj.Info.UserCreate == user.UserSerial &&
                  !purchasingManager
                "
                type="danger"
                :style="{
                  background: Purchasing_color,
                  'border-color': Purchasing_color,
                  color: 'black',
                }"
                @click="SavePurchasingManager()"
              >
                Purchasing
              </el-button>
              <el-button
                v-if="
                  obj.Info.Status == 6 &&
                  purchasingManager &&
                  purchasingManager.Emp_id == user.UserSerial
                "
                type="danger"
                :style="{
                  background: Purchasing_color,
                  'border-color': Purchasing_color,
                  color: 'black',
                }"
                @click="SaveAuthority()"
              >
                Authority
              </el-button>
              <!-- <div class="er-c"
                   style="color: blue; font-weight: bold">
                <label class="txt-er">
                  <input type="checkbox"
                         v-model="obj.Info.EmailReminder"
                         :disabled="disabled" />
                  <span>Email Reminder</span>
                </label>
                <div class="txt-er"
                     v-if="obj.Info.EmailReminder">
                  <span style="margin-left: 0">: Every</span>
                  <InputNumber v-model="obj.Info.EmailReminderTime"
                               style="flex: 0 0 30px"
                               :disabled="disabled" />
                  <span>hours.</span>
                </div>
              </div> -->
            </td>
          </tr>

          <tr>
            <td colspan="5"><label class="text-bold">REQUESTED BY:</label></td>

            <td colspan="4">
              <div style="display: flex; align-items: center">
                <PRCM
                  ref="PRCM"
                  :isoldValue="isoldValue"
                  :onMessage="GetApproverDiff(2)"
                  :baseValue="obj.Approval"
                  :oldValue="objOld.Approval"
                  :isPopup="true"
                >
                  <label class="text-bold">APPROVED BY: </label>
                  <div slot="popupContent">
                    <div
                      v-for="(item, index) in objOld.Approval.filter(
                        (p) => p.Type_id == 2
                      )"
                      :key="item.Emp_id"
                    >
                      <CheckboxApproval
                        :Item="item"
                        :index="index"
                        :Purchase="objOld.Info"
                        :disabled="true"
                        :disableState="true"
                      />
                    </div>
                    <span
                      v-if="
                        !objOld.Approval.filter((p) => p.Type_id == 2).length
                      "
                      >(No Data)</span
                    >
                  </div>
                </PRCM>
                &nbsp;
                <el-tooltip
                  content="Add approval"
                  placement="top"
                  :tabindex="-1"
                >
                  <el-button
                    v-if="!disabled && !isPRLink"
                    type="primary"
                    icon="fa fa-plus-circle"
                    class="detail-btn"
                    style="margin: 0"
                    @click="form.ShowForm(2)"
                  ></el-button>
                </el-tooltip>
                <!-- <span class="EndorsedBy">{{ Approvedby }}</span> -->
              </div>
            </td>
            <td colspan="3">
              <div style="display: flex; align-items: center">
                <label class="text-bold"> Purchased by: </label>
                &nbsp;
                <InputSelect
                  style="width: 200px"
                  ref="Purchasing_id"
                  v-model="Purchasing_id"
                  :model="Para.Para_Account_purchasing"
                  v-if="obj.Info.Status == 6"
                  :disabled="
                    obj.Info.UserCreate != user.UserSerial ||
                    !!purchasingManager
                  "
                />
              </div>
            </td>
          </tr>

          <tr>
            <td
              colspan="5"
              style="vertical-align: top !important; position: relative"
            >
              <div style="margin-top: 0px">
                <img
                  v-if="obj.Info.UserRequest_SignatureImage"
                  height="80px"
                  width="auto"
                  :src="
                    getPRFileAttach(
                      Para.SignImage.baseUrl +
                        getFilePath(obj.Info.UserRequest_SignatureImage),
                      isPRLink
                    )
                  "
                />
              </div>
              <div class="void-c" v-if="obj.isSelfVoid()">
                <div class="void-title">VOID</div>
                <div class="void-date">
                  {{
                    ConvertStr.ToDateStr(obj.Info.DateUpdate, "DD MMM, yyyy")
                  }}
                </div>
              </div>
              <div style="display: flex">
                <div style="flex: 1">
                  <b>{{ obj.Info.UserRequest_FullName }}</b> -
                  {{ obj.Info.UserRequest_Title }}
                </div>
                <div
                  v-if="obj.isSelfVoid() && obj.Info.ReasonRequestVoid"
                  style="flex: 1; color: blue"
                >
                  Comments: {{ obj.Info.ReasonRequestVoid }}
                </div>
              </div>
              <div v-if="obj.Info.DateSubmitted">
                Date:
                {{
                  ConvertStr.ToDateStr(obj.Info.DateSubmitted, "DD MMM, yyyy")
                }}
              </div>
              <div style="margin-top: 20px">
                <label>Notes:</label>
                <PRCM
                  :oldValue="objOld.Info.Comment"
                  :baseValue.sync="obj.Info.Comment"
                  ref="PRCM"
                  :isoldValue="isoldValue"
                  :isPopup="true"
                >
                  <InputTextArea
                    v-model.lazy="obj.Info.Comment"
                    spellcheck="false"
                    :disabled="disabled || isPRLink"
                  />
                </PRCM>
              </div>
              <div style="margin-top: 10px">
                <div style="height: 15px"></div>
                <div>
                  <PRCM
                    :oldValue="objOld.Info.URL"
                    :baseValue.sync="obj.Info.URL"
                    ref="PRCM"
                    :isoldValue="isoldValue"
                    :isPopup="true"
                  >
                    <InputFile
                      ref="PR_Attachment"
                      :model="
                        Para.PR_Attachment.set(
                          (p) =>
                            (p.baseUrl = getPRFileAttach(p.baseUrl, isPRLink))
                        )
                      "
                      v-model="obj.Info.URL"
                      label="Attachment(s)"
                      :disabled="disabled || isPRLink"
                    />
                    <InputFile
                      slot="popupContent"
                      ref="PR_Attachment_Old"
                      :model="
                        Para.PR_Attachment.set(
                          (p) =>
                            (p.baseUrl = getPRFileAttach(p.baseUrl, isPRLink))
                        )
                      "
                      v-model="objOld.Info.URL"
                      label="Attachment(s)"
                      :disabled="true"
                    />
                  </PRCM>
                </div>
              </div>
            </td>
            <!-- <td colspan="4"
                style="vertical-align: top !important">
              <div class="clearfix">
                <div v-for="(item, index) in obj.Approval.filter(
                  (p) => p.Type_id == 1
                )"
                     :key="item.Emp_id">
                  <CheckboxApproval :Item="item"
                                    :index="index"
                                    :Purchase="obj.Info"
                                    :disabled="disabled"
                                    @NoneCheckbox="NoneCheckbox(item)"
                                    @Approve="ApproveHandler()" />
                </div>
              </div>
            </td> -->
            <td colspan="4" style="vertical-align: top !important">
              <div class="clearfix" style="min-height: 140px">
                <div
                  v-for="(item, index) in obj.Approval.filter(
                    (p) => p.Type_id == 2
                  )"
                  :key="item.Emp_id"
                >
                  <CheckboxApproval
                    :Item="item"
                    :index="index"
                    :Purchase="obj.Info"
                    :Details="obj.Details"
                    @NoneCheckbox="NoneCheckbox(item)"
                    :disabled="disabled"
                    :noNeedEndorsed="
                      obj.Approval.filter((p) => p.Type_id == 1).length == 0
                    "
                    @Approve="ApproveHandler()"
                  />
                </div>
              </div>
            </td>
            <td colspan="3" style="vertical-align: top !important; padding: 0">
              <div class="clearfix" style="padding: 10px">
                <div
                  v-for="(item, index) in obj.Approval.filter(
                    (p) => p.Type_id == 4
                  )"
                  :key="item.Emp_id"
                >
                  <CheckboxApproval
                    :Item="item"
                    :index="index"
                    :Purchase="obj.Info"
                    :disabled="true"
                  />
                </div>
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  padding: 10px;
                  border-top: 1px solid #ddd;
                "
              >
                <label class="text-bold"> Authority by: </label>
                &nbsp;
                <InputSelect
                  style="width: 200px"
                  ref="Authority_id"
                  v-model="Authority_id"
                  :model="{
                    ...Para.Para_Account_purchasing,
                    IsItemDisabled(item) {
                      return (
                        purchasingManager && item.Id == purchasingManager.Emp_id
                      );
                    },
                  }"
                  v-if="obj.Info.Status == 6"
                  :disabled="
                    !purchasingManager || purchasingManager.Emp_id != UserSerial
                  "
                />
              </div>
              <div class="clearfix" style="padding: 10px">
                <div
                  v-for="(item, index) in obj.Approval.filter(
                    (p) => p.Type_id == 6
                  )"
                  :key="item.Emp_id"
                >
                  <CheckboxApproval
                    :Item="item"
                    :index="index"
                    :Purchase="obj.Info"
                    :disabled="true"
                  />
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div style="height: 20px"></div>
    <TechinicalForm v-if="TechinicalFormCheck" :model="obj"></TechinicalForm>
    <!-- <ProcuementForm v-if="obj.Info &&
      obj.Info.Status == 6 &&
      obj.Details &&
      obj.Details.length &&
      obj.Info.Use != 2
      "
                    :model="obj" /> -->

    <div class=""></div>
    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div slot="content">
        <div class="Table" style="height: 300px">
          <TablePaging ref="tp" :model="tp">
            <template slot="column-content-checkbox" slot-scope="{ row }">
              <el-checkbox
                style="pointer-events: none"
                :disabled="disabledCheckbox(row) || row.disabled"
                v-model.lazy="row.act"
              >
              </el-checkbox>
            </template>
          </TablePaging>
        </div>
      </div>
    </DefaultForm>
    <DefaultForm :model="formSpec" @actionOK="SaveFormSpec()">
      <div slot="content">
        <InputTextArea
          v-model.lazy="formSpecObj.specifications"
          :disabled="disabled"
        />
      </div>
    </DefaultForm>
    <DefaultForm :model="form_request_void">
      <div slot="content" v-focusFirstOnLoad>
        <InputTextArea v-model.lazy="obj.Info.ReasonRequestVoid" />
        <div style="display: flex; justify-content: end; margin-top: 10px">
          <el-button type="danger" @click="ProcessRequestVoid()">
            <i class="fa fa-thumbs-down" style="margin-right: 5px"></i>
            Request void
          </el-button>
          <el-button
            @click="
              obj.Info.ReasonRequestVoid = '';
              form_request_void.visible = false;
            "
          >
            <i class="fa fa-times-circle" style="margin-right: 5px"></i>
            Cancel
          </el-button>
        </div>
      </div>
    </DefaultForm>
    <DefaultForm :model="form_void">
      <div
        slot="content"
        v-focusFirstOnLoad
        v-if="approve || obj.Info.UserCreate == user.UserSerial"
      >
        <InputTextArea v-model.lazy="comment_info" />
        <div style="display: flex; justify-content: end; margin-top: 10px">
          <el-button
            :type="form_void_type == 1 ? 'danger' : 'primary'"
            @click="ProcessVoid()"
          >
            <i
              :class="
                'fa ' +
                (form_void_type == 1 ? 'fa-thumbs-down' : 'fa-thumbs-up')
              "
              style="margin-right: 5px"
            ></i>
            {{ form_void_type == 1 ? "Void" : "Reject Void" }}
          </el-button>
          <el-button @click="form_void.visible = false">
            <i class="fa fa-times-circle" style="margin-right: 5px"></i>
            Cancel
          </el-button>
        </div>
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import { SelectOption } from "~/assets/scripts/base/SelectOption";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
  dynamicColors,
  uploadFile,
} from "~/assets/scripts/Functions";
import PRForm from "~/assets/scripts/objects/Form/Purchase_info";
import PRFormDetail from "~/assets/scripts/objects/Form/Purchase_Detail";
import Purchase_input from "~/assets/scripts/objects/Form/Purchase_input";
import StoreManager from "~/assets/scripts/StoreManager";
import { Para } from "~/assets/scripts/Para";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import API, { linkAPI, linkPurchase } from "~/assets/scripts/API";
import { EventBus } from "~/assets/scripts/EventBus";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import Purchase_Approval from "~/assets/scripts/objects/Form/Purchase_Approval";
import Purchase_Detail from "~/assets/scripts/objects/Form/Purchase_Detail";
import MenuItem from "~/assets/scripts/objects/MenuItem";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import DelayCall from "~/assets/scripts/base/DelayCall";
import ConvertStr from "~/assets/scripts/ConvertStr";
import APIHelper from "~/assets/scripts/API/APIHelper";

export default {
  props: {
    pr_no: {},
    pr_id: {},
  },
  data() {
    return {
      Purchasing_color: dynamicColors(),
      Purchasing_id: "",
      Authority_id: "",
      loaded: false,
      form_request_void: new DefaultForm({
        title: "Comment for request void",
        width: "400px",
        // OKtext: "Reject",
        // Canceltext: "Cancel",
        type: "dialog",
      }),
      form_void_type: "",
      form_void: new DefaultForm({
        title: "Comment for void",
        width: "400px",
        // OKtext: "Reject",
        // Canceltext: "Cancel",
        type: "dialog",
      }),
      formSpecObj: {
        detail: null,
        specifications: "",
      },
      formSpec: new DefaultForm({
        title: "Item specifications",
      }),
      loadedCurrency: false,
      approve: null,
      show_data_cop: false,
      data_cop: [],
      dataApproval: [],
      Info_Content: "",
      filePicked: null,
      hasPick: false,
      /** @type {DelayCall} - description */
      ProcurementInfo: null,
      ProcurementMethod: null,

      Endorsedby: "",
      Approvedby: "",
      obj: new Purchase_input(),
      objOld: new Purchase_input(),
      isoldValue: false,
      // currency_code: Para.Para_Currency,
      project_code: Para.Para_Project_Code,
      UserSerial: StoreManager.GetUser().UserSerial,
      key: [],
      tp: new TablePaging({
        // title: "xxx",
        isSearchEqual: true,
        params: {
          iSearchInfo: "",
        },
        LoadDataSuccess: (re) => {
          // let _app = this;
          // console.log(_app.dataApproval);
          // (re || []).forEach((element) => {
          // });
        },
        clickRow: (row) => {
          if (!this.disabledCheckbox(row) && !row.disabled) {
            row.act = !row.act;
            if (row.act) {
              if (row.Approve_Type == 4) {
                this.$refs.tp.tempRows
                  .filter((p) => p.Id != row.Id)
                  .forEach((p) => {
                    p.act = false;
                    this.checkbox(p);
                  });
              }
            }
            this.checkbox(row);
            console.log(
              this.dataApproval.map((p) => `${p.FullName}-${p.Approve_Type}`)
            );
          }
        },
        // disablePaging: true,
        // noFilter: true,
        disableSelectRow: true,
        data: [],
        cols: [
          new TablePagingCol({
            title: "",
            data: "checkbox",
            min_width: 50,
          }),
          new TablePagingCol({
            title: "Họ tên",
            data: "FullName",
            min_width: 200,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Email",
            data: "Email",
            min_width: 220,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tiêu đề",
            data: "Tiêu đề",
            min_width: 200,
            sortable: false,
          }),
        ],
      }),
      comment_info: "",
      form: {
        obj: null,
        visible: false,
        width: "900px",
        title: "",
        OKtext: "OK",
        formType: "",
        ShowForm: (Approve_Type) => {
          GetDataAPI({
            url: API.Account,
            action: (re) => {
              re.forEach((p) => {
                p.Approve_Type = Approve_Type;
                
                // console.log('this.obj.Approval',this.obj.Approval)

                let find = this.obj.Approval.filter(  
                  (p1) => p1.Emp_id == p.Id
                )[0];

                if(Approve_Type==2 && StoreManager.GetUser().Email === p.Email){
                    p.disabled = true;
                }


                if (find && find.objOld) p.disabled = true;
                var find1 = (this.dataApproval || []).filter(
                  (p1) => p1.Id == p.Id
                )[0];
                if (find1) {
                  p.act = true;
                } else p.act = false;
              });
              console.log(StoreManager)
              // console.log(re)
              this.tp.data = re;
              this.form.formType = Approve_Type;
              switch (Approve_Type) {
                case 1:
                  this.form.title = "Select user for Endorse";
                  if (this.Endorsedby)
                    this.form.title +=
                      " " +
                      `<div style="font-style: italic;display: inline;color: #8bc34a;">(${this.Endorsedby})</div>`;
                  break;
                case 2:
                  this.form.title = "Select user for Approval";
                  if (this.Approvedby)
                    this.form.title +=
                      " " +
                      `<div style="font-style: italic;display: inline;color: #8bc34a;">(${this.Approvedby})</div>`;

                  break;
                case 3:
                  this.form.title = "Select user for CC Email";

                  break;
                case 4:
                  this.form.title = "Select purchasing manager";
                  re.forEach((p) => {
                    p.act = false;
                    p.disabled = false;
                    let find = (this.dataApproval || []).filter(
                      (p1) => p1.Id == p.Id && p1.Approve_Type == p.Approve_Type
                    )[0];
                    if (find) p.act = true;
                  });
                  this.tp.data = re.filter((p) => p.UserLevel_id == "2");
                  break;

                default:
                  break;
              }
              this.form.visible = true;
            },
          });
        },
        Save: () => {
          if (this.form.formType == 4) {
            this.SavePurchasingManager();
          } else this.Savecheckbox();
        },
      },
      dcMoney_CHF: null,
      dcMoney_CHF_confirm: false,
      ParaPurchasing: new SelectOption({
        data: [],
        label: "FullName",
      }),
    };
  },

  computed: {
    /**
     * @return {string} description
     */
    currency_code_info() {
      return StoreManager.Getcurrency_code()
        ? `(WWF_Fx rate_${ConvertStr.ToDateStr(
            StoreManager.Getcurrency_code().DateActive,
            "MMM.YYYY"
          )})`
        : "";
      //
    },

    /**
     * @return {Number} description
     */
    currency_code_rate() {
      return StoreManager.Getcurrency_code()
        ? StoreManager.Getcurrency_code().Percent
        : 0;
    },
    isPRLink() {
      if (this.obj.Info.Procurement_id) return true;
    },
    purchasingManager() {
      let find = this.obj.Approval.filter((p) => p.Type_id == 4)[0];
      if (find) return find;
      return null;
    },
    disabled() {
      if (!this.obj.Info.Status) return false;
      if (this.obj.Info.UserCreate != this.UserSerial) return true;
      if (this.obj.Info.Use == 2) return true;
      return (
        this.obj.Info.Status != 1 &&
        this.obj.Info.Status != 5 &&
        this.obj.Info.Status != 10
      );
    },
    isManagerApproval() {
      if (this.obj.Info.Status != 2) return false;

      let find = this.obj.Approval.filter(
        (p) => p.Type_id == 2 && p.Emp_id == this.UserSerial && p.State == 0
      )[0];
      if (find) return true;
      return false;
    },
    ParaOfficeLocal() {
      return Para.Para_Office.set((p) => (p.selectFirst = true)).set(
        (p) => (p.data = p.data.filter((p1) => p1.OfficeType == 1))
      );
    },
    ParaOfficeIntl() {
      return Para.Para_Office.set(
        (p) => (p.data = p.data.filter((p1) => p1.OfficeType == 2))
      );
    },
    TechinicalFormCheck() {
      if (!this.obj.Info) return false;
      if (this.obj.Info.Status != 6) return false;
      if (this.obj.Info.Use == 2) return false;
      let findPM = this.obj.Approval.filter(
        (p) =>
          (p.Type_id == 4 || p.Type_id == 5 || p.Type_id == 6) &&
          p.Emp_id == this.user.UserSerial
      )[0];
      if (!findPM) return false;
      return true;
    },
  },
  watch: {
    "obj.Info.Money_CHF"(nv, ov) {
      this.dcMoney_CHF.run();
    },
    "obj.Amount"(newValue, oldValue) {
      if (this.obj.Amount) this.GetProcurementInfo();
    },
    "obj.Info.Date_Request"() {
      this.loadedCurrency = false;
      new Promise((rs) => {
        if (this.obj && this.obj.Info.Date_Request) {
          let iDate = this.obj.Info.Date_Request;
          if (
            !this.obj.Info.Status ||
            this.obj.Info.Status == 1 ||
            this.obj.Info.Status == 5 ||
            this.obj.Info.Status == 10
          ) {
            iDate = new Date().toJSON();
          }
          GetDataAPI({
            url: API.Get_CurrentByDate,
            params: {
              iDate: iDate,
            },
            action: (re) => {
              Para.Para_Currency.data = re;
              rs();
            },
          });
        } else {
          Para.Para_Currency.data = [];
          rs();
        }
      }).then(() => {
        if (this.obj) {
          this.handleChangeCurrencyCode();
          this.loadedCurrency = true;
        }
      });
    },
    "obj.Details": {
      deep: true,
      handler() {
        if (this.loaded) {
          this.obj.totalAmountCurrency();
          this.obj.totalAmount();
        }
      },
    },
  },
  methods: {
    SavePurchasingManager() {
      if (!this.Purchasing_id) {
        ShowMessage("Please select a purchasing manager", "error");
        return;
      }

      console.log(this.$refs.Purchasing_id.selectedData);

      ShowConfirm({
        message: `Are you sure you want to select <b>${this.$refs.Purchasing_id.selectedData.FullName}</b> as purchasing manager?`,
        type: "warning",
        opt: {
          confirmButtonText: "Confirm",
          dangerouslyUseHTMLString: true,
        },
      }).then((re) => {
        new Promise((rs) => {
          if (this.obj.Info.Id) rs();
          else {
            if (this.obj.Info.Procurement_id) {
              APIHelper.purchase
                .ProcurementTranferToOrder({
                  pr_no: this.obj.Info.Serial,
                })
                .then((re) => {
                  // window.open("/Order/Invidual/Form/" + re);
                  rs(re);
                });
            }
          }
        }).then((pr_id) => {
          APIHelper.purchase
            .SavePurchasingManager({
              pr_id: pr_id || this.obj.Info.Id,
              pm_id: this.Purchasing_id,
              type: 4,
            })
            .then((re) => {
              ShowMessage(
                "Your order has been forwarded to the person in charge of shopping, Thank you!"
              );
              this.$router.push("/Order/Invidual/List");
            });
        });
      });
    },
    SaveAuthority() {
      if (!this.Authority_id) {
        ShowMessage("Please select a authority purchasing manager", "error");
        return;
      }

      ShowConfirm({
        message: `Are you sure you want to select <b>${this.$refs.Authority_id.selectedData.FullName}</b> as authority purchasing manager?`,
        type: "warning",
        opt: {
          confirmButtonText: "Confirm",
          dangerouslyUseHTMLString: true,
        },
      }).then((re) => {
        APIHelper.purchase
          .SavePurchasingManager({
            pr_id: this.obj.Info.Id,
            pm_id: this.Authority_id,
            type: 6,
          })
          .then((re) => {
            ShowMessage(
              "Your order has been forwarded to the person in charge of shopping, Thank you!"
            );
            this.$router.push("/Order/Invidual/List");
          });
      });
    },
    PickPurchasingManager() {
      this.form.ShowForm(4);
    },
    SendReminder() {
      APIHelper.purchase
        .SendReminder({
          pr_id: this.obj.Info.Id,
        })
        .then((re) => {
          ShowMessage("Send Reminder successfully");
        });
    },
    ShowFormSpec(item) {
      this.formSpecObj.detail = item;
      this.formSpecObj.specifications = item.specifications;
      this.formSpec.type = this.disabled ? "dialog" : "";
      this.formSpec.visible = true;
    },
    SaveFormSpec() {
      this.formSpecObj.detail.specifications = this.formSpecObj.specifications;
      this.formSpec.visible = false;
    },
    SearchPR() {
      if (this.obj.Info.Procurement_No) {
        APIHelper.purchase
          .SearchPR({
            iSearchInfo: this.obj.Info.Procurement_No,
          })
          .then((re) => {
            this.obj.update(re);
            console.log(re);
            let btn = [];
            // btn.push(
            //   new MenuItem({
            //     index: "btn_save",
            //     icon: "fa fa-save",
            //     title: "Save",
            //     banner: "Save",
            //   })
            // );
            StoreManager.SetMenuButton(btn);
          });
      }
    },
    GetApproverDiff(type_id) {
      var current = (this.obj.Approval || [])
        .filter((p) => p.Type_id == type_id)
        .map((p) => p.Emp_id);
      current.sort();
      var old = (this.objOld.Approval || [])
        .filter((p) => p.Type_id == type_id)
        .map((p) => p.Emp_id);
      old.sort();
      // console.log(
      //   JSON.stringify(current),
      //   JSON.stringify(old),
      //   JSON.stringify(current) != JSON.stringify(old) ? "Diff" : "Ko DIff"
      // );
      return JSON.stringify(current) != JSON.stringify(old) ? "Diff" : "";
    },
    ApproveHandler() {
      this.$router.push("/Order/Invidual/List");
      // this.InitForm();
    },

    GetProcurementInfo() {
      this.ProcurementInfo.timer = 500;
      this.ProcurementInfo.run();
    },
    award_code(item) {
      if (item.Project_code)
        return {
          ...Para.Para_Project_Award_Code,
          params: {
            ...Para.Para_Project_Award_Code.params,
            Project_Code: Para.Para_Project_Code.getName(item.Project_code),
          },
        };
      else
        return new SelectOption({
          placeholder: "Select Project Code",
          data: [],
        });
    },
    task_code(item) {
      if (item.Project_code)
        return {
          ...Para.Para_Project_Task_Code,
          params: {
            ...Para.Para_Project_Task_Code.params,
            Project_Code: Para.Para_Project_Code.getName(item.Project_code),
          },
        };
      else
        return new SelectOption({
          placeholder: "Select Project Code",
          data: [],
        });
    },
    NoneCheckbox(item) {
      this.dataApproval = this.dataApproval.filter((p) => {
        if (p.Id == item.Emp_id) {
          return false;
        } else return true;
      });
      //Nếu là admend user
      if (item.objOld) {
        this.dataApproval.push({
          Id: item.Emp_id,
          Approve_Type: 3,
          Title: item.Emp_Title,
          Email: item.Emp_Email,
          FullName: item.Emp_FullName,
        });
      }
      this.Savecheckbox();
    },
    Savecheckbox() {
      this.obj.Approval = this.dataApproval.map((p) => {
        let findOld = this.obj.Approval.filter(
          (p1) => p1.Emp_id == p.Id && p1.Type_id == p.Approve_Type
        )[0];
        return new Purchase_Approval({
          objOld: findOld ? findOld.objOld : null,
          Id: findOld ? findOld.Id : 0,
          Comment: findOld ? findOld.Comment : "",
          Purchase_id: this.obj.Info.Id,
          Emp_id: p.Id,
          Type_id: p.Approve_Type,
          Emp_Title: p.Title,
          Emp_Email: p.Email,
          Emp_FullName: p.FullName,
        });
      });
      this.form.visible = false;
    },
    pickAttachment() {
      document.getElementById("txtattachment").click();
    },
    TakeFile() {
      this.filePicked = document.getElementById("txtattachment").files[0];
      this.hasPick = true;
      this.obj.Info.URL = "";
    },
    removeItem(item) {
      ShowConfirm({
        title: "Warning!",
        message: "Are you sure?",
        type: "warning",
      }).then((re) => {
        this.obj.Details.splice(this.obj.Details.indexOf(item), 1);
      });
    },
    addItem() {
      this.obj.Details.push(new Purchase_Detail());
    },
    handleChangeCurrencyCode() {
      let find = Para.Para_Currency.data.filter(
        (p) => p[Para.Para_Currency.value] == this.obj.Info.Money_code
      )[0];
      StoreManager.Setcurrency_code(find);
      if (!this.disabled) {
        console.error("handleChangeCurrencyCode");
        this.obj.Details.forEach((p) => p.changeValue());
      }
      // alert(this.obj.currency_code);
    },
    Export() {
      GetDataAPI({
        url: API.Purchase_ExportPurchase,
        params: {
          iId: this.obj.Info.Id,
        },
        action: (re) => {
          window.open(linkAPI + "" + re);
        },
      });
    },
    getValidate() {
      console.log(this);
      return new Promise((rs) => {
        return Promise.all([
          this.$refs.validatePR.every((p) => p.getValidate()),
          this.$refs.Date_Request.getValidate(),
          this.$refs.Office_id.getValidate(),
          // this.$refs.Office_intl_id.getValidate(),
          // this.$refs.Content.getValidate(),
          // this.$refs.Category_id.getValidate(),
          this.$refs.validatecurrency_code.getValidate(),
        ]).then((re) => {
          // console.log(re);
          rs(re.every((p) => p));
        });
      });
    },
    Save(state, isAuto, isSaveNSubmit) {
      return new Promise((rsa) => {
        new Promise((rs) => {
          if (state == "submited") {
            this.getValidate().then((re) => {
              if (re) {
                rs();
              } else {
                ShowMessage("Please complete all information", "error");
              }
            });
          } else {
            rs();
          }
        }).then(() => {
          let file_stuff = new Promise((rs) => {
            this.$refs.PR_Attachment.submitUpload().then((results) => {
              // console.log(results);
              this.obj.Info.URL = results.join(",");
              rs();
            });
          });
          file_stuff.then(() => {
            // console.log(1231);
            let isAdd = !this.obj.Info.Id;
            GetDataAPI({
              method: "post",
              url: this.obj.Info.Id
                ? state == "submited"
                  ? API.Purchase_Submitted
                  : API.Edit_Purchase
                : API.Add_Purchase,
              params: this.obj,
              action: (re) => {
                if (!this.obj.Info.Id) {
                  if (!isAuto) {
                    ShowMessage("Lưu thành công");
                    if (isAdd && state == "submited") {
                      this.obj.Info.Id = re;
                      this.obj.Info.UserCreate =
                        StoreManager.GetUser().UserSerial;

                      this.Save(state, isAuto, true).then(() => {
                        this.$router.push(
                          "/Order/Invidual/Form/" + this.obj.Info.Id
                        );
                        rsa();
                      });
                      // this.$router.push(
                      //   "/Order/Invidual/Form/" + this.obj.Info.Id
                      // );
                    } else {
                      this.$router.push("/Order/Invidual/Form/" + re);
                      rsa();
                    }
                  } else rsa();
                } else {
                  if (state == "submited") {
                    if (!isSaveNSubmit) {
                      this.InitForm();
                    }
                    ShowMessage("Submitted successfully");
                    rsa();
                  } else {
                    if (!isAuto) {
                      ShowMessage("Lưu thành công");
                    }
                    rsa();
                  }
                }
              },
            });
          });
        });
      });
    },
    Submit() {
      if (this.obj.Info.Money_CHF >= 500) {
        this.dcMoney_CHF.run();
      } else
        ShowConfirm({
          message: "Are you sure ?",
          title: "Submit to approval",
          type: MessageType.success,
        }).then(() => {
          this.Save("submited");
        });
    },
    Adjustment() {
      this.SubmitApprove(API.Purchase_Adjustment, "PR Adjustment/Withdrawal");
    },
    Amendment() {
      //PR Amendment
      this.SubmitApprove(API.Purchase_Amendment, "").then((re) => {
        this.$router.push("/Order/Invidual/Form/" + re);
      });
    },
    RequestVoid() {
      this.form_request_void.visible = true;
    },
    ProcessRequestVoid() {
      this.SubmitApprove(API.Purchase_RequestVoid, "Request Void PR");
    },
    Void() {
      this.approve = this.obj.Approval.filter(
        (p) => p.Type_id == 2 && p.Emp_id == this.user.UserSerial
      )[0];
      if (this.approve || this.obj.Info.UserCreate == this.user.UserSerial) {
        this.form_void_type = 1;
        this.form_void.title = "Comments for Void PR";
        this.comment_info = "";
        this.form_void.visible = true;
      } else {
        ShowMessage("You do not have perrmisson to void this PR");
      }
    },
    Delete() {
      ShowConfirm({
        message: "Are you sure ?",
        title: "Delete PR",
        type: MessageType.error,
      }).then(() => {
        GetDataAPI({
          url: API.Delete_Purchase + "/" + this.obj.Info.Id,
          method: "post",

          action: (re) => {
            ShowMessage("Draft PR deleted");
            this.isDeleted = true;
            this.$router.go(-1);
          },
        });
      });
    },
    RejectVoid() {
      this.approve = this.obj.Approval.filter(
        (p) => p.Type_id == 2 && p.Emp_id == this.user.UserSerial
      )[0];
      if (this.approve) {
        this.form_void_type = 2;
        this.form_void.title = "Comments for Reject Void PR";
        this.comment_info = "";
        this.form_void.visible = true;
      } else {
        ShowMessage("You do not have perrmisson to reject void this PR");
      }
    },
    ProcessVoid() {
      if (this.approve)
        GetDataAPI({
          method: "post",
          url:
            this.form_void_type == 1
              ? API.Purchase_Voided
              : API.Purchase_SendBack,
          params: {
            ...this.approve,
            Comment: this.comment_info,
          },
          action: (re) => {
            this.InitForm();
          },
        });
      else if (this.obj.Info.UserCreate == this.user.UserSerial) {
        GetDataAPI({
          method: "post",
          url: this.form_void_type == 1 ? API.Purchase_SelfVoided : "",
          params: {
            Purchase_id: this.obj.Info.Id,
            Comment: this.comment_info,
          },
          action: (re) => {
            this.InitForm();
          },
        });
      }
    },
    UnVoid() {
      this.approve = this.obj.Approval.filter(
        (p) => p.Type_id == 2 && p.Emp_id == this.user.UserSerial
      )[0];
      ShowConfirm({
        message: "Are you sure ?",
        title: "UnVoid PR",
        type: MessageType.success,
      }).then(() => {
        GetDataAPI({
          method: "post",
          url: API.Purchase_UnVoided,
          params: this.approve,
          action: (re) => {
            ShowMessage("UnVoid PR successfully");
            this.InitForm();
          },
        });
      });
    },
    CancelAmendment() {
      this.SubmitApprove(
        API.Purchase_CancelAmendment,
        "Cancel Amendment",
        (pr_id_approved) => {
          ShowMessage(`Cancel Amendment successed`);
          this.$router.push("/Order/Invidual/Form/" + pr_id_approved);
        }
      );
    },
    SubmitApprove(api, Message, callback) {
      return new Promise((rs) => {
        ShowConfirm({
          message: "Are you sure ?",
          title: Message,
          type: MessageType.success,
        }).then(() => {
          GetDataAPI({
            method: "post",
            url: api,
            params: this.obj.Info,
            action: (re) => {
              if (callback) callback(re);
              else {
                this.InitForm();
                if (Message) {
                  ShowMessage(`${Message} successed`);
                }
              }
              rs(re);
            },
          });
        });
      });
    },
    checkbox(row) {
      if (row.act) {
        if (
          !this.dataApproval.filter(
            (p) => p.Id == row.Id && p.Approve_Type == row.Approve_Type
          )[0]
        )
          this.dataApproval.push(row);
        // this.valuecheck.push([])
      } else {
        // this.dataApproval.splice(this.dataApproval.indexOf(row.Id), 1);
        this.dataApproval = this.dataApproval.filter((p) => {
          if (p.Id == row.Id && p.Approve_Type == row.Approve_Type) {
            return false;
          } else return true;
        });
      }
    },
    disabledCheckbox(row) {
      let check = false;
      // console.log(this, row)
      this.dataApproval.forEach((p) => {
        if (
          p.Approve_Type != row.Approve_Type &&
          row.Id == p.Id &&
          row.Approve_Type != 4
        )
          check = true;
      });
      // if (row.Approve_Type == 4) {
      //   let find = this.dataApproval.filter(p => p.Id == row.Id)[0];
      //   if (find) {
      //     if (find.Id != row.Id)
      //       check = true
      //   }

      //   let find2 = this.$refs.tp.rawData.filter(p=>p.act)[0];
      //   if (find2) {
      //     if (find2.Id != row.Id)
      //       check = true
      //   }

      // }

      return check;
    },
    InitForm() {
      // console.log(this);
      this.loaded = false;
      this.objOld = new Purchase_input();
      this.isoldValue = false;
      setTimeout(() => {
        new Promise((rs) => {
          StoreManager.SetBannerTitle("WWF - PR Form");
          if (this.pr_id || this.$route.params.id) {
            GetDataAPI({
              url: API.Purchase_Get_Info,
              params: {
                iId: this.pr_id || this.$route.params.id,
              },
              action: (re) => {
                if (!re) {
                  this.obj = null;
                  ShowMessage("Invalid PR");
                  setTimeout(() => {
                    this.$router.go(-1);
                  }, 500);
                  return;
                }
                this.obj.update(re);
                EventBus.$emit("Setbreadcrumb", this.obj.Info.Serial);

                if (!this.disabled) {
                  this.handleChangeCurrencyCode();
                  this.obj.totalAmountCurrency();
                  this.obj.totalAmount();
                }
                GetDataAPI({
                  url: API.Account,
                  action: (re) => {
                    // re.forEach((p) => (p.Approve_Type = Approve_Type));
                    if (!this.obj.Info.Procurement_id)
                      this.obj.Approval = this.obj.Approval.filter((p) => {
                        let find = re.filter((p1) => p1.Id == p.Emp_id)[0];
                        return find;
                      });
                    this.dataApproval = this.obj.Approval.map((p) => {
                      let find = re.filter((p1) => p1.Id == p.Emp_id)[0];
                      if (find) find.Approve_Type = p.Type_id;
                      return JSON.parse(JSON.stringify(find || {}));
                    });
                  },
                });

                //Init button
                let btn = [];
                if (this.obj.Info.Use != 2)
                  switch (this.obj.Info.Status) {
                    case 1: //Draft
                    case 5: //Amendment
                    case 10: //Adjustment
                      if (this.obj.Info.UserCreate == this.user.UserSerial) {
                        btn.push(
                          new MenuItem({
                            index: "btn_save",
                            icon: "fa fa-save",
                            title: "Save",
                            banner: "Save",
                          })
                        );
                        btn.push(
                          new MenuItem({
                            index: "btn_submit",
                            icon: "fa fa-save",
                            title: "Submit to approval",
                            banner: "Submit",
                            path: "warning",
                          })
                        );
                        if (!this.obj.Info.Serial) {
                          btn.push(
                            new MenuItem({
                              index: "btn_delete",
                              icon: "fa fa-times",
                              title: "Delete PR",
                              banner: "Delete",
                              path: "danger",
                            })
                          );
                        }
                        if (this.obj.Info.Status == 5) {
                          btn.push(
                            new MenuItem({
                              index: "btn_cancel_amend",
                              icon: "fa fa-refresh",
                              title: "Cancel amendment",
                              banner: "CancelAmendment",
                              path: "danger",
                            })
                          );
                        }
                      }
                      break;
                    case 2: //Subbmited
                      // btn.push(
                      //   new MenuItem({
                      //     index: "btn_add",
                      //     icon: "fa fa-plus",
                      //     title: "Create PR",
                      //     banner: "Add",
                      //   })
                      // );

                      if (this.obj.Info.UserCreate == this.user.UserSerial) {
                        btn.push(
                          new MenuItem({
                            index: "btn_adjustment",
                            icon: "fa fa-edit",
                            title: "PR Adjustment/Withdrawal",
                            banner: "Adjustment",
                            path: "warning",
                          })
                        );
                      }
                      break;
                    case 4:
                      if (this.obj.Info.UserCreate == this.user.UserSerial) {
                        btn.push(
                          new MenuItem({
                            index: "btn_adjustment",
                            icon: "fa fa-edit",
                            title: "PR Adjustment/Withdrawal",
                            banner: "Adjustment",
                            path: "warning",
                          })
                        );
                      }
                      break;
                    case 3:
                      btn.push(
                        new MenuItem({
                          index: "btn_export",
                          icon: "fa fa-file-pdf-o",
                          title: "Export",
                          banner: "Export",
                          path: "success",
                        })
                      );
                      break;
                    case 6: //Approved
                      btn.push(
                        new MenuItem({
                          index: "btn_export",
                          icon: "fa fa-file-pdf-o",
                          title: "Export",
                          banner: "Export",
                          path: "success",
                        })
                      );
                      if (
                        this.obj.Info.Use != 2 &&
                        !this.obj.Info.Procurement_id
                      ) {
                        if (this.obj.Info.UserCreate == this.user.UserSerial) {
                          btn.push(
                            new MenuItem({
                              index: "btn_amendment",
                              title: "PR Amendment",
                              banner: "Amendment",
                              path: "warning",
                            })
                          );
                        }
                        if (
                          this.obj.Approval.filter(
                            (p) =>
                              p.Type_id == 2 && p.Emp_id == this.user.UserSerial
                          )[0] ||
                          this.obj.Info.UserCreate == this.user.UserSerial
                        )
                          btn.push(
                            new MenuItem({
                              index: "btn_void",
                              title: "Void PR",
                              banner: "Void",
                              path: "danger",
                            })
                          );
                      }
                      break;
                    case 7: //Request void
                      // if (
                      //   this.obj.Approval.filter(
                      //     (p) =>
                      //       p.Type_id == 2 && p.Emp_id == this.user.UserSerial && p.State != 1
                      //   )[0]
                      // )
                      //   btn.push(
                      //     new MenuItem({
                      //       index: "btn_void",
                      //       title: "Void PR",
                      //       banner: "Void",
                      //       path: "danger",
                      //     })
                      //   );
                      // btn.push(
                      //   new MenuItem({
                      //     index: "btn_void",
                      //     title: "Reject Void PR",
                      //     banner: "RejectVoid",
                      //     path: "primary",
                      //   })
                      // );
                      break;
                    case 8: //Pending void
                      let find = this.obj.Approval.filter(
                        (p) =>
                          p.Type_id == 2 && p.Emp_id == this.user.UserSerial
                      )[0];
                      if (find) {
                        if (find.State == 4)
                          btn.push(
                            new MenuItem({
                              index: "btn_void",
                              title: "Reject Void PR",
                              banner: "RejectVoid",
                              path: "primary",
                            })
                          );

                        if (find.State == 5)
                          btn.push(
                            new MenuItem({
                              index: "btn_void",
                              title: "Void PR",
                              banner: "Void",
                              path: "danger",
                            })
                          );
                      }
                      break;
                    case 9:
                      btn.push(
                        new MenuItem({
                          index: "btn_export",
                          icon: "fa fa-file-pdf-o",
                          title: "Export",
                          banner: "Export",
                          path: "success",
                        })
                      );
                      break;
                    default:
                      break;
                  }
                StoreManager.SetMenuButton(btn);
                if (re.Info.Amendment_Index > 0 && !re.Info.Procurement_id)
                  this.LoadCompare_Info();
                rs();
              },
            });
          } else {
            // this.ob
            this.obj.update(new Purchase_input());
            this.dataApproval = [];
            let btn = [];

            btn.push(
              new MenuItem({
                index: "btn_save",
                icon: "fa fa-save",
                title: "Save",
                banner: "Save",
              })
            );
            if (!this.obj.Info.Procurement_id)
              btn.push(
                new MenuItem({
                  index: "btn_submit",
                  icon: "fa fa-save",
                  title: "Submit to approval",
                  banner: "Submit",
                  path: "warning",
                })
              );
            StoreManager.SetMenuButton(btn);

            rs();
          }
        }).then(() => {
          if (this.obj.Approval) {
            let find = this.obj.Approval.filter((p) => p.Type_id == 4)[0];
            if (find) {
              this.Purchasing_id = find.Emp_id;
            }
            find = this.obj.Approval.filter((p) => p.Type_id == 6)[0];
            if (find) {
              this.Authority_id = find.Emp_id;
            }
          }

          this.loaded = true;
          this.form_request_void.visible = false;
          this.form_void.visible = false;
          if (this.pr_no) {
            this.obj.Info.Procurement_No = this.pr_no;
            this.SearchPR();
          }
        });
      }, 0);
    },

    handleInfoContent(value) {
      if (value.length > 3) {
        let str = value.trim();
        GetDataAPI({
          isWait: false,
          url: API.Purchase_Search_Name,
          params: {
            iSearchInfo: str,
          },
          action: (re) => {
            re.forEach((p) => {
              p.Content = p.Content.replace(
                new RegExp(str, "gi"),
                '<mark class="highlight">$&</mark>'
              );
            });
            this.data_cop = re;
            this.show_data_cop = re.length > 0;
          },
        });
      } else {
        this.data_cop = [];
        this.show_data_cop = false;
      }
    },
    LoadCompare_Info() {
      GetDataAPI({
        url: API.Get_Compare_Info,
        params: {
          iId: this.pr_id || this.$route.params.id,
        },
        action: (re) => {
          this.objOld.update(re);
          this.isoldValue = true;
          this.SosachDetails();
        },
      });
    },
    SosachDetails() {
      let data = this.obj.Details;
      if (this.isoldValue) {
        this.objOld.Details = this.objOld.Details || [];
        // if (this.objOld.Details[0].Id) {
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          element.objOld = this.objOld.Details[i] || new PRFormDetail();
        }

        // data.forEach((p) => {
        //   let objOld = this.objOld.Details.filter(
        //     (p1) => p.Base_id == p1.Id
        //   )[0];
        //   if (objOld) {
        //     p.objOld = objOld;
        //   }
        // });
        // }

        this.obj.Approval.forEach((p) => {
          let objOld = this.objOld.Approval.filter(
            (p1) => p.Emp_Email == p1.Emp_Email
          )[0];
          if (objOld) {
            p.objOld = objOld;
          }
        });
      }

      // console.log(data, "data");
      return data;
    },
  },
  mounted() {
    // console.log(StoreManager.GetUser(), "Use");
    console.log(this);

    this.InitForm();
    this.ProcurementInfo = new DelayCall(() => {
      if (this.obj.Info.Category_id && this.obj.Amount)
        GetDataAPI({
          isWait: false,
          url: API.GetProcurementInfo,
          params: {
            iCategory_id: this.obj.Info.Category_id,
            Budget: this.obj.Amount,
          },
          action: (re) => {
            if (re[0]) {
              this.ProcurementMethod = re[0];
              this.Approvedby = re[0].Info.Approval_Description;
              this.Endorsedby = re[0].Info.Endorsed_Description;
            } else {
              this.ProcurementMethod = null;

              this.Approvedby = "";
              this.Endorsedby = "";
            }
          },
        });
    });
    this.dcMoney_CHF = new DelayCall(() => {
      if (this.obj.Info.Money_CHF >= 500 && !this.obj.Info.Procurement_id) {
        if (!this.dcMoney_CHF_confirm) {
          this.dcMoney_CHF_confirm = true;
          ShowConfirm({
            message:
              "The order has exceeded the CHF limit, please transfer to Procurement to continue processing",
            title: "Warning",
          })
            .then(() => {
              APIHelper.purchase.TranferToProcurement(this.obj).then((re) => {
                window.open(linkPurchase + "/Form/Create/" + re, "_blank");
                location.href = "/Order/List";
              });
              this.dcMoney_CHF_confirm = false;
            })
            .catch(() => {
              this.dcMoney_CHF_confirm = false;
            });
        }
      }
    });
  },

  beforeMount() {
    EventBus.$on("CancelAmendment", this.CancelAmendment);
    EventBus.$on("Delete", this.Delete);
    EventBus.$on("RejectVoid", this.RejectVoid);
    EventBus.$on("UnVoid", this.UnVoid);
    EventBus.$on("Void", this.Void);
    EventBus.$on("RequestVoid", this.RequestVoid);
    EventBus.$on("Adjustment", this.Adjustment);
    EventBus.$on("Amendment", this.Amendment);
    EventBus.$on("Submit", this.Submit);
    EventBus.$on("Save", this.Save);
    EventBus.$on("Export", this.Export);
  },
  beforeDestroy() {
    EventBus.$off("CancelAmendment", this.CancelAmendment);
    EventBus.$off("Delete", this.Delete);
    EventBus.$off("RejectVoid", this.RejectVoid);
    EventBus.$off("UnVoid", this.UnVoid);
    EventBus.$off("Void", this.Void);
    EventBus.$off("RequestVoid", this.RequestVoid);
    EventBus.$off("Adjustment", this.Adjustment);
    EventBus.$off("Amendment", this.Amendment);
    EventBus.$off("Submit", this.Submit);
    EventBus.$off("Save", this.Save);
    EventBus.$off("Export", this.Export);
    EventBus.$emit("Setbreadcrumb", "");
  },

  ...{
    beforeRouteUpdate(to, from, next) {
      next();
      // console.log(to);
      this.InitForm();
    },
    beforeRouteLeave(to, from, next) {
      // next();
      // if(this.obj)
      // console.log(this.obj);
      new Promise((rs) => {
        if (!this.obj) rs(false);
        if (
          !this.obj.Info.Status ||
          this.obj.Info.Status == 1 ||
          this.obj.Info.Status == 5 ||
          this.obj.Info.Status == 10
        ) {
          new Promise((rs1) => {
            if (this.obj.Info.Id) rs1(true);
            else {
              ShowConfirm({
                title: "Alert!",
                message: "Do you want to save this PR?",
                type: "info",
                opt: {
                  cancelButtonText: "No",
                  confirmButtonText: "Yes",
                },
              })
                .then((re) => {
                  rs1(true);
                })
                .catch(() => {
                  rs1(false);
                });
            }
          }).then((re) => {
            if (re && !this.isDeleted)
              this.Save(null, true).then(() => {
                rs();
              });
            else rs();
          });
        } else rs();
      }).then(() => {
        next();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pf_c {
  background: #f4f4f4;
  overflow-x: auto;
  height: 100%;
  padding: 0 10px;

  .text-bold {
    // display: flex;
    font-weight: 700 !important;
  }

  .text-align-right {
    text-align: right !important;
  }

  .text-align-center {
    text-align: center !important;
  }

  .multi-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  h5 {
    font-size: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  ol li {
    margin-top: 15px;
  }

  .detail-btn {
    padding: 7px;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
    margin: auto;
  }

  .pf-h {
    text-align: center;
    padding: 0 15px;
    background: white;

    .pf-h-logo {
      img {
        width: 110px;
        height: 110px;
      }
    }

    .pf-h-title {
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        font-weight: 700 !important;
        font-size: 32px;
        margin-bottom: 10px;
      }

      h2 {
        font-weight: 300 !important;
        font-size: 36px;
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }

    .pf-h-serial {
      border: 1px solid #cccccc;
      margin-top: 20px;
      font-size: 18px;

      position: absolute;
      right: 15px;

      .text-bold {
        border-bottom: 1px solid #cccccc;
      }

      .pr_no {
        background-color: #e2efd9;
        white-space: nowrap;
        padding: 0 5px;

        ::v-deep  input {
          padding: 0 5px;
        }
      }
    }
  }

  .pf_m {
    padding: 0 15px;
    padding-bottom: 15px;
    background: white;

    table {
      width: 100%;
      border-top: 1px solid #ddd;
      border-left: 1px solid #ddd;
      border-spacing: 0;
      table-layout: fixed;

      tr {
        td {
          border-bottom: 1px solid #ddd;
          border-right: 1px solid #ddd;
          padding: 8px;
          line-height: 1.42857143;
        }
      }
    }
  }

  .select-currency_code {
    width: 80px;

    ::v-deep  .el-input--mini {
      input {
        background: none;
        // border: 1px solid #dcdfe6;
        padding: 0 10px;
        background: orange;
        color: white;

        &::placeholder {
          color: white;
        }
      }

      .el-input__icon {
        color: white;
      }
    }
  }

  ::v-deep  textarea {
    font-family: "Open Sans", "Segoe UI";
    font-size: 13px;
    color: #444444;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    padding: 0;
    border: none;
    background: url("/images/icon/border-line.png") scroll left bottom #edf3e9;
    line-height: 25px !important;
    width: 100%;
    // min-height: 50px;
    resize: none;
    outline: none;

    &[disabled] {
      color: black; // #858585;
      cursor: not-allowed;
      background-color: #fbfbfb;
      border-color: #e5e5e5;
    }
  }

  ::v-deep  .el-input--mini {
    input,
    textarea {
      font-family: "Open Sans", "Segoe UI";
      font-size: 13px;
      color: #444444;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      padding: 0;
      border: none;
      background: url("/images/icon/border-line.png") scroll left bottom #edf3e9;
      line-height: 25px !important;

      &[disabled] {
        color: black; // #858585;
        cursor: not-allowed;
        background-color: #fbfbfb;
        border-color: #e5e5e5;
      }
    }

    input {
      background-repeat: repeat-x;
    }

    textarea {
      resize: none;
      background-repeat: repeat;
      min-height: 26px;
    }
  }
}

.EndorsedBy {
  font-weight: normal;
  color: blue;
  font-style: italic;
  margin-left: 5px;
}

.show-data-cop {
  max-height: 300px;
  display: flex;
  flex-direction: column;

  .show-data-cop-title {
    border-bottom: 3px solid #585858;
    padding: 10px 0px;
    display: flex;
    align-items: center;
  }

  .show-data-cop-btn {
    font-size: 20px;
    width: auto;
    height: auto;
    margin-left: 5px;
    color: red;
    cursor: pointer;
  }

  .show-data-cop-c {
    flex: 1;
    overflow: auto;
  }
}

::v-deep .el-date-editor {
  width: 100%;
}

.Required {
  display: flex;
}

.Required_Sao {
  color: red;
}

.er-c {
  display: flex;

  .txt-er {
    display: flex;
    align-items: center;

    span {
      margin: 0 5px;
      white-space: nowrap;
    }
  }
}

.ProjectName-hd {
  color: blue;
}

.text-align-right {
  text-align: right;

  label {
    text-align: right;
    justify-content: end;
  }
}

.void-c {
  position: absolute;
  top: 5px;
  border: 8px solid red;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 17px;
  left: -5px;
  opacity: 1;
  transform: scale(0.5);
  background: #ffffffe0;

  .void-title {
    color: red;
    font-size: 61px;
    font-weight: bold;
  }

  .void-date {
    color: red;
    align-self: end;
    margin-right: 10px;
    position: absolute;
    bottom: 3px;
    font-weight: bold;
  }
}

table {
  tr.items {
    td {
      vertical-align: top;
    }
  }
}
</style>
