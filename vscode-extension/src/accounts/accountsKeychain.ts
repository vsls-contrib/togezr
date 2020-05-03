import { IAccountRecord, TAccountRecord } from '../interfaces/IAccountRecord';
import * as keytar from '../keytar';
import * as memento from '../memento';
import { arrayUnique } from '../utils/arrayUnique';

const ACCOUNT_KEYTAR_SERVICE = 'vso-account-keytar-key';
const ACCOUNTS_MEMENTO_KEY = 'vso-accounts-memento-key';

export class AccountsKeychain {
    private getAccountKey = (name: string) => {
        return `${ACCOUNT_KEYTAR_SERVICE}_${name}`;
    };

    public getAccount = async (
        name: string
    ): Promise<TAccountRecord | null> => {
        const accountJSON = await keytar.get(this.getAccountKey(name));

        if (!accountJSON) {
            this.removeAccountName(name);
            return null;
        }

        try {
            const account = JSON.parse(accountJSON);

            return account;
        } catch (e) {
            return null;
        }
    };

    public addAccount = async (account: IAccountRecord): Promise<void> => {
        const { name, type } = account;

        const accountJSON = await keytar.get(this.getAccountKey(name));

        if (accountJSON) {
            throw new Error(`Account ${name}[${type}] already exists.`);
        }

        await keytar.set(this.getAccountKey(name), JSON.stringify(account));

        this.addAccountName(name);
    };

    public updateAccount = async (account: IAccountRecord): Promise<void> => {
        const { name } = account;

        await keytar.set(this.getAccountKey(name), JSON.stringify(account));

        this.addAccountName(name);
    };

    public deleteAccount = async (name: string): Promise<void> => {
        await keytar.remove(this.getAccountKey(name));
        this.removeAccountName(name);
    };

    public getAllAccounts = async (): Promise<TAccountRecord[]> => {
        const accountNames = this.getAccountNames();

        const resultPromises: Promise<TAccountRecord>[] = accountNames.map(
            async (name: string) => {
                const account = await this.getAccount(name);

                if (!account) {
                    throw new Error(
                        `Account name ${name} is present, but no account record found.`
                    );
                }

                return account;
            }
        );

        const result = await Promise.all(resultPromises);

        // show only GitHub accounts for now
        return result.filter((acc) => {
            return acc.type === 'GitHub';
        });
    };

    public getAccountNames = () => {
        const accounts: string[] | undefined = memento.get(
            ACCOUNTS_MEMENTO_KEY
        );

        if (!accounts) {
            const accounts: string[] = [];
            memento.set(ACCOUNTS_MEMENTO_KEY, accounts);

            return accounts;
        }

        return arrayUnique(accounts);
    };

    private addAccountName = (name: string): string[] => {
        const accounts = this.getAccountNames();
        accounts.push(name);

        const newAaccounts = arrayUnique(accounts);

        memento.set(ACCOUNTS_MEMENTO_KEY, newAaccounts);

        return newAaccounts;
    };

    private removeAccountName = (name: string): string[] => {
        const accounts = this.getAccountNames();
        const newAccounts = accounts.filter((account) => {
            return account !== name;
        });

        memento.set(ACCOUNTS_MEMENTO_KEY, newAccounts);

        return newAccounts;
    };
}

export const accountsKeychain = new AccountsKeychain();
