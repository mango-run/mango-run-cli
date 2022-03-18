#!/usr/bin/env node

import dotenv from 'dotenv'
import { Command } from 'commander'
import { listAccounts } from './commands/list-accounts'
import { gridBot } from './commands/grid-bot'
import { cancelAllOrders } from './commands/cancel-all-orders'
import pkg from '../package.json'
import { closePosition } from './commands/close-position'

dotenv.config()

const program = new Command()

program.name(pkg.name).description(pkg.description).version(pkg.version)

function baseOptions(command: Command) {
  return command
    .requiredOption('-pk, --private-key <key>', 'solana wallet private key', process.env.PRIVATE_KEY)
    .option('-rpc, --rpc-url <string>', 'rpc url', 'https://ssc-dao.genesysgo.net')
}

// prettier-ignore
baseOptions(program.command('list-accounts'))
  .description('list all mango accounts')
  .action(listAccounts)

// prettier-ignore
baseOptions(program.command('cancel-all-orders'))
  .description('cancel all orders')
  .action(cancelAllOrders)

baseOptions(program.command('close-position'))
  .description('close perp market position')
  .action(closePosition)

// prettier-ignore
baseOptions(program.command('grid-bot'))
  .description('run grid bot')
  .requiredOption('-puc, --price-upper-cap <number>', 'highest acceptable price, bot will not place order when price higher than', parseFloat)
  .requiredOption('-plc, --price-lower-cap <number>', 'lowest acceptable price, bot will not place order when price lower than', parseFloat)
  .requiredOption('-grid, --grid-count <number>', 'maximun grid count', parseFloat)
  .requiredOption('-size, --order-size <number>', 'size of every placed order', parseFloat)
  .option('--grid-active-range <number>', 'limit the maximun count of placed orders', parseFloat, 10)
  .option('--start-price <number>', 'bot will start after price lower or equal to start price', parseFloat)
  .option('--stop-loss-price <number>', 'bot will clear all position and stop after price lowner or equal to this price', parseFloat)
  .option('--take-profit-price <number>', 'bot will clear all position and stop after price higher or equal to this price', parseFloat)
  .action(gridBot)

program.parse()
