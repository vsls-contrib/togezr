/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// This is the place for API experiments and proposal.

declare module 'vscode' {
    // #region auth provider: https://github.com/microsoft/vscode/issues/88309

    export interface AuthenticationSession {
        id: string;
        getAccessToken(): Thenable<string>;
        accountName: string;
        scopes: string[];
    }

    /**
     * An [event](#Event) which fires when an [AuthenticationProvider](#AuthenticationProvider) is added or removed.
     */
    export interface AuthenticationProvidersChangeEvent {
        /**
         * The ids of the [authenticationProvider](#AuthenticationProvider)s that have been added.
         */
        readonly added: string[];

        /**
         * The ids of the [authenticationProvider](#AuthenticationProvider)s that have been removed.
         */
        readonly removed: string[];
    }

    /**
     * An [event](#Event) which fires when an [AuthenticationSession](#AuthenticationSession) is added, removed, or changed.
     */
    export interface AuthenticationSessionsChangeEvent {
        /**
         * The ids of the [AuthenticationSession](#AuthenticationSession)s that have been added.
         */
        readonly added: string[];

        /**
         * The ids of the [AuthenticationSession](#AuthenticationSession)s that have been removed.
         */
        readonly removed: string[];

        /**
         * The ids of the [AuthenticationSession](#AuthenticationSession)s that have been changed.
         */
        readonly changed: string[];
    }

    /**
     * **WARNING** When writing an AuthenticationProvider, `id` should be treated as part of your extension's
     * API, changing it is a breaking change for all extensions relying on the provider. The id is
     * treated case-sensitively.
     */
    export interface AuthenticationProvider {
        /**
         * Used as an identifier for extensions trying to work with a particular
         * provider: 'microsoft', 'github', etc. id must be unique, registering
         * another provider with the same id will fail.
         */
        readonly id: string;
        readonly displayName: string;

        /**
         * An [event](#Event) which fires when the array of sessions has changed, or data
         * within a session has changed.
         */
        readonly onDidChangeSessions: Event<AuthenticationSessionsChangeEvent>;

        /**
         * Returns an array of current sessions.
         */
        getSessions(): Thenable<ReadonlyArray<AuthenticationSession>>;

        /**
         * Prompts a user to login.
         */
        login(scopes: string[]): Thenable<AuthenticationSession>;
        logout(sessionId: string): Thenable<void>;
    }

    export namespace authentication {
        export function registerAuthenticationProvider(
            provider: AuthenticationProvider
        ): Disposable;

        /**
         * Fires with the provider id that was registered or unregistered.
         */
        export const onDidChangeAuthenticationProviders: Event<AuthenticationProvidersChangeEvent>;

        /**
         * An array of the ids of authentication providers that are currently registered.
         */
        export const providerIds: string[];

        /**
         * An array of the ids of authentication providers.
         */
        export const providers: AuthenticationProvider[];

        /**
         * Get existing authentication sessions. Rejects if a provider with providerId is not
         * registered, or if the user does not consent to sharing authentication information with
         * the extension.
         */
        export function getSessions(
            providerId: string,
            scopes: string[]
        ): Thenable<readonly AuthenticationSession[]>;

        /**
         * Prompt a user to login to create a new authenticaiton session. Rejects if a provider with
         * providerId is not registered, or if the user does not consent to sharing authentication
         * information with the extension.
         */
        export function login(
            providerId: string,
            scopes: string[]
        ): Thenable<AuthenticationSession>;

        /**
         * An [event](#Event) which fires when the array of sessions has changed, or data
         * within a session has changed for a provider. Fires with the ids of the providers
         * that have had session data change.
         */
        export const onDidChangeSessions: Event<{
            [providerId: string]: AuthenticationSessionsChangeEvent;
        }>;
    }

    //#endregion

