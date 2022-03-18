import { GroupConfig, MangoCache, MangoClient, MangoGroup } from '@blockworks-foundation/mango-client'
import { Connection, Keypair } from '@solana/web3.js'

export interface BaseArgs {
  privateKey: string
  rpcUrl: string
}

export interface BaseContext {
  keypair: Keypair
  connection: Connection
  client: MangoClient
  group: MangoGroup
  groupConfig: GroupConfig
  cache: MangoCache
}
