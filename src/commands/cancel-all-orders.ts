import { getMarketByBaseSymbolAndKind } from '@blockworks-foundation/mango-client'
import { Account } from '@solana/web3.js'
import ora from 'ora'

import { BaseArgs } from '../types'
import { createContext } from '../helpers/create-context'
import { selectAccount } from '../prompts/select-account'
import { inputBaseSymbol } from '../prompts/inputs'

export interface CancelAllOrdersArgs extends BaseArgs {
  baseSymbol: string
}

export async function cancelAllOrders(baseArgs: BaseArgs) {
  const spinner = ora('initializing')
  spinner.start()
  const ctx = await createContext(baseArgs)
  spinner.stop()
  const baseSymbol = await inputBaseSymbol()
  const account = await selectAccount(ctx)
  const marketConfig = getMarketByBaseSymbolAndKind(ctx.groupConfig, baseSymbol, 'perp')
  spinner.start('loading')
  const market = await ctx.group.loadPerpMarket(
    ctx.connection,
    marketConfig.marketIndex,
    marketConfig.baseDecimals,
    marketConfig.quoteDecimals,
  )
  let orders = await market.loadOrdersForAccount(ctx.connection, account)
  spinner.stop()
  while (orders.length > 0) {
    console.log('count of orders', orders.length)
    spinner.start('canceling')
    const txs = await ctx.client
      .cancelAllPerpOrders(ctx.group, [market], account, new Account(ctx.keypair.secretKey))
      .catch(() => [])
    await Promise.all(txs.map(tx => ctx.connection.confirmTransaction(tx, 'confirmed'))).catch()
    spinner.stop()
    spinner.start('checking orders')
    orders = await market.loadOrdersForAccount(ctx.connection, account)
    spinner.stop()
  }
  console.log('count of orders', orders.length)
}