    //#region Joh: file system provider (OLD)
    export enum DeprecatedFileChangeType {
        Updated = 0,
        Added = 1,
        Deleted = 2,
    }
    export interface DeprecatedFileChange {
        type: DeprecatedFileChangeType;
        resource: Uri;
    }
    export enum DeprecatedFileType {
        File = 0,
        Dir = 1,
        Symlink = 2,
    }
    export interface DeprecatedFileStat {
        id: number | string;
        mtime: number;
        size: number;
        type: DeprecatedFileType;
    }
    export interface DeprecatedFileSystemProvider {
        readonly onDidChange?: Event<DeprecatedFileChange[]>;
        utimes(
            resource: Uri,
            mtime: number,
            atime: number
        ): Thenable<DeprecatedFileStat>;
        stat(resource: Uri): Thenable<DeprecatedFileStat>;
        read(
            resource: Uri,
            offset: number,
            length: number,
            progress: Progress<Uint8Array>
        ): Thenable<number>;
        write(resource: Uri, content: Uint8Array): Thenable<void>;
        move(resource: Uri, target: Uri): Thenable<DeprecatedFileStat>;
        mkdir(resource: Uri): Thenable<DeprecatedFileStat>;
        readdir(resource: Uri): Thenable<[Uri, DeprecatedFileStat][]>;
        rmdir(resource: Uri): Thenable<void>;
        unlink(resource: Uri): Thenable<void>;
    }
    export namespace workspace {
        /**
         * Register a filesystem provider for a given scheme, e.g. `ftp`.
         *
         * There can only be one provider per scheme and an error is being thrown when a scheme
         * has been claimed by another provider or when it is reserved.
         *
         * @param scheme The uri-[scheme](#Uri.scheme) the provider registers for.
         * @param provider The filesystem provider.
         * @param options Immutable metadata about the provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerFileSystemProvider(
            scheme: string,
            provider: FileSystemProvider,
            options: { isCaseSensitive?: boolean; isReadonly?: boolean }
        ): Disposable;
        export function registerDeprecatedFileSystemProvider(
            scheme: string,
            provider: DeprecatedFileSystemProvider
        ): Disposable;
    }

    export namespace env {
        export function createAppUri(options?: AppUriOptions): Thenable<Uri>;

        /**
         * Resolves a uri to form that is accessible externally. Currently only supports `https:`, `http:` and
         * `vscode.env.uriScheme` uris.
         *
         * #### `http:` or `https:` scheme
         *
         * Resolves an *external* uri, such as a `http:` or `https:` link, from where the extension is running to a
         * uri to the same resource on the client machine.
         *
         * This is a no-op if the extension is running on the client machine.
         *
         * If the extension is running remotely, this function automatically establishes a port forwarding tunnel
         * from the local machine to `target` on the remote and returns a local uri to the tunnel. The lifetime of
         * the port fowarding tunnel is managed by VS Code and the tunnel can be closed by the user.
         *
         * *Note* that uris passed through `openExternal` are automatically resolved and you should not call `asExternalUri` on them.
         *
         * #### `vscode.env.uriScheme`
         *
         * Creates a uri that - if opened in a browser (e.g. via `openExternal`) - will result in a registered [UriHandler](#UriHandler)
         * to trigger.
         *
         * Extensions should not make any assumptions about the resulting uri and should not alter it in anyway.
         * Rather, extensions can e.g. use this uri in an authentication flow, by adding the uri as callback query
         * argument to the server to authenticate to.
         *
         * *Note* that if the server decides to add additional query parameters to the uri (e.g. a token or secret), it
         * will appear in the uri that is passed to the [UriHandler](#UriHandler).
         *
         * **Example** of an authentication flow:
         * ```typescript
         * vscode.window.registerUriHandler({
         *   handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
         *     if (uri.path === '/did-authenticate') {
         *       console.log(uri.toString());
         *     }
         *   }
         * });
         *
         * const callableUri = await vscode.env.asExternalUri(vscode.Uri.parse(`${vscode.env.uriScheme}://my.extension/did-authenticate`));
         * await vscode.env.openExternal(callableUri);
         * ```
         *
         * *Note* that extensions should not cache the result of `asExternalUri` as the resolved uri may become invalid due to
         * a system or user action — for example, in remote cases, a user may close a port forwarding tunnel that was opened by
         * `asExternalUri`.
         *
         * @return A uri that can be used on the client machine.
         */
        export function asExternalUri(target: Uri): Thenable<Uri>;

        /**
         * The custom uri scheme the editor registers to in the operating system.
         */
        export const uriScheme: string;
    }

    export interface AppUriOptions {
        payload?: {
            path?: string;
            query?: string;
            fragment?: string;
        };
    }

    //#endregion
    //#region Joh: remote, search provider
    export interface TextSearchQuery {
        pattern: string;
        isRegExp?: boolean;
        isCaseSensitive?: boolean;
        isWordMatch?: boolean;
    }

    export interface SearchOptions {
        folder: Uri;
        includes: string[]; // paths relative to folder
        excludes: string[];
        useIgnoreFiles?: boolean;
        followSymlinks?: boolean;
        previewOptions?: any; // total length? # of context lines? leading and trailing # of chars?
    }

    export interface TextSearchOptions extends SearchOptions {
        maxFileSize?: number;
        encoding?: string;
        maxResults: number;
        previewOptions?: TextSearchPreviewOptions;
    }

    export interface TextSearchPreviewOptions {
        matchLines: number;
        charsPerLine: number;
    }

    export interface FileSearchOptions extends SearchOptions {
        maxResults?: number;
        session?: CancellationToken;
    }

    export type TextSearchResult = TextSearchMatch | OldTextSearchMatch;

    export interface TextSearchMatch {
        uri: Uri;
        ranges: Range | Range[];
        preview: TextSearchMatchPreview;
    }

    export interface OldTextSearchMatch {
        uri: Uri;
        range: Range;
        preview: OldTextSearchMatchPreview;
    }

    export interface OldTextSearchMatchPreview {
        text: string;
        match: Range;
    }

    export interface TextSearchMatchPreview {
        text: string;
        matches: Range | Range[];
    }

    /**
     * Options that can be set on a findTextInFiles search.
     */
    export interface FindTextInFilesOptions {
        /**
         * A [glob pattern](#GlobPattern) that defines the files to search for. The glob pattern
         * will be matched against the file paths of files relative to their workspace. Use a [relative pattern](#RelativePattern)
         * to restrict the search results to a [workspace folder](#WorkspaceFolder).
         */
        include?: GlobPattern;

        /**
         * A [glob pattern](#GlobPattern) that defines files and folders to exclude. The glob pattern
         * will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
         * apply, when `null` no excludes will apply.
         */
        exclude?: GlobPattern | null;

        /**
         * The maximum number of results to search for
         */
        maxResults?: number;

        /**
         * Whether external files that exclude files, like .gitignore, should be respected.
         * See the vscode setting `"search.useIgnoreFiles"`.
         */
        useIgnoreFiles?: boolean;

        /**
         * Whether symlinks should be followed while searching.
         * See the vscode setting `"search.followSymlinks"`.
         */
        followSymlinks?: boolean;

        /**
         * Interpret files using this encoding.
         * See the vscode setting `"files.encoding"`
         */
        encoding?: string;
    }

