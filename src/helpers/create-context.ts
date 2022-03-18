import base58 from 'bs58'
import ora from 'ora'

import { Config, IDS, MangoClient } from '@blockworks-foundation/mango-client'
import { Connection, Keypair } from '@solana/web3.js'

import { BaseArgs, BaseContext } from '../types'

export async function createContext({ privateKey, rpcUrl }: BaseArgs): Promise<BaseContext> {
  const spinner = ora('initializing')
  spinner.start()
  const connection = new Connection(rpcUrl)
  const groupConfig = new Config(IDS).getGroup('mainnet', 'mainnet.1')
  if (!groupConfig) throw new Error('not found grounp config')
  const client = new MangoClient(connection, groupConfig.mangoProgramId)
  const group = await client.getMangoGroup(groupConfig.publicKey)
  const cache = await group.loadCache(connection)
  const keypair = Keypair.fromSecretKey(base58.decode(privateKey))
  spinner.stop()
  return { connection, client, group, groupConfig, cache, keypair }
}
