import base58 from 'bs58'

import {
  Bot,
  ConsoleLogger,
  createMangoPerpMarketConfigs,
  GridSignalConfigs,
  MangoPerpMarket,
  NaiveGridSignal,
} from '@mango-run/core'
import { Keypair } from '@solana/web3.js'

import { BaseArgs } from '../types'
import { inputBaseSymbol } from '../prompts/inputs'
import { selectAccount } from '../prompts/select-account'
import { createContext } from '../helpers/create-context'

interface GridBotArgs extends BaseArgs {
  priceUpperCap: number
  priceLowerCap: number
  gridCount: number
  gridActiveRange?: number
  orderSize: number
  startPrice?: number
  stopLossPrice?: number
  takeProfitPrice?: number
  gridType?: GridSignalConfigs['gridType']
}

export async function gridBot(args: GridBotArgs) {
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

  const signalConfigs: GridSignalConfigs = {
    market: market,
    priceUpperCap: args.priceUpperCap,
    priceLowerCap: args.priceLowerCap,
    gridCount: args.gridCount,
    orderSize: args.orderSize,
    gridActiveRange: args.gridActiveRange,
    startPrice: args.startPrice,
    stopLossPrice: args.stopLossPrice,
    takeProfitPrice: args.takeProfitPrice,
    gridType: args.gridType,
  }

  const signal = new NaiveGridSignal(signalConfigs, logger)

  const bot = new Bot(market, signal, logger)

  bot.start()
}