    export interface TextSearchComplete {
        limitHit?: boolean;
    }

    /**
     * The parameters of a query for file search.
     */
    export interface FileSearchQuery {
        /**
         * The search pattern to match against file paths.
         */
        pattern: string;
    }
    export interface TextSearchProvider {
        /**
         * Provide results that match the given text pattern.
         * @param query The parameters for this query.
         * @param options A set of options to consider while searching.
         * @param progress A progress callback that must be invoked for all results.
         * @param token A cancellation token.
         */
        provideTextSearchResults(
            query: TextSearchQuery,
            options: TextSearchOptions,
            progress: Progress<TextSearchResult>,
            token: CancellationToken
        ): ProviderResult<TextSearchComplete>;
    }

    /**
     * A FileSearchProvider provides search results for files or text in files. It can be invoked by quickopen and other extensions.
     */
    export interface FileSearchProvider {
        /**
         * Provide the set of files that match a certain file path pattern.
         * @param query The parameters for this query.
         * @param options A set of options to consider while searching files.
         * @param progress A progress callback that must be invoked for all results.
         * @param token A cancellation token.
         */
        provideFileSearchResults(
            query: FileSearchQuery,
            options: FileSearchOptions,
            token: CancellationToken
        ): ProviderResult<Uri[]>;
    }

    export interface FileIndexProvider {
        provideFileIndex(
            options: FileSearchOptions,
            token: CancellationToken
        ): Thenable<Uri[]>;
    }

    export namespace workspace {
        /**
         * Register a search provider.
         *
         * Only one provider can be registered per scheme.
         *
         * @param scheme The provider will be invoked for workspace folders that have this file scheme.
         * @param provider The provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerFileSearchProvider(
            scheme: string,
            provider: FileSearchProvider
        ): Disposable;

        /**
         * Register a text search provider.
         *
         * Only one provider can be registered per scheme.
         *
         * @param scheme The provider will be invoked for workspace folders that have this file scheme.
         * @param provider The provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerTextSearchProvider(
            scheme: string,
            provider: TextSearchProvider
        ): Disposable;

        /**
         * Register a file index provider.
         *
         * Only one provider can be registered per scheme.
         *
         * @param scheme The provider will be invoked for workspace folders that have this file scheme.
         * @param provider The provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerFileIndexProvider(
            scheme: string,
            provider: FileIndexProvider
        ): Disposable;

        export function registerSearchProvider(): Disposable;

        /**
         * Search text in files across all [workspace folders](#workspace.workspaceFolders) in the workspace.
         * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
         * @param callback A callback, called for each result
         * @param token A token that can be used to signal cancellation to the underlying search engine.
         * @return A thenable that resolves when the search is complete.
         */
        export function findTextInFiles(
            query: TextSearchQuery,
            callback: (result: TextSearchResult) => void,
            token?: CancellationToken
        ): Thenable<void>;

        /**
         * Search text in files across all [workspace folders](#workspace.workspaceFolders) in the workspace.
         * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
         * @param options An optional set of query options. Include and exclude patterns, maxResults, etc.
         * @param callback A callback, called for each result
         * @param token A token that can be used to signal cancellation to the underlying search engine.
         * @return A thenable that resolves when the search is complete.
         */
        export function findTextInFiles(
            query: TextSearchQuery,
            options: FindTextInFilesOptions,
            callback: (result: TextSearchResult) => void,
            token?: CancellationToken
        ): Thenable<void>;
    }
    //#endregion

    export namespace window {
        export function sampleFunction(): Thenable<any>;

        /**
         * Registers a [uri handler](#UriHandler) capable of handling system-wide [uris](#Uri).
         * In case there are multiple windows open, the topmost window will handle the uri.
         * A uri handler is scoped to the extension it is contributed from; it will only
         * be able to handle uris which are directed to the extension itself. A uri must respect
         * the following rules:
         *
         * - The uri-scheme must be the product name;
         * - The uri-authority must be the extension id (eg. `my.extension`);
         * - The uri-path, -query and -fragment parts are arbitrary.
         *
         * For example, if the `my.extension` extension registers a uri handler, it will only
         * be allowed to handle uris with the prefix `product-name://my.extension`.
         *
         * An extension can only register a single uri handler in its entire activation lifetime.
         *
         * * *Note:* There is an activation event `onUri` that fires when a uri directed for
         * the current extension is about to be handled.
         *
         * @param handler The uri handler to register for this extension.
         */
        export function registerUriHandler(handler: UriHandler): Disposable;

        /**
         * Creates a [QuickPick](#QuickPick) to let the user pick an item from a list
         * of items of type T.
         *
         * Note that in many cases the more convenient [window.showQuickPick](#window.showQuickPick)
         * is easier to use. [window.createQuickPick](#window.createQuickPick) should be used
         * when [window.showQuickPick](#window.showQuickPick) does not offer the required flexibility.
         *
         * @return A new [QuickPick](#QuickPick).
         */
        export function createQuickPick<T extends QuickPickItem>(): QuickPick<
            T
        >;
    }

    /**
     * Button for an action in a [QuickPick](#QuickPick) or [InputBox](#InputBox).
     */
    export interface QuickInputButton {
        /**
         * Icon for the button.
         */
        readonly iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;

        /**
         * An optional tooltip.
         */
        readonly tooltip?: string | undefined;
    }

