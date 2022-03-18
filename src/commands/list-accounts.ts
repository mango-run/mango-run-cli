import base58 from 'bs58'

import { Config, IDS, MangoClient } from '@blockworks-foundation/mango-client'
import { Connection, Keypair } from '@solana/web3.js'

import { BaseArgs } from '../types'
import { createContext } from '../helpers/create-context'
import { getMangoAccounts } from '../helpers/get-mango-accounts'

export async function listAccounts(args: BaseArgs) {
  const ctx = await createContext(args)
  const accounts = await getMangoAccounts(ctx)
  const { groupConfig, group, cache } = ctx
  accounts.forEach((account, index) => {
    console.log('====================')
    console.log(index, account.name)
    console.log('====================')
    console.log(account.toPrettyString(groupConfig, group, cache))
  })
}
