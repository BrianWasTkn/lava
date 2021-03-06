import { Message, MessageOptions, GuildMember } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('inventory', {
      aliases: ['inv', 'items'],
      channel: 'guild',
      description: 'Check your inventory.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'member',
          default: 1,
          type: (msg: Message, phrase: string) => {
            if (!phrase) return 1; // inventory page
            const { resolver } = this.handler;
            return (
              resolver.type('number')(msg, phrase) ||
              resolver.type('memberMention')(msg, phrase)
            );
          },
        },
        {
          id: 'page',
          type: 'number',
          default: 1,
        },
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      member: number | GuildMember;
      page: number;
    }
  ): Promise<string | MessageOptions> {
    const { handlers, db, util } = this.client;
    const { member, page } = args;
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;

    let data: Document & CurrencyProfile;
    let memb: GuildMember;
    let pg: number;

    if (typeof member === 'number') {
      memb = msg.member;
      data = await fetch(memb.user.id);
      pg = member;
    } else {
      memb = member;
      data = await fetch(memb.user.id);
      pg = page;
    }

    let inv: string[] | string[][] | InventorySlot[];
    let total: number = 0;

    inv = data.items.filter((i) => i.amount >= 1);
    inv.forEach((i) => (total += i.amount));
    if (inv.length < 1) {
      return 'Imagine not having any items, buy something weirdo';
    }

    inv = util.paginateArray(
      inv.map((item) => {
        const i = Items.modules.get(item.id);
        return `**${i.emoji} ${
          i.name
        }** — ${item.amount.toLocaleString()}\n*ID* \`${i.id}\` — ${
          i.category
        }`;
      }),
      3
    );

    if (pg > inv.length) {
      return "That page doesn't even exist wtf are you high or what?";
    }

    return {
      embed: {
        color: 'GOLD',
        author: {
          name: `${memb.user.username}'s inventory`,
          iconURL: memb.user.avatarURL({ dynamic: true }),
        },
        fields: [
          {
            name: `Owned Items — ${total.toLocaleString()} total`,
            value: inv[pg - 1].join('\n\n'),
          },
        ],
        footer: {
          text: `Owned Shits — Page ${pg} of ${inv.length}`,
        },
      },
    };
  }
}