    /**
     * A light-weight user input UI that is intially not visible. After
     * configuring it through its properties the extension can make it
     * visible by calling [QuickInput.show](#QuickInput.show).
     *
     * There are several reasons why this UI might have to be hidden and
     * the extension will be notified through [QuickInput.onDidHide](#QuickInput.onDidHide).
     * (Examples include: an explict call to [QuickInput.hide](#QuickInput.hide),
     * the user pressing Esc, some other input UI opening, etc.)
     *
     * A user pressing Enter or some other gesture implying acceptance
     * of the current state does not automatically hide this UI component.
     * It is up to the extension to decide whether to accept the user's input
     * and if the UI should indeed be hidden through a call to [QuickInput.hide](#QuickInput.hide).
     *
     * When the extension no longer needs this input UI, it should
     * [QuickInput.dispose](#QuickInput.dispose) it to allow for freeing up
     * any resources associated with it.
     *
     * See [QuickPick](#QuickPick) and [InputBox](#InputBox) for concrete UIs.
     */
    export interface QuickInput {
        /**
         * An optional title.
         */
        title: string | undefined;

        /**
         * An optional current step count.
         */
        step: number | undefined;

        /**
         * An optional total step count.
         */
        totalSteps: number | undefined;

        /**
         * If the UI should allow for user input. Defaults to true.
         *
         * Change this to false, e.g., while validating user input or
         * loading data for the next step in user input.
         */
        enabled: boolean;

        /**
         * If the UI should show a progress indicator. Defaults to false.
         *
         * Change this to true, e.g., while loading more data or validating
         * user input.
         */
        busy: boolean;

        /**
         * If the UI should stay open even when loosing UI focus. Defaults to false.
         */
        ignoreFocusOut: boolean;

        /**
         * Makes the input UI visible in its current configuration. Any other input
         * UI will first fire an [QuickInput.onDidHide](#QuickInput.onDidHide) event.
         */
        show(): void;

        /**
         * Hides this input UI. This will also fire an [QuickInput.onDidHide](#QuickInput.onDidHide)
         * event.
         */
        hide(): void;

        /**
         * An event signaling when this input UI is hidden.
         *
         * There are several reasons why this UI might have to be hidden and
         * the extension will be notified through [QuickInput.onDidHide](#QuickInput.onDidHide).
         * (Examples include: an explict call to [QuickInput.hide](#QuickInput.hide),
         * the user pressing Esc, some other input UI opening, etc.)
         */
        onDidHide: Event<void>;

        /**
         * Dispose of this input UI and any associated resources. If it is still
         * visible, it is first hidden. After this call the input UI is no longer
         * functional and no additional methods or properties on it should be
         * accessed. Instead a new input UI should be created.
         */
        dispose(): void;
    }

    /**
     * A concrete [QuickInput](#QuickInput) to let the user pick an item from a
     * list of items of type T. The items can be filtered through a filter text field and
     * there is an option [canSelectMany](#QuickPick.canSelectMany) to allow for
     * selecting multiple items.
     *
     * Note that in many cases the more convenient [window.showQuickPick](#window.showQuickPick)
     * is easier to use. [window.createQuickPick](#window.createQuickPick) should be used
     * when [window.showQuickPick](#window.showQuickPick) does not offer the required flexibility.
     */
    export interface QuickPick<T extends QuickPickItem> extends QuickInput {
        /**
         * Current value of the filter text.
         */
        value: string;

        /**
         * Optional placeholder in the filter text.
         */
        placeholder: string | undefined;

        /**
         * An event signaling when the value of the filter text has changed.
         */
        readonly onDidChangeValue: Event<string>;

        /**
         * An event signaling when the user indicated acceptance of the selected item(s).
         */
        readonly onDidAccept: Event<void>;

        /**
         * Buttons for actions in the UI.
         */
        buttons: ReadonlyArray<QuickInputButton>;

        /**
         * An event signaling when a button was triggered.
         */
        readonly onDidTriggerButton: Event<QuickInputButton>;

        /**
         * Items to pick from.
         */
        items: ReadonlyArray<T>;

        /**
         * If multiple items can be selected at the same time. Defaults to false.
         */
        canSelectMany: boolean;

        /**
         * If the filter text should also be matched against the description of the items. Defaults to false.
         */
        matchOnDescription: boolean;

        /**
         * If the filter text should also be matched against the detail of the items. Defaults to false.
         */
        matchOnDetail: boolean;

        /**
         * Active items. This can be read and updated by the extension.
         */
        activeItems: ReadonlyArray<T>;

        /**
         * An event signaling when the active items have changed.
         */
        readonly onDidChangeActive: Event<T[]>;

        /**
         * Selected items. This can be read and updated by the extension.
         */
        selectedItems: ReadonlyArray<T>;

        /**
         * An event signaling when the selected items have changed.
         */
        readonly onDidChangeSelection: Event<T[]>;
    }
    /**
     * The contiguous set of modified lines in a diff.
     */
    export interface LineChange {
        readonly originalStartLineNumber: number;
        readonly originalEndLineNumber: number;
        readonly modifiedStartLineNumber: number;
        readonly modifiedEndLineNumber: number;
    }

    export namespace commands {
        /**
         * Registers a diff information command that can be invoked via a keyboard shortcut,
         * a menu item, an action, or directly.
         *
         * Diff information commands are different from ordinary [commands](#commands.registerCommand) as
         * they only execute when there is an active diff editor when the command is called, and the diff
         * information has been computed. Also, the command handler of an editor command has access to
         * the diff information.
         *
         * @param command A unique identifier for the command.
         * @param callback A command handler function with access to the [diff information](#LineChange).
         * @param thisArg The `this` context used when invoking the handler function.
         * @return Disposable which unregisters this command on disposal.
         */
        export function registerDiffInformationCommand(
            command: string,
            callback: (diff: LineChange[], ...args: any[]) => any,
            thisArg?: any
        ): Disposable;
    }

