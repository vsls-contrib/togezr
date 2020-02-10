// import fetch from 'node-fetch';
// import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
// import { ISessionReporter } from '../interfaces/ISessionReporter';
// import { IGuest, IMessageRessponeData } from './session';
// import { ISessionGuest, template } from './template';

// export const SLACK_BEARER_TOKEN = '';

// export class SlackSessionReporter implements ISessionReporter {
//     private messageData: IMessageRessponeData | undefined;
//     private guests: IGuest[] = [];
//     constructor(private registryData: IRegistryData) {}
//     private render(threadTs?: string) {
//         const guests: ISessionGuest[] = this.guests.map((guest) => {
//             return {
//                 name: guest.name,
//                 imageUrl:
//                     'https://avatars1.githubusercontent.com/u/1478800?s=460&v=4',
//             };
//         });
//         const result = template({
//             registryData: this.registryData,
//             // channelId: this.registryData.channel.url,
//             authorUserName: 'Oleg Solomka',
//             authorUserId: 'fakeLink.toUser.com',
//             // liveshareSessionId: this.registryData.sessionId,
//             guests,
//             threadTs,
//         });
//         return result;
//     }
//     public async reportSessionStart() {
//         const payload = this.render();
//         const result = await fetch('https://slack.com/api/chat.postMessage', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${SLACK_BEARER_TOKEN}`,
//             },
//             body: payload,
//         });
//         const body: IMessageRessponeData = await result.json();
//         this.messageData = body;
//     }
//     public async reportSessionGuest(guest: IGuest) {
//         if (!this.messageData) {
//             throw new Error('No send the message first!');
//         }
//         this.guests.push(guest);
//         const payload = this.render(this.messageData.ts);
//         const result = await fetch('https://slack.com/api/chat.update', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${SLACK_BEARER_TOKEN}`,
//             },
//             body: payload,
//         });
//         const res = await result.json();
//         console.log(res);
//     }
// }
