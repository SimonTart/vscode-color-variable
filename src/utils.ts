import { workspace, TextEditor, TextDocument, Position, Range, Uri, TextEditorEdit } from "vscode";
import * as path from 'path';
import * as postcss from 'postcss';
import * as postcssColorVariable from 'postcss-color-variable/src/index.js';
import { SupportLangs } from "./constant";

export async function postCSSReplace(input:string, variableFiles:string[]) {
  return await postcss([postcssColorVariable({ variables: variableFiles })]).process(input, { from: undefined });
}

export function isSupportedLanguage(languageId: string): boolean {
	return SupportLangs.includes(languageId);
}


export function getConfig(uri:Uri) {
  return workspace.getConfiguration("colorHero", uri);
}


export function replaceDocument(textEditor: TextEditor) {
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
  
  return postCSSReplace(content, colorVariables)
  .then((output) => {
    textEditor.edit((editor) => {
      editor.replace(range, output.content);
    });
  })
  .catch((e:Error) => { 
    console.error('[ColorHero]', e);
  });
}