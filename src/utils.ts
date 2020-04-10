import { workspace, TextEditor, TextDocument, Position, Range, Uri, TextEditorEdit, window, DebugConsoleMode } from "vscode";
import * as path from 'path';
import * as postcss from 'postcss';
import * as postcssColorVariable from 'postcss-color-variable/src/index.js';
import { SupportLangIds, LangIdToSyntax } from "./constant";
import { cosmiconfigSync } from 'cosmiconfig';

const ConfigFileName = 'colorvar'

const explorerSync = cosmiconfigSync(ConfigFileName)

function resolveFileConfig (uri: Uri) {
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    return {};
  }

  const result = explorerSync.search(workspaceFolder.uri.fsPath)
  if (!result) {
    return {}
  }

  if (result.config && result.config.variableFiles) {
    return Object.assign({}, result.config, {
      variableFiles: result.config.variableFiles.map(filePath => {
        if (path.isAbsolute(filePath)) {
          return filePath
        }

        if (result.filepath) {
          const fileFolder = path.dirname(result.filepath);
          return path.resolve(fileFolder, filePath)
        }

        return filePath
      })
    })
  }

  return result.config || {}
}


export function postCSSReplace(input:string, config:{ variableFiles: string[], syntax?: string }) {
  const syntax = config.syntax? LangIdToSyntax[config.syntax]: undefined;
  return postcss([postcssColorVariable(config)]).process(input, { from: undefined, syntax });
}

export function isSupportedLanguage(languageId: string): boolean {
	return SupportLangIds.includes(languageId);
}


export function getConfig(uri:Uri) {
  const workspaceConfig = workspace.getConfiguration("colorVar", uri);
  const fileConfig = resolveFileConfig(uri);
  return Object.assign({}, workspaceConfig, fileConfig);
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

  const variableFiles = (config.variableFiles || []).map((filePath: string) => {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.resolve(folder.uri.fsPath, filePath);
  });

  return postCSSReplace(content, { variableFiles, syntax: document.languageId })
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
    console.debug(e);
  });
}