    //#region decorations

    //todo@joh -> make class
    export interface DecorationData {
        letter?: string;
        priority?: number;
        title?: string;
        bubble?: boolean;
        abbreviation?: string;
        color?: ThemeColor;
        source?: string;
    }

    export interface SourceControlResourceDecorations {
        source?: string;
        letter?: string;
        color?: ThemeColor;
    }

    /**
     * Represents the input box in the Source Control viewlet.
     */
    export interface SourceControlInputBox {
        /**
         * Whether the input box is visible.
         */
        visible: boolean;
    }

    //#region Comments

    /**
     * A collection of [comments](#Comment) representing a conversation at a particular range in a document.
     */
    export interface CommentThread {
        /**
         * The uri of the document the thread has been created on.
         */
        readonly resource: Uri;
    }

    namespace comments {
        /**
         * Creates a new [comment controller](#CommentController) instance.
         *
         * @param id An `id` for the comment controller.
         * @param label A human-readable string for the comment controller.
         * @return An instance of [comment controller](#CommentController).
         */
        export function createCommentController(
            id: string,
            label: string
        ): CommentController;
    }

    //#endregion

    export interface DecorationProvider {
        onDidChangeDecorations: Event<undefined | Uri | Uri[]>;
        provideDecoration(
            uri: Uri,
            token: CancellationToken
        ): ProviderResult<DecorationData>;
    }

    export namespace window {
        export function registerDecorationProvider(
            provider: DecorationProvider
        ): Disposable;
    }

    //#endregion

    /**
     * Represents a debug adapter that is implemented in the extension.
     */
    export class DebugAdapterImplementation {
        readonly type: 'implementation';

        readonly implementation: any;

        /**
         * Create a description for a debug adapter directly implemented in the extension.
         * The implementation's "type": TBD
         */
        constructor(implementation: any);
    }

    export interface DebugAdapterProvider {
        /**
         * 'provideDebugAdapter' is called at the start of a debug session to provide details about the debug adapter to use.
         * These details must be returned as objects of type [DebugAdapterDescriptor](#DebugAdapterDescriptor).
         * Currently two types of debug adapters are supported:
         * - a debug adapter executable is specified as a command path and arguments (see [DebugAdapterExecutable](#DebugAdapterExecutable)),
         * - a debug adapter server reachable via a communication port (see [DebugAdapterServer](#DebugAdapterServer)).
         * If the method is not implemented the default behavior is this:
         *   provideDebugAdapter(session: DebugSession, executable: DebugAdapterExecutable) {
         *      if (typeof session.configuration.debugServer === 'number') {
         *         return new DebugAdapterServer(session.configuration.debugServer);
         *      }
         *      return executable;
         *   }
         * @param session The [debug session](#DebugSession) for which the debug adapter will be used.
         * @param executable The debug adapter's executable information as specified in the package.json (or undefined if no such information exists).
         * @return a [debug adapter descriptor](#DebugAdapterDescriptor) or undefined.
         */
        provideDebugAdapter(
            session: DebugSession,
            executable: DebugAdapterExecutable | undefined
        ): ProviderResult<DebugAdapterDescriptor>;
    }

    /**
     * A Debug Adapter Tracker is a means to track the communication between VS Code and a Debug Adapter.
     */
    export interface DebugAdapterTracker {
        /**
         * A session with the debug adapter is about to be started.
         */
        onWillStartSession?(): void;
        /**
         * The debug adapter is about to receive a Debug Adapter Protocol message from VS Code.
         */
        onWillReceiveMessage?(message: any): void;
        /**
         * The debug adapter has sent a Debug Adapter Protocol message to VS Code.
         */
        onDidSendMessage?(message: any): void;
        /**
         * The debug adapter session is about to be stopped.
         */
        onWillStopSession?(): void;
        /**
         * An error with the debug adapter has occured.
         */
        onError?(error: Error): void;
        /**
         * The debug adapter has exited with the given exit code or signal.
         */
        onExit?(code: number | undefined, signal: string | undefined): void;
    }

    export interface DebugAdapterTrackerFactory {
        /**
         * The method 'createDebugAdapterTracker' is called at the start of a debug session in order
         * to return a "tracker" object that provides read-access to the communication between VS Code and a debug adapter.
         *
         * @param session The [debug session](#DebugSession) for which the debug adapter tracker will be used.
         * @return A [debug adapter tracker](#DebugAdapterTracker) or undefined.
         */
        createDebugAdapterTracker(
            session: DebugSession
        ): ProviderResult<DebugAdapterTracker>;
    }

    export interface DebugAdapterDescriptorFactory {
        /**
         * 'createDebugAdapterDescriptor' is called at the start of a debug session to provide details about the debug adapter to use.
         * These details must be returned as objects of type [DebugAdapterDescriptor](#DebugAdapterDescriptor).
         * Currently two types of debug adapters are supported:
         * - a debug adapter executable is specified as a command path and arguments (see [DebugAdapterExecutable](#DebugAdapterExecutable)),
         * - a debug adapter server reachable via a communication port (see [DebugAdapterServer](#DebugAdapterServer)).
         * If the method is not implemented the default behavior is this:
         *   createDebugAdapter(session: DebugSession, executable: DebugAdapterExecutable) {
         *      if (typeof session.configuration.debugServer === 'number') {
         *         return new DebugAdapterServer(session.configuration.debugServer);
         *      }
         *      return executable;
         *   }
         * @param session The [debug session](#DebugSession) for which the debug adapter will be used.
         * @param executable The debug adapter's executable information as specified in the package.json (or undefined if no such information exists).
         * @return a [debug adapter descriptor](#DebugAdapterDescriptor) or undefined.
         */
        createDebugAdapterDescriptor(
            session: DebugSession,
            executable: DebugAdapterExecutable | undefined
        ): ProviderResult<DebugAdapterDescriptor>;
    }

