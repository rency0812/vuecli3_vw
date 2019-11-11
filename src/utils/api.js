/**
 * 接口文件
 */
export const login = 'login/user'
export const industry = 'industry/findall'
export const assistMan = 'choose/aux'
export const manager = 'choose/zoone'
export const targetDispatch = 'choose/associateMarketingActive'
export const marketActive = {
  add: 'market/add',
  targetInfo: 'target/add',
  targetList: 'target/list',
  getList: 'market/listMarketActive',
  targetEdit: 'target/update',
  viewTargetDetail: 'target/listDetail',
  getList: 'market/listMarketActive',
  // 未开始的市场活动
  getNotStartList: 'market/notStartMarketActive',
  // 已经开始的市场活动
  getonMarketList: 'market/onMarketActive',  
  // 已经结束的市场活动
  getendList: 'market/endMarketActive',
  // 活动详情
  getDetailInfo: 'market/marketActiveDetail',
  marketbasicEdit: 'market/updateMarketActiveDetail'
}
export const contact = {
  getList: 'contact/listAll',
  add: 'contact/add',
  assign: 'contact/assign',
  viewList: 'contact/list',
  edit: 'contact/edit',
  viewContact: 'contact/detail',
  update: 'contact/update'
}
// 指标分配相关接口
export const appoint ={
  getList: '/appoint/list',
  add: '/appoint/add',
  update: '/appoint/update'
}