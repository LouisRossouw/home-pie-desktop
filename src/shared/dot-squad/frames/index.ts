import { notAuth } from './no-auth'
import { noServer } from './no-server'
import { loginFail } from './login-fail'
import { isNewDailies } from './new-daily'
import { simpleCheck } from './simple-check'
import { singleBlink } from './single-blink'
import { aiResponseA } from './ai-response-a'
import { checkServers } from './check-servers'
import { loginSuccess } from './login-success'
import { selectProject } from './select-project'
import { reconnectServer } from './reconnect-server'

export const anims = {
  notAuth,
  aiResponseA,
  noServer,
  loginFail,
  simpleCheck,
  singleBlink,
  checkServers,
  isNewDailies,
  loginSuccess,
  selectProject,
  reconnectServer
}
