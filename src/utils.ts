import { workspace, TextEditor, TextDocument, Position, Range, Uri, TextEditorEdit, window, DebugConsoleMode } from "vscode";
import * as path from 'path';
import * as postcss from 'postcss';
import * as postcssColorVariable from 'postcss-color-variable';
import { SupportLangIds, LangIdToSyntax } from "./constant";

export function postCSSReplace(input:string, config:{
  syntax?: string;
  searchFrom: string;
  sourcePath?: string;
}) {
  const syntax = config.syntax ? LangIdToSyntax[config.syntax]: undefined;
  console.debug('config', config);
  return postcss([postcssColorVariable(config)]).process(input, { from: undefined, syntax });
}

export function isSupportedLanguage(languageId: string): boolean {
	return SupportLangIds.includes(languageId);
}


export function getConfig(uri:Uri) {
  return workspace.getConfiguration("colorVar", uri);
}


export function replaceDocument(textEditor: TextEditor, alertWarning?: boolean) {
  const document = textEditor.document;
  const start: Position = new Position(0, 0);
  const end: Position = new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
  const range: Range = new Range(start, end);
  const content: string = document.getText(range);
  const config = getConfig(document.uri);
  const folder = workspace.getWorkspaceFolder(document.uri);
  if (!folder) {
    return Promise.resolve();
  }

  return postCSSReplace(content, {
    syntax: document.languageId,
    searchFrom: document.uri.fsPath,
    sourcePath: document.uri.fsPath
  })
  .then((output) => {
    textEditor.edit((editor) => {
      if (content !== output.content) {
        editor.replace(range, output.content);
      }
    });
    if (config && config.alertWarning) {
      const warnings = output.warnings().filter(w => w.plugin === 'postcss-color-variable');
      if (warnings.length>0) {
        window.showWarningMessage(warnings[0].text);
      }
    }
  })
  .catch((e:Error) => { 
    console.error('[ColorHero]', e);
  });
}