import * as apiFinanceSetting from './api-finance-setting'
import * as apiFinanceSettings from './api-finance-settings'
import * as apiFinanceRecord from './api-finance-record'
import * as apiFinanceRecords from './api-finance-records'


export const API_FN = {
  ...apiFinanceSetting,
  ...apiFinanceSettings,
  ...apiFinanceRecord,
  ...apiFinanceRecords
}