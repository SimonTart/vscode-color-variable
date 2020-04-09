// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SupportLangIds } from './constant';
import { isSupportedLanguage, replaceDocument, getConfig } from './utils';


export function activate(context: vscode.ExtensionContext) {

	vscode.workspace.onWillSaveTextDocument((e) => {
		const {document} = e;
		const config = getConfig(document.uri);
		const onSave = config && config.onSave;
		if (!onSave) {
			return;
		}
		const currentEditor = vscode.window.visibleTextEditors.find((textEditor) => textEditor.document.fileName === document.fileName);
		if (!currentEditor) {
			return;
		}

		if (!isSupportedLanguage(document.languageId)) {
			return;
		}


		e.waitUntil(replaceDocument(currentEditor));
	});

	let disposable = vscode.commands.registerCommand('extension.colorHeroReplace', () => {
		const textEditor:vscode.TextEditor|undefined = vscode.window.activeTextEditor;
		if (!textEditor) {
			return;
		}

		if (!isSupportedLanguage(textEditor.document.languageId)) {
			return;
		}

		replaceDocument(textEditor);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
