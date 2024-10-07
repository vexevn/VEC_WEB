import API from "../API";
import GetDataAPI from "../GetDataAPI";

export default {
  GetList() {
    return new Promise(rs => {
      GetDataAPI({
        url: API.fixed_asset_group_Get_List,
        action: re => {
          rs(re);
        }
      })
    })
  },
  Add(obj) {
    return new Promise(rs => {
      GetDataAPI({
        method: 'post',
        url: API.fixed_asset_group_Add,
        params: obj,
        action: re => {
          rs(re);
        }
      })
    })
  },
  Edit(obj) {
    return new Promise(rs => {
      GetDataAPI({
        method: 'post',
        url: API.fixed_asset_group_Edit,
        params: obj,
        action: re => {
          rs(re);
        }
      })
    })
  },
  Delete(obj) {
    return new Promise(rs => {
      GetDataAPI({
        method: 'post',
        url: API.fixed_asset_group_Delete,
        params: obj,
        action: re => {
          rs(re);
        }
      })
    })
  },
}