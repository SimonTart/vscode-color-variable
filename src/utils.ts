import { workspace, TextEditor, TextDocument, Position, Range, Uri, TextEditorEdit, window } from "vscode";
import * as path from 'path';
import * as postcss from 'postcss';
import * as postcssColorVariable from 'postcss-color-variable/src/index.js';
import { SupportLangs, LangIdToSyntax } from "./constant";

export function postCSSReplace(input:string, config:{ variables: string[], syntax?: string }) {
  return postcss([postcssColorVariable(config)]).process(input, { from: undefined });
}

export function isSupportedLanguage(languageId: string): boolean {
	return SupportLangs.includes(languageId);
}


export function getConfig(uri:Uri) {
  return workspace.getConfiguration("colorHero", uri);
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

  const colorVariables = (config.variables || []).map((variable: string) => path.resolve(folder.uri.fsPath, variable));
  
  return postCSSReplace(content, { variables: colorVariables, syntax: LangIdToSyntax[document.languageId] })
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