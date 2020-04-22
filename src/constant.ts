import * as LessSyntax  from 'postcss-less';
import * as SassSyntax from 'postcss-scss';

export const SupportLangIds = ['less', 'scss'];


export const LangIdToSyntax =  {
  less: LessSyntax,
  scss: SassSyntax
}