    export interface DebugConfigurationProvider {
        /**
         * Deprecated, use DebugConfigurationProvider.provideDebugAdapter instead.
         * @deprecated Use DebugConfigurationProvider.provideDebugAdapter instead
         */
        debugAdapterExecutable?(
            folder: WorkspaceFolder | undefined,
            token?: CancellationToken
        ): ProviderResult<DebugAdapterExecutable>;

        /**
         * Preliminary API, do not use in production.
         *
         * The optional method 'provideDebugAdapterTracker' is called at the start of a debug session to provide a tracker that gives access to the communication between VS Code and a Debug Adapter.
         * @param session The [debug session](#DebugSession) for which the tracker will be used.
         * @param token A cancellation token.
         */
        provideDebugAdapterTracker?(
            session: DebugSession,
            workspaceFolder: WorkspaceFolder | undefined,
            config: DebugConfiguration,
            token?: CancellationToken
        ): ProviderResult<DebugAdapterTracker>;
    }

    //#endregion

    //#region Tasks

    export interface TaskFilter {
        /**
         * The task version as used in the tasks.json file.
         * The string support the package.json semver notation.
         */
        version?: string;

        /**
         * The task type to return;
         */
        type?: string;
    }

    //#endregion

    export namespace workspace {
        /**
         * This method replaces `deleteCount` [workspace folders](#workspace.workspaceFolders) starting at index `start`
         * by an optional set of `workspaceFoldersToAdd` on the `vscode.workspace.workspaceFolders` array. This "splice"
         * behavior can be used to add, remove and change workspace folders in a single operation.
         *
         * If the first workspace folder is added, removed or changed, the currently executing extensions (including the
         * one that called this method) will be terminated and restarted so that the (deprecated) `rootPath` property is
         * updated to point to the first workspace folder.
         *
         * Use the [`onDidChangeWorkspaceFolders()`](#onDidChangeWorkspaceFolders) event to get notified when the
         * workspace folders have been updated.
         *
         * **Example:** adding a new workspace folder at the end of workspace folders
         * ```typescript
         * workspace.updateWorkspaceFolders(workspace.workspaceFolders ? workspace.workspaceFolders.length : 0, null, { uri: ...});
         * ```
         *
         * **Example:** removing the first workspace folder
         * ```typescript
         * workspace.updateWorkspaceFolders(0, 1);
         * ```
         *
         * **Example:** replacing an existing workspace folder with a new one
         * ```typescript
         * workspace.updateWorkspaceFolders(0, 1, { uri: ...});
         * ```
         *
         * It is valid to remove an existing workspace folder and add it again with a different name
         * to rename that folder.
         *
         * **Note:** it is not valid to call [updateWorkspaceFolders()](#updateWorkspaceFolders) multiple times
         * without waiting for the [`onDidChangeWorkspaceFolders()`](#onDidChangeWorkspaceFolders) to fire.
         *
         * @param start the zero-based location in the list of currently opened [workspace folders](#WorkspaceFolder)
         * from which to start deleting workspace folders.
         * @param deleteCount the optional number of workspace folders to remove.
         * @param workspaceFoldersToAdd the optional variable set of workspace folders to add in place of the deleted ones.
         * Each workspace is identified with a mandatory URI and an optional name.
         * @return true if the operation was successfully started and false otherwise if arguments were used that would result
         * in invalid workspace folder state (e.g. 2 folders with the same URI).
         */
        export function updateWorkspaceFolders(
            start: number,
            deleteCount: number | undefined | null,
            ...workspaceFoldersToAdd: { uri: Uri; name?: string }[]
        ): boolean;
    }

    //#region TextEditor.visibleRange and related event

    export interface TextEditor {
        /**
         * The current visible ranges in the editor (vertically).
         * This accounts only for vertical scrolling, and not for horizontal scrolling.
         */
        readonly visibleRanges: Range[];
    }

    //#endregion

    //#region Terminal

    export interface Terminal {
        /**
         * Fires when the terminal's pty slave pseudo-device is written to. In other words, this
         * provides access to the raw data stream from the process running within the terminal,
         * including VT sequences.
         *
         * @deprecated Use [window.onDidWriteTerminalData](#onDidWriteTerminalData).
         */
        onDidWriteData: Event<string>;
    }

    /**
     * Represents the dimensions of a terminal.
     */
    export interface TerminalDimensions {
        /**
         * The number of columns in the terminal.
         */
        readonly columns: number;

        /**
         * The number of rows in the terminal.
         */
        readonly rows: number;
    }

