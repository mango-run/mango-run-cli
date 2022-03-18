import inquirer from 'inquirer'

export async function inputBaseSymbol() {
  const answer = await inquirer.prompt({ type: 'input', name: 'baseSymbol', message: 'base symbol' })
  return answer.baseSymbol as string
}
