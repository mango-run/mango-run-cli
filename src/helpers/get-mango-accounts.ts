import { BaseContext } from '../types'

export async function getMangoAccounts({ client, group, keypair }: BaseContext) {
  const accounts = await client.getMangoAccountsForOwner(group, keypair.publicKey)
  return accounts
}