    /**
     * Represents a terminal without a process where all interaction and output in the terminal is
     * controlled by an extension. This is similar to an output window but has the same VT sequence
     * compatility as the regular terminal.
     *
     * Note that an instance of [Terminal](#Terminal) will be created when a TerminalRenderer is
     * created with all its APIs available for use by extensions. When using the Terminal object
     * of a TerminalRenderer it acts just like normal only the extension that created the
     * TerminalRenderer essentially acts as a process. For example when an
     * [Terminal.onDidWriteData](#Terminal.onDidWriteData) listener is registered, that will fire
     * when [TerminalRenderer.write](#TerminalRenderer.write) is called. Similarly when
     * [Terminal.sendText](#Terminal.sendText) is triggered that will fire the
     * [TerminalRenderer.onDidAcceptInput](#TerminalRenderer.onDidAcceptInput) event.
     *
     * **Example:** Create a terminal renderer, show it and write hello world in red
     * ```typescript
     * const renderer = window.createTerminalRenderer('foo');
     * renderer.terminal.then(t => t.show());
     * renderer.write('\x1b[31mHello world\x1b[0m');
     * ```
     */
    export interface TerminalRenderer {
        /**
         * The name of the terminal, this will appear in the terminal selector.
         */
        name: string;

        /**
         * The dimensions of the terminal, the rows and columns of the terminal can only be set to
         * a value smaller than the maximum value, if this is undefined the terminal will auto fit
         * to the maximum value [maximumDimensions](TerminalRenderer.maximumDimensions).
         *
         * **Example:** Override the dimensions of a TerminalRenderer to 20 columns and 10 rows
         * ```typescript
         * terminalRenderer.dimensions = {
         *   cols: 20,
         *   rows: 10
         * };
         * ```
         */
        dimensions: TerminalDimensions | undefined;

        /**
         * The maximum dimensions of the terminal, this will be undefined immediately after a
         * terminal renderer is created and also until the terminal becomes visible in the UI.
         * Listen to [onDidChangeMaximumDimensions](TerminalRenderer.onDidChangeMaximumDimensions)
         * to get notified when this value changes.
         */
        readonly maximumDimensions: TerminalDimensions | undefined;

        /**
         * The corressponding [Terminal](#Terminal) for this TerminalRenderer.
         */
        readonly terminal: Terminal;

        /**
         * Write text to the terminal. Unlike [Terminal.sendText](#Terminal.sendText) which sends
         * text to the underlying _process_, this will write the text to the terminal itself.
         *
         * **Example:** Write red text to the terminal
         * ```typescript
         * terminalRenderer.write('\x1b[31mHello world\x1b[0m');
         * ```
         *
         * **Example:** Move the cursor to the 10th row and 20th column and write an asterisk
         * ```typescript
         * terminalRenderer.write('\x1b[10;20H*');
         * ```
         *
         * @param text The text to write.
         */
        write(text: string): void;

        /**
         * An event which fires on keystrokes in the terminal or when an extension calls
         * [Terminal.sendText](#Terminal.sendText). Keystrokes are converted into their
         * corresponding VT sequence representation.
         *
         * **Example:** Simulate interaction with the terminal from an outside extension or a
         * workbench command such as `workbench.action.terminal.runSelectedText`
         * ```typescript
         * const terminalRenderer = window.createTerminalRenderer('test');
         * terminalRenderer.onDidAcceptInput(data => {
         *   cosole.log(data); // 'Hello world'
         * });
         * terminalRenderer.terminal.then(t => t.sendText('Hello world'));
         * ```
         */
        readonly onDidAcceptInput: Event<string>;

        /**
         * An event which fires when the [maximum dimensions](#TerminalRenderer.maimumDimensions) of
         * the terminal renderer change.
         */
        readonly onDidChangeMaximumDimensions: Event<TerminalDimensions>;
    }

    /** Since VSCode 1.38. */
    export interface TerminalDataWriteEvent {
        /**
         * The [terminal](#Terminal) for which the data was written.
         */
        readonly terminal: Terminal;
        /**
         * The data being written.
         */
        readonly data: string;
    }

    export namespace window {
        /**
         * Since 1.38.
         * An event which fires when the terminal's pty slave pseudo-device is written to. In other
         * words, this provides access to the raw data stream from the process running within the
         * terminal, including VT sequences.
         */
        export const onDidWriteTerminalData: Event<TerminalDataWriteEvent>;

        /**
         * Create a [TerminalRenderer](#TerminalRenderer).
         *
         * @param name The name of the terminal renderer, this shows up in the terminal selector.
         */
        export function createTerminalRenderer(name: string): TerminalRenderer;
    }

    //#endregion

    //#region Terminal virtual process (since 1.37.0)

    export namespace window {
        /**
         * Creates a [Terminal](#Terminal) where an extension acts as the process.
         *
         * @param options A [TerminalVirtualProcessOptions](#TerminalVirtualProcessOptions) object describing the
         * characteristics of the new terminal.
         * @return A new Terminal.
         */
        export function createTerminal(
            options: TerminalVirtualProcessOptions
        ): Terminal;
    }

    /**
     * Value-object describing what options a virtual process terminal should use.
     */
    export interface TerminalVirtualProcessOptions {
        /**
         * A human-readable string which will be used to represent the terminal in the UI.
         */
        name: string;

        /**
         * An implementation of [TerminalVirtualProcess](#TerminalVirtualProcess) that allows an
         * extension to act as a terminal's backing process.
         */
        virtualProcess: TerminalVirtualProcess;
    }

    /**
     * Defines the interface of a terminal virtual process, enabling extensions to act as a process
     * in the terminal.
     */
    interface TerminalVirtualProcess {
        /**
         * An event that when fired will write data to the terminal. Unlike
         * [Terminal.sendText](#Terminal.sendText) which sends text to the underlying _process_,
         * this will write the text to the terminal itself.
         *
         * **Example:** Write red text to the terminal
         * ```typescript
         * const writeEmitter = new vscode.EventEmitter<string>();
         * const virtualProcess: TerminalVirtualProcess = {
         *   onDidWrite: writeEmitter.event
         * };
         * vscode.window.createTerminal({ name: 'My terminal', virtualProcess });
         * writeEmitter.fire('\x1b[31mHello world\x1b[0m');
         * ```
         *
         * **Example:** Move the cursor to the 10th row and 20th column and write an asterisk
         * ```typescript
         * writeEmitter.fire('\x1b[10;20H*');
         * ```
         */
        onDidWrite: Event<string>;

