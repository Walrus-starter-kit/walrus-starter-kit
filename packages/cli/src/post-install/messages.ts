import kleur from 'kleur';
import { logger } from '../utils/logger.js';
import { getRunCommand } from './package-manager.js';
import type { Context } from '../types.js';

/**
 * Display success message with next steps
 */
export function displaySuccess(context: Context): void {
  const { projectName, packageManager, sdk, framework, useCase } = context;

  console.log('\n' + kleur.green('━'.repeat(60)));
  console.log(kleur.bold().green('  ✨ Project created successfully! ✨'));
  console.log(kleur.green('━'.repeat(60)));

  console.log('\n' + kleur.bold('📦 Project Details:'));
  console.log(`  Name: ${kleur.cyan(projectName)}`);
  console.log(`  SDK: ${kleur.cyan(sdk)}`);
  console.log(`  Framework: ${kleur.cyan(framework)}`);
  console.log(`  Use Case: ${kleur.cyan(useCase)}`);

  console.log('\n' + kleur.bold('🚀 Next Steps:'));
  console.log(`  ${kleur.gray('1.')} cd ${kleur.cyan(projectName)}`);
  console.log(
    `  ${kleur.gray('2.')} ${kleur.cyan(getRunCommand(packageManager, 'dev'))}`
  );

  console.log('\n' + kleur.bold('📚 Helpful Commands:'));
  console.log(
    `  ${kleur.cyan(getRunCommand(packageManager, 'dev'))}      - Start development server`
  );
  console.log(
    `  ${kleur.cyan(getRunCommand(packageManager, 'build'))}    - Build for production`
  );
  console.log(
    `  ${kleur.cyan(getRunCommand(packageManager, 'lint'))}     - Run linter`
  );

  console.log('\n' + kleur.bold('🔗 Resources:'));
  console.log(`  Walrus Docs:   ${kleur.cyan('https://docs.walrus.site')}`);
  console.log(`  Sui Docs:      ${kleur.cyan('https://docs.sui.io')}`);
  console.log(
    `  Sui Faucet:    ${kleur.cyan('https://faucet.testnet.sui.io')}`
  );

  console.log('\n' + kleur.bold('💡 Tips:'));
  console.log(
    `  - Copy ${kleur.cyan('.env.example')} to ${kleur.cyan('.env')}`
  );
  console.log(`  - Install Sui Wallet browser extension`);
  console.log(`  - Get testnet SUI from the faucet`);

  console.log('\n' + kleur.green('━'.repeat(60)) + '\n');
}

/**
 * Display error message with recovery steps
 */
export function displayError(error: Error, context: Context): void {
  console.log('\n' + kleur.red('━'.repeat(60)));
  console.log(kleur.bold().red('  ❌ Project creation failed'));
  console.log(kleur.red('━'.repeat(60)));

  console.log('\n' + kleur.bold('Error:'));
  console.log(`  ${kleur.red(error.message)}`);

  console.log('\n' + kleur.bold('Recovery Steps:'));
  console.log(`  ${kleur.gray('1.')} cd ${kleur.cyan(context.projectName)}`);
  console.log(
    `  ${kleur.gray('2.')} ${kleur.cyan(`${context.packageManager} install`)}`
  );
  console.log(
    `  ${kleur.gray('3.')} Try running ${kleur.cyan(getRunCommand(context.packageManager, 'dev'))}`
  );

  console.log('\n' + kleur.bold('Need Help?'));
  console.log(
    `  Report issues: ${kleur.cyan('https://github.com/your-org/walrus-starter-kit/issues')}`
  );

  console.log('\n' + kleur.red('━'.repeat(60)) + '\n');
}
