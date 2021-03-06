import { Message, GuildMember, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('dep', {
      aliases: ['deposit', 'dep', 'put'],
      channel: 'guild',
      description: 'Deposit coins into your vault.',
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'amount',
          type: async (msg: Message, phrase: number | string) => {
            if (!phrase) {
              await msg.channel.send('You need something to deposit');
              return null;
            }
            const data = await this.client.db.currency.fetch(msg.author.id);
            if (data.pocket < 1) {
              await msg.channel.send("Lol you don't have coins to deposit rip");
              return null;
            }
            if (data.vault >= data.space) {
              await msg.channel.send('You already have full vault');
              return null;
            }

            let dep: string | number = phrase;
            if (!Boolean(Number(dep))) {
              dep = (<string>dep).toLowerCase();
              if (['all', 'max'].some(p => p.toLowerCase() === dep)) {
                dep = data.pocket;
              } else if (phrase === 'half') {
                dep = Math.round(data.pocket / 2);
              } else {
                await msg.channel.send('You actually need a number to deposit...');
                return null;
              }
            }

            return Math.trunc(Number(dep));
          },
        },
      ],
    });
  }

  public async exec(
    _: Message,
    {
      amount,
    }: {
      amount: number;
    }
  ): Promise<string | MessageOptions> {
    const { fetch, add, remove } = this.client.db.currency;
    const { pocket, vault, space } = await fetch(_.author.id);
    const embed: Embed = new Embed();
    
    if (!amount)
      return;
    else if (amount < 1)
      return 'You thought you can fool me?';
    else if (amount > pocket)
      return `Bro, you only have ${pocket.toLocaleString()} coins what're you doing?`;

    const input = amount >= space - vault ? space - vault : amount;
    await add(_.author.id, 'vault', input);
    await remove(_.author.id, 'pocket', input);
    return `**${input.toLocaleString()}** coins deposited.`;
  }
}
