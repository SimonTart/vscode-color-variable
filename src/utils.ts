import { workspace } from "vscode";
import postcss from 'postcss';
import postcssColorVariable from 'postcss-color-variable/src/index';

export function getVariableFiles() {
  console.log(workspace.getConfiguration())
  return workspace.getConfiguration()
}

export async function replace(input:string, variableFiles:string[]) {
  return await postcss([postcssColorVariable({ variables: variableFiles })]).process(input, { from: undefined })
}