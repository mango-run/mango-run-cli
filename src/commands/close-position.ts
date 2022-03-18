import base58 from 'bs58'

import {
  ConsoleLogger,
  createMangoPerpMarketConfigs,
  MangoPerpMarket,
} from '@mango-run/core'
import { Keypair } from '@solana/web3.js'

import { BaseArgs } from '../types'
import { inputBaseSymbol } from '../prompts/inputs'
import { selectAccount } from '../prompts/select-account'
import { createContext } from '../helpers/create-context'


export async function closePosition(args: BaseArgs) {
  const logger = new ConsoleLogger()

  const ctx = await createContext(args)

  const keypair = Keypair.fromSecretKey(base58.decode(args.privateKey))

  const baseSymbol = await inputBaseSymbol()

  const mangoAccount = await selectAccount(ctx)

  const marketConfigs = await createMangoPerpMarketConfigs('mainnet', 'mainnet.1', keypair, baseSymbol, 0, {
    rpcUrl: args.rpcUrl,
  })

  await new Promise(r => setTimeout(r, 5000))

  const market = new MangoPerpMarket({ ...marketConfigs, mangoAccount }, logger)

  const tx = await market.closePosition()
  console.log('tx:', tx)
}
