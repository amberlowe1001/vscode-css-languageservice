/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { Range, TextEdit, Position, DocumentUri, MarkupContent, MarkupKind } from 'vscode-languageserver-types';

export { Range, TextEdit, Position, DocumentUri };

export type LintSettings = { [key: string]: any };

export interface CompletionSettings {
	triggerPropertyValueCompletion: boolean;
}

export interface LanguageSettings {
	validate?: boolean;
	lint?: LintSettings;
	completion?: CompletionSettings;
}

export interface PropertyCompletionContext {
	propertyName: string;
	range: Range;
}

export interface PropertyValueCompletionContext {
	propertyName: string;
	propertyValue?: string;
	range: Range;
}

export interface URILiteralCompletionContext {
	uriValue: string;
	position: Position;
	range: Range;
}

export interface ImportPathCompletionContext {
	pathValue: string;
	position: Position;
	range: Range;
}

export interface ICompletionParticipant {
	onCssProperty?: (context: PropertyCompletionContext) => void;
	onCssPropertyValue?: (context: PropertyValueCompletionContext) => void;
	onCssURILiteralValue?: (context: URILiteralCompletionContext) => void;
	onCssImportPath?: (context: ImportPathCompletionContext) => void;
}

export interface DocumentContext {
	resolveReference(ref: string, base?: string): string;
}

/**
 * Describes what LSP capabilities the client supports
 */
export interface ClientCapabilities {
	/**
	 * The text document client capabilities
	 */
	textDocument?: {
		/**
		 * Capabilities specific to completions.
		 */
		completion?: {
			/**
			 * The client supports the following `CompletionItem` specific
			 * capabilities.
			 */
			completionItem?: {
				/**
				 * Client supports the follow content formats for the documentation
				 * property. The order describes the preferred format of the client.
				 */
				documentationFormat?: MarkupKind[];
			};

		};
		/**
		 * Capabilities specific to hovers.
		 */
		hover?: {
			/**
			 * Client supports the follow content formats for the content
			 * property. The order describes the preferred format of the client.
			 */
			contentFormat?: MarkupKind[];
		};
	};
}

export namespace ClientCapabilities {
	export const LATEST: ClientCapabilities = {
		textDocument: {
			completion: {
				completionItem: {
					documentationFormat: [MarkupKind.Markdown, MarkupKind.PlainText]
				}
			},
			hover: {
				contentFormat: [MarkupKind.Markdown, MarkupKind.PlainText]
			}
		}
	};
}

export interface LanguageServiceOptions {
	/**
	 * Provide data that could enhance the service's understanding of
	 * CSS property / at-rule / pseudo-class / pseudo-element
	 */
	customDataProviders?: ICSSDataProvider[];

	/**
	 * Abstract file system access away from the service.
	 * Used for dynamic link resolving, path completion, etc.
	 */
	fileSystemProvider?: FileSystemProvider;

	/**
	 * Describes the LSP capabilities the client supports.
	 */
	clientCapabilities?: ClientCapabilities;
}

export type EntryStatus = 'standard' | 'experimental' | 'nonstandard' | 'obsolete';

export interface IPropertyData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	restrictions?: string[];
	status?: EntryStatus;
	syntax?: string;
	values?: IValueData[];
}
export interface IAtDirectiveData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
}
export interface IPseudoClassData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
}
export interface IPseudoElementData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
}

export interface IValueData {
	name: string;
	description?: string | MarkupContent;
	browsers?: string[];
	status?: EntryStatus;
}

export interface CSSDataV1 {
	version: 1;
	properties?: IPropertyData[];
	atDirectives?: IAtDirectiveData[];
	pseudoClasses?: IPseudoClassData[];
	pseudoElements?: IPseudoElementData[];
}

export interface ICSSDataProvider {
	provideProperties(): IPropertyData[];
	provideAtDirectives(): IAtDirectiveData[];
	providePseudoClasses(): IPseudoClassData[];
	providePseudoElements(): IPseudoElementData[];
}

export enum FileType {
	/**
	 * The file type is unknown.
	 */
	Unknown = 0,
	/**
	 * A regular file.
	 */
	File = 1,
	/**
	 * A directory.
	 */
	Directory = 2,
	/**
	 * A symbolic link to a file.
	 */
	SymbolicLink = 64
}

export interface FileStat {
	/**
	 * The type of the file, e.g. is a regular file, a directory, or symbolic link
	 * to a file.
	 */
	type: FileType;
	/**
	 * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	ctime: number;
	/**
	 * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	mtime: number;
	/**
	 * The size in bytes.
	 */
	size: number;
}

export interface FileSystemProvider {
	stat(uri: DocumentUri): Promise<FileStat>;
}