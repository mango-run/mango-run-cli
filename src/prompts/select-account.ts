import { MangoAccount } from '@blockworks-foundation/mango-client'
import inquirer from 'inquirer'
import ora from 'ora'
import { getMangoAccounts } from '../helpers/get-mango-accounts'
import { BaseContext } from '../types'

export async function selectAccount(ctx: BaseContext) {
  const spinner = ora('loading mango accounts')

  spinner.start()

  const accounts = await getMangoAccounts(ctx)

  spinner.stop()

  const { answer } = await inquirer.prompt({
    type: 'list',
    name: 'answer',
    message: 'select a mango account',
    choices: accounts.map(account => ({ name: account.name, value: account })),
  })

  return answer as MangoAccount
}