        /**
         * An event that when fired allows overriding the [dimensions](#Terminal.dimensions) of the
         * terminal. Note that when set the overridden dimensions will only take effect when they
         * are lower than the actual dimensions of the terminal (ie. there will never be a scroll
         * bar). Set to `undefined` for the terminal to go back to the regular dimensions.
         *
         * **Example:** Override the dimensions of a terminal to 20 columns and 10 rows
         * ```typescript
         * const dimensionsEmitter = new vscode.EventEmitter<string>();
         * const virtualProcess: TerminalVirtualProcess = {
         *   onDidWrite: writeEmitter.event,
         *   onDidOverrideDimensions: dimensionsEmitter.event
         * };
         * vscode.window.createTerminal({ name: 'My terminal', virtualProcess });
         * dimensionsEmitter.fire({
         *   columns: 20,
         *   rows: 10
         * });
         * ```
         */
        onDidOverrideDimensions?: Event<TerminalDimensions | undefined>;

        /**
         * An event that when fired will exit the process with an exit code, this will behave the
         * same for a virtual process as when a regular process exits with an exit code. Note that
         * exit codes must be positive numbers, when negative the exit code will be forced to `1`.
         *
         * **Example:** Exit with an exit code of `0` if the y key is pressed, otherwise `1`.
         * ```typescript
         * const writeEmitter = new vscode.EventEmitter<string>();
         * const exitEmitter = new vscode.EventEmitter<number>();
         * const virtualProcess: TerminalVirtualProcess = {
         *   onDidWrite: writeEmitter.event,
         *   input: data => exitEmitter.fire(data === 'y' ? 0 : 1)
         * };
         * vscode.window.createTerminal({ name: 'Exit example', virtualProcess });
         * writeEmitter.fire('Press y to exit successfully');
         */
        onDidExit?: Event<number>;

        /**
         * Implement to handle keystrokes in the terminal or when an extension calls
         * [Terminal.sendText](#Terminal.sendText). Keystrokes are converted into their
         * corresponding VT sequence representation.
         *
         * @param data The sent data.
         *
         * **Example:** Echo input in the terminal. The sequence for enter (`\r`) is translated to
         * CRLF to go to a new line and move the cursor to the start of the line.
         * ```typescript
         * const writeEmitter = new vscode.EventEmitter<string>();
         * const virtualProcess: TerminalVirtualProcess = {
         *   onDidWrite: writeEmitter.event,
         *   handleInput: data => writeEmitter.fire(data === '\r' ? '\r\n' : data)
         * };
         * vscode.window.createTerminal({ name: 'Local echo', virtualProcess });
         * ```
         */
        handleInput?(data: string): void;

        /**
         * Implement to handle when the number of rows and columns that fit into the terminal panel
         * changes, for example when font size changes or when the panel is resized. The initial
         * state of a terminal's dimensions should be treated as `undefined` until this is triggered
         * as the size of a terminal isn't know until it shows up in the user interface.
         *
         * @param dimensions The new dimensions.
         */
        setDimensions?(dimensions: TerminalDimensions): void;

        /**
         * Implement to handle when the terminal shuts down by an act of the user.
         */
        shutdown?(): void;

        /**
         * Implement to handle when the terminal is ready to start firing events.
         *
         * @param initialDimensions The dimensions of the terminal, this will be undefined if the
         * terminal panel has not been opened before this is called.
         */
        start?(initialDimensions: TerminalDimensions | undefined): void;
    }

    //#endregion

    /**
     * The code action interface defines the contract between extensions and
     * the [light bulb](https://code.visualstudio.com/docs/editor/editingevolved#_code-action) feature.
     *
     * A code action can be any command that is [known](#commands.getCommands) to the system.
     */
    export interface CodeActionProvider {
        /**
         * Provide commands for the given document and range.
         *
         * @param document The document in which the command was invoked.
         * @param range The selector or range for which the command was invoked. This will always be a selection if
         * there is a currently active editor.
         * @param context Context carrying additional information.
         * @param token A cancellation token.
         * @return An array of commands, quick fixes, or refactorings or a thenable of such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideCodeActions(
            document: TextDocument,
            range: Range | Selection,
            context: CodeActionContext,
            token: CancellationToken
        ): ProviderResult<(Command | CodeAction)[]>;
    }

    /**
     * Metadata about the type of code actions that a [CodeActionProvider](#CodeActionProvider) providers
     */
    export interface CodeActionProviderMetadata {
        /**
         * [CodeActionKinds](#CodeActionKind) that this provider may return.
         *
         * The list of kinds may be generic, such as `CodeActionKind.Refactor`, or the provider
         * may list our every specific kind they provide, such as `CodeActionKind.Refactor.Extract.append('function`)`
         */
        readonly providedCodeActionKinds?: ReadonlyArray<CodeActionKind>;
    }

    /**
     * Folding context (for future use)
     */
    export interface FoldingContext {}

    export namespace debug {
        export function registerDebugAdapterProvider(
            debugType: string,
            provider: DebugAdapterProvider
        ): Disposable;
    }
}
